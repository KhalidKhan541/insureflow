/**
 * Mock data powering the InsureFlow dashboard & analytics screens.
 * Shapes mirror what the API layer will eventually return.
 */

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export type MetricFormat = 'currency' | 'percent' | 'number';

export interface DashboardMetric {
  key: string;
  label: string;
  value: number;
  format: MetricFormat;
  delta: number;
  deltaLabel: string;
  hint: string;
  trend: 'up' | 'down' | 'flat';
}

export const MOCK_DASHBOARD_METRICS: DashboardMetric[] = [
  {
    key: 'written-premium',
    label: 'Written premium',
    value: 48_240_000,
    format: 'currency',
    delta: 12.4,
    deltaLabel: 'vs last year',
    hint: '9-month total',
    trend: 'up',
  },
  {
    key: 'loss-ratio',
    label: 'Loss ratio',
    value: 0.618,
    format: 'percent',
    delta: 2.4,
    deltaLabel: 'pts better than target',
    hint: 'Target 62.0%',
    trend: 'up',
  },
  {
    key: 'open-claims',
    label: 'Open claims',
    value: 233,
    format: 'number',
    delta: -6.1,
    deltaLabel: 'vs last month',
    hint: '18 critical · 46 high',
    trend: 'down',
  },
  {
    key: 'retention-rate',
    label: 'Retention rate',
    value: 0.942,
    format: 'percent',
    delta: 1.3,
    deltaLabel: 'pts vs last year',
    hint: '12-month rolling',
    trend: 'up',
  },
];

/** Written premium vs claims paid, 9 months (Jan–Sep 2026). */
export const MOCK_PREMIUM_CLAIMS: { month: string; premium: number; claims: number }[] = [
  { month: 'Jan', premium: 4_620_000, claims: 2_640_000 },
  { month: 'Feb', premium: 4_880_000, claims: 2_810_000 },
  { month: 'Mar', premium: 5_140_000, claims: 3_020_000 },
  { month: 'Apr', premium: 5_020_000, claims: 3_410_000 },
  { month: 'May', premium: 5_360_000, claims: 3_180_000 },
  { month: 'Jun', premium: 5_610_000, claims: 3_520_000 },
  { month: 'Jul', premium: 5_480_000, claims: 3_690_000 },
  { month: 'Aug', premium: 5_910_000, claims: 3_440_000 },
  { month: 'Sep', premium: 6_220_000, claims: 3_860_000 },
];

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface OpenClaim {
  id: string;
  claimNumber: string;
  claimant: string;
  type: string;
  severity: Severity;
  amount: number;
  filed: string;
}

export const MOCK_OPEN_CLAIMS: OpenClaim[] = [
  {
    id: 'clm_1',
    claimNumber: 'CLM-2026-4821',
    claimant: 'Marisol Vega',
    type: 'Auto collision',
    severity: 'Critical',
    amount: 84_500,
    filed: '2h ago',
  },
  {
    id: 'clm_2',
    claimNumber: 'CLM-2026-4817',
    claimant: 'Northwind Logistics',
    type: 'Commercial cargo',
    severity: 'Critical',
    amount: 132_000,
    filed: '5h ago',
  },
  {
    id: 'clm_3',
    claimNumber: 'CLM-2026-4809',
    claimant: 'Devon Park HOA',
    type: 'Property water damage',
    severity: 'High',
    amount: 47_250,
    filed: 'Yesterday',
  },
  {
    id: 'clm_4',
    claimNumber: 'CLM-2026-4802',
    claimant: 'Aiko Tanaka',
    type: 'Home theft',
    severity: 'High',
    amount: 18_900,
    filed: '2 days ago',
  },
  {
    id: 'clm_5',
    claimNumber: 'CLM-2026-4794',
    claimant: 'Ridgeline Cafe Group',
    type: 'General liability',
    severity: 'Medium',
    amount: 9_600,
    filed: '3 days ago',
  },
  {
    id: 'clm_6',
    claimNumber: 'CLM-2026-4788',
    claimant: 'Priya Raman',
    type: 'Windshield glass',
    severity: 'Low',
    amount: 1_450,
    filed: '4 days ago',
  },
];

export interface TopAgent {
  name: string;
  agency: string;
  book: number;
  policies: number;
  /** Fraction, e.g. 0.96 */
  retention: number;
}

export const MOCK_TOP_AGENTS: TopAgent[] = [
  { name: 'Elena Brooks', agency: 'Brooks & Co.', book: 4_820_000, policies: 412, retention: 0.96 },
  { name: 'Marcus Idowu', agency: 'Idowu Risk Partners', book: 3_960_000, policies: 356, retention: 0.94 },
  { name: 'Sofia Marchetti', agency: 'Marchetti Insurance', book: 3_410_000, policies: 301, retention: 0.92 },
  { name: 'Grace Lim', agency: 'Harborline Agency', book: 2_780_000, policies: 248, retention: 0.95 },
  { name: 'Tom Whitfield', agency: 'Whitfield Financial', book: 2_140_000, policies: 197, retention: 0.89 },
];

export const MOCK_POLICY_STATUS: { label: string; count: number; delta: number }[] = [
  { label: 'Active', count: 8_412, delta: 1.8 },
  { label: 'Pending Renewal', count: 632, delta: -0.9 },
  { label: 'In Underwriting', count: 418, delta: 3.2 },
  { label: 'Endorsement Review', count: 154, delta: 0.7 },
  { label: 'Lapsed', count: 226, delta: -1.4 },
];

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone?: 'default' | 'muted';
}

export const MOCK_ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'act_1',
    title: 'Policy POL-90312 renewed',
    detail: 'Elena Brooks · Commercial property · $48,200 premium',
    time: '4 min ago',
  },
  {
    id: 'act_2',
    title: 'Claim CLM-2026-4821 escalated to Critical',
    detail: 'Auto collision · assigned to complex claims desk',
    time: '22 min ago',
    tone: 'muted',
  },
  {
    id: 'act_3',
    title: 'New quote request from Delacroix Hardware',
    detail: 'General liability · $1.2M revenue band',
    time: '1 hr ago',
  },
  {
    id: 'act_4',
    title: 'Underwriting decision approved',
    detail: 'Health · family plan · Marcus Idowu',
    time: '3 hr ago',
    tone: 'muted',
  },
  {
    id: 'act_5',
    title: 'Commission payout processed',
    detail: 'September cycle · 42 agents · $612,400',
    time: '6 hr ago',
  },
];

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

/** Written premium current year vs prior year, 9 months. */
export const MOCK_PREMIUM_GROWTH: { month: string; current: number; prior: number }[] = [
  { month: 'Jan', current: 4_620_000, prior: 4_110_000 },
  { month: 'Feb', current: 4_880_000, prior: 4_240_000 },
  { month: 'Mar', current: 5_140_000, prior: 4_460_000 },
  { month: 'Apr', current: 5_020_000, prior: 4_380_000 },
  { month: 'May', current: 5_360_000, prior: 4_610_000 },
  { month: 'Jun', current: 5_610_000, prior: 4_790_000 },
  { month: 'Jul', current: 5_480_000, prior: 4_720_000 },
  { month: 'Aug', current: 5_910_000, prior: 4_930_000 },
  { month: 'Sep', current: 6_220_000, prior: 5_140_000 },
];

/** Loss ratio expressed as a percentage number (61.8 → 61.8%). */
export const MOCK_LOSS_RATIO_BY_PRODUCT: { product: string; lossRatio: number }[] = [
  { product: 'Auto', lossRatio: 68.4 },
  { product: 'Homeowners', lossRatio: 57.2 },
  { product: 'Commercial', lossRatio: 63.9 },
  { product: 'Life', lossRatio: 41.5 },
  { product: 'Health', lossRatio: 71.8 },
  { product: 'Umbrella', lossRatio: 49.6 },
];

export const MOCK_CLAIMS_SEVERITY: { severity: Severity; value: number }[] = [
  { severity: 'Critical', value: 18 },
  { severity: 'High', value: 46 },
  { severity: 'Medium', value: 92 },
  { severity: 'Low', value: 77 },
];

export const MOCK_POLICY_MIX: { type: string; value: number }[] = [
  { type: 'Auto', value: 4_210 },
  { type: 'Homeowners', value: 2_680 },
  { type: 'Commercial', value: 1_520 },
  { type: 'Life', value: 980 },
  { type: 'Health', value: 760 },
  { type: 'Umbrella', value: 410 },
];

/** Retention as a percentage number (93.4 → 93.4%). */
export const MOCK_RETENTION_TREND: { month: string; retention: number }[] = [
  { month: 'Jan', retention: 91.2 },
  { month: 'Feb', retention: 91.6 },
  { month: 'Mar', retention: 92.1 },
  { month: 'Apr', retention: 91.8 },
  { month: 'May', retention: 92.7 },
  { month: 'Jun', retention: 93.0 },
  { month: 'Jul', retention: 93.4 },
  { month: 'Aug', retention: 93.9 },
  { month: 'Sep', retention: 94.2 },
];

/** Commission outflow vs written premium, 9 months. */
export const MOCK_COMMISSION_SPEND: { month: string; commission: number; premium: number }[] = [
  { month: 'Jan', commission: 323_400, premium: 4_620_000 },
  { month: 'Feb', commission: 341_600, premium: 4_880_000 },
  { month: 'Mar', commission: 359_800, premium: 5_140_000 },
  { month: 'Apr', commission: 351_400, premium: 5_020_000 },
  { month: 'May', commission: 375_200, premium: 5_360_000 },
  { month: 'Jun', commission: 392_700, premium: 5_610_000 },
  { month: 'Jul', commission: 383_600, premium: 5_480_000 },
  { month: 'Aug', commission: 413_700, premium: 5_910_000 },
  { month: 'Sep', commission: 435_400, premium: 6_220_000 },
];
