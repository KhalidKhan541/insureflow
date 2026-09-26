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

/* ------------------------------------------------------------------ */
/* Claims, adjusters & litigation                                      */
/* ------------------------------------------------------------------ */

export type ClaimStatus = 'Reported' | 'Investigating' | 'Adjusting' | 'Settled' | 'Denied';

export interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  claimant: string;
  lossType: string;
  amountClaimed: number;
  amountReserved: number;
  severity: Severity;
  status: ClaimStatus;
  /** 0–100 model score; >= 70 routes to the SIU queue. */
  fraudScore: number;
  adjuster: string;
  /** ISO date, `YYYY-MM-DD`. */
  dateOfLoss: string;
}

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 'clm_4821',
    claimNumber: 'CLM-2026-4821',
    policyNumber: 'POL-883014',
    claimant: 'Marisol Vega',
    lossType: 'Auto collision',
    amountClaimed: 84_500,
    amountReserved: 76_000,
    severity: 'Critical',
    status: 'Adjusting',
    fraudScore: 72,
    adjuster: 'Elena Vasquez',
    dateOfLoss: '2026-09-14',
  },
  {
    id: 'clm_4817',
    claimNumber: 'CLM-2026-4817',
    policyNumber: 'POL-441902',
    claimant: 'Northwind Logistics',
    lossType: 'Commercial cargo',
    amountClaimed: 132_000,
    amountReserved: 150_000,
    severity: 'Critical',
    status: 'Investigating',
    fraudScore: 41,
    adjuster: 'Marcus Hale',
    dateOfLoss: '2026-09-11',
  },
  {
    id: 'clm_4809',
    claimNumber: 'CLM-2026-4809',
    policyNumber: 'POL-770255',
    claimant: 'Devon Park HOA',
    lossType: 'Property water damage',
    amountClaimed: 47_250,
    amountReserved: 40_000,
    severity: 'High',
    status: 'Adjusting',
    fraudScore: 24,
    adjuster: 'Nadia Osei',
    dateOfLoss: '2026-09-06',
  },
  {
    id: 'clm_4802',
    claimNumber: 'CLM-2026-4802',
    policyNumber: 'POL-559118',
    claimant: 'Aiko Tanaka',
    lossType: 'Home theft',
    amountClaimed: 18_900,
    amountReserved: 12_000,
    severity: 'High',
    status: 'Reported',
    fraudScore: 66,
    adjuster: 'Nadia Osei',
    dateOfLoss: '2026-09-02',
  },
  {
    id: 'clm_4794',
    claimNumber: 'CLM-2026-4794',
    policyNumber: 'POL-206447',
    claimant: 'Ridgeline Cafe Group',
    lossType: 'General liability',
    amountClaimed: 9_600,
    amountReserved: 15_000,
    severity: 'Medium',
    status: 'Investigating',
    fraudScore: 33,
    adjuster: 'Tom Brennan',
    dateOfLoss: '2026-08-27',
  },
  {
    id: 'clm_4788',
    claimNumber: 'CLM-2026-4788',
    policyNumber: 'POL-331290',
    claimant: 'Priya Raman',
    lossType: 'Windshield glass',
    amountClaimed: 1_450,
    amountReserved: 1_200,
    severity: 'Low',
    status: 'Settled',
    fraudScore: 8,
    adjuster: 'Elena Vasquez',
    dateOfLoss: '2026-08-21',
  },
  {
    id: 'clm_4771',
    claimNumber: 'CLM-2026-4771',
    policyNumber: 'POL-884771',
    claimant: 'Calder & Finch LLC',
    lossType: 'Slip and fall',
    amountClaimed: 62_400,
    amountReserved: 55_000,
    severity: 'High',
    status: 'Adjusting',
    fraudScore: 58,
    adjuster: 'Tom Brennan',
    dateOfLoss: '2026-08-14',
  },
  {
    id: 'clm_4763',
    claimNumber: 'CLM-2026-4763',
    policyNumber: 'POL-118364',
    claimant: 'Hana Ishikawa',
    lossType: 'Auto collision',
    amountClaimed: 27_300,
    amountReserved: 9_000,
    severity: 'Medium',
    status: 'Denied',
    fraudScore: 81,
    adjuster: 'Elena Vasquez',
    dateOfLoss: '2026-08-09',
  },
  {
    id: 'clm_4750',
    claimNumber: 'CLM-2026-4750',
    policyNumber: 'POL-665019',
    claimant: 'Beacon Medical Group',
    lossType: 'Malpractice',
    amountClaimed: 410_000,
    amountReserved: 380_000,
    severity: 'Critical',
    status: 'Investigating',
    fraudScore: 47,
    adjuster: 'Grace Cho',
    dateOfLoss: '2026-07-30',
  },
  {
    id: 'clm_4742',
    claimNumber: 'CLM-2026-4742',
    policyNumber: 'POL-902873',
    claimant: 'Redwood Freight',
    lossType: 'Fleet fire',
    amountClaimed: 214_000,
    amountReserved: 190_000,
    severity: 'Critical',
    status: 'Adjusting',
    fraudScore: 35,
    adjuster: 'Marcus Hale',
    dateOfLoss: '2026-07-22',
  },
  {
    id: 'clm_4736',
    claimNumber: 'CLM-2026-4736',
    policyNumber: 'POL-474120',
    claimant: 'Jordan Meyers',
    lossType: 'Workers compensation',
    amountClaimed: 38_750,
    amountReserved: 45_000,
    severity: 'Medium',
    status: 'Settled',
    fraudScore: 12,
    adjuster: 'Owen Farrell',
    dateOfLoss: '2026-07-15',
  },
  {
    id: 'clm_4728',
    claimNumber: 'CLM-2026-4728',
    policyNumber: 'POL-350982',
    claimant: 'Sierra Vista Retail',
    lossType: 'Theft liability',
    amountClaimed: 6_200,
    amountReserved: 4_500,
    severity: 'Low',
    status: 'Settled',
    fraudScore: 19,
    adjuster: 'Tom Brennan',
    dateOfLoss: '2026-07-08',
  },
  {
    id: 'clm_4715',
    claimNumber: 'CLM-2026-4715',
    policyNumber: 'POL-728640',
    claimant: 'Ferndale Construction',
    lossType: 'Equipment damage',
    amountClaimed: 96_500,
    amountReserved: 88_000,
    severity: 'High',
    status: 'Denied',
    fraudScore: 74,
    adjuster: 'Marcus Hale',
    dateOfLoss: '2026-06-28',
  },
  {
    id: 'clm_4702',
    claimNumber: 'CLM-2026-4702',
    policyNumber: 'POL-514203',
    claimant: 'Lucia Moreno',
    lossType: 'Hail damage',
    amountClaimed: 33_800,
    amountReserved: 30_000,
    severity: 'Medium',
    status: 'Reported',
    fraudScore: 21,
    adjuster: 'Nadia Osei',
    dateOfLoss: '2026-06-19',
  },
  {
    id: 'clm_4695',
    claimNumber: 'CLM-2026-4695',
    policyNumber: 'POL-640775',
    claimant: 'Kingsley Productions',
    lossType: 'Event cancellation',
    amountClaimed: 58_000,
    amountReserved: 50_000,
    severity: 'High',
    status: 'Investigating',
    fraudScore: 55,
    adjuster: 'Tom Brennan',
    dateOfLoss: '2026-06-11',
  },
  {
    id: 'clm_4688',
    claimNumber: 'CLM-2026-4688',
    policyNumber: 'POL-287541',
    claimant: 'Ade Adeyemi',
    lossType: 'Life claim',
    amountClaimed: 250_000,
    amountReserved: 250_000,
    severity: 'Critical',
    status: 'Settled',
    fraudScore: 5,
    adjuster: 'Grace Cho',
    dateOfLoss: '2026-05-30',
  },
];

export type AdjusterStatus = 'Available' | 'At Capacity' | 'On Leave' | 'Mentoring';

export interface Adjuster {
  id: string;
  name: string;
  specialty: string;
  region: string;
  /** Currently assigned claims. */
  caseload: number;
  /** Max claims this adjuster can carry before escalation. */
  capacity: number;
  /** Median days from FNOL to settlement. */
  avgCycleTime: number;
  /** Percentage number (84 → 84%). */
  settlementRate: number;
  /** 0–5 field rating. */
  rating: number;
  status: AdjusterStatus;
}

export const MOCK_ADJUSTERS: Adjuster[] = [
  {
    id: 'adj_1',
    name: 'Elena Vasquez',
    specialty: 'Auto',
    region: 'Southwest',
    caseload: 18,
    capacity: 22,
    avgCycleTime: 21,
    settlementRate: 84,
    rating: 4.7,
    status: 'Available',
  },
  {
    id: 'adj_2',
    name: 'Marcus Hale',
    specialty: 'Commercial',
    region: 'Northeast',
    caseload: 15,
    capacity: 16,
    avgCycleTime: 34,
    settlementRate: 71,
    rating: 4.3,
    status: 'At Capacity',
  },
  {
    id: 'adj_3',
    name: 'Nadia Osei',
    specialty: 'Property',
    region: 'Southeast',
    caseload: 12,
    capacity: 20,
    avgCycleTime: 18,
    settlementRate: 88,
    rating: 4.8,
    status: 'Available',
  },
  {
    id: 'adj_4',
    name: 'Tom Brennan',
    specialty: 'Liability',
    region: 'Midwest',
    caseload: 19,
    capacity: 20,
    avgCycleTime: 27,
    settlementRate: 76,
    rating: 4.1,
    status: 'At Capacity',
  },
  {
    id: 'adj_5',
    name: 'Grace Cho',
    specialty: 'Health & Life',
    region: 'West',
    caseload: 9,
    capacity: 18,
    avgCycleTime: 14,
    settlementRate: 91,
    rating: 4.9,
    status: 'Mentoring',
  },
  {
    id: 'adj_6',
    name: 'Owen Farrell',
    specialty: "Workers' Comp",
    region: 'Northwest',
    caseload: 7,
    capacity: 16,
    avgCycleTime: 25,
    settlementRate: 79,
    rating: 4.4,
    status: 'On Leave',
  },
];

export type LitigationStatus = 'Pre-Trial' | 'Discovery' | 'Trial' | 'Settled' | 'Closed';

export interface LitigationCase {
  id: string;
  caseNumber: string;
  claimNumber: string;
  defendant: string;
  counsel: string;
  counselFirm: string;
  /** ISO date, `YYYY-MM-DD`. */
  filingDate: string;
  /** ISO date, `YYYY-MM-DD` — next calendared hearing. */
  nextHearing: string;
  status: LitigationStatus;
  amountAtStake: number;
  jurisdiction: string;
  venue: string;
  owner: string;
  notes: string;
}

export const MOCK_LITIGATION: LitigationCase[] = [
  {
    id: 'lit_14',
    caseNumber: 'LIT-2026-014',
    claimNumber: 'CLM-2026-4763',
    defendant: 'Hana Ishikawa',
    counsel: 'Rachel Kim',
    counselFirm: 'Whitmore & Cole LLP',
    filingDate: '2026-06-04',
    nextHearing: '2026-10-02',
    status: 'Trial',
    amountAtStake: 120_000,
    jurisdiction: 'California Superior Court',
    venue: 'Los Angeles County',
    owner: 'D. Okafor',
    notes:
      'Denial is being contested after the SIU flagged staged-collision indicators. Jury selection begins with the October sitting; reserve held at the denial exposure.',
  },
  {
    id: 'lit_13',
    caseNumber: 'LIT-2026-013',
    claimNumber: 'CLM-2026-4715',
    defendant: 'Ferndale Construction',
    counsel: 'Peter Nkemdirim',
    counselFirm: 'Sterling Bridge Law',
    filingDate: '2026-05-19',
    nextHearing: '2026-10-14',
    status: 'Discovery',
    amountAtStake: 96_500,
    jurisdiction: 'Colorado District Court',
    venue: 'Denver County',
    owner: 'S. Marchetti',
    notes:
      'Equipment damage denial under review — plaintiff alleges negligent site supervision. Document production closes the first week of October.',
  },
  {
    id: 'lit_12',
    caseNumber: 'LIT-2026-012',
    claimNumber: 'CLM-2026-4750',
    defendant: 'Beacon Medical Group',
    counsel: 'Alicia Ward',
    counselFirm: 'Hartwell Pierce PC',
    filingDate: '2026-04-28',
    nextHearing: '2026-11-06',
    status: 'Pre-Trial',
    amountAtStake: 410_000,
    jurisdiction: 'New York Supreme Court',
    venue: 'Kings County',
    owner: 'D. Okafor',
    notes:
      'Highest-exposure matter on the docket. Mediation requested by claimant counsel; expert reports on standard of care outstanding.',
  },
  {
    id: 'lit_11',
    caseNumber: 'LIT-2026-011',
    claimNumber: 'CLM-2026-4742',
    defendant: 'Redwood Freight',
    counsel: 'Marcus Delgado',
    counselFirm: 'Corbin Hale LLP',
    filingDate: '2026-03-30',
    nextHearing: '2026-09-30',
    status: 'Trial',
    amountAtStake: 214_000,
    jurisdiction: 'Texas District Court',
    venue: 'Travis County',
    owner: 'S. Marchetti',
    notes:
      'Fleet fire subrogation action against the maintenance contractor. Opening statements calendared this week; engineer testimony lined up.',
  },
  {
    id: 'lit_10',
    caseNumber: 'LIT-2026-010',
    claimNumber: 'CLM-2026-4794',
    defendant: 'Ridgeline Cafe Group',
    counsel: 'June Park',
    counselFirm: 'Alder & Finch',
    filingDate: '2026-02-17',
    nextHearing: '2026-10-21',
    status: 'Discovery',
    amountAtStake: 64_000,
    jurisdiction: 'Washington Superior Court',
    venue: 'King County',
    owner: 'L. Ferreira',
    notes:
      'Third-party claimant pursuing damages above the initial reserve. Depositions of store staff scheduled through October.',
  },
  {
    id: 'lit_09',
    caseNumber: 'LIT-2026-009',
    claimNumber: 'CLM-2026-4771',
    defendant: 'Calder & Finch LLC',
    counsel: 'Owen Mbeki',
    counselFirm: 'Whitmore & Cole LLP',
    filingDate: '2026-01-22',
    nextHearing: '2026-11-19',
    status: 'Pre-Trial',
    amountAtStake: 82_000,
    jurisdiction: 'Illinois Circuit Court',
    venue: 'Cook County',
    owner: 'L. Ferreira',
    notes:
      'Slip-and-fall premises liability dispute. Pre-trial conference set to confirm witness lists and expert disclosures.',
  },
  {
    id: 'lit_08',
    caseNumber: 'LIT-2026-008',
    claimNumber: 'CLM-2026-4728',
    defendant: 'Sierra Vista Retail',
    counsel: 'Nina Alvarez',
    counselFirm: 'Sterling Bridge Law',
    filingDate: '2026-07-09',
    nextHearing: '2026-12-03',
    status: 'Pre-Trial',
    amountAtStake: 41_000,
    jurisdiction: 'Arizona Superior Court',
    venue: 'Maricopa County',
    owner: 'S. Marchetti',
    notes:
      'Theft liability dispute with a co-defendant retailer. Case management conference in December; early settlement conference offered.',
  },
  {
    id: 'lit_07',
    caseNumber: 'LIT-2026-007',
    claimNumber: 'CLM-2026-4817',
    defendant: 'Northwind Logistics',
    counsel: 'Peter Nkemdirim',
    counselFirm: 'Sterling Bridge Law',
    filingDate: '2026-08-26',
    nextHearing: '2026-10-27',
    status: 'Pre-Trial',
    amountAtStake: 132_000,
    jurisdiction: 'New Jersey Chancery Division',
    venue: 'Essex County',
    owner: 'D. Okafor',
    notes:
      'Cargo loss recovery action against the haulier. Answer filed; motion to transfer venue pending ahead of the October conference.',
  },
  {
    id: 'lit_06',
    caseNumber: 'LIT-2026-006',
    claimNumber: 'CLM-2026-4788',
    defendant: 'Priya Raman',
    counsel: 'June Park',
    counselFirm: 'Alder & Finch',
    filingDate: '2026-06-30',
    nextHearing: '2026-09-15',
    status: 'Settled',
    amountAtStake: 4_500,
    jurisdiction: 'Oregon Circuit Court',
    venue: 'Multnomah County',
    owner: 'L. Ferreira',
    notes:
      'Glass claim escalated to suit, then resolved at mediation for below the adjusted reserve. Release executed and filed.',
  },
  {
    id: 'lit_05',
    caseNumber: 'LIT-2026-005',
    claimNumber: 'CLM-2026-4736',
    defendant: 'Jordan Meyers',
    counsel: 'Alicia Ward',
    counselFirm: 'Hartwell Pierce PC',
    filingDate: '2026-05-08',
    nextHearing: '2026-08-05',
    status: 'Closed',
    amountAtStake: 38_750,
    jurisdiction: 'Ohio Court of Common Pleas',
    venue: 'Franklin County',
    owner: 'S. Marchetti',
    notes:
      'Workers compensation dispute closed after the parties agreed to a structured settlement. Order entered and file archived.',
  },
];
