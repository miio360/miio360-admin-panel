import { useEffect, useRef } from 'react';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { db } from '../services/firebase';
import {
  requestNotificationPermission,
  getNotificationPermission,
  getFcmToken,
  onForegroundMessage,
} from '../services/push-notification-service';

interface StoredPushToken {
  token: string;
  platform: 'android' | 'ios' | 'web';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Saves (or refreshes) the web FCM token in the user's `pushTokens` array.
 * Reads the current array, removes any existing web token with the same value
 * to prevent duplicates caused by Timestamp drift, then appends the fresh entry.
 */
async function savePushToken(userId: string, token: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const current: StoredPushToken[] = (snap.data()?.pushTokens ?? []) as StoredPushToken[];
  // Strip any stale web entries for this exact token string
  const without = current.filter((t) => !(t.platform === 'web' && t.token === token));
  const now = Timestamp.now();
  without.push({ token, platform: 'web', createdAt: now, updatedAt: now });

  await updateDoc(userRef, { pushTokens: without });
}

/**
 * Removes a web FCM token from Firestore by reading the array and filtering it.
 * `arrayRemove` cannot be used here because it requires an exact object match
 * including Timestamps that are unknown at removal time.
 */
async function removePushToken(userId: string, token: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const current: StoredPushToken[] = (snap.data()?.pushTokens ?? []) as StoredPushToken[];
    const filtered = current.filter((t) => !(t.platform === 'web' && t.token === token));
    await updateDoc(userRef, { pushTokens: filtered });
  } catch {
    // Non-critical — stale tokens are cleaned server-side after a failed send
  }
}

/**
 * Manages the full web push notification lifecycle for the authenticated admin:
 * - Asks for browser notification permission on first login.
 * - Registers the FCM service worker and stores the device token in Firestore.
 * - Listens for foreground messages and shows them as toasts.
 * - Removes the token from Firestore only when the user explicitly logs out.
 *   (The token is intentionally kept alive across page navigation and hot-reload
 *    so background notifications continue working while the tab is closed.)
 */
export function usePushNotifications(): void {
  const { user } = useAuth();

  const tokenRef = useRef<string | null>(null);
  // Tracks the userId that owns the current token so logout cleanup works correctly
  const userIdRef = useRef<string | null>(null);
  const unsubForegroundRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Always cancel any active foreground subscription first
    if (unsubForegroundRef.current) {
      unsubForegroundRef.current();
      unsubForegroundRef.current = null;
    }

    // ── Logged out: remove the stored token from Firestore ──────────────────
    if (!user?.uid) {
      if (tokenRef.current && userIdRef.current) {
        removePushToken(userIdRef.current, tokenRef.current).catch(() => {});
        tokenRef.current = null;
      }
      userIdRef.current = null;
      return;
    }

    const userId = user.uid;
    userIdRef.current = userId;
    let cancelled = false;

    async function init() {
      const permission = getNotificationPermission();

      if (permission === 'denied') {
        console.warn('[push] Notification permission denied — cannot register push token.');
        return;
      }

      // Prompt the user with a friendly toast if they haven't decided yet
      if (permission === 'default') {
        toast.info('Activa las notificaciones', {
          description: 'Permite las notificaciones para recibir alertas de comprobantes en tiempo real.',
          duration: 8000,
        });
      }

      const granted = await requestNotificationPermission();
      if (!granted || cancelled) return;

      const token = await getFcmToken();
      if (!token || cancelled) return;

      // Skip the Firestore write if the token hasn't changed in this session
      if (tokenRef.current !== token) {
        tokenRef.current = token;
        savePushToken(userId, token).catch((err) =>
          console.warn('[push] Could not save push token:', err)
        );
      }

      const unsub = await onForegroundMessage((payload) => {
        const title = payload.notification?.title ?? 'Nueva notificación';
        const body = payload.notification?.body;
        toast.info(title, { description: body });
      });

      if (cancelled) { unsub(); return; }
      unsubForegroundRef.current = unsub;
    }

    init();

    // On unmount (navigation, hot-reload) only cancel the async init and
    // unsubscribe foreground messages. DO NOT remove the Firestore token —
    // the background SW needs it to deliver notifications to closed tabs.
    return () => {
      cancelled = true;
      if (unsubForegroundRef.current) {
        unsubForegroundRef.current();
        unsubForegroundRef.current = null;
      }
    };
  }, [user?.uid]);
}
