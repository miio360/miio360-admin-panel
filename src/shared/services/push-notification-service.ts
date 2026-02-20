import { getToken, onMessage } from 'firebase/messaging';
import type { Messaging, MessagePayload } from 'firebase/messaging';
import { getFirebaseMessaging } from './firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;

// ─── Permission ────────────────────────────────────────────────────────────────

/**
 * Requests notification permission from the browser.
 * Returns `true` if granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

// ─── FCM token ─────────────────────────────────────────────────────────────────

/**
 * Waits for the firebase-messaging-sw.js service worker to be registered
 * and returns its registration. FCM will use this SW for background messages.
 */
async function getFcmServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | undefined> {
  if (!('serviceWorker' in navigator)) return undefined;

  try {
    // Register (or retrieve if already registered) the FCM-specific SW
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/' },
    );
    // Wait until the SW is active
    await navigator.serviceWorker.ready;
    return registration;
  } catch (err) {
    console.warn('[push] Could not register firebase-messaging-sw.js:', err);
    return undefined;
  }
}

/**
 * Obtains the FCM push token for the current browser session.
 * Requires notification permission to have been granted first.
 */
export async function getFcmToken(): Promise<string | null> {
  if (!VAPID_KEY) {
    console.error('[push] VITE_FIREBASE_VAPID_KEY is not set.');
    return null;
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    console.warn('[push] Firebase Messaging is not supported in this browser.');
    return null;
  }

  const serviceWorkerRegistration = await getFcmServiceWorkerRegistration();

  try {
    const token = await getToken(messaging as Messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration,
    });
    return token ?? null;
  } catch (err) {
    console.error('[push] Failed to get FCM token:', err);
    return null;
  }
}

// ─── Foreground messages ────────────────────────────────────────────────────────

type MessageHandler = (payload: MessagePayload) => void;

/**
 * Subscribes to foreground FCM messages (app is focused).
 * Returns an unsubscribe function.
 */
export async function onForegroundMessage(handler: MessageHandler): Promise<() => void> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};

  return onMessage(messaging as Messaging, handler);
}
