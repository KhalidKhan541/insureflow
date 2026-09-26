'use client';

/**
 * InsureFlow — Tabs.
 *
 * Controlled or uncontrolled tab set with two visual styles:
 *   variant="pill"     — rounded segmented control (default)
 *   variant="underline" — minimal underline tabs
 *
 * The variant lives on `Tabs` and is inherited by `TabsList` / `TabsTrigger`
 * unless overridden explicitly.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

export type TabsVariant = 'pill' | 'underline';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  variant: TabsVariant;
  baseId: string;
  /** Registers a trigger so roving-focus arrow keys know the order. */
  register: (value: string, el: HTMLButtonElement | null) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext(component: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`<${component}> must be used inside <Tabs>`);
  }
  return context;
}

export interface TabsProps {
  children: ReactNode;
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Visual style inherited by the list and triggers. */
  variant?: TabsVariant;
  className?: string;
}

export function Tabs({
  children,
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  variant = 'pill',
  className,
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;
  const baseId = useId();
  const triggers = useRef(new Map<string, HTMLButtonElement>());

  const register = useCallback((key: string, el: HTMLButtonElement | null) => {
    if (el) triggers.current.set(key, el);
    else triggers.current.delete(key);
  }, []);

  const setValue = useCallback(
    (next: string) => {
      if (next === value) return;
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange, value]
  );

  const context = useMemo<TabsContextValue>(
    () => ({ value, setValue, variant, baseId, register }),
    [value, setValue, variant, baseId, register]
  );

  return (
    <TabsContext.Provider value={context}>
      <div className={cn('w-full', className)} data-variant={variant}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  /** Overrides the variant set on `Tabs`. */
  variant?: TabsVariant;
  /** Stretch triggers to fill the row (pill style only). */
  fullWidth?: boolean;
  className?: string;
}

export function TabsList({ children, variant, fullWidth = false, className }: TabsListProps) {
  const { variant: inherited, baseId } = useTabsContext('TabsList');
  const resolved = variant ?? inherited;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const list = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
    );
    if (list.length === 0) return;
    const index = list.findIndex((el) => el === document.activeElement);
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = list[(index + delta + list.length) % list.length];
    event.preventDefault();
    next?.focus();
    next?.click();
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      id={`${baseId}-list`}
      onKeyDown={onKeyDown}
      className={cn(
        'flex items-center gap-1',
        resolved === 'pill'
          ? 'inline-flex w-fit rounded-lg border border-border bg-muted p-1'
          : 'w-full border-b border-border',
        fullWidth && resolved === 'pill' && 'w-full',
        className
      )}
      data-variant={resolved}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  /** Small count/pill rendered after the label. */
  badge?: ReactNode;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  badge,
  className,
}: TabsTriggerProps) {
  const {
    value: selected,
    setValue,
    variant,
    baseId,
    register,
  } = useTabsContext('TabsTrigger');
  const isActive = selected === value;
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    register(value, ref.current);
    return () => register(value, null);
  }, [register, value]);

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => setValue(value)}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold',
        'transition-all duration-200 ease-if-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'pill'
          ? cn(
              'rounded-md px-3 py-1.5',
              isActive
                ? 'bg-card text-if-700 shadow-sm dark:text-if-300'
                : 'text-muted-foreground hover:text-foreground'
            )
          : cn(
              'relative -mb-px rounded-none px-3 py-2.5',
              isActive
                ? 'text-if-700 dark:text-if-300 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-if-600 after:content-[""]'
                : 'text-muted-foreground hover:border-border hover:text-foreground'
            ),
        className
      )}
    >
      {children}
      {badge ? (
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none',
            isActive
              ? 'bg-if-600/10 text-if-700 dark:bg-if-500/20 dark:text-if-300'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  /** Keep mounted while hidden (avoids remounting charts/filters). */
  keepMounted?: boolean;
  className?: string;
}

export function TabsContent({ value, children, keepMounted = false, className }: TabsContentProps) {
  const { value: selected, baseId } = useTabsContext('TabsContent');
  const isActive = selected === value;

  if (!isActive && !keepMounted) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={cn('mt-4 focus-visible:outline-none', isActive && 'animate-if-fade-in', className)}
    >
      {children}
    </div>
  );
}

export default Tabs;
