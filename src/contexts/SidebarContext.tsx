'use client';

/**
 * InsureFlow — sidebar context.
 *
 * Tracks desktop collapse state, the mobile drawer, and which sections are
 * expanded. The `if-` prefix is used for the CSS classes this context
 * applies (`if-sidebar-collapsed`, `if-sidebar-open`, `if-sidebar-overlay`).
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

export const IF_SIDEBAR_WIDTH = 272;
export const IF_SIDEBAR_COLLAPSED_WIDTH = 76;
export const IF_MOBILE_BREAKPOINT = 1024;

interface IfSidebarContextValue {
  /** Desktop: whether the rail is collapsed to icons only. */
  isCollapsed: boolean;
  /** Desktop: toggle the collapsed rail. */
  toggleCollapsed: () => void;
  /** Desktop: set collapsed state explicitly. */
  setCollapsed: (collapsed: boolean) => void;
  /** Mobile: whether the drawer overlay is open. */
  isOpen: boolean;
  /** Mobile: open the drawer. */
  open: () => void;
  /** Mobile: close the drawer. */
  close: () => void;
  /** Mobile: toggle the drawer. */
  toggleOpen: () => void;
  /** Mobile: true while the viewport is at least the desktop breakpoint. */
  isDesktop: boolean;
  /** Section ids the user has manually expanded. */
  expandedSections: string[];
  /** Toggle a nav section's expanded state. */
  toggleSection: (id: string) => void;
  /** Expand every section. */
  expandAll: () => void;
  /** Collapse every manually-expanded section. */
  collapseAll: () => void;
  /** Current sidebar width in px (desktop). */
  width: number;
  /** Whether any sidebar chrome is being animated. */
  isAnimating: boolean;
}

const IfSidebarContext = createContext<IfSidebarContextValue | undefined>(undefined);

const IF_COLLAPSED_KEY = 'if-sidebar-collapsed';
const IF_SECTIONS_KEY = 'if-sidebar-sections';

function readCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(IF_COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

function readExpandedSections(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(IF_SECTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function matchesDesktop(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= IF_MOBILE_BREAKPOINT;
}

export function IfSidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Hydrate from storage and track the viewport.
  useEffect(() => {
    setIsCollapsed(readCollapsed());
    setExpandedSections(readExpandedSections());
    setIsDesktop(matchesDesktop());

    if (!window.matchMedia) return;
    const media = window.matchMedia(`(min-width: ${IF_MOBILE_BREAKPOINT}px)`);
    const onChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      if (event.matches) setIsOpen(false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!isDesktop && isOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [isDesktop, isOpen]);

  // Close the drawer on Escape.
  useEffect(() => {
    if (!isDesktop || !isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDesktop, isOpen]);

  const persistCollapsed = useCallback((collapsed: boolean) => {
    try {
      window.localStorage.setItem(IF_COLLAPSED_KEY, String(collapsed));
    } catch {
      // Non-fatal.
    }
  }, []);

  const persistSections = useCallback((sections: string[]) => {
    try {
      window.localStorage.setItem(IF_SECTIONS_KEY, JSON.stringify(sections));
    } catch {
      // Non-fatal.
    }
  }, []);

  const setCollapsed = useCallback(
    (collapsed: boolean) => {
      setIsCollapsed(collapsed);
      setIsAnimating(true);
      persistCollapsed(collapsed);
      window.setTimeout(() => setIsAnimating(false), 350);
    },
    [persistCollapsed]
  );

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!isCollapsed);
  }, [isCollapsed, setCollapsed]);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), 350);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const toggleOpen = useCallback(() => {
    setIsOpen((current) => !current);
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), 350);
  }, []);

  const toggleSection = useCallback(
    (id: string) => {
      setExpandedSections((current) => {
        const next = current.includes(id)
          ? current.filter((sectionId) => sectionId !== id)
          : [...current, id];
        persistSections(next);
        return next;
      });
    },
    [persistSections]
  );

  const expandAll = useCallback(() => {
    setExpandedSections(['*']);
    persistSections(['*']);
  }, [persistSections]);

  const collapseAll = useCallback(() => {
    setExpandedSections([]);
    persistSections([]);
  }, [persistSections]);

  const width = isCollapsed ? IF_SIDEBAR_COLLAPSED_WIDTH : IF_SIDEBAR_WIDTH;

  const value = useMemo<IfSidebarContextValue>(
    () => ({
      isCollapsed,
      toggleCollapsed,
      setCollapsed,
      isOpen,
      open,
      close,
      toggleOpen,
      isDesktop,
      expandedSections,
      toggleSection,
      expandAll,
      collapseAll,
      width,
      isAnimating,
    }),
    [
      isCollapsed,
      toggleCollapsed,
      setCollapsed,
      isOpen,
      open,
      close,
      toggleOpen,
      isDesktop,
      expandedSections,
      toggleSection,
      expandAll,
      collapseAll,
      width,
      isAnimating,
    ]
  );

  return <IfSidebarContext.Provider value={value}>{children}</IfSidebarContext.Provider>;
}

export function useIfSidebar(): IfSidebarContextValue {
  const context = useContext(IfSidebarContext);
  if (!context) {
    throw new Error('useIfSidebar must be used within a IfSidebarProvider');
  }
  return context;
}

/** Alias kept for generic `SidebarProvider` imports. */
export const SidebarProvider = IfSidebarProvider;
/** Alias kept for generic `useSidebar` imports. */
export const useSidebar = useIfSidebar;
