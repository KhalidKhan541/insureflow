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

/* ------------------------------------------------------------------ */
/* Finance — premiums, payments, reserves & commissions                */
/* ------------------------------------------------------------------ */

export type PremiumStatus = 'Collected' | 'Partial' | 'Outstanding' | 'Overdue';

export interface Premium {
  id: string;
  /** Billing period label, e.g. `Jan 2026`. */
  period: string;
  policyNumber: string;
  customer: string;
  product: string;
  written: number;
  earned: number;
  collected: number;
  outstanding: number;
  /** ISO date (`YYYY-MM-DD`) the installment is billed for. */
  dueDate: string;
  status: PremiumStatus;
}

export const MOCK_PREMIUMS: Premium[] = [
  { id: 'prm_01', period: 'Jan 2026', policyNumber: 'POL-883014', customer: 'Marisol Vega', product: 'Auto', written: 1_386_000, earned: 1_234_000, collected: 1_386_000, outstanding: 0, dueDate: '2026-01-15', status: 'Collected' },
  { id: 'prm_02', period: 'Jan 2026', policyNumber: 'POL-770255', customer: 'Devon Park HOA', product: 'Homeowners', written: 1_016_000, earned: 904_000, collected: 610_000, outstanding: 406_000, dueDate: '2026-01-15', status: 'Partial' },
  { id: 'prm_03', period: 'Jan 2026', policyNumber: 'POL-441902', customer: 'Northwind Logistics', product: 'Commercial', written: 924_000, earned: 822_000, collected: 924_000, outstanding: 0, dueDate: '2026-01-15', status: 'Collected' },
  { id: 'prm_04', period: 'Jan 2026', policyNumber: 'POL-559118', customer: 'Aiko Tanaka', product: 'Life', written: 554_000, earned: 493_000, collected: 554_000, outstanding: 0, dueDate: '2026-01-15', status: 'Collected' },
  { id: 'prm_05', period: 'Jan 2026', policyNumber: 'POL-665019', customer: 'Beacon Medical Group', product: 'Health', written: 462_000, earned: 411_000, collected: 462_000, outstanding: 0, dueDate: '2026-01-15', status: 'Collected' },
  { id: 'prm_06', period: 'Jan 2026', policyNumber: 'POL-640775', customer: 'Whitfield Financial', product: 'Umbrella', written: 278_000, earned: 247_000, collected: 0, outstanding: 278_000, dueDate: '2026-01-15', status: 'Overdue' },
  { id: 'prm_07', period: 'Feb 2026', policyNumber: 'POL-331290', customer: 'Priya Raman', product: 'Auto', written: 1_464_000, earned: 1_318_000, collected: 1_464_000, outstanding: 0, dueDate: '2026-02-15', status: 'Collected' },
  { id: 'prm_08', period: 'Feb 2026', policyNumber: 'POL-728640', customer: 'Lucia Moreno', product: 'Homeowners', written: 1_074_000, earned: 967_000, collected: 1_074_000, outstanding: 0, dueDate: '2026-02-15', status: 'Collected' },
  { id: 'prm_09', period: 'Feb 2026', policyNumber: 'POL-206447', customer: 'Ridgeline Cafe Group', product: 'Commercial', written: 976_000, earned: 878_000, collected: 976_000, outstanding: 0, dueDate: '2026-02-15', status: 'Collected' },
  { id: 'prm_10', period: 'Feb 2026', policyNumber: 'POL-474120', customer: 'Jordan Meyers', product: 'Life', written: 586_000, earned: 527_000, collected: 586_000, outstanding: 0, dueDate: '2026-02-15', status: 'Collected' },
  { id: 'prm_11', period: 'Feb 2026', policyNumber: 'POL-917455', customer: 'Brightpath Clinics', product: 'Health', written: 488_000, earned: 439_000, collected: 0, outstanding: 488_000, dueDate: '2026-02-15', status: 'Overdue' },
  { id: 'prm_12', period: 'Feb 2026', policyNumber: 'POL-884771', customer: 'Calder & Finch LLC', product: 'Umbrella', written: 292_000, earned: 263_000, collected: 292_000, outstanding: 0, dueDate: '2026-02-15', status: 'Collected' },
  { id: 'prm_13', period: 'Mar 2026', policyNumber: 'POL-118364', customer: 'Hana Ishikawa', product: 'Auto', written: 1_542_000, earned: 1_403_000, collected: 1_542_000, outstanding: 0, dueDate: '2026-03-15', status: 'Collected' },
  { id: 'prm_14', period: 'Mar 2026', policyNumber: 'POL-956120', customer: 'Harborline Realty', product: 'Homeowners', written: 1_131_000, earned: 1_029_000, collected: 1_131_000, outstanding: 0, dueDate: '2026-03-15', status: 'Collected' },
  { id: 'prm_15', period: 'Mar 2026', policyNumber: 'POL-514203', customer: 'Delacroix Hardware', product: 'Commercial', written: 1_028_000, earned: 935_000, collected: 600_000, outstanding: 428_000, dueDate: '2026-03-15', status: 'Partial' },
  { id: 'prm_16', period: 'Mar 2026', policyNumber: 'POL-287541', customer: 'Kingsley Productions', product: 'Life', written: 617_000, earned: 561_000, collected: 617_000, outstanding: 0, dueDate: '2026-03-15', status: 'Collected' },
  { id: 'prm_17', period: 'Mar 2026', policyNumber: 'POL-665019', customer: 'Beacon Medical Group', product: 'Health', written: 514_000, earned: 468_000, collected: 514_000, outstanding: 0, dueDate: '2026-03-15', status: 'Collected' },
  { id: 'prm_18', period: 'Mar 2026', policyNumber: 'POL-640775', customer: 'Whitfield Financial', product: 'Umbrella', written: 308_000, earned: 280_000, collected: 308_000, outstanding: 0, dueDate: '2026-03-15', status: 'Collected' },
  { id: 'prm_19', period: 'Apr 2026', policyNumber: 'POL-883014', customer: 'Marisol Vega', product: 'Auto', written: 1_506_000, earned: 1_363_000, collected: 1_506_000, outstanding: 0, dueDate: '2026-04-15', status: 'Collected' },
  { id: 'prm_20', period: 'Apr 2026', policyNumber: 'POL-770255', customer: 'Devon Park HOA', product: 'Homeowners', written: 1_104_000, earned: 999_000, collected: 1_104_000, outstanding: 0, dueDate: '2026-04-15', status: 'Collected' },
  { id: 'prm_21', period: 'Apr 2026', policyNumber: 'POL-350982', customer: 'Sierra Vista Retail', product: 'Commercial', written: 1_004_000, earned: 909_000, collected: 1_004_000, outstanding: 0, dueDate: '2026-04-15', status: 'Collected' },
  { id: 'prm_22', period: 'Apr 2026', policyNumber: 'POL-559118', customer: 'Aiko Tanaka', product: 'Life', written: 602_000, earned: 545_000, collected: 602_000, outstanding: 0, dueDate: '2026-04-15', status: 'Collected' },
  { id: 'prm_23', period: 'Apr 2026', policyNumber: 'POL-917455', customer: 'Brightpath Clinics', product: 'Health', written: 502_000, earned: 454_000, collected: 502_000, outstanding: 0, dueDate: '2026-04-15', status: 'Collected' },
  { id: 'prm_24', period: 'Apr 2026', policyNumber: 'POL-884771', customer: 'Calder & Finch LLC', product: 'Umbrella', written: 302_000, earned: 273_000, collected: 302_000, outstanding: 0, dueDate: '2026-04-15', status: 'Collected' },
  { id: 'prm_25', period: 'May 2026', policyNumber: 'POL-331290', customer: 'Priya Raman', product: 'Auto', written: 1_608_000, earned: 1_479_000, collected: 1_608_000, outstanding: 0, dueDate: '2026-05-15', status: 'Collected' },
  { id: 'prm_26', period: 'May 2026', policyNumber: 'POL-728640', customer: 'Lucia Moreno', product: 'Homeowners', written: 1_179_000, earned: 1_085_000, collected: 1_179_000, outstanding: 0, dueDate: '2026-05-15', status: 'Collected' },
  { id: 'prm_27', period: 'May 2026', policyNumber: 'POL-441902', customer: 'Northwind Logistics', product: 'Commercial', written: 1_072_000, earned: 986_000, collected: 1_072_000, outstanding: 0, dueDate: '2026-05-15', status: 'Collected' },
  { id: 'prm_28', period: 'May 2026', policyNumber: 'POL-474120', customer: 'Jordan Meyers', product: 'Life', written: 643_000, earned: 592_000, collected: 0, outstanding: 643_000, dueDate: '2026-05-15', status: 'Overdue' },
  { id: 'prm_29', period: 'May 2026', policyNumber: 'POL-665019', customer: 'Beacon Medical Group', product: 'Health', written: 536_000, earned: 493_000, collected: 536_000, outstanding: 0, dueDate: '2026-05-15', status: 'Collected' },
  { id: 'prm_30', period: 'May 2026', policyNumber: 'POL-640775', customer: 'Whitfield Financial', product: 'Umbrella', written: 322_000, earned: 296_000, collected: 322_000, outstanding: 0, dueDate: '2026-05-15', status: 'Collected' },
  { id: 'prm_31', period: 'Jun 2026', policyNumber: 'POL-118364', customer: 'Hana Ishikawa', product: 'Auto', written: 1_683_000, earned: 1_565_000, collected: 1_000_000, outstanding: 683_000, dueDate: '2026-06-15', status: 'Partial' },
  { id: 'prm_32', period: 'Jun 2026', policyNumber: 'POL-956120', customer: 'Harborline Realty', product: 'Homeowners', written: 1_234_000, earned: 1_148_000, collected: 1_234_000, outstanding: 0, dueDate: '2026-06-15', status: 'Collected' },
  { id: 'prm_33', period: 'Jun 2026', policyNumber: 'POL-206447', customer: 'Ridgeline Cafe Group', product: 'Commercial', written: 1_122_000, earned: 1_043_000, collected: 1_122_000, outstanding: 0, dueDate: '2026-06-15', status: 'Collected' },
  { id: 'prm_34', period: 'Jun 2026', policyNumber: 'POL-287541', customer: 'Kingsley Productions', product: 'Life', written: 673_000, earned: 626_000, collected: 673_000, outstanding: 0, dueDate: '2026-06-15', status: 'Collected' },
  { id: 'prm_35', period: 'Jun 2026', policyNumber: 'POL-917455', customer: 'Brightpath Clinics', product: 'Health', written: 561_000, earned: 522_000, collected: 561_000, outstanding: 0, dueDate: '2026-06-15', status: 'Collected' },
  { id: 'prm_36', period: 'Jun 2026', policyNumber: 'POL-884771', customer: 'Calder & Finch LLC', product: 'Umbrella', written: 337_000, earned: 313_000, collected: 337_000, outstanding: 0, dueDate: '2026-06-15', status: 'Collected' },
  { id: 'prm_37', period: 'Jul 2026', policyNumber: 'POL-883014', customer: 'Marisol Vega', product: 'Auto', written: 1_644_000, earned: 1_521_000, collected: 1_644_000, outstanding: 0, dueDate: '2026-07-15', status: 'Collected' },
  { id: 'prm_38', period: 'Jul 2026', policyNumber: 'POL-770255', customer: 'Devon Park HOA', product: 'Homeowners', written: 1_206_000, earned: 1_116_000, collected: 600_000, outstanding: 606_000, dueDate: '2026-07-15', status: 'Partial' },
  { id: 'prm_39', period: 'Jul 2026', policyNumber: 'POL-514203', customer: 'Delacroix Hardware', product: 'Commercial', written: 1_096_000, earned: 1_014_000, collected: 1_096_000, outstanding: 0, dueDate: '2026-07-15', status: 'Collected' },
  { id: 'prm_40', period: 'Jul 2026', policyNumber: 'POL-559118', customer: 'Aiko Tanaka', product: 'Life', written: 658_000, earned: 609_000, collected: 658_000, outstanding: 0, dueDate: '2026-07-15', status: 'Collected' },
  { id: 'prm_41', period: 'Jul 2026', policyNumber: 'POL-665019', customer: 'Beacon Medical Group', product: 'Health', written: 548_000, earned: 507_000, collected: 548_000, outstanding: 0, dueDate: '2026-07-15', status: 'Collected' },
  { id: 'prm_42', period: 'Jul 2026', policyNumber: 'POL-640775', customer: 'Whitfield Financial', product: 'Umbrella', written: 328_000, earned: 303_000, collected: 0, outstanding: 328_000, dueDate: '2026-07-15', status: 'Overdue' },
  { id: 'prm_43', period: 'Aug 2026', policyNumber: 'POL-331290', customer: 'Priya Raman', product: 'Auto', written: 1_773_000, earned: 1_667_000, collected: 1_773_000, outstanding: 0, dueDate: '2026-08-15', status: 'Collected' },
  { id: 'prm_44', period: 'Aug 2026', policyNumber: 'POL-728640', customer: 'Lucia Moreno', product: 'Homeowners', written: 1_300_000, earned: 1_222_000, collected: 1_300_000, outstanding: 0, dueDate: '2026-08-15', status: 'Collected' },
  { id: 'prm_45', period: 'Aug 2026', policyNumber: 'POL-350982', customer: 'Sierra Vista Retail', product: 'Commercial', written: 1_182_000, earned: 1_111_000, collected: 500_000, outstanding: 682_000, dueDate: '2026-08-15', status: 'Partial' },
  { id: 'prm_46', period: 'Aug 2026', policyNumber: 'POL-474120', customer: 'Jordan Meyers', product: 'Life', written: 709_000, earned: 666_000, collected: 709_000, outstanding: 0, dueDate: '2026-08-15', status: 'Collected' },
  { id: 'prm_47', period: 'Aug 2026', policyNumber: 'POL-917455', customer: 'Brightpath Clinics', product: 'Health', written: 591_000, earned: 556_000, collected: 591_000, outstanding: 0, dueDate: '2026-08-15', status: 'Collected' },
  { id: 'prm_48', period: 'Aug 2026', policyNumber: 'POL-884771', customer: 'Calder & Finch LLC', product: 'Umbrella', written: 355_000, earned: 334_000, collected: 0, outstanding: 355_000, dueDate: '2026-10-05', status: 'Outstanding' },
  { id: 'prm_49', period: 'Sep 2026', policyNumber: 'POL-118364', customer: 'Hana Ishikawa', product: 'Auto', written: 1_866_000, earned: 1_773_000, collected: 900_000, outstanding: 966_000, dueDate: '2026-09-15', status: 'Partial' },
  { id: 'prm_50', period: 'Sep 2026', policyNumber: 'POL-956120', customer: 'Harborline Realty', product: 'Homeowners', written: 1_368_000, earned: 1_300_000, collected: 1_368_000, outstanding: 0, dueDate: '2026-09-15', status: 'Collected' },
  { id: 'prm_51', period: 'Sep 2026', policyNumber: 'POL-441902', customer: 'Northwind Logistics', product: 'Commercial', written: 1_244_000, earned: 1_182_000, collected: 1_244_000, outstanding: 0, dueDate: '2026-09-15', status: 'Collected' },
  { id: 'prm_52', period: 'Sep 2026', policyNumber: 'POL-287541', customer: 'Kingsley Productions', product: 'Life', written: 746_000, earned: 709_000, collected: 0, outstanding: 746_000, dueDate: '2026-09-15', status: 'Overdue' },
  { id: 'prm_53', period: 'Sep 2026', policyNumber: 'POL-665019', customer: 'Beacon Medical Group', product: 'Health', written: 622_000, earned: 591_000, collected: 622_000, outstanding: 0, dueDate: '2026-09-15', status: 'Collected' },
  { id: 'prm_54', period: 'Sep 2026', policyNumber: 'POL-640775', customer: 'Whitfield Financial', product: 'Umbrella', written: 374_000, earned: 355_000, collected: 0, outstanding: 374_000, dueDate: '2026-10-05', status: 'Outstanding' },
];

export type PaymentMethod = 'Card' | 'ACH' | 'Check' | 'Wire';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export interface Payment {
  id: string;
  reference: string;
  policyNumber: string;
  customer: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  /** ISO date the installment is due. */
  dueDate: string;
  /** ISO date funds settled, `null` while unpaid. */
  paidDate: string | null;
  /** 1-based installment number and total installments in the plan. */
  installment: number;
  installments: number;
}

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'pmt_01', reference: 'PAY-2026-0912', policyNumber: 'POL-883014', customer: 'Marisol Vega', amount: 4_620, method: 'Card', status: 'Paid', dueDate: '2026-01-15', paidDate: '2026-01-14', installment: 1, installments: 12 },
  { id: 'pmt_02', reference: 'PAY-2026-0913', policyNumber: 'POL-441902', customer: 'Northwind Logistics', amount: 12_800, method: 'ACH', status: 'Paid', dueDate: '2026-02-15', paidDate: '2026-02-15', installment: 2, installments: 12 },
  { id: 'pmt_03', reference: 'PAY-2026-0914', policyNumber: 'POL-770255', customer: 'Devon Park HOA', amount: 3_450, method: 'Check', status: 'Paid', dueDate: '2026-03-15', paidDate: '2026-03-18', installment: 3, installments: 12 },
  { id: 'pmt_04', reference: 'PAY-2026-0915', policyNumber: 'POL-665019', customer: 'Beacon Medical Group', amount: 18_200, method: 'Wire', status: 'Paid', dueDate: '2026-04-15', paidDate: '2026-04-11', installment: 4, installments: 12 },
  { id: 'pmt_05', reference: 'PAY-2026-0916', policyNumber: 'POL-331290', customer: 'Priya Raman', amount: 4_180, method: 'Card', status: 'Paid', dueDate: '2026-05-15', paidDate: '2026-05-13', installment: 5, installments: 12 },
  { id: 'pmt_06', reference: 'PAY-2026-0917', policyNumber: 'POL-206447', customer: 'Ridgeline Cafe Group', amount: 9_600, method: 'ACH', status: 'Paid', dueDate: '2026-06-15', paidDate: '2026-06-20', installment: 6, installments: 12 },
  { id: 'pmt_07', reference: 'PAY-2026-0918', policyNumber: 'POL-559118', customer: 'Aiko Tanaka', amount: 2_940, method: 'Card', status: 'Paid', dueDate: '2026-07-15', paidDate: '2026-07-15', installment: 7, installments: 12 },
  { id: 'pmt_08', reference: 'PAY-2026-0919', policyNumber: 'POL-956120', customer: 'Harborline Realty', amount: 6_750, method: 'ACH', status: 'Paid', dueDate: '2026-08-15', paidDate: '2026-08-12', installment: 8, installments: 12 },
  { id: 'pmt_09', reference: 'PAY-2026-0920', policyNumber: 'POL-514203', customer: 'Delacroix Hardware', amount: 7_400, method: 'Wire', status: 'Paid', dueDate: '2026-08-20', paidDate: '2026-08-19', installment: 9, installments: 12 },
  { id: 'pmt_10', reference: 'PAY-2026-0921', policyNumber: 'POL-884771', customer: 'Calder & Finch LLC', amount: 5_250, method: 'Check', status: 'Paid', dueDate: '2026-09-01', paidDate: '2026-09-04', installment: 10, installments: 12 },
  { id: 'pmt_11', reference: 'PAY-2026-0922', policyNumber: 'POL-118364', customer: 'Hana Ishikawa', amount: 3_980, method: 'Card', status: 'Paid', dueDate: '2026-09-10', paidDate: '2026-09-09', installment: 11, installments: 12 },
  { id: 'pmt_12', reference: 'PAY-2026-0923', policyNumber: 'POL-474120', customer: 'Jordan Meyers', amount: 5_600, method: 'ACH', status: 'Paid', dueDate: '2026-09-18', paidDate: '2026-09-17', installment: 12, installments: 12 },
  { id: 'pmt_13', reference: 'PAY-2026-0924', policyNumber: 'POL-728640', customer: 'Lucia Moreno', amount: 3_120, method: 'Card', status: 'Refunded', dueDate: '2026-06-15', paidDate: '2026-06-14', installment: 6, installments: 12 },
  { id: 'pmt_14', reference: 'PAY-2026-0925', policyNumber: 'POL-640775', customer: 'Whitfield Financial', amount: 8_900, method: 'Wire', status: 'Refunded', dueDate: '2026-07-10', paidDate: '2026-07-10', installment: 7, installments: 12 },
  { id: 'pmt_15', reference: 'PAY-2026-0926', policyNumber: 'POL-350982', customer: 'Sierra Vista Retail', amount: 4_450, method: 'Card', status: 'Refunded', dueDate: '2026-08-15', paidDate: '2026-08-14', installment: 8, installments: 12 },
  { id: 'pmt_16', reference: 'PAY-2026-0927', policyNumber: 'POL-665019', customer: 'Beacon Medical Group', amount: 18_200, method: 'Wire', status: 'Pending', dueDate: '2026-10-05', paidDate: null, installment: 11, installments: 12 },
  { id: 'pmt_17', reference: 'PAY-2026-0928', policyNumber: 'POL-917455', customer: 'Brightpath Clinics', amount: 6_300, method: 'ACH', status: 'Pending', dueDate: '2026-09-30', paidDate: null, installment: 9, installments: 12 },
  { id: 'pmt_18', reference: 'PAY-2026-0929', policyNumber: 'POL-287541', customer: 'Kingsley Productions', amount: 4_900, method: 'Card', status: 'Pending', dueDate: '2026-09-20', paidDate: null, installment: 9, installments: 12 },
  { id: 'pmt_19', reference: 'PAY-2026-0930', policyNumber: 'POL-514203', customer: 'Delacroix Hardware', amount: 7_400, method: 'ACH', status: 'Pending', dueDate: '2026-09-10', paidDate: null, installment: 9, installments: 12 },
  { id: 'pmt_20', reference: 'PAY-2026-0931', policyNumber: 'POL-206447', customer: 'Ridgeline Cafe Group', amount: 9_600, method: 'Check', status: 'Pending', dueDate: '2026-08-25', paidDate: null, installment: 8, installments: 12 },
  { id: 'pmt_21', reference: 'PAY-2026-0932', policyNumber: 'POL-474120', customer: 'Jordan Meyers', amount: 5_600, method: 'Card', status: 'Pending', dueDate: '2026-08-10', paidDate: null, installment: 8, installments: 12 },
  { id: 'pmt_22', reference: 'PAY-2026-0933', policyNumber: 'POL-350982', customer: 'Sierra Vista Retail', amount: 4_450, method: 'ACH', status: 'Pending', dueDate: '2026-07-20', paidDate: null, installment: 7, installments: 12 },
  { id: 'pmt_23', reference: 'PAY-2026-0934', policyNumber: 'POL-331290', customer: 'Priya Raman', amount: 4_180, method: 'Card', status: 'Failed', dueDate: '2026-09-18', paidDate: null, installment: 9, installments: 12 },
  { id: 'pmt_24', reference: 'PAY-2026-0935', policyNumber: 'POL-118364', customer: 'Hana Ishikawa', amount: 3_980, method: 'Card', status: 'Failed', dueDate: '2026-08-30', paidDate: null, installment: 8, installments: 12 },
  { id: 'pmt_25', reference: 'PAY-2026-0936', policyNumber: 'POL-728640', customer: 'Lucia Moreno', amount: 3_120, method: 'Card', status: 'Failed', dueDate: '2026-08-05', paidDate: null, installment: 8, installments: 12 },
  { id: 'pmt_26', reference: 'PAY-2026-0937', policyNumber: 'POL-640775', customer: 'Whitfield Financial', amount: 8_900, method: 'Wire', status: 'Failed', dueDate: '2026-06-28', paidDate: null, installment: 6, installments: 12 },
];

export type ReserveType = 'Case' | 'IBNR' | 'Salvage';
export type ReserveStatus = 'Open' | 'Under Review' | 'Closed';

export interface Reserve {
  id: string;
  claimNumber: string;
  claimant: string;
  policyNumber: string;
  reserveType: ReserveType;
  initialReserve: number;
  currentReserve: number;
  /** Indemnity + expense paid against the claim to date. */
  paid: number;
  adjuster: string;
  /** Month the reserve was first established, e.g. `Mar 2026`. */
  opened: string;
  /** Human-readable date of the last reserve review. */
  lastReview: string;
  status: ReserveStatus;
}

export const MOCK_RESERVES: Reserve[] = [
  { id: 'rsv_01', claimNumber: 'CLM-2026-4821', claimant: 'Marisol Vega', policyNumber: 'POL-883014', reserveType: 'Case', initialReserve: 76_000, currentReserve: 68_000, paid: 12_000, adjuster: 'Elena Vasquez', opened: 'Sep 2026', lastReview: 'Sep 22, 2026', status: 'Open' },
  { id: 'rsv_02', claimNumber: 'CLM-2026-4817', claimant: 'Northwind Logistics', policyNumber: 'POL-441902', reserveType: 'Case', initialReserve: 150_000, currentReserve: 165_000, paid: 40_000, adjuster: 'Marcus Hale', opened: 'Sep 2026', lastReview: 'Sep 24, 2026', status: 'Open' },
  { id: 'rsv_03', claimNumber: 'CLM-2026-4809', claimant: 'Devon Park HOA', policyNumber: 'POL-770255', reserveType: 'Case', initialReserve: 40_000, currentReserve: 34_000, paid: 9_500, adjuster: 'Nadia Osei', opened: 'Sep 2026', lastReview: 'Sep 20, 2026', status: 'Open' },
  { id: 'rsv_04', claimNumber: 'CLM-2026-4802', claimant: 'Aiko Tanaka', policyNumber: 'POL-559118', reserveType: 'Case', initialReserve: 12_000, currentReserve: 9_000, paid: 4_200, adjuster: 'Nadia Osei', opened: 'Sep 2026', lastReview: 'Sep 18, 2026', status: 'Under Review' },
  { id: 'rsv_05', claimNumber: 'CLM-2026-4794', claimant: 'Ridgeline Cafe Group', policyNumber: 'POL-206447', reserveType: 'Case', initialReserve: 15_000, currentReserve: 11_500, paid: 8_000, adjuster: 'Tom Brennan', opened: 'Aug 2026', lastReview: 'Sep 12, 2026', status: 'Open' },
  { id: 'rsv_06', claimNumber: 'CLM-2026-4788', claimant: 'Priya Raman', policyNumber: 'POL-331290', reserveType: 'Salvage', initialReserve: 1_200, currentReserve: 900, paid: 0, adjuster: 'Owen Farrell', opened: 'Aug 2026', lastReview: 'Sep 08, 2026', status: 'Open' },
  { id: 'rsv_07', claimNumber: 'CLM-2026-4771', claimant: 'Calder & Finch LLC', policyNumber: 'POL-884771', reserveType: 'Case', initialReserve: 55_000, currentReserve: 6_500, paid: 42_000, adjuster: 'Tom Brennan', opened: 'Aug 2026', lastReview: 'Sep 15, 2026', status: 'Under Review' },
  { id: 'rsv_08', claimNumber: 'CLM-2026-4763', claimant: 'Hana Ishikawa', policyNumber: 'POL-118364', reserveType: 'Case', initialReserve: 9_000, currentReserve: 2_500, paid: 6_800, adjuster: 'Elena Vasquez', opened: 'Jul 2026', lastReview: 'Sep 05, 2026', status: 'Open' },
  { id: 'rsv_09', claimNumber: 'CLM-2026-4750', claimant: 'Beacon Medical Group', policyNumber: 'POL-665019', reserveType: 'Case', initialReserve: 380_000, currentReserve: 420_000, paid: 95_000, adjuster: 'Marcus Hale', opened: 'Jul 2026', lastReview: 'Sep 19, 2026', status: 'Under Review' },
  { id: 'rsv_10', claimNumber: 'CLM-2026-4742', claimant: 'Redwood Freight', policyNumber: 'POL-902873', reserveType: 'Case', initialReserve: 190_000, currentReserve: 14_000, paid: 172_000, adjuster: 'Marcus Hale', opened: 'Jun 2026', lastReview: 'Sep 11, 2026', status: 'Open' },
  { id: 'rsv_11', claimNumber: 'CLM-2026-4736', claimant: 'Jordan Meyers', policyNumber: 'POL-474120', reserveType: 'IBNR', initialReserve: 45_000, currentReserve: 38_000, paid: 12_000, adjuster: 'Grace Cho', opened: 'Jun 2026', lastReview: 'Aug 29, 2026', status: 'Open' },
  { id: 'rsv_12', claimNumber: 'CLM-2026-4728', claimant: 'Sierra Vista Retail', policyNumber: 'POL-350982', reserveType: 'IBNR', initialReserve: 4_500, currentReserve: 3_200, paid: 1_400, adjuster: 'Tom Brennan', opened: 'May 2026', lastReview: 'Aug 21, 2026', status: 'Open' },
  { id: 'rsv_13', claimNumber: 'CLM-2026-4715', claimant: 'Ferndale Construction', policyNumber: 'POL-728640', reserveType: 'IBNR', initialReserve: 88_000, currentReserve: 18_000, paid: 54_000, adjuster: 'Owen Farrell', opened: 'May 2026', lastReview: 'Sep 02, 2026', status: 'Under Review' },
  { id: 'rsv_14', claimNumber: 'CLM-2026-4702', claimant: 'Lucia Moreno', policyNumber: 'POL-514203', reserveType: 'Case', initialReserve: 30_000, currentReserve: 8_000, paid: 22_500, adjuster: 'Nadia Osei', opened: 'Apr 2026', lastReview: 'Aug 14, 2026', status: 'Open' },
  { id: 'rsv_15', claimNumber: 'CLM-2026-4695', claimant: 'Kingsley Productions', policyNumber: 'POL-640775', reserveType: 'Salvage', initialReserve: 50_000, currentReserve: 0, paid: 44_000, adjuster: 'Grace Cho', opened: 'Mar 2026', lastReview: 'Jul 30, 2026', status: 'Closed' },
  { id: 'rsv_16', claimNumber: 'CLM-2026-4688', claimant: 'Ade Adeyemi', policyNumber: 'POL-287541', reserveType: 'Case', initialReserve: 250_000, currentReserve: 0, paid: 240_000, adjuster: 'Owen Farrell', opened: 'Feb 2026', lastReview: 'Jun 18, 2026', status: 'Closed' },
];

export type CommissionStatus = 'Accrued' | 'Paid' | 'Held';

export interface Commission {
  id: string;
  statement: string;
  payee: string;
  payeeType: 'Agent' | 'Broker';
  agency: string;
  policyNumber: string;
  grossPremium: number;
  /** Fraction of gross premium, e.g. `0.14` → 14%. */
  rate: number;
  /** Commission dollars earned on the policy. */
  earned: number;
  status: CommissionStatus;
  /** Statement period, e.g. `Sep 2026`. */
  period: string;
}

export const MOCK_COMMISSIONS: Commission[] = [
  { id: 'cmm_01', statement: 'STMT-2026-07-001', payee: 'Elena Brooks', payeeType: 'Agent', agency: 'Brooks & Co.', policyNumber: 'POL-883014', grossPremium: 128_000, rate: 0.14, earned: 17_920, status: 'Paid', period: 'Jul 2026' },
  { id: 'cmm_02', statement: 'STMT-2026-07-002', payee: 'Marcus Idowu', payeeType: 'Agent', agency: 'Idowu Risk Partners', policyNumber: 'POL-441902', grossPremium: 96_000, rate: 0.12, earned: 11_520, status: 'Paid', period: 'Jul 2026' },
  { id: 'cmm_03', statement: 'STMT-2026-07-003', payee: 'Sofia Marchetti', payeeType: 'Agent', agency: 'Marchetti Insurance', policyNumber: 'POL-770255', grossPremium: 88_000, rate: 0.13, earned: 11_440, status: 'Paid', period: 'Jul 2026' },
  { id: 'cmm_04', statement: 'STMT-2026-07-004', payee: 'Grace Lim', payeeType: 'Agent', agency: 'Harborline Agency', policyNumber: 'POL-956120', grossPremium: 74_000, rate: 0.11, earned: 8_140, status: 'Paid', period: 'Jul 2026' },
  { id: 'cmm_05', statement: 'STMT-2026-07-005', payee: 'Tom Whitfield', payeeType: 'Agent', agency: 'Whitfield Financial', policyNumber: 'POL-640775', grossPremium: 62_000, rate: 0.15, earned: 9_300, status: 'Paid', period: 'Jul 2026' },
  { id: 'cmm_06', statement: 'STMT-2026-07-006', payee: 'Cascade Risk Advisors', payeeType: 'Broker', agency: 'Wholesale · West', policyNumber: 'POL-665019', grossPremium: 154_000, rate: 0.09, earned: 13_860, status: 'Paid', period: 'Jul 2026' },
  { id: 'cmm_07', statement: 'STMT-2026-07-007', payee: 'Vantage Brokerage', payeeType: 'Broker', agency: 'Wholesale · East', policyNumber: 'POL-350982', grossPremium: 132_000, rate: 0.1, earned: 13_200, status: 'Paid', period: 'Jul 2026' },
  { id: 'cmm_08', statement: 'STMT-2026-07-008', payee: 'Northgate Brokers', payeeType: 'Broker', agency: 'Wholesale · Central', policyNumber: 'POL-514203', grossPremium: 98_000, rate: 0.08, earned: 7_840, status: 'Paid', period: 'Jul 2026' },
  { id: 'cmm_09', statement: 'STMT-2026-08-001', payee: 'Elena Brooks', payeeType: 'Agent', agency: 'Brooks & Co.', policyNumber: 'POL-118364', grossPremium: 142_000, rate: 0.14, earned: 19_880, status: 'Paid', period: 'Aug 2026' },
  { id: 'cmm_10', statement: 'STMT-2026-08-002', payee: 'Marcus Idowu', payeeType: 'Agent', agency: 'Idowu Risk Partners', policyNumber: 'POL-206447', grossPremium: 104_000, rate: 0.12, earned: 12_480, status: 'Paid', period: 'Aug 2026' },
  { id: 'cmm_11', statement: 'STMT-2026-08-003', payee: 'Sofia Marchetti', payeeType: 'Agent', agency: 'Marchetti Insurance', policyNumber: 'POL-728640', grossPremium: 92_000, rate: 0.13, earned: 11_960, status: 'Paid', period: 'Aug 2026' },
  { id: 'cmm_12', statement: 'STMT-2026-08-004', payee: 'Grace Lim', payeeType: 'Agent', agency: 'Harborline Agency', policyNumber: 'POL-917455', grossPremium: 79_000, rate: 0.11, earned: 8_690, status: 'Paid', period: 'Aug 2026' },
  { id: 'cmm_13', statement: 'STMT-2026-08-005', payee: 'Tom Whitfield', payeeType: 'Agent', agency: 'Whitfield Financial', policyNumber: 'POL-884771', grossPremium: 68_000, rate: 0.15, earned: 10_200, status: 'Held', period: 'Aug 2026' },
  { id: 'cmm_14', statement: 'STMT-2026-08-006', payee: 'Cascade Risk Advisors', payeeType: 'Broker', agency: 'Wholesale · West', policyNumber: 'POL-902873', grossPremium: 168_000, rate: 0.09, earned: 15_120, status: 'Paid', period: 'Aug 2026' },
  { id: 'cmm_15', statement: 'STMT-2026-08-007', payee: 'Vantage Brokerage', payeeType: 'Broker', agency: 'Wholesale · East', policyNumber: 'POL-474120', grossPremium: 145_000, rate: 0.1, earned: 14_500, status: 'Paid', period: 'Aug 2026' },
  { id: 'cmm_16', statement: 'STMT-2026-08-008', payee: 'Northgate Brokers', payeeType: 'Broker', agency: 'Wholesale · Central', policyNumber: 'POL-287541', grossPremium: 107_000, rate: 0.08, earned: 8_560, status: 'Held', period: 'Aug 2026' },
  { id: 'cmm_17', statement: 'STMT-2026-09-001', payee: 'Elena Brooks', payeeType: 'Agent', agency: 'Brooks & Co.', policyNumber: 'POL-559118', grossPremium: 156_000, rate: 0.14, earned: 21_840, status: 'Accrued', period: 'Sep 2026' },
  { id: 'cmm_18', statement: 'STMT-2026-09-002', payee: 'Marcus Idowu', payeeType: 'Agent', agency: 'Idowu Risk Partners', policyNumber: 'POL-331290', grossPremium: 118_000, rate: 0.12, earned: 14_160, status: 'Accrued', period: 'Sep 2026' },
  { id: 'cmm_19', statement: 'STMT-2026-09-003', payee: 'Sofia Marchetti', payeeType: 'Agent', agency: 'Marchetti Insurance', policyNumber: 'POL-883014', grossPremium: 101_000, rate: 0.13, earned: 13_130, status: 'Accrued', period: 'Sep 2026' },
  { id: 'cmm_20', statement: 'STMT-2026-09-004', payee: 'Grace Lim', payeeType: 'Agent', agency: 'Harborline Agency', policyNumber: 'POL-441902', grossPremium: 86_000, rate: 0.11, earned: 9_460, status: 'Accrued', period: 'Sep 2026' },
  { id: 'cmm_21', statement: 'STMT-2026-09-005', payee: 'Tom Whitfield', payeeType: 'Agent', agency: 'Whitfield Financial', policyNumber: 'POL-770255', grossPremium: 71_000, rate: 0.15, earned: 10_650, status: 'Accrued', period: 'Sep 2026' },
  { id: 'cmm_22', statement: 'STMT-2026-09-006', payee: 'Cascade Risk Advisors', payeeType: 'Broker', agency: 'Wholesale · West', policyNumber: 'POL-665019', grossPremium: 175_000, rate: 0.09, earned: 15_750, status: 'Accrued', period: 'Sep 2026' },
  { id: 'cmm_23', statement: 'STMT-2026-09-007', payee: 'Vantage Brokerage', payeeType: 'Broker', agency: 'Wholesale · East', policyNumber: 'POL-350982', grossPremium: 158_000, rate: 0.1, earned: 15_800, status: 'Accrued', period: 'Sep 2026' },
  { id: 'cmm_24', statement: 'STMT-2026-09-008', payee: 'Northgate Brokers', payeeType: 'Broker', agency: 'Wholesale · Central', policyNumber: 'POL-514203', grossPremium: 112_000, rate: 0.08, earned: 8_960, status: 'Held', period: 'Sep 2026' },
];

/* ------------------------------------------------------------------ */
/* Product catalog                                                     */
/* ------------------------------------------------------------------ */

export type CatalogProductCategory = 'auto' | 'home' | 'life' | 'commercial' | 'cyber';
export type CatalogProductStatus = 'live' | 'draft' | 'deprecated';

export interface CatalogProduct {
  id: string;
  code: string;
  name: string;
  category: CatalogProductCategory;
  description: string;
  /** Annual base premium for a standard risk. */
  basePremium: number;
  policiesInForce: number;
  /** Written premium year to date. */
  writtenPremium: number;
  /** Fraction, e.g. 0.684 → 68.4%. */
  lossRatio: number;
  avgClaimSize: number;
  status: CatalogProductStatus;
  updatedAt: string;
}

export const MOCK_PRODUCTS: CatalogProduct[] = [
  {
    id: 'prd_1',
    code: 'PRD-1001',
    name: 'Personal Auto Select',
    category: 'auto',
    description: 'Standard private passenger auto with telematics-safe driver pricing.',
    basePremium: 1_480,
    policiesInForce: 4_210,
    writtenPremium: 6_420_000,
    lossRatio: 0.684,
    avgClaimSize: 8_640,
    status: 'live',
    updatedAt: '2026-09-12',
  },
  {
    id: 'prd_2',
    code: 'PRD-1002',
    name: 'Fleet Auto Advantage',
    category: 'auto',
    description: 'Commercial fleet package for 10–250 power units with telematics credits.',
    basePremium: 3_950,
    policiesInForce: 860,
    writtenPremium: 3_120_000,
    lossRatio: 0.712,
    avgClaimSize: 14_200,
    status: 'live',
    updatedAt: '2026-09-08',
  },
  {
    id: 'prd_3',
    code: 'PRD-1003',
    name: 'Homeowners Plus',
    category: 'home',
    description: 'HO-3 dwelling and contents cover with optional water backup.',
    basePremium: 1_920,
    policiesInForce: 2_680,
    writtenPremium: 4_980_000,
    lossRatio: 0.572,
    avgClaimSize: 12_450,
    status: 'live',
    updatedAt: '2026-09-15',
  },
  {
    id: 'prd_4',
    code: 'PRD-1004',
    name: 'Renters & Condo Shield',
    category: 'home',
    description: 'Contents-first cover for renters and condo owners, issued instantly online.',
    basePremium: 320,
    policiesInForce: 1_540,
    writtenPremium: 468_000,
    lossRatio: 0.448,
    avgClaimSize: 3_150,
    status: 'live',
    updatedAt: '2026-09-02',
  },
  {
    id: 'prd_5',
    code: 'PRD-1005',
    name: 'Term Life 20',
    category: 'life',
    description: '20-year level term with convertibility and accelerated death benefit.',
    basePremium: 720,
    policiesInForce: 980,
    writtenPremium: 706_000,
    lossRatio: 0.415,
    avgClaimSize: 212_000,
    status: 'live',
    updatedAt: '2026-08-29',
  },
  {
    id: 'prd_6',
    code: 'PRD-1006',
    name: 'Whole Life Advantage',
    category: 'life',
    description: 'Participating whole life with guaranteed cash value — pilot book only.',
    basePremium: 2_640,
    policiesInForce: 42,
    writtenPremium: 31_000,
    lossRatio: 0.28,
    avgClaimSize: 96_000,
    status: 'draft',
    updatedAt: '2026-09-19',
  },
  {
    id: 'prd_7',
    code: 'PRD-1007',
    name: 'Commercial Property Guard',
    category: 'commercial',
    description: 'Building, business personal property and business interruption cover.',
    basePremium: 8_400,
    policiesInForce: 1_520,
    writtenPremium: 11_740_000,
    lossRatio: 0.639,
    avgClaimSize: 27_800,
    status: 'live',
    updatedAt: '2026-09-17',
  },
  {
    id: 'prd_8',
    code: 'PRD-1008',
    name: 'General Liability Pro',
    category: 'commercial',
    description: 'Occurrence-form GL with products and completed operations coverage.',
    basePremium: 5_100,
    policiesInForce: 1_180,
    writtenPremium: 5_620_000,
    lossRatio: 0.586,
    avgClaimSize: 19_400,
    status: 'live',
    updatedAt: '2026-09-10',
  },
  {
    id: 'prd_9',
    code: 'PRD-1009',
    name: 'Cyber Defense Essential',
    category: 'cyber',
    description: 'First-party breach response plus third-party liability for SMBs.',
    basePremium: 3_250,
    policiesInForce: 640,
    writtenPremium: 2_040_000,
    lossRatio: 0.524,
    avgClaimSize: 46_500,
    status: 'live',
    updatedAt: '2026-09-21',
  },
  {
    id: 'prd_10',
    code: 'PRD-1010',
    name: 'Cyber Breach Response',
    category: 'cyber',
    description: 'Legacy higher-limit cyber form — closed to new business at renewal.',
    basePremium: 4_800,
    policiesInForce: 118,
    writtenPremium: 512_000,
    lossRatio: 0.741,
    avgClaimSize: 68_900,
    status: 'deprecated',
    updatedAt: '2026-08-26',
  },
];

/* ------------------------------------------------------------------ */
/* Underwriting queue                                                  */
/* ------------------------------------------------------------------ */

export type SubmissionDecision = 'accept' | 'decline' | 'refer' | 'price-load';

export interface UnderwritingSubmission {
  id: string;
  /** Human-facing submission number, e.g. `SUB-2026-0418`. */
  submission: string;
  applicant: string;
  product: string;
  /** Total coverage requested by the applicant. */
  coverageRequested: number;
  riskFactors: string[];
  /** 0–100 underwriting score; higher is better. */
  score: number;
  decision: SubmissionDecision;
  underwriter: string;
  /** ISO date the decision was recorded. */
  date: string;
}

export const MOCK_UNDERWRITING: UnderwritingSubmission[] = [
  {
    id: 'sub_1',
    submission: 'SUB-2026-0418',
    applicant: 'Northwind Logistics',
    product: 'Commercial Property Guard',
    coverageRequested: 4_200_000,
    riskFactors: ['Clean loss history', 'Telematics fleet', 'Multi-policy bundle'],
    score: 82,
    decision: 'accept',
    underwriter: 'Dana Whitmore',
    date: '2026-09-14',
  },
  {
    id: 'sub_2',
    submission: 'SUB-2026-0417',
    applicant: 'Marisol Vega',
    product: 'Personal Auto Select',
    coverageRequested: 350_000,
    riskFactors: ['Two at-fault claims (3 yrs)', 'Young driver on policy'],
    score: 47,
    decision: 'decline',
    underwriter: 'Oscar Lindqvist',
    date: '2026-09-14',
  },
  {
    id: 'sub_3',
    submission: 'SUB-2026-0415',
    applicant: 'Ridgeline Cafe Group',
    product: 'General Liability Pro',
    coverageRequested: 1_200_000,
    riskFactors: ['Prior slip-and-fall claim', 'Alcohol service endorsement'],
    score: 58,
    decision: 'refer',
    underwriter: 'Renee Okafor',
    date: '2026-09-13',
  },
  {
    id: 'sub_4',
    submission: 'SUB-2026-0412',
    applicant: 'Devon Park HOA',
    product: 'Homeowners Plus',
    coverageRequested: 8_600_000,
    riskFactors: ['Roof age 18 years', 'Two prior water losses'],
    score: 61,
    decision: 'price-load',
    underwriter: 'Dana Whitmore',
    date: '2026-09-12',
  },
  {
    id: 'sub_5',
    submission: 'SUB-2026-0409',
    applicant: 'Aiko Tanaka',
    product: 'Renters & Condo Shield',
    coverageRequested: 60_000,
    riskFactors: ['Claims-free 6 years', 'Bundled auto policy'],
    score: 88,
    decision: 'accept',
    underwriter: 'Hana Kimura',
    date: '2026-09-11',
  },
  {
    id: 'sub_6',
    submission: 'SUB-2026-0406',
    applicant: 'Cobalt Digital Labs',
    product: 'Cyber Defense Essential',
    coverageRequested: 2_500_000,
    riskFactors: ['No MFA on admin accounts', 'SOC 2 in progress', 'Incident in 2024'],
    score: 54,
    decision: 'refer',
    underwriter: 'Victor Salas',
    date: '2026-09-10',
  },
  {
    id: 'sub_7',
    submission: 'SUB-2026-0403',
    applicant: 'Harlow Construction',
    product: 'Fleet Auto Advantage',
    coverageRequested: 3_750_000,
    riskFactors: ['Recent safety violations', 'Driver turnover 38%'],
    score: 63,
    decision: 'price-load',
    underwriter: 'Oscar Lindqvist',
    date: '2026-09-09',
  },
  {
    id: 'sub_8',
    submission: 'SUB-2026-0399',
    applicant: 'Serena Vaughn',
    product: 'Term Life 20',
    coverageRequested: 750_000,
    riskFactors: ['Preferred health class', 'Nicotine-free 5 years'],
    score: 91,
    decision: 'accept',
    underwriter: 'Renee Okafor',
    date: '2026-09-08',
  },
];

/* ------------------------------------------------------------------ */
/* Risk assessment register                                            */
/* ------------------------------------------------------------------ */

export type RiskLevelLabel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type RiskRegisterStatus = 'open' | 'mitigating' | 'monitoring' | 'accepted' | 'closed';

export interface RiskRegisterEntry {
  id: string;
  /** Business unit, portfolio or account the risk belongs to. */
  entity: string;
  /** Exposure category, e.g. `Cyber`, `Property`, `Auto liability`. */
  exposure: string;
  inherentRisk: RiskLevelLabel;
  /** Control effectiveness as a percentage number (0–100). */
  controlEffectiveness: number;
  residualRisk: RiskLevelLabel;
  assessor: string;
  /** ISO date of the last completed review. */
  lastReview: string;
  /** ISO date the next review is scheduled for. */
  nextReview: string;
  status: RiskRegisterStatus;
}

export const MOCK_RISK: RiskRegisterEntry[] = [
  {
    id: 'RSK-01',
    entity: 'Northwind Logistics fleet',
    exposure: 'Auto liability',
    inherentRisk: 'High',
    controlEffectiveness: 72,
    residualRisk: 'Moderate',
    assessor: 'Renee Okafor',
    lastReview: '2026-06-18',
    nextReview: '2026-10-05',
    status: 'mitigating',
  },
  {
    id: 'RSK-02',
    entity: 'Cobalt Digital Labs',
    exposure: 'Cyber',
    inherentRisk: 'Critical',
    controlEffectiveness: 41,
    residualRisk: 'High',
    assessor: 'Victor Salas',
    lastReview: '2026-05-30',
    nextReview: '2026-09-12',
    status: 'open',
  },
  {
    id: 'RSK-03',
    entity: 'Devon Park HOA',
    exposure: 'Property',
    inherentRisk: 'High',
    controlEffectiveness: 66,
    residualRisk: 'Moderate',
    assessor: 'Hana Kimura',
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    status: 'monitoring',
  },
  {
    id: 'RSK-04',
    entity: 'Ridgeline Cafe Group',
    exposure: 'General liability',
    inherentRisk: 'Moderate',
    controlEffectiveness: 84,
    residualRisk: 'Low',
    assessor: 'Dana Whitmore',
    lastReview: '2026-08-11',
    nextReview: '2026-11-11',
    status: 'monitoring',
  },
  {
    id: 'RSK-05',
    entity: 'Harlow Construction',
    exposure: 'Workers compensation',
    inherentRisk: 'Critical',
    controlEffectiveness: 58,
    residualRisk: 'High',
    assessor: 'Renee Okafor',
    lastReview: '2026-04-22',
    nextReview: '2026-09-05',
    status: 'open',
  },
  {
    id: 'RSK-06',
    entity: 'Marisol Vega — personal lines',
    exposure: 'Auto liability',
    inherentRisk: 'Moderate',
    controlEffectiveness: 77,
    residualRisk: 'Low',
    assessor: 'Oscar Lindqvist',
    lastReview: '2026-08-01',
    nextReview: '2026-10-01',
    status: 'accepted',
  },
  {
    id: 'RSK-07',
    entity: 'Harborline Agency network',
    exposure: 'Professional liability',
    inherentRisk: 'Moderate',
    controlEffectiveness: 88,
    residualRisk: 'Low',
    assessor: 'Grace Lim',
    lastReview: '2026-06-30',
    nextReview: '2026-12-30',
    status: 'closed',
  },
  {
    id: 'RSK-08',
    entity: 'Summit Ridge Apartments',
    exposure: 'Property',
    inherentRisk: 'Moderate',
    controlEffectiveness: 55,
    residualRisk: 'Moderate',
    assessor: 'Victor Salas',
    lastReview: '2026-07-28',
    nextReview: '2026-10-28',
    status: 'mitigating',
  },
  {
    id: 'RSK-09',
    entity: 'Claims operations desk',
    exposure: 'Fraud & leakage',
    inherentRisk: 'High',
    controlEffectiveness: 63,
    residualRisk: 'Moderate',
    assessor: 'Hana Kimura',
    lastReview: '2026-08-19',
    nextReview: '2026-11-19',
    status: 'open',
  },
  {
    id: 'RSK-10',
    entity: 'Solstice Health Partners',
    exposure: 'Regulatory',
    inherentRisk: 'Critical',
    controlEffectiveness: 34,
    residualRisk: 'Critical',
    assessor: 'Victor Salas',
    lastReview: '2026-05-12',
    nextReview: '2026-09-20',
    status: 'open',
  },
];
