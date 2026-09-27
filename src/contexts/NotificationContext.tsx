'use client';

/**
 * InsureFlow — notification context.
 *
 * Holds the in-app notification feed (bell menu) plus a thin wrapper around
 * react-hot-toast for transient messages. Classes rendered by this context
 * use the `if-` prefix (`if-notification-*`).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';

import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export type IfNotificationSeverity = 'info' | 'success' | 'warning' | 'danger';
export type IfNotificationCategory =
  | 'policies'
  | 'claims'
  | 'underwriting'
  | 'payments'
  | 'compliance'
  | 'team'
  | 'system';

export interface IfNotification {
  id: string;
  title: string;
  body: string;
  category: IfNotificationCategory;
  severity: IfNotificationSeverity;
  read: boolean;
  actionLabel?: string;
  href?: string;
  createdAt: string;
}

/** Payload accepted when pushing a new notification at runtime. */
export interface IfNotificationInput {
  title: string;
  body: string;
  category?: IfNotificationCategory;
  severity?: IfNotificationSeverity;
  actionLabel?: string;
  href?: string;
}

interface IfNotificationContextValue {
  /** Full feed, newest first. */
  notifications: IfNotification[];
  /** Notifications where read === false. */
  unread: IfNotification[];
  /** Convenience count of unread items. */
  unreadCount: number;
  /** Push a notification onto the feed (also fires a toast). */
  notify: (input: IfNotificationInput) => IfNotification;
  /** Mark one notification as read. */
  markRead: (id: string) => void;
  /** Mark every notification as read. */
  markAllRead: () => void;
  /** Remove a single notification. */
  remove: (id: string) => void;
  /** Clear the entire feed. */
  clearAll: () => void;
  /** Toast helpers — thin wrappers over react-hot-toast with if styling. */
  toast: {
    success: (message: string) => string | undefined;
    error: (message: string) => string | undefined;
    info: (message: string) => string | undefined;
    promise: typeof toast.promise;
  };
}

const IfNotificationContext = createContext<IfNotificationContextValue | undefined>(undefined);

const IF_STORAGE_KEY = 'if-notifications-read';

function readReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(IF_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(
      Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
    );
  } catch {
    return new Set();
  }
}

function persistReadIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(IF_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Non-fatal.
  }
}

let ifNotificationSeq = 0;

export function IfNotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<IfNotification[]>(() =>
    [...MOCK_NOTIFICATIONS]
      .map((notification) => ({
        id: notification.id,
        title: notification.title,
        body: notification.body,
        category: notification.category as IfNotificationCategory,
        severity: notification.severity as IfNotificationSeverity,
        read: notification.read,
        actionLabel: notification.actionLabel,
        href: notification.href,
        createdAt: notification.createdAt,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  // Rehydrate read-state from localStorage on mount (SSR renders everything unread).
  useEffect(() => {
    const readIds = readReadIds();
    if (readIds.size === 0) return;
    setNotifications((current) =>
      current.map((notification) =>
        readIds.has(notification.id) ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const persistRead = useCallback((list: IfNotification[]) => {
    const readIds = new Set(list.filter((n) => n.read).map((n) => n.id));
    // Union with previously stored ids so clearing doesn't resurrect unread state.
    const merged = new Set([...readReadIds(), ...readIds]);
    persistReadIds(merged);
  }, []);

  const notify = useCallback((input: IfNotificationInput): IfNotification => {
    const notification: IfNotification = {
      id: `ntf_local_${Date.now().toString(36)}_${(ifNotificationSeq++).toString(36)}`,
      title: input.title,
      body: input.body,
      category: input.category ?? 'system',
      severity: input.severity ?? 'info',
      read: false,
      actionLabel: input.actionLabel,
      href: input.href,
      createdAt: new Date().toISOString(),
    };
    setNotifications((current) => [notification, ...current]);

    const toastFn =
      notification.severity === 'danger'
        ? toast.error
        : notification.severity === 'success'
          ? toast.success
          : toast;
    toastFn(`${notification.title} — ${notification.body}`);

    return notification;
  }, []);

  const markRead = useCallback(
    (id: string) => {
      setNotifications((current) => {
        const next = current.map((n) => (n.id === id ? { ...n, read: true } : n));
        persistRead(next);
        return next;
      });
    },
    [persistRead]
  );

  const markAllRead = useCallback(() => {
    setNotifications((current) => {
      const next = current.map((n) => ({ ...n, read: true }));
      persistRead(next);
      return next;
    });
  }, [persistRead]);

  const remove = useCallback(
    (id: string) => {
      setNotifications((current) => {
        const next = current.filter((n) => n.id !== id);
        persistRead(next);
        return next;
      });
    },
    [persistRead]
  );

  const clearAll = useCallback(() => {
    setNotifications([]);
    persistReadIds(new Set());
  }, []);

  const unread = useMemo(() => notifications.filter((n) => !n.read), [notifications]);

  const value = useMemo<IfNotificationContextValue>(
    () => ({
      notifications,
      unread,
      unreadCount: unread.length,
      notify,
      markRead,
      markAllRead,
      remove,
      clearAll,
      toast: {
        success: (message: string) => toast.success(message, { className: 'if-toast' }),
        error: (message: string) => toast.error(message, { className: 'if-toast' }),
        info: (message: string) => toast(message, { className: 'if-toast', icon: 'ℹ️' }),
        promise: toast.promise,
      },
    }),
    [notifications, unread, notify, markRead, markAllRead, remove, clearAll]
  );

  return (
    <IfNotificationContext.Provider value={value}>{children}</IfNotificationContext.Provider>
  );
}

export function useIfNotifications(): IfNotificationContextValue {
  const context = useContext(IfNotificationContext);
  if (!context) {
    throw new Error('useIfNotifications must be used within a IfNotificationProvider');
  }
  return context;
}

/** Severity → Tailwind classes, exported so the bell component can share it. */
export function ifSeverityClass(severity: IfNotificationSeverity): string {
  return cn(
    'if-notification-dot h-2 w-2 rounded-full',
    severity === 'success' && 'bg-emerald-500',
    severity === 'warning' && 'bg-amber-500',
    severity === 'danger' && 'bg-red-500',
    severity === 'info' && 'bg-if-500'
  );
}

/** Alias kept for generic `NotificationProvider` imports. */
export const NotificationProvider = IfNotificationProvider;
/** Alias kept for generic `useNotifications` imports. */
export const useNotifications = useIfNotifications;
