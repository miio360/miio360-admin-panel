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

const FCM_SW_URL = '/firebase-messaging-sw.js';

/**
 * Waits for the firebase-messaging-sw.js SW specifically to become active.
 * Unlike `navigator.serviceWorker.ready` (which returns ANY active SW),
 * this resolves only once our FCM SW controls the page.
 */
async function waitForSwActive(registration: ServiceWorkerRegistration): Promise<void> {
  if (registration.active) return;

  return new Promise((resolve, reject) => {
    const sw = registration.installing ?? registration.waiting;
    if (!sw) {
      reject(new Error('[push] SW has no installing/waiting/active state'));
      return;
    }

    const timeout = setTimeout(() => reject(new Error('[push] SW activation timed out')), 10_000);

    sw.addEventListener('statechange', () => {
      console.log('[push] SW state →', sw.state);
      if (sw.state === 'activated') {
        clearTimeout(timeout);
        resolve();
      } else if (sw.state === 'redundant') {
        clearTimeout(timeout);
        reject(new Error('[push] SW became redundant before activating'));
      }
    });
  });
}

async function getFcmServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | undefined> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[push] serviceWorker API not available.');
    return undefined;
  }

  // Log all currently registered SWs for diagnosis
  const existing = await navigator.serviceWorker.getRegistrations();
  console.log('[push] Registered SWs:', existing.map((r) => `${r.scope} [${r.active?.scriptURL ?? 'no active'}]`));

  try {
    console.log('[push] Registering firebase-messaging-sw.js …');
    const registration = await navigator.serviceWorker.register(FCM_SW_URL, { scope: '/' });
    console.log('[push] SW registered. active?', !!registration.active, '| installing?', !!registration.installing, '| waiting?', !!registration.waiting);

    await waitForSwActive(registration);
    console.log('[push] firebase-messaging-sw.js is active ✓');
    return registration;
  } catch (err) {
    console.error('[push] Failed to register/activate firebase-messaging-sw.js:', err);
    return undefined;
  }
}

/**
 * Deletes any existing push subscription on a registration so FCM can create a fresh one.
 */
async function clearPushSubscription(registration: ServiceWorkerRegistration): Promise<void> {
  try {
    const sub = await registration.pushManager.getSubscription();
    if (sub) {
      console.log('[push] Clearing stale push subscription …');
      await sub.unsubscribe();
      console.log('[push] Stale subscription cleared ✓');
    } else {
      console.log('[push] No existing push subscription to clear.');
    }
  } catch (err) {
    console.warn('[push] Could not clear push subscription:', err);
  }
}

/**
 * Obtains the FCM push token for the current browser session.
 * Requires notification permission to have been granted first.
 */
export async function getFcmToken(): Promise<string | null> {
  console.log('[push] getFcmToken() called. VAPID key present?', !!VAPID_KEY);

  if (!VAPID_KEY) {
    console.error('[push] VITE_FIREBASE_VAPID_KEY is not set.');
    return null;
  }

  const messaging = await getFirebaseMessaging();
  console.log('[push] Firebase Messaging supported?', !!messaging);
  if (!messaging) return null;

  const swReg = await getFcmServiceWorkerRegistration();
  console.log('[push] SW registration obtained?', !!swReg);

  // On first attempt, clear any stale push subscription to avoid AbortError
  if (swReg) await clearPushSubscription(swReg);

  try {
    console.log('[push] Calling getToken() …');
    const token = await getToken(messaging as Messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });
    console.log('[push] Token obtained ✓', token ? token.slice(0, 20) + '…' : '(empty)');
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
