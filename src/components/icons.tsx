/**
 * InsureFlow — inline SVG icon set.
 *
 * Every icon is a stroke-based 24×24 SVG drawn from the same primitives so the
 * whole app keeps a single visual weight (1.75 stroke, round caps/joins). No
 * icon library dependency — the paths live here.
 *
 * Usage:
 *   import { Bell, getIcon } from '@/components/icons';
 *   <Bell className="h-4 w-4" />
 *   const Icon = getIcon('LayoutDashboard');   // dynamic lookup for nav config
 */

import type { ReactNode, SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Width + height in px (or any CSS size when a string is passed). */
  size?: number | string;
  /** Accessible name. When omitted the icon is marked `aria-hidden`. */
  title?: string;
  /** Stroke width override (default 1.75). */
  strokeWidth?: number;
}

export type IconComponent = (props: IconProps) => JSX.Element;

function createIcon(displayName: string, node: ReactNode): IconComponent {
  function Icon({ size = 20, title, strokeWidth = 1.75, className, ...rest }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        role={title ? 'img' : undefined}
        aria-hidden={title ? undefined : true}
        focusable="false"
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        {node}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

/* -------------------------------------------------------------------------- */
/*  Navigation icons                                                          */
/* -------------------------------------------------------------------------- */

export const LayoutDashboard = createIcon(
  'LayoutDashboard',
  <>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </>
);

export const BarChart3 = createIcon(
  'BarChart3',
  <>
    <path d="M3 3v18h18" />
    <path d="M8 17v-4" />
    <path d="M13 17V9" />
    <path d="M18 17v-6" />
  </>
);

export const FileText = createIcon(
  'FileText',
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </>
);

export const Quote = createIcon(
  'Quote',
  <>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 11h.01" />
    <path d="M12 11h.01" />
    <path d="M16 11h.01" />
  </>
);

export const RefreshCw = createIcon(
  'RefreshCw',
  <>
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </>
);

export const ShieldCheck = createIcon(
  'ShieldCheck',
  <>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </>
);

export const ClipboardList = createIcon(
  'ClipboardList',
  <>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M8 11h8" />
    <path d="M8 15h6" />
  </>
);

export const HardHat = createIcon(
  'HardHat',
  <>
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z" />
    <path d="M10 10V5a2 2 0 0 1 4 0v5" />
    <path d="M4 15v-3a6 6 0 0 1 6-6" />
    <path d="M14 6a6 6 0 0 1 6 6v3" />
  </>
);

export const Gavel = createIcon(
  'Gavel',
  <>
    <path d="m14 13-8.5 8.5a2.12 2.12 0 1 1-3-3L11 10" />
    <path d="m16 16 6-6" />
    <path d="m8 8 6-6" />
    <path d="m9 7 8 8" />
    <path d="m21 11-8-8" />
  </>
);

export const Users = createIcon(
  'Users',
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);

export const UserCheck = createIcon(
  'UserCheck',
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="m16 11 2 2 4-4" />
  </>
);

export const Handshake = createIcon(
  'Handshake',
  <>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </>
);

export const Package = createIcon(
  'Package',
  <>
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </>
);

export const ScanLine = createIcon(
  'ScanLine',
  <>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 12h10" />
  </>
);

export const Activity = createIcon('Activity', <path d="M22 12h-4l-3 9L9 3l-3 9H2" />);

export const TrendingUp = createIcon(
  'TrendingUp',
  <>
    <path d="m22 7-8.5 8.5-5-5L2 17" />
    <path d="M16 7h6v6" />
  </>
);

export const TrendingDown = createIcon(
  'TrendingDown',
  <>
    <path d="m22 17-8.5-8.5-5 5L2 7" />
    <path d="M16 17h6v-6" />
  </>
);

export const CreditCard = createIcon(
  'CreditCard',
  <>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <path d="M6 15h4" />
  </>
);

export const Landmark = createIcon(
  'Landmark',
  <>
    <path d="M3 22h18" />
    <path d="M6 18v-7" />
    <path d="M10 18v-7" />
    <path d="M14 18v-7" />
    <path d="M18 18v-7" />
    <path d="m12 2 9 5H3z" />
  </>
);

export const Percent = createIcon(
  'Percent',
  <>
    <path d="m19 5-14 14" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </>
);

export const FileBarChart = createIcon(
  'FileBarChart',
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 18v-3" />
    <path d="M12 18v-6" />
    <path d="M16 18v-2" />
  </>
);

export const Code2 = createIcon(
  'Code2',
  <>
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </>
);

export const UsersRound = createIcon(
  'UsersRound',
  <>
    <path d="M18 21a8 8 0 0 0-16 0" />
    <circle cx="10" cy="8" r="5" />
    <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
  </>
);

export const Settings = createIcon(
  'Settings',
  <>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

/* -------------------------------------------------------------------------- */
/*  Chrome / action icons                                                     */
/* -------------------------------------------------------------------------- */

export const Sun = createIcon(
  'Sun',
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </>
);

export const Moon = createIcon('Moon', <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />);

export const Bell = createIcon(
  'Bell',
  <>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </>
);

export const Search = createIcon(
  'Search',
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>
);

export const Menu = createIcon(
  'Menu',
  <>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </>
);

export const X = createIcon(
  'X',
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>
);

export const ChevronDown = createIcon('ChevronDown', <path d="m6 9 6 6 6-6" />);
export const ChevronUp = createIcon('ChevronUp', <path d="m18 15-6-6-6 6" />);
export const ChevronLeft = createIcon('ChevronLeft', <path d="m15 18-6-6 6-6" />);
export const ChevronRight = createIcon('ChevronRight', <path d="m9 18 6-6-6-6" />);

export const Plus = createIcon(
  'Plus',
  <>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </>
);

export const Minus = createIcon('Minus', <path d="M5 12h14" />);

export const ArrowUp = createIcon(
  'ArrowUp',
  <>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </>
);

export const ArrowDown = createIcon(
  'ArrowDown',
  <>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </>
);

export const ArrowRight = createIcon(
  'ArrowRight',
  <>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </>
);

export const Check = createIcon('Check', <path d="M20 6 9 17l-5-5" />);

export const CheckCircle2 = createIcon(
  'CheckCircle2',
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </>
);

export const Loader2 = createIcon('Loader2', <path d="M21 12a9 9 0 1 1-6.219-8.56" />);

export const LogOut = createIcon(
  'LogOut',
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </>
);

export const PanelLeft = createIcon(
  'PanelLeft',
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </>
);

export const User = createIcon(
  'User',
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
  </>
);

export const Inbox = createIcon(
  'Inbox',
  <>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </>
);

export const Calendar = createIcon(
  'Calendar',
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </>
);

export const Filter = createIcon('Filter', <path d="M22 3H2l8 9.46V19l4 2v-8.54z" />);

export const Download = createIcon(
  'Download',
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
    <path d="M12 15V3" />
  </>
);

export const AlertTriangle = createIcon(
  'AlertTriangle',
  <>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </>
);

export const Info = createIcon(
  'Info',
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </>
);

export const HelpCircle = createIcon(
  'HelpCircle',
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </>
);

export const Eye = createIcon(
  'Eye',
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const Pencil = createIcon('Pencil', <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />);

export const Trash2 = createIcon(
  'Trash2',
  <>
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </>
);

export const Circle = createIcon('Circle', <circle cx="12" cy="12" r="9" />);

/* -------------------------------------------------------------------------- */
/*  Registry — string lookup for `NavItem.icon` in lib/constants              */
/* -------------------------------------------------------------------------- */

export const ICONS = {
  // Navigation
  LayoutDashboard,
  BarChart3,
  FileText,
  Quote,
  RefreshCw,
  ShieldCheck,
  ClipboardList,
  HardHat,
  Gavel,
  Users,
  UserCheck,
  Handshake,
  Package,
  ScanLine,
  Activity,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Landmark,
  Percent,
  FileBarChart,
  Code2,
  UsersRound,
  Settings,
  // Chrome / actions
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  LogOut,
  PanelLeft,
  User,
  Inbox,
  Calendar,
  Filter,
  Download,
  AlertTriangle,
  Info,
  HelpCircle,
  Eye,
  Pencil,
  Trash2,
  Circle,
} as const;

export type IconName = keyof typeof ICONS;

/** Resolve an icon by config string (`NavItem.icon`), falling back to a dot. */
export function getIcon(name: string): IconComponent {
  return (ICONS as Record<string, IconComponent | undefined>)[name] ?? Circle;
}

export default ICONS;
