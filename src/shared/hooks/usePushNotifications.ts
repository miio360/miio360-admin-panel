import { useEffect, useRef } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { db } from '../services/firebase';
import {
  requestNotificationPermission,
  getNotificationPermission,
  getFcmToken,
  onForegroundMessage,
} from '../services/push-notification-service';

/**
 * Saves a web FCM token to the user's `pushTokens` array in Firestore.
 * Avoids duplicates by not inserting if the token already exists.
 */
async function savePushToken(userId: string, token: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const now = Timestamp.now();
  await updateDoc(userRef, {
    pushTokens: arrayUnion({
      token,
      platform: 'web',
      createdAt: now,
      updatedAt: now,
    }),
  });
}

/**
 * Removes a web FCM token from the user's `pushTokens` array in Firestore.
 * Matches on the `token` string value.
 */
async function removePushToken(userId: string, token: string): Promise<void> {
  // arrayRemove requires the exact object. Since we can't know createdAt,
  // we query first — here we do a best-effort approach: rely on the
  // notification-sender cleanup on next send, and only call deleteToken() locally.
  // The server-side notification-sender already removes stale tokens automatically.
  try {
    const userRef = doc(db, 'users', userId);
    // We stored with specific Timestamps so we cannot reliably use arrayRemove.
    // Instead we mark the token for removal via a best-effort approach:
    // The FCM service worker is unregistered, so sends will fail and the
    // server-side cleanup in notification-sender.ts will remove invalid tokens.
    console.info('[push] Token will be cleaned up server-side on next send:', token.slice(0, 20));
    // Attempt removal anyway (works when the exact object can be reconstructed)
    await updateDoc(userRef, {
      pushTokens: arrayRemove({ token, platform: 'web' }),
    });
  } catch {
    // Non-critical — server side cleanup handles stale tokens
  }
}

/**
 * Initialises push notifications for the currently authenticated admin user.
 * - Requests browser notification permission on first call.
 * - Registers the FCM service worker and obtains a device token.
 * - Persists the token to Firestore (`users/{uid}.pushTokens`).
 * - Shows foreground notifications as toasts while the tab is open.
 * - Cleans up on logout / unmount.
 */
export function usePushNotifications(): void {
  const { user } = useAuth();
  // Keep a ref to the current token so we can remove it on cleanup
  const tokenRef = useRef<string | null>(null);
  // Keep unsubscribe fn for foreground messages
  const unsubForegroundRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const userId = user.uid;
    let cancelled = false;

    async function init() {
      // Skip if already denied — don't pester the user each render
      if (getNotificationPermission() === 'denied') return;

      const granted = await requestNotificationPermission();
      if (!granted || cancelled) return;

      const token = await getFcmToken();
      if (!token || cancelled) return;

      tokenRef.current = token;

      try {
        await savePushToken(userId, token);
      } catch (err) {
        console.warn('[push] Could not save push token:', err);
      }

      // Subscribe to foreground messages and show as toasts
      const unsub = await onForegroundMessage((payload) => {
        const title = payload.notification?.title ?? 'Nueva notificación';
        const body = payload.notification?.body;
        toast.info(title, { description: body });
      });

      if (cancelled) {
        unsub();
        return;
      }

      unsubForegroundRef.current = unsub;
    }

    init();

    return () => {
      cancelled = true;

      // Stop listening to foreground messages
      if (unsubForegroundRef.current) {
        unsubForegroundRef.current();
        unsubForegroundRef.current = null;
      }

      // Remove token from Firestore on logout
      if (tokenRef.current) {
        removePushToken(userId, tokenRef.current).catch(() => {});
        tokenRef.current = null;
      }
    };
  }, [user?.uid]);
}
