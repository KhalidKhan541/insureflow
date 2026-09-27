'use client';

/**
 * InsureFlow — theme context.
 *
 * Persists the user's light/dark/system preference to localStorage and keeps
 * the `dark` class in sync on <html> so Tailwind's `darkMode: 'class'`
 * strategy works. All class names use the `if-` prefix where a prefix is
 * needed (e.g. the `if-theme-ready` class used to avoid a flash of wrong
 * theme).
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

export type IfThemeMode = 'light' | 'dark' | 'system';
export type IfResolvedTheme = 'light' | 'dark';

interface IfThemeContextValue {
  /** The mode the user picked (may be 'system'). */
  mode: IfThemeMode;
  /** The theme actually applied right now. */
  resolvedTheme: IfResolvedTheme;
  /** Switch to an explicit light/dark/system mode. */
  setMode: (mode: IfThemeMode) => void;
  /** Toggle between light and dark (resets system preference). */
  toggleTheme: () => void;
  /** True while the user's stored preference has been read. */
  isReady: boolean;
}

const IfThemeContext = createContext<IfThemeContextValue | undefined>(undefined);

const IF_STORAGE_KEY = 'if-theme-mode';
const IF_DARK_CLASS = 'dark';
const IF_READY_CLASS = 'if-theme-ready';

function readStoredMode(): IfThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const value = window.localStorage.getItem(IF_STORAGE_KEY);
    if (value === 'light' || value === 'dark' || value === 'system') return value;
  } catch {
    // Storage may be unavailable (private mode, blocked cookies, SSR).
  }
  return 'system';
}

function getSystemTheme(): IfResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: IfResolvedTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === IF_DARK_CLASS) {
    root.classList.add(IF_DARK_CLASS);
  } else {
    root.classList.remove(IF_DARK_CLASS);
  }
  root.classList.add(IF_READY_CLASS);
  root.style.colorScheme = theme;
}

export function IfThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<IfThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<IfResolvedTheme>('light');
  const [isReady, setIsReady] = useState(false);

  // Read the stored preference and start listening to OS changes.
  useEffect(() => {
    const stored = readStoredMode();
    setModeState(stored);
    setSystemTheme(getSystemTheme());
    setIsReady(true);

    if (!window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme: IfResolvedTheme = mode === 'system' ? systemTheme : mode;

  // Apply the resolved theme to <html> whenever it changes.
  useEffect(() => {
    if (!isReady) return;
    applyTheme(resolvedTheme);
  }, [resolvedTheme, isReady]);

  const setMode = useCallback((next: IfThemeMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(IF_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures — the theme still applies for this session.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setMode]);

  const value = useMemo<IfThemeContextValue>(
    () => ({ mode, resolvedTheme, setMode, toggleTheme, isReady }),
    [mode, resolvedTheme, setMode, toggleTheme, isReady]
  );

  return <IfThemeContext.Provider value={value}>{children}</IfThemeContext.Provider>;
}

export function useIfTheme(): IfThemeContextValue {
  const context = useContext(IfThemeContext);
  if (!context) {
    throw new Error('useIfTheme must be used within a IfThemeProvider');
  }
  return context;
}

/** Alias kept for generic `ThemeProvider` imports. */
export const ThemeProvider = IfThemeProvider;
/** Alias kept for generic `useTheme` imports. */
export const useTheme = useIfTheme;
