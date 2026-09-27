/**
 * InsureFlow — application-wide constants.
 *
 * Every route label, navigation section, and static enum used across the
 * dashboard lives here so that copy changes never require touching markup.
 */

export const APP_NAME = 'InsureFlow';
export const APP_DESCRIPTION =
  'Policy, claims, and underwriting operations for modern insurers.';
export const APP_TAGLINE = 'Every policy. Every claim. One flow.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
export const APP_VERSION = '0.1.0';
export const APP_SUPPORT_EMAIL = 'support@insureflow.dev';
export const APP_LEGAL_NAME = 'InsureFlow Technologies, Inc.';

export type NavItemId =
  | 'dashboard'
  | 'analytics'
  | 'policies'
  | 'quotes'
  | 'renewals'
  | 'coverage'
  | 'claims'
  | 'adjusters'
  | 'litigation'
  | 'customers'
  | 'agents'
  | 'brokers'
  | 'products'
  | 'underwriting'
  | 'risk'
  | 'premiums'
  | 'payments'
  | 'reserves'
  | 'commissions'
  | 'reports'
  | 'api'
  | 'team'
  | 'settings';

export interface NavItem {
  /** Stable identifier used for routing and active-state matching. */
  id: NavItemId;
  /** Human-readable label rendered in the sidebar. */
  label: string;
  /** Relative href for the item. */
  href: string;
  /**
   * Name of the icon component/variant to render. Kept as a string so this
   * file stays framework-agnostic and import-free.
   */
  icon: string;
  /** Optional count/badge shown next to the label (e.g. open claims). */
  badge?: number | string;
  /** Secondary status pill, e.g. "Beta". */
  tag?: 'beta' | 'new' | 'live';
  /** Whether the item is visible to restricted roles. */
  requiresPermission?: string;
}

export interface NavSection {
  id: string;
  /** Section heading rendered above the group. */
  title: string;
  items: NavItem[];
}

/**
 * Primary sidebar navigation — grouped into seven logical sections.
 */
export const SIDEBAR_NAV: NavSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: 'LayoutDashboard',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/analytics',
        icon: 'BarChart3',
      },
    ],
  },
  {
    id: 'policies',
    title: 'Policies',
    items: [
      {
        id: 'policies',
        label: 'Policies',
        href: '/policies',
        icon: 'FileText',
      },
      {
        id: 'quotes',
        label: 'Quotes',
        href: '/quotes',
        icon: 'Quote',
        badge: 12,
      },
      {
        id: 'renewals',
        label: 'Renewals',
        href: '/renewals',
        icon: 'RefreshCw',
        badge: 10,
      },
      {
        id: 'coverage',
        label: 'Coverage',
        href: '/coverage',
        icon: 'ShieldCheck',
      },
    ],
  },
  {
    id: 'claims',
    title: 'Claims',
    items: [
      {
        id: 'claims',
        label: 'Claims',
        href: '/claims',
        icon: 'ClipboardList',
        badge: 7,
      },
      {
        id: 'adjusters',
        label: 'Adjusters',
        href: '/adjusters',
        icon: 'HardHat',
      },
      {
        id: 'litigation',
        label: 'Litigation',
        href: '/litigation',
        icon: 'Gavel',
      },
    ],
  },
  {
    id: 'customers',
    title: 'Customers',
    items: [
      {
        id: 'customers',
        label: 'Customers',
        href: '/customers',
        icon: 'Users',
      },
      {
        id: 'agents',
        label: 'Agents',
        href: '/agents',
        icon: 'UserCheck',
      },
      {
        id: 'brokers',
        label: 'Brokers',
        href: '/brokers',
        icon: 'Handshake',
      },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    items: [
      {
        id: 'products',
        label: 'Products',
        href: '/products',
        icon: 'Package',
      },
      {
        id: 'underwriting',
        label: 'Underwriting',
        href: '/underwriting',
        icon: 'ScanLine',
        tag: 'beta',
      },
      {
        id: 'risk',
        label: 'Risk',
        href: '/risk',
        icon: 'Activity',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    items: [
      {
        id: 'premiums',
        label: 'Premiums',
        href: '/premiums',
        icon: 'TrendingUp',
      },
      {
        id: 'payments',
        label: 'Payments',
        href: '/payments',
        icon: 'CreditCard',
      },
      {
        id: 'reserves',
        label: 'Reserves',
        href: '/reserves',
        icon: 'Landmark',
      },
      {
        id: 'commissions',
        label: 'Commissions',
        href: '/commissions',
        icon: 'Percent',
      },
    ],
  },
  {
    id: 'platform',
    title: 'Platform',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        href: '/reports',
        icon: 'FileBarChart',
      },
      {
        id: 'api',
        label: 'API',
        href: '/api',
        icon: 'Code2',
        tag: 'live',
      },
      {
        id: 'team',
        label: 'Team',
        href: '/team',
        icon: 'UsersRound',
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        icon: 'Settings',
      },
    ],
  },
];

/** Flattened lookup map for navigation items by id. */
export const NAV_ITEM_BY_ID: Record<string, NavItem> = Object.fromEntries(
  SIDEBAR_NAV.flatMap((section) => section.items).map((item) => [item.id, item])
);

/* -------------------------------------------------------------------------- */
/*  Domain vocabularies                                                       */
/* -------------------------------------------------------------------------- */

export const POLICY_STATUSES = [
  'active',
  'pending',
  'renewal_due',
  'expired',
  'cancelled',
  'lapsed',
  'draft',
] as const;

export const CLAIM_STATUSES = [
  'reported',
  'under_review',
  'investigating',
  'awaiting_documents',
  'approved',
  'partially_paid',
  'paid',
  'denied',
  'reopened',
  'litigation',
] as const;

export const SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;

export const QUOTE_DECISIONS = ['approved', 'declined', 'refer', 'needs_info'] as const;

export const PAYMENT_STATUSES = [
  'succeeded',
  'processing',
  'failed',
  'refunded',
  'past_due',
  'canceled',
] as const;

export const PAYMENT_METHODS = [
  'card',
  'ach',
  'wire',
  'check',
  'direct_debit',
  'paypal',
] as const;

export const COVERAGE_TYPES = [
  'auto_liability',
  'collision',
  'comprehensive',
  'property',
  'general_liability',
  'professional_indemnity',
  'workers_compensation',
  'cyber',
] as const;

export const RISK_PROFILES = ['preferred', 'standard', 'elevated', 'high_risk'] as const;

/** Severity → badge class, shared by every status pill in the app. */
export const SEVERITY_BADGE: Record<string, string> = {
  low: 'if-badge-neutral',
  medium: 'if-badge-info',
  high: 'if-badge-warning',
  critical: 'if-badge-destructive',
};

/** Status → badge class, shared by every status pill in the app. */
export const STATUS_BADGE: Record<string, string> = {
  active: 'if-badge-success',
  approved: 'if-badge-success',
  paid: 'if-badge-success',
  succeeded: 'if-badge-success',
  healthy: 'if-badge-success',
  pending: 'if-badge-warning',
  processing: 'if-badge-info',
  under_review: 'if-badge-info',
  investigating: 'if-badge-info',
  reported: 'if-badge-info',
  renewal_due: 'if-badge-warning',
  needs_info: 'if-badge-warning',
  awaiting_documents: 'if-badge-warning',
  past_due: 'if-badge-warning',
  refer: 'if-badge-warning',
  draft: 'if-badge-neutral',
  expired: 'if-badge-neutral',
  canceled: 'if-badge-neutral',
  cancelled: 'if-badge-neutral',
  lapsed: 'if-badge-neutral',
  denied: 'if-badge-destructive',
  declined: 'if-badge-destructive',
  failed: 'if-badge-destructive',
  critical: 'if-badge-destructive',
  litigation: 'if-badge-destructive',
  reopened: 'if-badge-warning',
};

export const SEVERITY_DOT: Record<string, string> = {
  low: 'if-dot-neutral',
  medium: 'if-dot-info',
  high: 'if-dot-warning',
  critical: 'if-dot-danger',
};
