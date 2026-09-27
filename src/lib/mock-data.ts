/**
 * InsureFlow — mock dataset
 * ---------------------------------------------------------------------------
 * A large, hand-curated fixture set used by the dashboard while the real core
 * system is under construction. Every record is intentionally verbose so that
 * tables, drawers, charts, funnels, and empty states can all be exercised
 * without a backend.
 *
 * All timestamps are ISO-8601 strings (UTC). All monetary amounts are in USD
 * unless a `currency` field says otherwise. Money is stored whole (no cents
 * rounding surprises) except for premium installments, which keep cents.
 *
 * Sections
 *   1.  Types
 *   2.  Company profile
 *   3.  Policies            — 20 records
 *   4.  Quotes              — 12 records
 *   5.  Renewals            — 10 records
 *   6.  Coverage options    —  8 records
 *   7.  Claims              — 20 records
 *   8.  Adjusters           —  8 records
 *   9.  Litigation matters  —  6 records
 *   10. Customers           — 15 records
 *   11. Agents              —  8 records
 *   12. Brokers             —  6 records
 *   13. Products            — 10 records
 *   14. Underwriting cases  —  8 records
 *   15. Risk assessments    —  8 records
 *   16. Premium ledger      —  9 months
 *   17. Payments            — 12 records
 *   18. Reserves            —  8 records
 *   19. Commissions         —  8 records
 *   20. Activity feed       — 10 records
 *   21. Notifications       —  6 records
 *   22. Team                —  8 records
 *   23. API keys            —  3 records
 *   24. Reports             —  6 records
 *   25. Fraud indicators    —  8 records
 */

/* ========================================================================== */
/*  1. Types                                                                  */
/* ========================================================================== */

export type PolicyStatus =
  | 'active'
  | 'pending'
  | 'renewal_due'
  | 'expired'
  | 'cancelled'
  | 'lapsed'
  | 'draft';

export type LineOfBusiness =
  | 'personal_auto'
  | 'homeowners'
  | 'commercial_auto'
  | 'commercial_property'
  | 'general_liability'
  | 'workers_compensation'
  | 'cyber'
  | 'professional_indemnity'
  | 'marine'
  | 'life';

export type BillingFrequency = 'monthly' | 'quarterly' | 'semi_annual' | 'annual';

export type ClaimStatus =
  | 'reported'
  | 'under_review'
  | 'investigating'
  | 'awaiting_documents'
  | 'approved'
  | 'partially_paid'
  | 'paid'
  | 'denied'
  | 'reopened'
  | 'litigation';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export type QuoteDecision = 'approved' | 'declined' | 'refer' | 'needs_info';

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'bound' | 'expired' | 'withdrawn';

export type QuoteChannel = 'web' | 'agent' | 'broker' | 'renewal' | 'partner';

export type PaymentStatus =
  | 'succeeded'
  | 'processing'
  | 'failed'
  | 'refunded'
  | 'past_due'
  | 'canceled';

export type PaymentMethod = 'card' | 'ach' | 'wire' | 'check' | 'direct_debit' | 'paypal';

export type RiskProfile = 'preferred' | 'standard' | 'elevated' | 'high_risk';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type CustomerType = 'individual' | 'family' | 'small_business' | 'enterprise';

export type CustomerSegment = 'platinum' | 'gold' | 'silver' | 'bronze';

export type CoverageCategory =
  | 'liability'
  | 'property'
  | 'collision'
  | 'injury'
  | 'cyber'
  | 'specialty';

export type AdjusterSpecialty =
  | 'auto'
  | 'property'
  | 'bodily_injury'
  | 'commercial'
  | 'fraud'
  | 'workers_comp'
  | 'cyber'
  | 'subrogation';

export type TeamRole = 'owner' | 'admin' | 'underwriter' | 'adjuster' | 'analyst' | 'agent' | 'viewer';

export type FraudStatus = 'cleared' | 'monitoring' | 'suspected' | 'confirmed';

export type LineOfBusinessLabel = Record<LineOfBusiness, string>;

/* -------------------------------------------------------------------------- */
/*  Company profile                                                           */
/* -------------------------------------------------------------------------- */

export interface CompanyProfile {
  id: string;
  legalName: string;
  displayName: string;
  tagline: string;
  licenseNumber: string;
  naicCode: string;
  foundedAt: string;
  email: string;
  phone: string;
  website: string;
  supportUrl: string;
  ratings: {
    amBest: string;
    standardPoors: string;
    moodys: string;
    demotech: string;
  };
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  branding: {
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
    faviconUrl: string;
  };
  financials: {
    grossWrittenPremium: number;
    earnedPremiumYtd: number;
    totalAssets: number;
    policyholderSurplus: number;
    lossRatio: number;
    expenseRatio: number;
    combinedRatio: number;
    currency: string;
  };
  operations: {
    statesCovered: number;
    activePolicies: number;
    appointedAgents: number;
    partnerBrokers: number;
    openClaims: number;
    retentionRate: number;
    avgClaimCycleDays: number;
    nps: number;
  };
  compliance: {
    statutoryFilingsCurrent: boolean;
    lastAuditAt: string;
    nextAuditAt: string;
    licensesOnFile: number;
    outstandingDocuments: string[];
    amBestOutlook: 'stable' | 'positive' | 'negative';
  };
  settings: {
    defaultDeductible: number;
    claimReportCutoffDays: number;
    renewalNoticeDays: number;
    quoteValidityDays: number;
    allowPaperless: boolean;
    enableAutoPay: boolean;
    enableAIDecisions: boolean;
  };
  created: string;
  updated: string;
}

/* -------------------------------------------------------------------------- */
/*  Policy                                                                    */
/* -------------------------------------------------------------------------- */

export interface Policy {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  agentId: string;
  agentName: string;
  lineOfBusiness: LineOfBusiness;
  status: PolicyStatus;
  effectiveDate: string;
  expirationDate: string;
  issuedAt: string;
  paidThrough: string | null;
  /** Annual premium in USD. */
  premium: number;
  /** Monthly installment in USD. */
  monthlyPremium: number;
  coverageLimit: number;
  deductible: number;
  termMonths: number;
  billingFrequency: BillingFrequency;
  paymentStatus: 'current' | 'auto_pay' | 'past_due' | 'grace_period' | 'unbilled';
  claimsCount: number;
  claimsTotal: number;
  riskProfile: RiskProfile;
  hasAutoPay: boolean;
  paperless: boolean;
  coverageCodes: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Quote                                                                     */
/* -------------------------------------------------------------------------- */

export interface QuoteFactor {
  label: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  detail: string;
}

export interface Quote {
  id: string;
  number: string;
  customerId: string | null;
  applicantName: string;
  applicantEmail: string;
  productId: string;
  productName: string;
  lineOfBusiness: LineOfBusiness;
  requestedAt: string;
  expiresAt: string;
  decidedAt: string | null;
  /** 0 (safest) – 100 (riskiest). */
  riskScore: number;
  premium: number;
  monthlyPremium: number;
  coverageLimit: number;
  deductible: number;
  decision: QuoteDecision;
  decisionReason: string | null;
  status: QuoteStatus;
  channel: QuoteChannel;
  priorCarrier: string | null;
  priorPremium: number | null;
  claimsLast3Years: number;
  notes: string;
  factors: QuoteFactor[];
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Renewal                                                                   */
/* -------------------------------------------------------------------------- */

export interface Renewal {
  id: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  agentId: string;
  agentName: string;
  renewalDate: string;
  noticeSentAt: string | null;
  quotedAt: string | null;
  boundAt: string | null;
  currentPremium: number;
  renewalPremium: number;
  deltaAmount: number;
  deltaPercent: number;
  status: 'scheduled' | 'notice_sent' | 'quoted' | 'accepted' | 'declined' | 'lapsed';
  retentionRisk: 'low' | 'medium' | 'high';
  reason: string | null;
  actions: string[];
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Coverage options                                                          */
/* -------------------------------------------------------------------------- */

export interface CoverageOption {
  id: string;
  code: string;
  name: string;
  category: CoverageCategory;
  description: string;
  limitOptions: number[];
  deductibleOptions: number[];
  defaultLimit: number;
  defaultDeductible: number;
  /** Rating basis: per $1,000 of limit, flat, or percent of insured value. */
  unit: 'per_mille' | 'flat' | 'percent';
  baseRate: number;
  deductibleApplies: boolean;
  waitingPeriodDays: number | null;
  exclusions: string[];
  isRecommended: boolean;
  isActive: boolean;
  policiesEnrolled: number;
  avgClaimCost: number;
}

/* -------------------------------------------------------------------------- */
/*  Claim                                                                     */
/* -------------------------------------------------------------------------- */

export interface Claim {
  id: string;
  number: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  lineOfBusiness: LineOfBusiness;
  reportedAt: string;
  lossDate: string;
  lossLocation: string | null;
  description: string;
  causeOfLoss: string;
  amountClaimed: number;
  amountApproved: number | null;
  amountPaid: number;
  reserveAmount: number;
  status: ClaimStatus;
  severity: Severity;
  priority: Priority;
  adjusterId: string;
  adjusterName: string;
  /** 0 (clean) – 100 (almost certainly fraudulent). */
  fraudScore: number;
  fraudStatus: FraudStatus;
  deductible: number;
  deductibleMet: boolean;
  litigationId: string | null;
  settlementOffer: number | null;
  subrogationPotential: number | null;
  documentsRequired: string[];
  documentsReceived: string[];
  nextAction: string;
  nextActionDue: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  /** Legacy display code (alias of `number`). */
  claimNumber: string;
  /** Claimant / policyholder name (alias of `customerName`). */
  claimant: string;
  /** Loss category shown in list views (alias of `causeOfLoss`). */
  lossType: string;
  /** Assigned adjuster name (alias of `adjusterName`). */
  adjuster: string;
  /** Reserve currently held against the claim (alias of `reserveAmount`). */
  amountReserved: number;
  /** Date of loss, `YYYY-MM-DD` (alias of `lossDate`). */
  dateOfLoss: string;
}

/* -------------------------------------------------------------------------- */
/*  Adjuster                                                                  */
/* -------------------------------------------------------------------------- */

export interface Adjuster {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: AdjusterSpecialty;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: string;
  region: string;
  seniority: 'junior' | 'senior' | 'lead';
  caseload: number;
  openClaims: number;
  closedClaims: number;
  pendingReview: number;
  avgCycleTimeDays: number;
  closureRate: number;
  satisfactionScore: number;
  totalResolvedValue: number;
  fraudCatches: number;
  status: 'available' | 'at_capacity' | 'on_leave' | 'training';
  joinedAt: string;
  lastActiveAt: string;
  languages: string[];
  certifications: string[];
  supervisorId: string | null;
  /** Maximum claims this adjuster can carry at once. */
  capacity: number;
  /** Median days from FNOL to settlement (alias of `avgCycleTimeDays`). */
  avgCycleTime: number;
  /** Share of assigned claims closed without further action, as a percentage (0-100). */
  settlementRate: number;
  /** Field rating out of 5 (alias of `satisfactionScore`). */
  rating: number;
}

/* -------------------------------------------------------------------------- */
/*  Litigation                                                                */
/* -------------------------------------------------------------------------- */

export interface LitigationMatter {
  id: string;
  matterNumber: string;
  claimId: string;
  claimNumber: string;
  policyNumber: string;
  claimantName: string;
  court: string;
  jurisdiction: string;
  filedAt: string;
  nextHearingAt: string | null;
  trialDate: string | null;
  status: 'filed' | 'discovery' | 'mediation' | 'trial' | 'settled' | 'closed' | 'appeal';
  matterType:
    | 'bodily_injury'
    | 'property'
    | 'coverage_dispute'
    | 'subrogation'
    | 'class_action'
    | 'bad_faith';
  amountClaimed: number;
  amountReserved: number;
  amountSettled: number | null;
  defenseCounsel: string;
  counselFirm: string;
  hourlyRate: number;
  legalSpendToDate: number;
  liabilityAssessment: 'strong_defense' | 'mixed' | 'exposed';
  probabilityOfLoss: number;
  statusNotes: string;
  assignedTo: string;
  /** Alias of `matterNumber`. */
  caseNumber: string;
  /** Party being defended in the suit (alias of `claimantName`). */
  defendant: string;
  /** Alias of `defenseCounsel`. */
  counsel: string;
  /** Next calendared hearing (alias of `nextHearingAt`, falling back to `trialDate`). */
  nextHearing: string;
  /** Largest single exposure on the matter (alias of `amountClaimed`). */
  amountAtStake: number;
  /** Alias of `filedAt`. */
  filingDate: string;
  /** Alias of `court`. */
  venue: string;
  /** Alias of `assignedTo`. */
  owner: string;
  /** Alias of `statusNotes`. */
  notes: string;
}

/* -------------------------------------------------------------------------- */
/*  Customer                                                                  */
/* -------------------------------------------------------------------------- */

export interface CustomerAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  customerId: string;
  name: string;
  type: CustomerType;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  address: CustomerAddress;
  since: string;
  status: 'active' | 'prospect' | 'inactive' | 'at_risk' | 'churned';
  policies: number;
  activePolicies: number;
  lifetimeValue: number;
  annualPremium: number;
  totalPaid: number;
  outstandingBalance: number;
  riskProfile: RiskProfile;
  riskScore: number;
  claimsCount: number;
  claimsTotal: number;
  paymentMethod: PaymentMethod;
  autoPay: boolean;
  paperless: boolean;
  /** 0–100 likelihood of leaving in the next term. */
  churnRisk: number;
  satisfactionScore: number;
  segment: CustomerSegment;
  preferredContact: 'email' | 'phone' | 'sms' | 'portal';
  agentId: string;
  agentName: string;
  tags: string[];
  lastContactAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Agent                                                                     */
/* -------------------------------------------------------------------------- */

export interface Agent {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  agency: string;
  region: string;
  appointmentDate: string;
  status: 'active' | 'pending' | 'suspended' | 'terminated';
  bookOfBusiness: number;
  policyCount: number;
  customerCount: number;
  commissionYtd: number;
  commissionRate: number;
  newBusinessPremium: number;
  renewalPremium: number;
  retentionRate: number;
  conversionRate: number;
  avgQuoteToBindDays: number;
  performance: 'top' | 'above' | 'on_track' | 'below';
  rating: number;
  languages: string[];
  specialties: LineOfBusiness[];
  teamLead: string;
  lastActiveAt: string;
  notes: string;
}

/* -------------------------------------------------------------------------- */
/*  Broker                                                                    */
/* -------------------------------------------------------------------------- */

export interface Broker {
  id: string;
  firm: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  brokerLicense: string;
  tier: 'premier' | 'preferred' | 'standard' | 'limited';
  status: 'active' | 'onboarding' | 'probation' | 'inactive';
  submittedPolicies: number;
  boundPolicies: number;
  conversionRate: number;
  premiumVolume: number;
  commissionRate: number;
  commissionPaid: number;
  lines: LineOfBusiness[];
  territories: string[];
  serviceLevel: 'platinum' | 'gold' | 'silver';
  avgTurnaroundDays: number;
  lastSubmissionAt: string;
  contractRenewalAt: string;
  notes: string;
}

/* -------------------------------------------------------------------------- */
/*  Product                                                                   */
/* -------------------------------------------------------------------------- */

export interface Product {
  id: string;
  code: string;
  name: string;
  lineOfBusiness: LineOfBusiness;
  category: string;
  description: string;
  status: 'active' | 'draft' | 'deprecated' | 'paused';
  pricing: {
    basePremium: number;
    minPremium: number;
    maxPremium: number;
    ratePerThousand: number;
    currency: string;
    ratingEngine: string;
  };
  lossRatio: number;
  expenseRatio: number;
  combinedRatio: number;
  policiesInForce: number;
  writtenPremium: number;
  earnedPremium: number;
  claimsIncurred: number;
  claimsPaid: number;
  avgPremium: number;
  retentionRate: number;
  quoteToBindRate: number;
  deductibleMin: number;
  deductibleMax: number;
  limitMin: number;
  limitMax: number;
  filingStatus: 'filed' | 'approved' | 'pending' | 'withdrawn';
  filedStates: string[];
  effectiveAt: string;
  features: string[];
  exclusions: string[];
  targetSegments: string[];
  updatedAt: string;
  /** Alias of `pricing.basePremium`. */
  basePremium: number;
  /** Average incurred claim size (derived from `avgPremium` and `lossRatio`). */
  avgClaimSize: number;
}

/* -------------------------------------------------------------------------- */
/*  Underwriting                                                              */
/* -------------------------------------------------------------------------- */

export interface UnderwritingRiskFactor {
  label: string;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
  detail: string;
}

export interface UnderwritingCase {
  id: string;
  reference: string;
  applicantName: string;
  customerId: string | null;
  productId: string;
  productName: string;
  lineOfBusiness: LineOfBusiness;
  submittedAt: string;
  assignedTo: string;
  assignedAt: string | null;
  decidedAt: string | null;
  status:
    | 'triage'
    | 'in_review'
    | 'clarification'
    | 'approved'
    | 'declined'
    | 'referred'
    | 'withdrawn';
  decision: 'approve' | 'approve_with_conditions' | 'decline' | 'refer' | null;
  riskFactors: UnderwritingRiskFactor[];
  riskScore: number;
  premiumIndication: number;
  coverageLimit: number;
  deductible: number;
  referralReason: string | null;
  conditions: string[];
  documentsRequired: string[];
  documentsReceived: string[];
  aiRecommendation: 'approve' | 'refer' | 'decline';
  aiConfidence: number;
  priority: Priority;
  notes: string;
  /** Alias of `reference`. */
  submission: string;
  /** Alias of `applicantName`. */
  applicant: string;
  /** Alias of `productName`. */
  product: string;
  /** Alias of `assignedTo`. */
  underwriter: string;
  /** Underwriting quality score, 0-100 with higher being better (inverse of `riskScore`). */
  score: number;
  /** Alias of `coverageLimit`. */
  coverageRequested: number;
  /** Decision date, falling back to `submittedAt` (alias of `decidedAt ?? submittedAt`). */
  date: string;
}

/* -------------------------------------------------------------------------- */
/*  Risk assessment                                                           */
/* -------------------------------------------------------------------------- */

export interface RiskFactorScore {
  name: string;
  weight: number;
  score: number;
  rating: 'favorable' | 'neutral' | 'unfavorable';
  detail: string;
}

export interface RiskAssessment {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectType: 'property' | 'vehicle' | 'business' | 'customer' | 'policy';
  assessedAt: string;
  assessor: string;
  methodology: string;
  modelVersion: string;
  /** 0 (best) – 100 (worst). */
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  level: RiskLevel;
  residualLevel: RiskLevel;
  factors: RiskFactorScore[];
  hazardScore: number;
  vulnerabilityScore: number;
  exposureScore: number;
  mitigationScore: number;
  recommendations: string[];
  trend: 'improving' | 'stable' | 'deteriorating';
  status: 'current' | 'stale' | 'superseded';
  nextReviewAt: string;
  /** Alias of `subjectName`. */
  entity: string;
  /** Exposure category derived from `subjectType`. */
  exposure: string;
  /** Inherent risk before controls. */
  inherentRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  /** Residual risk after controls. */
  residualRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  /** Control effectiveness as a percentage (0-100, alias of `mitigationScore`). */
  controlEffectiveness: number;
  /** Alias of `assessedAt`. */
  lastReview: string;
  /** Alias of `nextReviewAt`. */
  nextReview: string;
}

/* -------------------------------------------------------------------------- */
/*  Premium ledger                                                            */
/* -------------------------------------------------------------------------- */

export interface PremiumMonth {
  id: string;
  /** YYYY-MM */
  month: string;
  label: string;
  periodStart: string;
  periodEnd: string;
  writtenPremium: number;
  earnedPremium: number;
  unearnedPremium: number;
  newBusinessPremium: number;
  renewalPremium: number;
  premiumCollected: number;
  premiumOutstanding: number;
  refundsIssued: number;
  commissionPaid: number;
  claimsIncurred: number;
  claimsPaid: number;
  policiesIssued: number;
  policiesCancelled: number;
  lossRatio: number;
  expenseRatio: number;
  combinedRatio: number;
  growthPercent: number;
}

/* -------------------------------------------------------------------------- */
/*  Payment                                                                   */
/* -------------------------------------------------------------------------- */

export interface Payment {
  id: string;
  reference: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  methodDetail: string;
  status: PaymentStatus;
  dueAt: string;
  paidAt: string | null;
  processedAt: string | null;
  installment: number;
  ofInstallments: number;
  attemptNumber: number;
  failureReason: string | null;
  feeAmount: number;
  netAmount: number;
  gatewayRef: string;
  receiptUrl: string | null;
  createdAt: string;
  updatedAt: string;
  /** Alias of `dueAt`. */
  dueDate: string;
  /** Alias of `customerName`. */
  customer: string;
  /** Alias of `paidAt`. */
  paidDate: string | null;
  /** Total installments in the payment plan (alias of `ofInstallments`). */
  installments: number;
}

/* -------------------------------------------------------------------------- */
/*  Reserve                                                                   */
/* -------------------------------------------------------------------------- */

export interface Reserve {
  id: string;
  claimId: string;
  claimNumber: string;
  policyNumber: string;
  reserveCategory: 'indemnity' | 'expense' | 'legal' | 'medical' | 'subrogation';
  initialReserve: number;
  currentReserve: number;
  caseReserve: number;
  ibnrAmount: number;
  paidToDate: number;
  remainingReserve: number;
  varianceAmount: number;
  monthsOpen: number;
  status: 'adequate' | 'under_review' | 'increase_requested' | 'released';
  setBy: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  lastChangeAt: string;
  lastChangeReason: string;
  nextReviewAt: string;
  /** Indemnity + expense paid against the claim to date (alias of `paidToDate`). */
  paid: number;
  /** Reserve class shown in list views. */
  reserveType: 'Case' | 'IBNR' | 'Salvage';
  /** Month the reserve was first established, e.g. `Mar 2026`. */
  opened: string;
  /** Claimant name resolved from the linked claim. */
  claimant: string;
  /** Adjuster name resolved from the linked claim. */
  adjuster: string;
  /** Human-readable date of the last reserve review. */
  lastReview: string;
}

/* -------------------------------------------------------------------------- */
/*  Commission                                                                */
/* -------------------------------------------------------------------------- */

export interface Commission {
  id: string;
  payeeId: string;
  payeeName: string;
  payeeType: 'agent' | 'broker' | 'captive';
  policyId: string;
  policyNumber: string;
  /** YYYY-MM */
  period: string;
  basePremium: number;
  rate: number;
  grossCommission: number;
  overrideAmount: number;
  netCommission: number;
  status: 'pending' | 'approved' | 'paid' | 'reversed' | 'clawback';
  dueAt: string;
  paidAt: string | null;
  method: PaymentMethod;
  transactionRef: string | null;
  ytdTotal: number;
  notes: string;
  /** Statement reference derived from `period` and `id`. */
  statement: string;
  /** Alias of `payeeName`. */
  payee: string;
  /** Agency or firm the payee belongs to. */
  agency: string;
  /** Premium the commission was earned on (alias of `basePremium`). */
  grossPremium: number;
  /** Alias of `grossCommission`. */
  earned: number;
}

/* -------------------------------------------------------------------------- */
/*  Activity feed                                                             */
/* -------------------------------------------------------------------------- */

export interface ActivityItem {
  id: string;
  type: 'policy' | 'claim' | 'quote' | 'payment' | 'customer' | 'underwriting' | 'system' | 'team';
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
  targetId: string | null;
  targetLabel: string | null;
  href: string | null;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Notification                                                              */
/* -------------------------------------------------------------------------- */

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: 'policies' | 'claims' | 'underwriting' | 'payments' | 'compliance' | 'team' | 'system';
  severity: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
  actionLabel?: string;
  href?: string;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Team                                                                      */
/* -------------------------------------------------------------------------- */

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  title: string;
  department: string;
  avatarInitials: string;
  scope: 'all' | 'team' | 'own';
  permissions: string[];
  status: 'active' | 'invited' | 'suspended';
  mfaEnabled: boolean;
  phone: string;
  location: string;
  reportsTo: string | null;
  policiesAssigned: number;
  claimsAssigned: number;
  joinedAt: string;
  lastActiveAt: string;
  notes: string;
}

/* -------------------------------------------------------------------------- */
/*  API keys                                                                  */
/* -------------------------------------------------------------------------- */

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  maskedKey: string;
  environment: 'live' | 'test';
  scopes: string[];
  createdBy: string;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  secretRotatedAt: string;
  requestsLast30Days: number;
  rateLimitPerMin: number;
  status: 'active' | 'revoked' | 'expiring';
  ipWhitelist: string[];
  webhookUrl: string | null;
}

/* -------------------------------------------------------------------------- */
/*  Report                                                                    */
/* -------------------------------------------------------------------------- */

export interface Report {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'compliance' | 'sales' | 'claims';
  format: 'pdf' | 'csv' | 'xlsx' | 'json';
  cadence: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'on_demand';
  scheduled: boolean;
  recipients: string[];
  lastGeneratedAt: string | null;
  nextRunAt: string | null;
  rows: number | null;
  sizeKb: number | null;
  status: 'ready' | 'generating' | 'failed' | 'stale';
  owner: string;
  pinned: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Fraud indicator                                                           */
/* -------------------------------------------------------------------------- */

export interface FraudIndicator {
  id: string;
  code: string;
  name: string;
  category: 'application' | 'claim' | 'payment' | 'identity' | 'provider';
  severity: Severity;
  description: string;
  detectionRule: string;
  confidence: number;
  falsePositiveRate: number;
  status: 'open' | 'investigating' | 'cleared' | 'confirmed';
  casesTriggered: number;
  caughtValue: number;
  modelVersion: string;
  owner: string;
  recommendedAction: string;
  lastTriggeredAt: string;
  createdAt: string;
}


/* ========================================================================== */
/*  2. Company profile                                                        */
/* ========================================================================== */

export const MOCK_COMPANY: CompanyProfile = {
  id: 'org_insureflow_001',
  legalName: 'InsureFlow Mutual Assurance Company',
  displayName: 'InsureFlow',
  tagline: 'Every policy. Every claim. One flow.',
  licenseNumber: 'CAS-884213',
  naicCode: '18472',
  foundedAt: '2011-04-18',
  email: 'hello@insureflow.dev',
  phone: '+1 (415) 555-0142',
  website: 'https://insureflow.dev',
  supportUrl: 'https://insureflow.dev/support',
  ratings: {
    amBest: 'A (Excellent)',
    standardPoors: 'A-',
    moodys: 'A2',
    demotech: 'A (Exceptional)',
  },
  address: {
    line1: '400 Harbor Point Drive',
    line2: 'Suite 1200',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94111',
    country: 'United States',
  },
  branding: {
    primaryColor: '#0d9488',
    accentColor: '#0284c7',
    logoUrl: '/brand/insureflow-logo.svg',
    faviconUrl: '/brand/insureflow-favicon.svg',
  },
  financials: {
    grossWrittenPremium: 486_250_000,
    earnedPremiumYtd: 318_940_000,
    totalAssets: 1_284_600_000,
    policyholderSurplus: 412_800_000,
    lossRatio: 0.612,
    expenseRatio: 0.278,
    combinedRatio: 0.89,
    currency: 'USD',
  },
  operations: {
    statesCovered: 42,
    activePolicies: 128_470,
    appointedAgents: 1_842,
    partnerBrokers: 96,
    openClaims: 3_118,
    retentionRate: 0.912,
    avgClaimCycleDays: 14.6,
    nps: 62,
  },
  compliance: {
    statutoryFilingsCurrent: true,
    lastAuditAt: '2026-03-12',
    nextAuditAt: '2027-03-12',
    licensesOnFile: 42,
    outstandingDocuments: [
      'CA DOI annual statement — pages 5–7 pending sign-off',
      'TX windstorm plan acknowledgement (due 2026-11-01)',
    ],
    amBestOutlook: 'stable',
  },
  settings: {
    defaultDeductible: 1000,
    claimReportCutoffDays: 180,
    renewalNoticeDays: 45,
    quoteValidityDays: 30,
    allowPaperless: true,
    enableAutoPay: true,
    enableAIDecisions: true,
  },
  created: '2011-04-18T09:00:00.000Z',
  updated: '2026-09-20T16:42:00.000Z',
};

/* ========================================================================== */
/*  3. Policies — 20 records                                                  */
/* ========================================================================== */

export const MOCK_POLICIES: Policy[] = [
  {
    id: 'pol_001',
    number: 'IF-POL-2026-0001',
    customerId: 'cust_001',
    customerName: 'Amelia Thornton',
    productId: 'prod_001',
    productName: 'AutoPlus Premier',
    agentId: 'agnt_001',
    agentName: 'Marcus Bellweather',
    lineOfBusiness: 'personal_auto',
    status: 'active',
    effectiveDate: '2026-03-01',
    expirationDate: '2027-03-01',
    issuedAt: '2026-02-24T14:08:00.000Z',
    paidThrough: '2026-12-01',
    premium: 1842,
    monthlyPremium: 153.5,
    coverageLimit: 300000,
    deductible: 500,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'auto_pay',
    claimsCount: 1,
    claimsTotal: 3420,
    riskProfile: 'preferred',
    hasAutoPay: true,
    paperless: true,
    coverageCodes: ['cov_001', 'cov_003', 'cov_005'],
    notes: 'Multi-policy discount applied with HomeGuard Elite. Clean driving record since 2019.',
    createdAt: '2026-02-24T14:08:00.000Z',
    updatedAt: '2026-09-02T11:20:00.000Z',
  },
  {
    id: 'pol_002',
    number: 'IF-POL-2025-0148',
    customerId: 'cust_002',
    customerName: 'Bennett & Cole Logistics LLC',
    productId: 'prod_003',
    productName: 'Fleet360 Commercial',
    agentId: 'agnt_002',
    agentName: 'Priya Raghunathan',
    lineOfBusiness: 'commercial_auto',
    status: 'active',
    effectiveDate: '2025-11-15',
    expirationDate: '2026-11-15',
    issuedAt: '2025-11-08T09:32:00.000Z',
    paidThrough: '2026-11-15',
    premium: 28450,
    monthlyPremium: 2370.83,
    coverageLimit: 1000000,
    deductible: 2500,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'auto_pay',
    claimsCount: 3,
    claimsTotal: 41200,
    riskProfile: 'elevated',
    hasAutoPay: true,
    paperless: true,
    coverageCodes: ['cov_001', 'cov_007'],
    notes: '48-unit fleet across CA/AZ/NV. Telematics program reduced frequency but severity remains high.',
    createdAt: '2025-11-08T09:32:00.000Z',
    updatedAt: '2026-09-14T08:05:00.000Z',
  },
  {
    id: 'pol_003',
    number: 'IF-POL-2025-0219',
    customerId: 'cust_003',
    customerName: 'Rowan Delacroix',
    productId: 'prod_002',
    productName: 'HomeGuard Elite',
    agentId: 'agnt_003',
    agentName: 'Dana Whitfield',
    lineOfBusiness: 'homeowners',
    status: 'renewal_due',
    effectiveDate: '2025-10-01',
    expirationDate: '2026-10-01',
    issuedAt: '2025-09-24T17:44:00.000Z',
    paidThrough: '2026-10-01',
    premium: 3120,
    monthlyPremium: 260,
    coverageLimit: 650000,
    deductible: 1500,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'current',
    claimsCount: 1,
    claimsTotal: 8700,
    riskProfile: 'standard',
    hasAutoPay: true,
    paperless: false,
    coverageCodes: ['cov_002', 'cov_005'],
    notes: 'Roof replaced 2024 — renewal indication expects a 6% credit. Notice window opens 2026-08-17.',
    createdAt: '2025-09-24T17:44:00.000Z',
    updatedAt: '2026-08-18T13:15:00.000Z',
  },
  {
    id: 'pol_004',
    number: 'IF-POL-2026-0057',
    customerId: 'cust_004',
    customerName: 'Harbor Point Dental Group',
    productId: 'prod_005',
    productName: 'General Liability Secure',
    agentId: 'agnt_004',
    agentName: 'Omar Haddad',
    lineOfBusiness: 'general_liability',
    status: 'active',
    effectiveDate: '2026-01-10',
    expirationDate: '2027-01-10',
    issuedAt: '2026-01-04T10:12:00.000Z',
    paidThrough: '2027-01-10',
    premium: 7480,
    monthlyPremium: 623.33,
    coverageLimit: 2000000,
    deductible: 1000,
    termMonths: 12,
    billingFrequency: 'annual',
    paymentStatus: 'current',
    claimsCount: 1,
    claimsTotal: 12500,
    riskProfile: 'standard',
    hasAutoPay: false,
    paperless: true,
    coverageCodes: ['cov_001', 'cov_007'],
    notes: 'Two-chair practice with sedation services — anesthesiology endorsement included.',
    createdAt: '2026-01-04T10:12:00.000Z',
    updatedAt: '2026-06-22T09:47:00.000Z',
  },
  {
    id: 'pol_005',
    number: 'IF-POL-2026-0063',
    customerId: 'cust_005',
    customerName: 'Nadia Farouk',
    productId: 'prod_001',
    productName: 'AutoPlus Premier',
    agentId: 'agnt_005',
    agentName: 'Sofia Marchetti',
    lineOfBusiness: 'personal_auto',
    status: 'active',
    effectiveDate: '2026-06-20',
    expirationDate: '2027-06-20',
    issuedAt: '2026-06-12T12:30:00.000Z',
    paidThrough: '2026-09-20',
    premium: 2410,
    monthlyPremium: 200.83,
    coverageLimit: 500000,
    deductible: 1000,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'grace_period',
    claimsCount: 2,
    claimsTotal: 9870,
    riskProfile: 'elevated',
    hasAutoPay: false,
    paperless: true,
    coverageCodes: ['cov_001', 'cov_003', 'cov_004'],
    notes: 'Two at-fault incidents in 36 months. telematics device offered but not yet accepted.',
    createdAt: '2026-06-12T12:30:00.000Z',
    updatedAt: '2026-09-19T15:02:00.000Z',
  },
  {
    id: 'pol_006',
    number: 'IF-POL-2026-0071',
    customerId: 'cust_006',
    customerName: 'Summit Ridge Construction Inc.',
    productId: 'prod_004',
    productName: 'PropertyShield BOP',
    agentId: 'agnt_006',
    agentName: 'Ethan Brackett',
    lineOfBusiness: 'commercial_property',
    status: 'active',
    effectiveDate: '2026-02-01',
    expirationDate: '2027-02-01',
    issuedAt: '2026-01-22T08:55:00.000Z',
    paidThrough: '2027-02-01',
    premium: 46800,
    monthlyPremium: 3900,
    coverageLimit: 12000000,
    deductible: 10000,
    termMonths: 12,
    billingFrequency: 'quarterly',
    paymentStatus: 'current',
    claimsCount: 1,
    claimsTotal: 156000,
    riskProfile: 'standard',
    hasAutoPay: true,
    paperless: true,
    coverageCodes: ['cov_002', 'cov_007'],
    notes: 'Scheduled equipment floater included. Wildfire score improved after deforestation buffer work.',
    createdAt: '2026-01-22T08:55:00.000Z',
    updatedAt: '2026-08-30T14:25:00.000Z',
  },
  {
    id: 'pol_007',
    number: 'IF-POL-2026-0104',
    customerId: 'cust_007',
    customerName: 'Julian Vasquez',
    productId: 'prod_002',
    productName: 'HomeGuard Elite',
    agentId: 'agnt_007',
    agentName: 'Grace Okonkwo',
    lineOfBusiness: 'homeowners',
    status: 'pending',
    effectiveDate: '2026-09-15',
    expirationDate: '2027-09-15',
    issuedAt: '2026-09-09T16:18:00.000Z',
    paidThrough: null,
    premium: 2760,
    monthlyPremium: 230,
    coverageLimit: 480000,
    deductible: 2500,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'unbilled',
    claimsCount: 0,
    claimsTotal: 0,
    riskProfile: 'preferred',
    hasAutoPay: false,
    paperless: true,
    coverageCodes: ['cov_002', 'cov_005'],
    notes: 'Awaiting first installment — bind subject to payment confirmation by 2026-09-28.',
    createdAt: '2026-09-09T16:18:00.000Z',
    updatedAt: '2026-09-18T10:41:00.000Z',
  },
  {
    id: 'pol_008',
    number: 'IF-POL-2025-0666',
    customerId: 'cust_008',
    customerName: 'Cedar Grove Apartments LLC',
    productId: 'prod_004',
    productName: 'PropertyShield BOP',
    agentId: 'agnt_008',
    agentName: 'Victor Sorensen',
    lineOfBusiness: 'commercial_property',
    status: 'active',
    effectiveDate: '2025-12-01',
    expirationDate: '2026-12-01',
    issuedAt: '2025-11-21T11:05:00.000Z',
    paidThrough: '2026-12-01',
    premium: 38900,
    monthlyPremium: 3241.67,
    coverageLimit: 8500000,
    deductible: 5000,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'auto_pay',
    claimsCount: 2,
    claimsTotal: 88400,
    riskProfile: 'high_risk',
    hasAutoPay: true,
    paperless: false,
    coverageCodes: ['cov_002', 'cov_007'],
    notes: 'Two water-damage claims in 14 months. Plumbing remediation certificate required at renewal.',
    createdAt: '2025-11-21T11:05:00.000Z',
    updatedAt: '2026-09-11T09:12:00.000Z',
  },
  {
    id: 'pol_009',
    number: 'IF-POL-2026-0088',
    customerId: 'cust_009',
    customerName: 'Harper Lindqvist',
    productId: 'prod_001',
    productName: 'AutoPlus Premier',
    agentId: 'agnt_001',
    agentName: 'Marcus Bellweather',
    lineOfBusiness: 'personal_auto',
    status: 'active',
    effectiveDate: '2026-04-05',
    expirationDate: '2027-04-05',
    issuedAt: '2026-03-29T13:40:00.000Z',
    paidThrough: '2027-04-05',
    premium: 1655,
    monthlyPremium: 137.92,
    coverageLimit: 300000,
    deductible: 500,
    termMonths: 12,
    billingFrequency: 'semi_annual',
    paymentStatus: 'current',
    claimsCount: 1,
    claimsTotal: 420,
    riskProfile: 'preferred',
    hasAutoPay: true,
    paperless: true,
    coverageCodes: ['cov_001', 'cov_003', 'cov_004'],
    notes: 'Defensive driving discount renews 2027. Vehicle is a 2024 EV with active safety telemetry.',
    createdAt: '2026-03-29T13:40:00.000Z',
    updatedAt: '2026-07-05T08:33:00.000Z',
  },
  {
    id: 'pol_010',
    number: 'IF-POL-2026-0096',
    customerId: 'cust_010',
    customerName: 'Quantum Layer Technologies Inc.',
    productId: 'prod_007',
    productName: 'CyberDefend Pro',
    agentId: 'agnt_002',
    agentName: 'Priya Raghunathan',
    lineOfBusiness: 'cyber',
    status: 'active',
    effectiveDate: '2026-05-01',
    expirationDate: '2027-05-01',
    issuedAt: '2026-04-23T15:26:00.000Z',
    paidThrough: '2027-05-01',
    premium: 24500,
    monthlyPremium: 2041.67,
    coverageLimit: 5000000,
    deductible: 25000,
    termMonths: 12,
    billingFrequency: 'quarterly',
    paymentStatus: 'current',
    claimsCount: 1,
    claimsTotal: 640000,
    riskProfile: 'elevated',
    hasAutoPay: true,
    paperless: true,
    coverageCodes: ['cov_006', 'cov_007'],
    notes: 'Ransomware event contained 2026-07-11. Post-incident controls review completed and accepted.',
    createdAt: '2026-04-23T15:26:00.000Z',
    updatedAt: '2026-08-27T17:09:00.000Z',
  },
  {
    id: 'pol_011',
    number: 'IF-POL-2026-0112',
    customerId: 'cust_011',
    customerName: 'Marcus Oyelaran',
    productId: 'prod_006',
    productName: 'WorkCare Workers Comp',
    agentId: 'agnt_004',
    agentName: 'Omar Haddad',
    lineOfBusiness: 'workers_compensation',
    status: 'active',
    effectiveDate: '2026-07-01',
    expirationDate: '2027-07-01',
    issuedAt: '2026-06-25T09:14:00.000Z',
    paidThrough: '2026-12-01',
    premium: 19800,
    monthlyPremium: 1650,
    coverageLimit: 1000000,
    deductible: 0,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'auto_pay',
    claimsCount: 1,
    claimsTotal: 27400,
    riskProfile: 'standard',
    hasAutoPay: true,
    paperless: true,
    coverageCodes: ['cov_008'],
    notes: 'Class code 5403 (carpentry). Experience modifier 1.08 after one lost-time claim in 2025.',
    createdAt: '2026-06-25T09:14:00.000Z',
    updatedAt: '2026-09-04T12:56:00.000Z',
  },
  {
    id: 'pol_012',
    number: 'IF-POL-2025-0555',
    customerId: 'cust_012',
    customerName: 'Willowbrook Veterinary Clinic',
    productId: 'prod_005',
    productName: 'General Liability Secure',
    agentId: 'agnt_005',
    agentName: 'Sofia Marchetti',
    lineOfBusiness: 'general_liability',
    status: 'renewal_due',
    effectiveDate: '2025-10-20',
    expirationDate: '2026-10-20',
    issuedAt: '2025-10-13T10:27:00.000Z',
    paidThrough: '2026-10-20',
    premium: 5960,
    monthlyPremium: 496.67,
    coverageLimit: 1000000,
    deductible: 1000,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'current',
    claimsCount: 1,
    claimsTotal: 6300,
    riskProfile: 'standard',
    hasAutoPay: true,
    paperless: false,
    coverageCodes: ['cov_001', 'cov_007'],
    notes: 'Renewal indication +9% driven by veterinary liability base rate change. Quote issued 2026-09-08.',
    createdAt: '2025-10-13T10:27:00.000Z',
    updatedAt: '2026-09-08T14:38:00.000Z',
  },
  {
    id: 'pol_013',
    number: 'IF-POL-2026-0044',
    customerId: 'cust_013',
    customerName: 'Camille Boudreaux',
    productId: 'prod_002',
    productName: 'HomeGuard Elite',
    agentId: 'agnt_006',
    agentName: 'Ethan Brackett',
    lineOfBusiness: 'homeowners',
    status: 'active',
    effectiveDate: '2026-03-18',
    expirationDate: '2027-03-18',
    issuedAt: '2026-03-11T11:52:00.000Z',
    paidThrough: '2027-03-18',
    premium: 3480,
    monthlyPremium: 290,
    coverageLimit: 720000,
    deductible: 1000,
    termMonths: 12,
    billingFrequency: 'annual',
    paymentStatus: 'current',
    claimsCount: 1,
    claimsTotal: 4120,
    riskProfile: 'preferred',
    hasAutoPay: true,
    paperless: true,
    coverageCodes: ['cov_002', 'cov_005', 'cov_007'],
    notes: 'Coastal wind mitigation credits applied. Umbrella attached for total liability of $3M.',
    createdAt: '2026-03-11T11:52:00.000Z',
    updatedAt: '2026-05-03T16:04:00.000Z',
  },
  {
    id: 'pol_014',
    number: 'IF-POL-2026-0015',
    customerId: 'cust_014',
    customerName: 'Trident Marine Freight Co.',
    productId: 'prod_009',
    productName: 'MarineHaul Cargo',
    agentId: 'agnt_008',
    agentName: 'Victor Sorensen',
    lineOfBusiness: 'marine',
    status: 'active',
    effectiveDate: '2026-01-01',
    expirationDate: '2027-01-01',
    issuedAt: '2025-12-18T14:49:00.000Z',
    paidThrough: '2027-01-01',
    premium: 62400,
    monthlyPremium: 5200,
    coverageLimit: 25000000,
    deductible: 25000,
    termMonths: 12,
    billingFrequency: 'quarterly',
    paymentStatus: 'current',
    claimsCount: 1,
    claimsTotal: 310000,
    riskProfile: 'elevated',
    hasAutoPay: false,
    paperless: true,
    coverageCodes: ['cov_002', 'cov_007'],
    notes: 'Open cargo cover across 14 trade lanes. One refrigerated container spoilage claim settled Q2.',
    createdAt: '2025-12-18T14:49:00.000Z',
    updatedAt: '2026-07-16T13:21:00.000Z',
  },
  {
    id: 'pol_015',
    number: 'IF-POL-2026-0131',
    customerId: 'cust_015',
    customerName: 'Ethan Kimura',
    productId: 'prod_008',
    productName: 'ProfIndemnity Assurance',
    agentId: 'agnt_003',
    agentName: 'Dana Whitfield',
    lineOfBusiness: 'professional_indemnity',
    status: 'active',
    effectiveDate: '2026-08-01',
    expirationDate: '2027-08-01',
    issuedAt: '2026-07-27T09:38:00.000Z',
    paidThrough: '2027-08-01',
    premium: 11200,
    monthlyPremium: 933.33,
    coverageLimit: 3000000,
    deductible: 10000,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'auto_pay',
    claimsCount: 0,
    claimsTotal: 0,
    riskProfile: 'preferred',
    hasAutoPay: true,
    paperless: true,
    coverageCodes: ['cov_001', 'cov_007'],
    notes: 'Architecture practice — retroactive date 2016. Prior acts coverage confirmed with previous carrier.',
    createdAt: '2026-07-27T09:38:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'pol_016',
    number: 'IF-POL-2025-0810',
    customerId: 'cust_002',
    customerName: 'Bennett & Cole Logistics LLC',
    productId: 'prod_003',
    productName: 'Fleet360 Commercial',
    agentId: 'agnt_002',
    agentName: 'Priya Raghunathan',
    lineOfBusiness: 'commercial_auto',
    status: 'expired',
    effectiveDate: '2025-07-01',
    expirationDate: '2026-07-01',
    issuedAt: '2025-06-24T08:20:00.000Z',
    paidThrough: '2026-07-01',
    premium: 26100,
    monthlyPremium: 2175,
    coverageLimit: 1000000,
    deductible: 5000,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'current',
    claimsCount: 2,
    claimsTotal: 33800,
    riskProfile: 'elevated',
    hasAutoPay: true,
    paperless: true,
    coverageCodes: ['cov_001'],
    notes: 'Superseded by IF-POL-2025-0148 after fleet expansion. Retained for claims history lookup.',
    createdAt: '2025-06-24T08:20:00.000Z',
    updatedAt: '2026-07-01T00:01:00.000Z',
  },
  {
    id: 'pol_017',
    number: 'IF-POL-2026-0162',
    customerId: 'cust_006',
    customerName: 'Summit Ridge Construction Inc.',
    productId: 'prod_005',
    productName: 'General Liability Secure',
    agentId: 'agnt_006',
    agentName: 'Ethan Brackett',
    lineOfBusiness: 'general_liability',
    status: 'lapsed',
    effectiveDate: '2026-06-10',
    expirationDate: '2027-06-10',
    issuedAt: '2026-06-03T15:11:00.000Z',
    paidThrough: '2026-08-10',
    premium: 18400,
    monthlyPremium: 1533.33,
    coverageLimit: 5000000,
    deductible: 5000,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'past_due',
    claimsCount: 1,
    claimsTotal: 12400,
    riskProfile: 'standard',
    hasAutoPay: false,
    paperless: true,
    coverageCodes: ['cov_001', 'cov_007'],
    notes: 'Lapsed 2026-09-05 after two failed ACH attempts. Reinstatement offer sent — no response yet.',
    createdAt: '2026-06-03T15:11:00.000Z',
    updatedAt: '2026-09-05T06:30:00.000Z',
  },
  {
    id: 'pol_018',
    number: 'IF-POL-2025-0472',
    customerId: 'cust_010',
    customerName: 'Quantum Layer Technologies Inc.',
    productId: 'prod_010',
    productName: 'LifeLegacy Term',
    agentId: 'agnt_007',
    agentName: 'Grace Okonkwo',
    lineOfBusiness: 'life',
    status: 'active',
    effectiveDate: '2025-09-30',
    expirationDate: '2030-09-30',
    issuedAt: '2025-09-22T10:05:00.000Z',
    paidThrough: '2026-09-30',
    premium: 8400,
    monthlyPremium: 700,
    coverageLimit: 1000000,
    deductible: 0,
    termMonths: 60,
    billingFrequency: 'monthly',
    paymentStatus: 'current',
    claimsCount: 0,
    claimsTotal: 0,
    riskProfile: 'preferred',
    hasAutoPay: true,
    paperless: true,
    coverageCodes: ['cov_005'],
    notes: 'Key-person coverage on founding team. Level term with guaranteed premium through 2030.',
    createdAt: '2025-09-22T10:05:00.000Z',
    updatedAt: '2026-02-14T11:44:00.000Z',
  },
  {
    id: 'pol_019',
    number: 'IF-POL-2026-0175',
    customerId: 'cust_004',
    customerName: 'Harbor Point Dental Group',
    productId: 'prod_001',
    productName: 'AutoPlus Premier',
    agentId: 'agnt_004',
    agentName: 'Omar Haddad',
    lineOfBusiness: 'personal_auto',
    status: 'cancelled',
    effectiveDate: '2026-02-14',
    expirationDate: '2027-02-14',
    issuedAt: '2026-02-07T12:22:00.000Z',
    paidThrough: '2026-05-02',
    premium: 2180,
    monthlyPremium: 181.67,
    coverageLimit: 300000,
    deductible: 1000,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'unbilled',
    claimsCount: 0,
    claimsTotal: 0,
    riskProfile: 'standard',
    hasAutoPay: false,
    paperless: true,
    coverageCodes: ['cov_001', 'cov_003'],
    notes: 'Vehicle sold 2026-05-02 — pro-rata refund of $1,246 issued to the practice operating account.',
    createdAt: '2026-02-07T12:22:00.000Z',
    updatedAt: '2026-05-02T09:18:00.000Z',
  },
  {
    id: 'pol_020',
    number: 'IF-POL-2026-0188',
    customerId: 'cust_012',
    customerName: 'Willowbrook Veterinary Clinic',
    productId: 'prod_003',
    productName: 'Fleet360 Commercial',
    agentId: 'agnt_005',
    agentName: 'Sofia Marchetti',
    lineOfBusiness: 'commercial_auto',
    status: 'draft',
    effectiveDate: '2026-10-01',
    expirationDate: '2027-10-01',
    issuedAt: '2026-09-21T08:47:00.000Z',
    paidThrough: null,
    premium: 14750,
    monthlyPremium: 1229.17,
    coverageLimit: 1000000,
    deductible: 2500,
    termMonths: 12,
    billingFrequency: 'monthly',
    paymentStatus: 'unbilled',
    claimsCount: 0,
    claimsTotal: 0,
    riskProfile: 'standard',
    hasAutoPay: false,
    paperless: false,
    coverageCodes: ['cov_001', 'cov_003'],
    notes: 'Draft created from clinic mobile-unit submission. Awaiting VIN list for all four vehicles.',
    createdAt: '2026-09-21T08:47:00.000Z',
    updatedAt: '2026-09-21T08:47:00.000Z',
  },
];


/* ========================================================================== */
/*  4. Quotes — 12 records                                                    */
/* ========================================================================== */

export const MOCK_QUOTES: Quote[] = [
  {
    id: 'quo_001',
    number: 'IF-QTE-2026-4821',
    customerId: null,
    applicantName: 'Lena Okafor',
    applicantEmail: 'lena.okafor@example.com',
    productId: 'prod_001',
    productName: 'AutoPlus Premier',
    lineOfBusiness: 'personal_auto',
    requestedAt: '2026-09-18T09:14:00.000Z',
    expiresAt: '2026-10-18T09:14:00.000Z',
    decidedAt: '2026-09-18T09:16:00.000Z',
    riskScore: 22,
    premium: 1584,
    monthlyPremium: 132,
    coverageLimit: 300000,
    deductible: 500,
    decision: 'approved',
    decisionReason: 'Clean record, low-mileage commuter, garaged vehicle.',
    status: 'sent',
    channel: 'web',
    priorCarrier: 'Statewide Mutual',
    priorPremium: 1710,
    claimsLast3Years: 0,
    notes: 'Web quote converted to a bound policy 4 days later.',
    factors: [
      { label: 'Claims history', impact: 'positive', weight: 30, detail: 'No losses in the last 3 years.' },
      { label: 'Credit tier', impact: 'positive', weight: 20, detail: 'Tier 1 insured credit band.' },
      { label: 'Vehicle safety', impact: 'positive', weight: 25, detail: '2025 model with IIHS Top Safety Pick+.' },
      { label: 'Annual mileage', impact: 'neutral', weight: 15, detail: '9,400 miles — near portfolio median.' },
    ],
    createdAt: '2026-09-18T09:14:00.000Z',
    updatedAt: '2026-09-18T09:16:00.000Z',
  },
  {
    id: 'quo_002',
    number: 'IF-QTE-2026-4809',
    customerId: null,
    applicantName: 'Redwood Fabrication Works',
    applicantEmail: 'ops@redwoodfab.example.com',
    productId: 'prod_005',
    productName: 'General Liability Secure',
    lineOfBusiness: 'general_liability',
    requestedAt: '2026-09-15T13:41:00.000Z',
    expiresAt: '2026-10-15T13:41:00.000Z',
    decidedAt: '2026-09-16T10:02:00.000Z',
    riskScore: 58,
    premium: 21600,
    monthlyPremium: 1800,
    coverageLimit: 2000000,
    deductible: 5000,
    decision: 'refer',
    decisionReason: 'Metal fabrication exposure exceeds straight-through authority.',
    status: 'viewed',
    channel: 'broker',
    priorCarrier: 'Pacific Indemnity',
    priorPremium: 19450,
    claimsLast3Years: 2,
    notes: 'Referred to senior referral underwriter — loss runs requested from applicant.',
    factors: [
      { label: 'Classification', impact: 'negative', weight: 35, detail: 'Class 2585 fabrication carries elevated severity.' },
      { label: 'Payroll exposure', impact: 'negative', weight: 25, detail: '$1.4M annual payroll on non-owned locations.' },
      { label: 'Loss history', impact: 'negative', weight: 25, detail: 'Two small claims in 3 years, both under $15k.' },
      { label: 'Safety program', impact: 'positive', weight: 15, detail: 'Documented OSHA 300A and monthly toolbox talks.' },
    ],
    createdAt: '2026-09-15T13:41:00.000Z',
    updatedAt: '2026-09-16T10:02:00.000Z',
  },
  {
    id: 'quo_003',
    number: 'IF-QTE-2026-4798',
    customerId: 'cust_003',
    applicantName: 'Rowan Delacroix',
    applicantEmail: 'rowan.delacroix@example.com',
    productId: 'prod_002',
    productName: 'HomeGuard Elite',
    lineOfBusiness: 'homeowners',
    requestedAt: '2026-09-11T15:27:00.000Z',
    expiresAt: '2026-10-11T15:27:00.000Z',
    decidedAt: '2026-09-11T15:27:04.000Z',
    riskScore: 31,
    premium: 2940,
    monthlyPremium: 245,
    coverageLimit: 650000,
    deductible: 1500,
    decision: 'approved',
    decisionReason: 'Renewal indication returned within pricing corridor.',
    status: 'bound',
    channel: 'renewal',
    priorCarrier: null,
    priorPremium: 3120,
    claimsLast3Years: 0,
    notes: 'Bound automatically — renewal premium decreased 5.8% after roof credit.',
    factors: [
      { label: 'Roof age', impact: 'positive', weight: 30, detail: 'Impact-resistant shingles installed 2024.' },
      { label: 'Protection class', impact: 'neutral', weight: 20, detail: 'ISO 4 — average for the territory.' },
      { label: 'Prior premium', impact: 'positive', weight: 25, detail: 'Indicated 5.8% below expiring.' },
      { label: 'Claims history', impact: 'positive', weight: 25, detail: 'Zero losses across three policy terms.' },
    ],
    createdAt: '2026-09-11T15:27:00.000Z',
    updatedAt: '2026-09-11T15:31:00.000Z',
  },
  {
    id: 'quo_004',
    number: 'IF-QTE-2026-4785',
    customerId: null,
    applicantName: 'Tobias Grant',
    applicantEmail: 't.grant@example.com',
    productId: 'prod_001',
    productName: 'AutoPlus Premier',
    lineOfBusiness: 'personal_auto',
    requestedAt: '2026-09-08T11:03:00.000Z',
    expiresAt: '2026-10-08T11:03:00.000Z',
    decidedAt: '2026-09-08T11:05:00.000Z',
    riskScore: 84,
    premium: 4380,
    monthlyPremium: 365,
    coverageLimit: 300000,
    deductible: 1000,
    decision: 'declined',
    decisionReason: 'Two at-fault accidents and one DUI conviction within 36 months.',
    status: 'expired',
    channel: 'web',
    priorCarrier: 'HighRisk Auto Pool',
    priorPremium: 4920,
    claimsLast3Years: 4,
    notes: 'Applicant redirected to state residual market information page.',
    factors: [
      { label: 'Accident frequency', impact: 'negative', weight: 40, detail: 'Two at-fault losses since 2024.' },
      { label: 'Violations', impact: 'negative', weight: 35, detail: 'DUI conviction — mandatory 3-year decline.' },
      { label: 'Loss ratio', impact: 'negative', weight: 15, detail: 'Carrier loss ratio on prior policy: 214%.' },
      { label: 'Continuous coverage', impact: 'positive', weight: 10, detail: 'No lapse in prior insurance.' },
    ],
    createdAt: '2026-09-08T11:03:00.000Z',
    updatedAt: '2026-09-08T11:05:00.000Z',
  },
  {
    id: 'quo_005',
    number: 'IF-QTE-2026-4772',
    customerId: 'cust_014',
    applicantName: 'Trident Marine Freight Co.',
    applicantEmail: 'risk@tridentmarine.example.com',
    productId: 'prod_009',
    productName: 'MarineHaul Cargo',
    lineOfBusiness: 'marine',
    requestedAt: '2026-09-03T08:52:00.000Z',
    expiresAt: '2026-10-03T08:52:00.000Z',
    decidedAt: '2026-09-04T14:19:00.000Z',
    riskScore: 47,
    premium: 68400,
    monthlyPremium: 5700,
    coverageLimit: 30000000,
    deductible: 25000,
    decision: 'approved',
    decisionReason: 'Approved with increased deductible and named-driver warranty.',
    status: 'sent',
    channel: 'broker',
    priorCarrier: 'Atlantic Cargo Syndicate',
    priorPremium: 62400,
    claimsLast3Years: 1,
    notes: 'Limit raised from $25M to $30M; premium +9.6% with unchanged retention.',
    factors: [
      { label: 'Cargo mix', impact: 'negative', weight: 30, detail: '40% refrigerated — spoilage severity driver.' },
      { label: 'Lane concentration', impact: 'neutral', weight: 20, detail: 'Two lanes account for 61% of tonnage.' },
      { label: 'Loss experience', impact: 'positive', weight: 25, detail: 'Single moderate loss in 3 years.' },
      { label: 'Risk engineering', impact: 'positive', weight: 25, detail: 'Temperature telemetry on all reefer units.' },
    ],
    createdAt: '2026-09-03T08:52:00.000Z',
    updatedAt: '2026-09-04T14:19:00.000Z',
  },
  {
    id: 'quo_006',
    number: 'IF-QTE-2026-4764',
    customerId: null,
    applicantName: 'Priomark Digital Agency',
    applicantEmail: 'finance@priomark.example.com',
    productId: 'prod_007',
    productName: 'CyberDefend Pro',
    lineOfBusiness: 'cyber',
    requestedAt: '2026-08-30T16:35:00.000Z',
    expiresAt: '2026-09-29T16:35:00.000Z',
    decidedAt: '2026-08-31T09:47:00.000Z',
    riskScore: 66,
    premium: 17800,
    monthlyPremium: 1483.33,
    coverageLimit: 2000000,
    deductible: 25000,
    decision: 'needs_info',
    decisionReason: 'MFA coverage and backup restore test evidence outstanding.',
    status: 'viewed',
    channel: 'web',
    priorCarrier: null,
    priorPremium: null,
    claimsLast3Years: 0,
    notes: 'Applicant uploaded partial SOC 2 report — second request sent 2026-09-06.',
    factors: [
      { label: 'MFA coverage', impact: 'negative', weight: 35, detail: 'MFA present on email only, not on VPN or admin consoles.' },
      { label: 'Backup posture', impact: 'negative', weight: 25, detail: 'No documented restore test in 24 months.' },
      { label: 'Revenue exposure', impact: 'neutral', weight: 20, detail: '$12M revenue — within target segment.' },
      { label: 'Incident history', impact: 'positive', weight: 20, detail: 'No prior cyber events reported.' },
    ],
    createdAt: '2026-08-30T16:35:00.000Z',
    updatedAt: '2026-09-06T10:12:00.000Z',
  },
  {
    id: 'quo_007',
    number: 'IF-QTE-2026-4751',
    customerId: null,
    applicantName: 'Harborview Bakery LLC',
    applicantEmail: 'owner@harborviewbakery.example.com',
    productId: 'prod_005',
    productName: 'General Liability Secure',
    lineOfBusiness: 'general_liability',
    requestedAt: '2026-08-25T10:18:00.000Z',
    expiresAt: '2026-09-24T10:18:00.000Z',
    decidedAt: '2026-08-25T10:19:00.000Z',
    riskScore: 26,
    premium: 4920,
    monthlyPremium: 410,
    coverageLimit: 1000000,
    deductible: 1000,
    decision: 'approved',
    decisionReason: 'Low-hazard retail food exposure with clean loss history.',
    status: 'bound',
    channel: 'agent',
    priorCarrier: 'Main Street Mutual',
    priorPremium: 4680,
    claimsLast3Years: 0,
    notes: 'Bound by Dana Whitfield — payment plan set to monthly ACH.',
    factors: [
      { label: 'Classification', impact: 'positive', weight: 35, detail: 'Retail bakery — low hazard code 5812.' },
      { label: 'Sq. footage', impact: 'neutral', weight: 20, detail: '1,850 sq ft with limited seating.' },
      { label: 'Loss history', impact: 'positive', weight: 25, detail: 'No liability losses in the lookback period.' },
      { label: 'Prior premium', impact: 'negative', weight: 20, detail: 'Indicated 5.1% above expiring rate.' },
    ],
    createdAt: '2026-08-25T10:18:00.000Z',
    updatedAt: '2026-08-25T10:19:00.000Z',
  },
  {
    id: 'quo_008',
    number: 'IF-QTE-2026-4740',
    customerId: 'cust_005',
    applicantName: 'Nadia Farouk',
    applicantEmail: 'nadia.farouk@example.com',
    productId: 'prod_001',
    productName: 'AutoPlus Premier',
    lineOfBusiness: 'personal_auto',
    requestedAt: '2026-08-19T14:56:00.000Z',
    expiresAt: '2026-09-18T14:56:00.000Z',
    decidedAt: '2026-08-20T08:31:00.000Z',
    riskScore: 71,
    premium: 2410,
    monthlyPremium: 200.83,
    coverageLimit: 500000,
    deductible: 1000,
    decision: 'approved',
    decisionReason: 'Approved with telematics requirement for the first two terms.',
    status: 'bound',
    channel: 'renewal',
    priorCarrier: null,
    priorPremium: 2185,
    claimsLast3Years: 2,
    notes: 'Renewal quote with +10.3% adjustment driven by second at-fault loss.',
    factors: [
      { label: 'At-fault losses', impact: 'negative', weight: 40, detail: 'Two at-fault incidents within 36 months.' },
      { label: 'Telematics', impact: 'negative', weight: 25, detail: 'Device offered twice — not accepted.' },
      { label: 'Continuous tenure', impact: 'positive', weight: 20, detail: 'Five consecutive years with InsureFlow.' },
      { label: 'Prior premium', impact: 'negative', weight: 15, detail: 'Indicated 10.3% above expiring.' },
    ],
    createdAt: '2026-08-19T14:56:00.000Z',
    updatedAt: '2026-08-20T08:31:00.000Z',
  },
  {
    id: 'quo_009',
    number: 'IF-QTE-2026-4726',
    customerId: null,
    applicantName: 'Juniper Home Services',
    applicantEmail: 'dispatch@juniperhome.example.com',
    productId: 'prod_006',
    productName: 'WorkCare Workers Comp',
    lineOfBusiness: 'workers_compensation',
    requestedAt: '2026-08-13T09:07:00.000Z',
    expiresAt: '2026-09-12T09:07:00.000Z',
    decidedAt: '2026-08-14T11:44:00.000Z',
    riskScore: 52,
    premium: 26400,
    monthlyPremium: 2200,
    coverageLimit: 1000000,
    deductible: 0,
    decision: 'refer',
    decisionReason: 'Experience modifier above 1.25 requires home-office referral.',
    status: 'withdrawn',
    channel: 'agent',
    priorCarrier: 'Keystone Workers Comp',
    priorPremium: 24800,
    claimsLast3Years: 3,
    notes: 'Applicant withdrew after incumbent offered a lower deductible option.',
    factors: [
      { label: 'Experience modifier', impact: 'negative', weight: 40, detail: 'EM 1.34 — above referral threshold.' },
      { label: 'Class codes', impact: 'negative', weight: 25, detail: 'Mixed HVAC/plumbing codes with injury frequency.' },
      { label: 'Payroll growth', impact: 'neutral', weight: 15, detail: 'Payroll up 18% year over year.' },
      { label: 'Safety program', impact: 'positive', weight: 20, detail: 'Return-to-work program documented.' },
    ],
    createdAt: '2026-08-13T09:07:00.000Z',
    updatedAt: '2026-08-22T16:10:00.000Z',
  },
  {
    id: 'quo_010',
    number: 'IF-QTE-2026-4718',
    customerId: null,
    applicantName: 'Selina Moraux',
    applicantEmail: 'selina.moraux@example.com',
    productId: 'prod_002',
    productName: 'HomeGuard Elite',
    lineOfBusiness: 'homeowners',
    requestedAt: '2026-08-08T12:40:00.000Z',
    expiresAt: '2026-09-07T12:40:00.000Z',
    decidedAt: '2026-08-08T12:41:00.000Z',
    riskScore: 39,
    premium: 4260,
    monthlyPremium: 355,
    coverageLimit: 900000,
    deductible: 2500,
    decision: 'approved',
    decisionReason: 'Approved at higher deductible to meet price expectation.',
    status: 'expired',
    channel: 'web',
    priorCarrier: 'Civic Casualty',
    priorPremium: 4410,
    claimsLast3Years: 1,
    notes: 'Quote expired unbought — re-engagement email queued for the next renewal cycle.',
    factors: [
      { label: 'Deductible choice', impact: 'positive', weight: 30, detail: '$2,500 deductible reduces expected loss cost.' },
      { label: 'Wind zone', impact: 'negative', weight: 30, detail: 'Coastal AE flood-adjacent zone.' },
      { label: 'Prior loss', impact: 'negative', weight: 25, detail: 'One water ingress claim in 2024.' },
      { label: 'Bundle potential', impact: 'neutral', weight: 15, detail: 'No auto policy on file to bundle.' },
    ],
    createdAt: '2026-08-08T12:40:00.000Z',
    updatedAt: '2026-09-07T12:41:00.000Z',
  },
  {
    id: 'quo_011',
    number: 'IF-QTE-2026-4705',
    customerId: 'cust_015',
    applicantName: 'Ethan Kimura',
    applicantEmail: 'ethan.kimura@example.com',
    productId: 'prod_008',
    productName: 'ProfIndemnity Assurance',
    lineOfBusiness: 'professional_indemnity',
    requestedAt: '2026-07-29T15:22:00.000Z',
    expiresAt: '2026-08-28T15:22:00.000Z',
    decidedAt: '2026-07-29T15:24:00.000Z',
    riskScore: 18,
    premium: 11200,
    monthlyPremium: 933.33,
    coverageLimit: 3000000,
    deductible: 10000,
    decision: 'approved',
    decisionReason: 'Preferred architect practice with no prior acts claims.',
    status: 'bound',
    channel: 'agent',
    priorCarrier: 'Architects Mutual',
    priorPremium: 10600,
    claimsLast3Years: 0,
    notes: 'Bound with retroactive date 2016 confirmed by prior carrier letter.',
    factors: [
      { label: 'Profession', impact: 'positive', weight: 30, detail: 'Architectural design — moderate severity class.' },
      { label: 'Prior acts', impact: 'positive', weight: 30, detail: 'Continuous coverage since 2016.' },
      { label: 'Revenue', impact: 'neutral', weight: 20, detail: '$3.4M professional revenue.' },
      { label: 'Loss history', impact: 'positive', weight: 20, detail: 'Zero claims across two carriers.' },
    ],
    createdAt: '2026-07-29T15:22:00.000Z',
    updatedAt: '2026-07-29T15:24:00.000Z',
  },
  {
    id: 'quo_012',
    number: 'IF-QTE-2026-4692',
    customerId: null,
    applicantName: 'Northgate Auto Body',
    applicantEmail: 'claims@northgateauto.example.com',
    productId: 'prod_003',
    productName: 'Fleet360 Commercial',
    lineOfBusiness: 'commercial_auto',
    requestedAt: '2026-07-21T10:49:00.000Z',
    expiresAt: '2026-08-20T10:49:00.000Z',
    decidedAt: '2026-07-23T13:06:00.000Z',
    riskScore: 74,
    premium: 33900,
    monthlyPremium: 2825,
    coverageLimit: 1000000,
    deductible: 10000,
    decision: 'declined',
    decisionReason: 'Garagekeepers exposure with unresolved DOI complaint on file.',
    status: 'expired',
    channel: 'broker',
    priorCarrier: 'Fairlane Insurance',
    priorPremium: 29700,
    claimsLast3Years: 5,
    notes: 'Open regulatory complaint must be closed before any reconsideration.',
    factors: [
      { label: 'Garagekeepers liability', impact: 'negative', weight: 40, detail: 'Custody of customer vehicles drives severity.' },
      { label: 'Loss frequency', impact: 'negative', weight: 35, detail: 'Five losses in 3 years — 118% loss ratio.' },
      { label: 'Regulatory standing', impact: 'negative', weight: 15, detail: 'Open DOI complaint against the applicant.' },
      { label: 'Fleet size', impact: 'neutral', weight: 10, detail: 'Nine units plus yard vehicles.' },
    ],
    createdAt: '2026-07-21T10:49:00.000Z',
    updatedAt: '2026-07-23T13:06:00.000Z',
  },
];

/* ========================================================================== */
/*  5. Renewals — 10 records                                                  */
/* ========================================================================== */

export const MOCK_RENEWALS: Renewal[] = [
  {
    id: 'ren_001',
    policyId: 'pol_003',
    policyNumber: 'IF-POL-2025-0219',
    customerId: 'cust_003',
    customerName: 'Rowan Delacroix',
    agentId: 'agnt_003',
    agentName: 'Dana Whitfield',
    renewalDate: '2026-10-01',
    noticeSentAt: '2026-08-17T09:00:00.000Z',
    quotedAt: '2026-09-11T15:27:00.000Z',
    boundAt: '2026-09-11T15:31:00.000Z',
    currentPremium: 3120,
    renewalPremium: 2940,
    deltaAmount: -180,
    deltaPercent: -5.77,
    status: 'accepted',
    retentionRisk: 'low',
    reason: 'Roof credit lowered indicated premium.',
    actions: ['Send renewal confirmation', 'Update autopay schedule'],
    createdAt: '2026-07-17T09:00:00.000Z',
    updatedAt: '2026-09-11T15:31:00.000Z',
  },
  {
    id: 'ren_002',
    policyId: 'pol_012',
    policyNumber: 'IF-POL-2025-0555',
    customerId: 'cust_012',
    customerName: 'Willowbrook Veterinary Clinic',
    agentId: 'agnt_005',
    agentName: 'Sofia Marchetti',
    renewalDate: '2026-10-20',
    noticeSentAt: '2026-09-05T09:00:00.000Z',
    quotedAt: '2026-09-08T14:38:00.000Z',
    boundAt: null,
    currentPremium: 5960,
    renewalPremium: 6496,
    deltaAmount: 536,
    deltaPercent: 8.99,
    status: 'quoted',
    retentionRisk: 'medium',
    reason: 'Veterinary liability base rate revision +9%.',
    actions: ['Follow up 2026-09-26', 'Offer 3-pay installment option'],
    createdAt: '2026-08-20T09:00:00.000Z',
    updatedAt: '2026-09-08T14:38:00.000Z',
  },
  {
    id: 'ren_003',
    policyId: 'pol_016',
    policyNumber: 'IF-POL-2025-0810',
    customerId: 'cust_002',
    customerName: 'Bennett & Cole Logistics LLC',
    agentId: 'agnt_002',
    agentName: 'Priya Raghunathan',
    renewalDate: '2026-07-01',
    noticeSentAt: '2026-05-17T09:00:00.000Z',
    quotedAt: '2026-06-12T11:20:00.000Z',
    boundAt: '2026-06-26T09:44:00.000Z',
    currentPremium: 26100,
    renewalPremium: 28450,
    deltaAmount: 2350,
    deltaPercent: 9.0,
    status: 'accepted',
    retentionRisk: 'low',
    reason: 'Fleet grew from 34 to 48 units — replaced under new policy number.',
    actions: ['Archive superseded policy', 'Issue fleet schedule'],
    createdAt: '2026-04-01T09:00:00.000Z',
    updatedAt: '2026-06-26T09:44:00.000Z',
  },
  {
    id: 'ren_004',
    policyId: 'pol_002',
    policyNumber: 'IF-POL-2025-0148',
    customerId: 'cust_002',
    customerName: 'Bennett & Cole Logistics LLC',
    agentId: 'agnt_002',
    agentName: 'Priya Raghunathan',
    renewalDate: '2026-11-15',
    noticeSentAt: null,
    quotedAt: null,
    boundAt: null,
    currentPremium: 28450,
    renewalPremium: 30160,
    deltaAmount: 1710,
    deltaPercent: 6.01,
    status: 'scheduled',
    retentionRisk: 'medium',
    reason: 'Preliminary indication — commercial auto base rate +6%.',
    actions: ['Request current loss runs', 'Schedule risk-engineering visit'],
    createdAt: '2026-09-15T09:00:00.000Z',
    updatedAt: '2026-09-15T09:00:00.000Z',
  },
  {
    id: 'ren_005',
    policyId: 'pol_008',
    policyNumber: 'IF-POL-2025-0666',
    customerId: 'cust_008',
    customerName: 'Cedar Grove Apartments LLC',
    agentId: 'agnt_008',
    agentName: 'Victor Sorensen',
    renewalDate: '2026-12-01',
    noticeSentAt: null,
    quotedAt: null,
    boundAt: null,
    currentPremium: 38900,
    renewalPremium: 46302,
    deltaAmount: 7402,
    deltaPercent: 19.03,
    status: 'notice_sent',
    retentionRisk: 'high',
    reason: 'Two water-damage losses; plumbing certificate required to hold rate.',
    actions: ['Order plumbing inspection', 'Escalate to retention desk', 'Explore higher deductible'],
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-09-10T14:02:00.000Z',
  },
  {
    id: 'ren_006',
    policyId: 'pol_014',
    policyNumber: 'IF-POL-2026-0015',
    customerId: 'cust_014',
    customerName: 'Trident Marine Freight Co.',
    agentId: 'agnt_008',
    agentName: 'Victor Sorensen',
    renewalDate: '2027-01-01',
    noticeSentAt: null,
    quotedAt: null,
    boundAt: null,
    currentPremium: 62400,
    renewalPremium: 68400,
    deltaAmount: 6000,
    deltaPercent: 9.62,
    status: 'quoted',
    retentionRisk: 'medium',
    reason: 'Limit increase to $30M priced in the September quote.',
    actions: ['Present options to risk manager', 'Confirm deductible retention'],
    createdAt: '2026-08-15T09:00:00.000Z',
    updatedAt: '2026-09-04T14:19:00.000Z',
  },
  {
    id: 'ren_007',
    policyId: 'pol_006',
    policyNumber: 'IF-POL-2026-0071',
    customerId: 'cust_006',
    customerName: 'Summit Ridge Construction Inc.',
    agentId: 'agnt_006',
    agentName: 'Ethan Brackett',
    renewalDate: '2027-02-01',
    noticeSentAt: null,
    quotedAt: null,
    boundAt: null,
    currentPremium: 46800,
    renewalPremium: 46800,
    deltaAmount: 0,
    deltaPercent: 0,
    status: 'scheduled',
    retentionRisk: 'low',
    reason: 'Flat renewal expected — wildfire mitigation credit holds rate.',
    actions: ['Update equipment schedule at 12/31'],
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'ren_008',
    policyId: 'pol_019',
    policyNumber: 'IF-POL-2026-0175',
    customerId: 'cust_004',
    customerName: 'Harbor Point Dental Group',
    agentId: 'agnt_004',
    agentName: 'Omar Haddad',
    renewalDate: '2027-02-14',
    noticeSentAt: null,
    quotedAt: null,
    boundAt: null,
    currentPremium: 2180,
    renewalPremium: 0,
    deltaAmount: -2180,
    deltaPercent: -100,
    status: 'lapsed',
    retentionRisk: 'high',
    reason: 'Policy cancelled at insured request — vehicle sold.',
    actions: ['Archive policy', 'Mark renewal as not required'],
    createdAt: '2026-05-02T09:18:00.000Z',
    updatedAt: '2026-05-02T09:18:00.000Z',
  },
  {
    id: 'ren_009',
    policyId: 'pol_017',
    policyNumber: 'IF-POL-2026-0162',
    customerId: 'cust_006',
    customerName: 'Summit Ridge Construction Inc.',
    agentId: 'agnt_006',
    agentName: 'Ethan Brackett',
    renewalDate: '2027-06-10',
    noticeSentAt: null,
    quotedAt: null,
    boundAt: null,
    currentPremium: 18400,
    renewalPremium: 18400,
    deltaAmount: 0,
    deltaPercent: 0,
    status: 'declined',
    retentionRisk: 'high',
    reason: 'Lapsed for non-payment — reinstatement must clear before renewal track resumes.',
    actions: ['Send reinstatement invoice', 'Escalate after 2026-09-30'],
    createdAt: '2026-09-05T06:30:00.000Z',
    updatedAt: '2026-09-12T10:15:00.000Z',
  },
  {
    id: 'ren_010',
    policyId: 'pol_005',
    policyNumber: 'IF-POL-2026-0063',
    customerId: 'cust_005',
    customerName: 'Nadia Farouk',
    agentId: 'agnt_005',
    agentName: 'Sofia Marchetti',
    renewalDate: '2027-06-20',
    noticeSentAt: null,
    quotedAt: null,
    boundAt: null,
    currentPremium: 2410,
    renewalPremium: 2658,
    deltaAmount: 248,
    deltaPercent: 10.29,
    status: 'scheduled',
    retentionRisk: 'high',
    reason: 'Indication assumes telematics remains declined.',
    actions: ['Offer telematics again at 60 days', 'Review grace-period payment status'],
    createdAt: '2026-09-19T15:02:00.000Z',
    updatedAt: '2026-09-19T15:02:00.000Z',
  },
];

/* ========================================================================== */
/*  6. Coverage options — 8 records                                           */
/* ========================================================================== */

export const MOCK_COVERAGE: CoverageOption[] = [
  {
    id: 'cov_001',
    code: 'LIAB-100',
    name: 'Bodily Injury & Property Damage Liability',
    category: 'liability',
    description:
      'Pays for injury you cause to others and damage to their property, up to the combined single limit you select.',
    limitOptions: [250000, 300000, 500000, 1000000],
    deductibleOptions: [0, 500, 1000],
    defaultLimit: 300000,
    defaultDeductible: 500,
    unit: 'per_mille',
    baseRate: 6.4,
    deductibleApplies: false,
    waitingPeriodDays: null,
    exclusions: [
      'Intentional injury or damage',
      'Business use of a personal vehicle',
      'Racing or competitive events',
    ],
    isRecommended: true,
    isActive: true,
    policiesEnrolled: 96_420,
    avgClaimCost: 8_640,
  },
  {
    id: 'cov_002',
    code: 'PROP-200',
    name: 'Dwelling & Property Damage',
    category: 'property',
    description:
      'Rebuilds or repairs the insured structure and its contents after a covered peril, minus your deductible.',
    limitOptions: [250000, 500000, 750000, 1000000, 1500000, 2500000],
    deductibleOptions: [1000, 1500, 2500, 5000, 10000],
    defaultLimit: 650000,
    defaultDeductible: 1500,
    unit: 'per_mille',
    baseRate: 4.1,
    deductibleApplies: true,
    waitingPeriodDays: null,
    exclusions: [
      'Flood and storm surge (separate NFIP policy required)',
      'Earth movement unless endorsed',
      'Wear, tear, and maintenance items',
    ],
    isRecommended: true,
    isActive: true,
    policiesEnrolled: 74_180,
    avgClaimCost: 21_450,
  },
  {
    id: 'cov_003',
    code: 'COLL-300',
    name: 'Collision',
    category: 'collision',
    description:
      'Covers damage to your vehicle from a collision with another vehicle or object, regardless of fault. The limit is the vehicle’s actual cash value; options below are the scheduled value caps.',
    limitOptions: [25000, 40000, 60000, 80000],
    deductibleOptions: [250, 500, 1000, 2500],
    defaultLimit: 40000,
    defaultDeductible: 500,
    unit: 'flat',
    baseRate: 312,
    deductibleApplies: true,
    waitingPeriodDays: null,
    exclusions: [
      'Mechanical breakdown',
      'Tires worn beyond legal limits',
      'Damage while committing a felony',
    ],
    isRecommended: true,
    isActive: true,
    policiesEnrolled: 88_940,
    avgClaimCost: 4_980,
  },
  {
    id: 'cov_004',
    code: 'COMP-310',
    name: 'Comprehensive',
    category: 'collision',
    description:
      'Covers non-collision losses such as theft, hail, falling objects, vandalism, and animal strikes. The limit is the vehicle’s actual cash value; options below are the scheduled value caps.',
    limitOptions: [25000, 40000, 60000, 80000],
    deductibleOptions: [100, 250, 500, 1000, 2500],
    defaultLimit: 40000,
    defaultDeductible: 500,
    unit: 'flat',
    baseRate: 168,
    deductibleApplies: true,
    waitingPeriodDays: null,
    exclusions: [
      'Cargo or personal property left in plain sight',
      'Political action or war',
      'Radio aftermarket equipment over $1,500 without endorsement',
    ],
    isRecommended: false,
    isActive: true,
    policiesEnrolled: 81_260,
    avgClaimCost: 3_210,
  },
  {
    id: 'cov_005',
    code: 'MED-400',
    name: 'Medical Payments',
    category: 'injury',
    description:
      'Pays reasonable medical and funeral expenses for you and your passengers after a covered accident.',
    limitOptions: [5000, 10000, 25000, 50000],
    deductibleOptions: [0],
    defaultLimit: 10000,
    defaultDeductible: 0,
    unit: 'flat',
    baseRate: 42,
    deductibleApplies: false,
    waitingPeriodDays: 0,
    exclusions: ['Injury outside the covered vehicle', 'Intentional self-harm'],
    isRecommended: false,
    isActive: true,
    policiesEnrolled: 62_310,
    avgClaimCost: 1_940,
  },
  {
    id: 'cov_006',
    code: 'CYBR-500',
    name: 'Cyber Incident Response',
    category: 'cyber',
    description:
      'Funds forensic investigation, breach notification, credit monitoring, and extortion response after a cyber event.',
    limitOptions: [1000000, 2000000, 5000000, 10000000],
    deductibleOptions: [10000, 25000, 50000, 100000],
    defaultLimit: 5000000,
    defaultDeductible: 25000,
    unit: 'percent',
    baseRate: 0.42,
    deductibleApplies: true,
    waitingPeriodDays: 0,
    exclusions: [
      'Prior known incidents',
      'Infrastructure failure without a security breach',
      'Bodily injury or physical property damage',
    ],
    isRecommended: true,
    isActive: true,
    policiesEnrolled: 4_120,
    avgClaimCost: 168_400,
  },
  {
    id: 'cov_007',
    code: 'UMB-600',
    name: 'Umbrella / Excess Liability',
    category: 'liability',
    description:
      'Sits above your underlying liability limits and adds excess capacity across auto, home, and business exposures.',
    limitOptions: [1000000, 2000000, 5000000, 10000000],
    deductibleOptions: [0],
    defaultLimit: 2000000,
    defaultDeductible: 0,
    unit: 'per_mille',
    baseRate: 1.8,
    deductibleApplies: false,
    waitingPeriodDays: null,
    exclusions: [
      'Exposures not scheduled on the underlying policy',
      'Professional services (see PI coverage)',
      'Employment practices claims',
    ],
    isRecommended: false,
    isActive: true,
    policiesEnrolled: 31_470,
    avgClaimCost: 54_700,
  },
  {
    id: 'cov_008',
    code: 'WCP-700',
    name: "Employer's Injury Benefit",
    category: 'injury',
    description:
      'Statutory workers compensation benefits: medical care, wage replacement, and permanent disability payments. Employer liability limit shown; medical benefits are uncapped by statute.',
    limitOptions: [500000, 1000000, 2000000],
    deductibleOptions: [0, 500, 1000, 2500],
    defaultLimit: 1000000,
    defaultDeductible: 500,
    unit: 'percent',
    baseRate: 1.94,
    deductibleApplies: true,
    waitingPeriodDays: 3,
    exclusions: [
      'Injuries arising from substance abuse',
      'Voluntary participation in off-duty activities',
      'Claims reported after the statutory bar period',
    ],
    isRecommended: true,
    isActive: true,
    policiesEnrolled: 18_930,
    avgClaimCost: 12_860,
  },
];


/* ========================================================================== */
/*  7. Claims — 20 records                                                    */
/* ========================================================================== */

const MOCK_CLAIMS_BASE: Omit<
  Claim,
  'claimNumber' | 'claimant' | 'lossType' | 'adjuster' | 'amountReserved' | 'dateOfLoss'
>[] = [
  {
    id: 'clm_001',
    number: 'IF-CLM-2026-3182',
    policyId: 'pol_001',
    policyNumber: 'IF-POL-2026-0001',
    customerId: 'cust_001',
    customerName: 'Amelia Thornton',
    lineOfBusiness: 'personal_auto',
    reportedAt: '2026-06-14T18:22:00.000Z',
    lossDate: '2026-06-13',
    lossLocation: 'Van Ness Ave & Fell St, San Francisco, CA',
    description:
      'Insured was rear-ended while stopped at a red light. Third party accepted fault at the scene; no injuries reported.',
    causeOfLoss: 'Rear-end collision',
    amountClaimed: 3420,
    amountApproved: 3420,
    amountPaid: 3420,
    reserveAmount: 0,
    status: 'paid',
    severity: 'low',
    priority: 'normal',
    adjusterId: 'adj_001',
    adjusterName: 'Renée Castellanos',
    fraudScore: 6,
    fraudStatus: 'cleared',
    deductible: 500,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 3420,
    subrogationPotential: 800,
    documentsRequired: ['Police report', 'Repair estimate'],
    documentsReceived: ['Police report', 'Repair estimate'],
    nextAction: 'None — file closed',
    nextActionDue: null,
    tags: ['auto', 'no-injury', 'subrogation'],
    createdAt: '2026-06-14T18:22:00.000Z',
    updatedAt: '2026-07-02T15:11:00.000Z',
  },
  {
    id: 'clm_002',
    number: 'IF-CLM-2026-3176',
    policyId: 'pol_002',
    policyNumber: 'IF-POL-2025-0148',
    customerId: 'cust_002',
    customerName: 'Bennett & Cole Logistics LLC',
    lineOfBusiness: 'commercial_auto',
    reportedAt: '2026-08-02T07:41:00.000Z',
    lossDate: '2026-08-01',
    lossLocation: 'I-15 near Primm, NV',
    description:
      'Tractor-trailer combination jackknifed in heavy rain. Tractor a total loss, trailer damaged, third-party cargo claim pending.',
    causeOfLoss: 'Jackknife / multi-vehicle',
    amountClaimed: 245000,
    amountApproved: null,
    amountPaid: 0,
    reserveAmount: 450000,
    status: 'investigating',
    severity: 'high',
    priority: 'urgent',
    adjusterId: 'adj_004',
    adjusterName: 'Grant McAllister',
    fraudScore: 22,
    fraudStatus: 'monitoring',
    deductible: 2500,
    deductibleMet: false,
    litigationId: null,
    settlementOffer: null,
    subrogationPotential: 120000,
    documentsRequired: [
      'Police report',
      'DOT incident report',
      'Telematics download',
      'Driver qualification file',
      'Third-party damage invoices',
    ],
    documentsReceived: ['Police report', 'DOT incident report'],
    nextAction: 'Obtain telematics download and driver logs',
    nextActionDue: '2026-09-29',
    tags: ['fleet', 'weather', 'total-loss'],
    createdAt: '2026-08-02T07:41:00.000Z',
    updatedAt: '2026-09-22T11:04:00.000Z',
  },
  {
    id: 'clm_003',
    number: 'IF-CLM-2026-3164',
    policyId: 'pol_008',
    policyNumber: 'IF-POL-2025-0666',
    customerId: 'cust_008',
    customerName: 'Cedar Grove Apartments LLC',
    lineOfBusiness: 'commercial_property',
    reportedAt: '2026-07-19T13:55:00.000Z',
    lossDate: '2026-07-17',
    lossLocation: 'Building C, 1140 Cedar Grove Rd, Portland, OR',
    description:
      'Supply line failed on the fourth floor, damaging 11 units and the lobby below. Mold remediation not yet scoped.',
    causeOfLoss: 'Water damage — supply line failure',
    amountClaimed: 61400,
    amountApproved: 58900,
    amountPaid: 30000,
    reserveAmount: 28900,
    status: 'partially_paid',
    severity: 'high',
    priority: 'high',
    adjusterId: 'adj_002',
    adjusterName: 'Tobias Lindgren',
    fraudScore: 34,
    fraudStatus: 'monitoring',
    deductible: 5000,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 58900,
    subrogationPotential: 22000,
    documentsRequired: [
      'Plumber failure report',
      'Unit-by-unit damage schedule',
      'Mitigation vendor invoice',
      'Proof of occupancy',
    ],
    documentsReceived: [
      'Plumber failure report',
      'Unit-by-unit damage schedule',
      'Mitigation vendor invoice',
    ],
    nextAction: 'Await mold remediation scope and final invoice',
    nextActionDue: '2026-10-06',
    tags: ['property', 'water', 'multi-unit'],
    createdAt: '2026-07-19T13:55:00.000Z',
    updatedAt: '2026-09-18T16:40:00.000Z',
  },
  {
    id: 'clm_004',
    number: 'IF-CLM-2026-3151',
    policyId: 'pol_005',
    policyNumber: 'IF-POL-2026-0063',
    customerId: 'cust_005',
    customerName: 'Nadia Farouk',
    lineOfBusiness: 'personal_auto',
    reportedAt: '2026-07-05T21:12:00.000Z',
    lossDate: '2026-07-04',
    lossLocation: '88th St & Aurora Ave N, Seattle, WA',
    description:
      'Insured struck a traffic island while avoiding a pedestrian. Front bumper, radiator, and headlight assembly damaged.',
    causeOfLoss: 'Single-vehicle impact',
    amountClaimed: 4370,
    amountApproved: 3870,
    amountPaid: 3870,
    reserveAmount: 0,
    status: 'paid',
    severity: 'medium',
    priority: 'normal',
    adjusterId: 'adj_001',
    adjusterName: 'Renée Castellanos',
    fraudScore: 41,
    fraudStatus: 'monitoring',
    deductible: 1000,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 3870,
    subrogationPotential: 0,
    documentsRequired: ['Repair estimate', 'Dashcam footage'],
    documentsReceived: ['Repair estimate'],
    nextAction: 'Close file once dashcam denial is documented',
    nextActionDue: '2026-09-30',
    tags: ['auto', 'at-fault'],
    createdAt: '2026-07-05T21:12:00.000Z',
    updatedAt: '2026-08-11T09:26:00.000Z',
  },
  {
    id: 'clm_005',
    number: 'IF-CLM-2026-3140',
    policyId: 'pol_004',
    policyNumber: 'IF-POL-2026-0057',
    customerId: 'cust_004',
    customerName: 'Harbor Point Dental Group',
    lineOfBusiness: 'general_liability',
    reportedAt: '2026-05-28T16:04:00.000Z',
    lossDate: '2026-05-26',
    lossLocation: 'Harbor Point Dental Group, Suite 210, Oakland, CA',
    description:
      'Patient slipped on a wet reception floor and reported wrist pain. Liability disputed — wet-floor signage log requested.',
    causeOfLoss: 'Premises liability — slip and fall',
    amountClaimed: 12500,
    amountApproved: null,
    amountPaid: 0,
    reserveAmount: 18000,
    status: 'awaiting_documents',
    severity: 'medium',
    priority: 'normal',
    adjusterId: 'adj_003',
    adjusterName: 'Aisha Bello',
    fraudScore: 57,
    fraudStatus: 'monitoring',
    deductible: 1000,
    deductibleMet: false,
    litigationId: null,
    settlementOffer: null,
    subrogationPotential: 0,
    documentsRequired: [
      'Incident report',
      'Cleaning schedule and signage log',
      'Surveillance footage',
      'Medical records authorization',
    ],
    documentsReceived: ['Incident report'],
    nextAction: 'Chase surveillance footage retention deadline (30 days)',
    nextActionDue: '2026-09-28',
    tags: ['liability', 'premises', 'medical'],
    createdAt: '2026-05-28T16:04:00.000Z',
    updatedAt: '2026-09-15T14:47:00.000Z',
  },
  {
    id: 'clm_006',
    number: 'IF-CLM-2026-3128',
    policyId: 'pol_006',
    policyNumber: 'IF-POL-2026-0071',
    customerId: 'cust_006',
    customerName: 'Summit Ridge Construction Inc.',
    lineOfBusiness: 'commercial_property',
    reportedAt: '2026-04-11T10:30:00.000Z',
    lossDate: '2026-04-09',
    lossLocation: 'Jobsite 42, Ridgeline Parkway, Sacramento, CA',
    description:
      'Straight-line winds tore off temporary roofing and destroyed stored lumber and formwork over a two-day event.',
    causeOfLoss: 'Windstorm',
    amountClaimed: 156000,
    amountApproved: 156000,
    amountPaid: 156000,
    reserveAmount: 0,
    status: 'paid',
    severity: 'high',
    priority: 'high',
    adjusterId: 'adj_002',
    adjusterName: 'Tobias Lindgren',
    fraudScore: 12,
    fraudStatus: 'cleared',
    deductible: 10000,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 156000,
    subrogationPotential: 0,
    documentsRequired: ['Weather event verification', 'Contractor invoices', 'Inventory schedule'],
    documentsReceived: ['Weather event verification', 'Contractor invoices', 'Inventory schedule'],
    nextAction: 'None — file closed',
    nextActionDue: null,
    tags: ['property', 'weather', 'large-loss'],
    createdAt: '2026-04-11T10:30:00.000Z',
    updatedAt: '2026-06-30T13:12:00.000Z',
  },
  {
    id: 'clm_007',
    number: 'IF-CLM-2026-3115',
    policyId: 'pol_010',
    policyNumber: 'IF-POL-2026-0096',
    customerId: 'cust_010',
    customerName: 'Quantum Layer Technologies Inc.',
    lineOfBusiness: 'cyber',
    reportedAt: '2026-07-11T04:18:00.000Z',
    lossDate: '2026-07-10',
    lossLocation: 'Cloud infrastructure — us-west-2',
    description:
      'Affiliate access used to deploy encrypting malware across file shares. Forensics, negotiation support, and business interruption invoked.',
    causeOfLoss: 'Ransomware / malicious code',
    amountClaimed: 640000,
    amountApproved: 640000,
    amountPaid: 410000,
    reserveAmount: 230000,
    status: 'partially_paid',
    severity: 'critical',
    priority: 'urgent',
    adjusterId: 'adj_007',
    adjusterName: 'Hannah Whitmore',
    fraudScore: 9,
    fraudStatus: 'cleared',
    deductible: 25000,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 640000,
    subrogationPotential: 75000,
    documentsRequired: [
      'Forensic report',
      'Extortion communication log',
      'Business interruption worksheet',
      'Notification letter samples',
      'Invoice backup for restoration costs',
    ],
    documentsReceived: [
      'Forensic report',
      'Extortion communication log',
      'Business interruption worksheet',
      'Notification letter samples',
    ],
    nextAction: 'Review restoration cost backup for final payment tranche',
    nextActionDue: '2026-10-02',
    tags: ['cyber', 'large-loss', 'bi'],
    createdAt: '2026-07-11T04:18:00.000Z',
    updatedAt: '2026-09-21T18:33:00.000Z',
  },
  {
    id: 'clm_008',
    number: 'IF-CLM-2026-3102',
    policyId: 'pol_011',
    policyNumber: 'IF-POL-2026-0112',
    customerId: 'cust_011',
    customerName: 'Marcus Oyelaran',
    lineOfBusiness: 'workers_compensation',
    reportedAt: '2026-08-14T15:47:00.000Z',
    lossDate: '2026-08-12',
    lossLocation: 'Job site — 7 Rue Argent, Baton Rouge, LA',
    description:
      'Carpenter sustained a lumbar strain while lifting engineered trusses. Light duty offered; physical therapy authorized.',
    causeOfLoss: 'Strain / lifting injury',
    amountClaimed: 27400,
    amountApproved: null,
    amountPaid: 6200,
    reserveAmount: 21200,
    status: 'investigating',
    severity: 'medium',
    priority: 'normal',
    adjusterId: 'adj_006',
    adjusterName: 'Dominic Reyes',
    fraudScore: 31,
    fraudStatus: 'monitoring',
    deductible: 500,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: null,
    subrogationPotential: 0,
    documentsRequired: [
      'First report of injury',
      'Medical evaluation',
      'Wage statements (4 quarters)',
      'Return-to-work offer',
    ],
    documentsReceived: ['First report of injury', 'Medical evaluation'],
    nextAction: 'Collect wage statements for indemnity calculation',
    nextActionDue: '2026-10-01',
    tags: ['workers-comp', 'medical', 'light-duty'],
    createdAt: '2026-08-14T15:47:00.000Z',
    updatedAt: '2026-09-17T10:22:00.000Z',
  },
  {
    id: 'clm_009',
    number: 'IF-CLM-2026-3090',
    policyId: 'pol_013',
    policyNumber: 'IF-POL-2026-0044',
    customerId: 'cust_013',
    customerName: 'Camille Boudreaux',
    lineOfBusiness: 'homeowners',
    reportedAt: '2026-04-27T19:02:00.000Z',
    lossDate: '2026-04-25',
    lossLocation: '412 Magnolia Lane, Mobile, AL',
    description:
      'Water heater failed overnight and damaged flooring in the utility room and adjacent hallway.',
    causeOfLoss: 'Water heater rupture',
    amountClaimed: 4120,
    amountApproved: 3120,
    amountPaid: 3120,
    reserveAmount: 0,
    status: 'paid',
    severity: 'low',
    priority: 'normal',
    adjusterId: 'adj_002',
    adjusterName: 'Tobias Lindgren',
    fraudScore: 4,
    fraudStatus: 'cleared',
    deductible: 1000,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 3120,
    subrogationPotential: 950,
    documentsRequired: ['Plumber invoice', 'Flooring estimate'],
    documentsReceived: ['Plumber invoice', 'Flooring estimate'],
    nextAction: 'None — file closed',
    nextActionDue: null,
    tags: ['property', 'water'],
    createdAt: '2026-04-27T19:02:00.000Z',
    updatedAt: '2026-05-30T12:04:00.000Z',
  },
  {
    id: 'clm_010',
    number: 'IF-CLM-2026-3077',
    policyId: 'pol_014',
    policyNumber: 'IF-POL-2026-0015',
    customerId: 'cust_014',
    customerName: 'Trident Marine Freight Co.',
    lineOfBusiness: 'marine',
    reportedAt: '2026-03-08T06:55:00.000Z',
    lossDate: '2026-03-05',
    lossLocation: 'Reefer container MSCU-7742113, Port of Long Beach, CA',
    description:
      'Reefer unit compressor failure during transit spoiled 18 pallets of frozen seafood. Surveyor confirmed total constructive loss.',
    causeOfLoss: 'Refrigeration failure — cargo spoilage',
    amountClaimed: 310000,
    amountApproved: 310000,
    amountPaid: 310000,
    reserveAmount: 0,
    status: 'paid',
    severity: 'high',
    priority: 'high',
    adjusterId: 'adj_004',
    adjusterName: 'Grant McAllister',
    fraudScore: 18,
    fraudStatus: 'cleared',
    deductible: 25000,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 310000,
    subrogationPotential: 95000,
    documentsRequired: ['Surveyor report', 'Temperature log', 'Bill of lading', 'Commercial invoice'],
    documentsReceived: ['Surveyor report', 'Temperature log', 'Bill of lading', 'Commercial invoice'],
    nextAction: 'Pursue subrogation against the reefer lessor',
    nextActionDue: '2026-11-15',
    tags: ['marine', 'cargo', 'subrogation'],
    createdAt: '2026-03-08T06:55:00.000Z',
    updatedAt: '2026-05-19T15:41:00.000Z',
  },
  {
    id: 'clm_011',
    number: 'IF-CLM-2026-3065',
    policyId: 'pol_002',
    policyNumber: 'IF-POL-2025-0148',
    customerId: 'cust_002',
    customerName: 'Bennett & Cole Logistics LLC',
    lineOfBusiness: 'commercial_auto',
    reportedAt: '2026-02-17T14:33:00.000Z',
    lossDate: '2026-02-16',
    lossLocation: 'Dock 7, 2200 Export Blvd, Houston, TX',
    description:
      'Yard tractor clipped a parked trailer while maneuvering in the distribution yard. Minor panel and light damage.',
    causeOfLoss: 'Low-speed impact in yard',
    amountClaimed: 12800,
    amountApproved: 12800,
    amountPaid: 12800,
    reserveAmount: 0,
    status: 'paid',
    severity: 'low',
    priority: 'low',
    adjusterId: 'adj_004',
    adjusterName: 'Grant McAllister',
    fraudScore: 8,
    fraudStatus: 'cleared',
    deductible: 2500,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 12800,
    subrogationPotential: 0,
    documentsRequired: ['Damage photos', 'Repair invoice'],
    documentsReceived: ['Damage photos', 'Repair invoice'],
    nextAction: 'None — file closed',
    nextActionDue: null,
    tags: ['fleet', 'yard'],
    createdAt: '2026-02-17T14:33:00.000Z',
    updatedAt: '2026-03-24T11:18:00.000Z',
  },
  {
    id: 'clm_012',
    number: 'IF-CLM-2026-3051',
    policyId: 'pol_008',
    policyNumber: 'IF-POL-2025-0666',
    customerId: 'cust_008',
    customerName: 'Cedar Grove Apartments LLC',
    lineOfBusiness: 'commercial_property',
    reportedAt: '2026-01-24T22:40:00.000Z',
    lossDate: '2026-01-22',
    lossLocation: 'Building A elevator, 1140 Cedar Grove Rd, Portland, OR',
    description:
      'Tenant injured when the elevator lurched between floors. Claimant alleges negligent maintenance and consequential damages.',
    causeOfLoss: 'Elevator malfunction — bodily injury',
    amountClaimed: 270000,
    amountApproved: null,
    amountPaid: 15000,
    reserveAmount: 255000,
    status: 'litigation',
    severity: 'critical',
    priority: 'urgent',
    adjusterId: 'adj_003',
    adjusterName: 'Aisha Bello',
    fraudScore: 46,
    fraudStatus: 'monitoring',
    deductible: 5000,
    deductibleMet: true,
    litigationId: 'lit_001',
    settlementOffer: 145000,
    subrogationPotential: 60000,
    documentsRequired: [
      'Complaint and civil cover sheet',
      'Maintenance contract',
      'Elevator inspection certificates',
      'Claimant medical records',
      'Surveillance review memo',
    ],
    documentsReceived: [
      'Complaint and civil cover sheet',
      'Maintenance contract',
      'Elevator inspection certificates',
    ],
    nextAction: 'Mediation prep — exchange of medicals due',
    nextActionDue: '2026-10-14',
    tags: ['litigation', 'bodily-injury', 'escalated'],
    createdAt: '2026-01-24T22:40:00.000Z',
    updatedAt: '2026-09-23T09:52:00.000Z',
  },
  {
    id: 'clm_013',
    number: 'IF-CLM-2026-3040',
    policyId: 'pol_005',
    policyNumber: 'IF-POL-2026-0063',
    customerId: 'cust_005',
    customerName: 'Nadia Farouk',
    lineOfBusiness: 'personal_auto',
    reportedAt: '2025-12-19T03:11:00.000Z',
    lossDate: '2025-12-17',
    lossLocation: 'Underground garage, 500 Pine St, Seattle, WA',
    description:
      'Vehicle reported stolen from a secured garage. Investigation found the keys were with a third party who had prior access.',
    causeOfLoss: 'Theft — questioned circumstances',
    amountClaimed: 18500,
    amountApproved: 0,
    amountPaid: 0,
    reserveAmount: 0,
    status: 'denied',
    severity: 'high',
    priority: 'high',
    adjusterId: 'adj_005',
    adjusterName: 'Priyanka Nair',
    fraudScore: 78,
    fraudStatus: 'suspected',
    deductible: 1000,
    deductibleMet: false,
    litigationId: null,
    settlementOffer: 0,
    subrogationPotential: 0,
    documentsRequired: ['Police report', 'Key custody affidavit', 'Garage access logs'],
    documentsReceived: ['Police report', 'Garage access logs'],
    nextAction: 'Refer to SIU — recorded statement inconsistencies',
    nextActionDue: '2026-10-05',
    tags: ['auto', 'theft', 'siu'],
    createdAt: '2025-12-19T03:11:00.000Z',
    updatedAt: '2026-08-30T17:26:00.000Z',
  },
  {
    id: 'clm_014',
    number: 'IF-CLM-2026-3026',
    policyId: 'pol_003',
    policyNumber: 'IF-POL-2025-0219',
    customerId: 'cust_003',
    customerName: 'Rowan Delacroix',
    lineOfBusiness: 'homeowners',
    reportedAt: '2025-11-30T20:15:00.000Z',
    lossDate: '2025-11-28',
    lossLocation: '412 Magnolia Lane annex, Mobile, AL',
    description:
      'Oak limb fell through the carport roof during a storm, damaging the structure and a parked vehicle.',
    causeOfLoss: 'Falling object — wind-driven limb',
    amountClaimed: 8700,
    amountApproved: 8700,
    amountPaid: 8700,
    reserveAmount: 0,
    status: 'paid',
    severity: 'medium',
    priority: 'normal',
    adjusterId: 'adj_002',
    adjusterName: 'Tobias Lindgren',
    fraudScore: 7,
    fraudStatus: 'cleared',
    deductible: 1500,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 8700,
    subrogationPotential: 0,
    documentsRequired: ['Arborist report', 'Contractor estimate'],
    documentsReceived: ['Arborist report', 'Contractor estimate'],
    nextAction: 'None — file closed',
    nextActionDue: null,
    tags: ['property', 'storm'],
    createdAt: '2025-11-30T20:15:00.000Z',
    updatedAt: '2026-01-22T14:09:00.000Z',
  },
  {
    id: 'clm_015',
    number: 'IF-CLM-2026-3014',
    policyId: 'pol_009',
    policyNumber: 'IF-POL-2026-0088',
    customerId: 'cust_009',
    customerName: 'Harper Lindqvist',
    lineOfBusiness: 'personal_auto',
    reportedAt: '2025-11-06T12:44:00.000Z',
    lossDate: '2025-11-05',
    lossLocation: 'Parking structure, 900 Market St, San Francisco, CA',
    description:
      'Windshield chipped by road debris on the Bay Bridge; repair completed through the glass network.',
    causeOfLoss: 'Glass — road debris',
    amountClaimed: 420,
    amountApproved: 420,
    amountPaid: 420,
    reserveAmount: 0,
    status: 'paid',
    severity: 'low',
    priority: 'low',
    adjusterId: 'adj_001',
    adjusterName: 'Renée Castellanos',
    fraudScore: 3,
    fraudStatus: 'cleared',
    deductible: 0,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 420,
    subrogationPotential: 0,
    documentsRequired: ['Glass repair invoice'],
    documentsReceived: ['Glass repair invoice'],
    nextAction: 'None — file closed',
    nextActionDue: null,
    tags: ['auto', 'glass'],
    createdAt: '2025-11-06T12:44:00.000Z',
    updatedAt: '2025-11-08T08:31:00.000Z',
  },
  {
    id: 'clm_016',
    number: 'IF-CLM-2026-3001',
    policyId: 'pol_016',
    policyNumber: 'IF-POL-2025-0810',
    customerId: 'cust_002',
    customerName: 'Bennett & Cole Logistics LLC',
    lineOfBusiness: 'commercial_auto',
    reportedAt: '2025-10-21T09:26:00.000Z',
    lossDate: '2025-10-19',
    lossLocation: 'US-101 near Gilroy, CA',
    description:
      'Unit 41 sideswiped a barrier during a lane change. Driver reported no injury; vehicle out of service four days.',
    causeOfLoss: 'Sideswipe / barrier contact',
    amountClaimed: 18200,
    amountApproved: 18200,
    amountPaid: 18200,
    reserveAmount: 0,
    status: 'paid',
    severity: 'medium',
    priority: 'normal',
    adjusterId: 'adj_004',
    adjusterName: 'Grant McAllister',
    fraudScore: 11,
    fraudStatus: 'cleared',
    deductible: 5000,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 18200,
    subrogationPotential: 0,
    documentsRequired: ['Repair estimate', 'Tow invoice'],
    documentsReceived: ['Repair estimate', 'Tow invoice'],
    nextAction: 'None — file closed',
    nextActionDue: null,
    tags: ['fleet', 'superseded-policy'],
    createdAt: '2025-10-21T09:26:00.000Z',
    updatedAt: '2025-12-02T16:55:00.000Z',
  },
  {
    id: 'clm_017',
    number: 'IF-CLM-2026-2988',
    policyId: 'pol_012',
    policyNumber: 'IF-POL-2025-0555',
    customerId: 'cust_012',
    customerName: 'Willowbrook Veterinary Clinic',
    lineOfBusiness: 'general_liability',
    reportedAt: '2025-10-09T17:38:00.000Z',
    lossDate: '2025-10-07',
    lossLocation: 'Willowbrook Veterinary Clinic, Austin, TX',
    description:
      'Client was bitten by a kennelled dog in the waiting area; stitches required and infection follow-up claimed.',
    causeOfLoss: 'Animal bite — third party',
    amountClaimed: 6300,
    amountApproved: 6300,
    amountPaid: 6300,
    reserveAmount: 0,
    status: 'paid',
    severity: 'medium',
    priority: 'normal',
    adjusterId: 'adj_003',
    adjusterName: 'Aisha Bello',
    fraudScore: 27,
    fraudStatus: 'cleared',
    deductible: 1000,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 6300,
    subrogationPotential: 0,
    documentsRequired: ['Medical bill', 'Kennel protocol'],
    documentsReceived: ['Medical bill', 'Kennel protocol'],
    nextAction: 'None — file closed',
    nextActionDue: null,
    tags: ['liability', 'animal'],
    createdAt: '2025-10-09T17:38:00.000Z',
    updatedAt: '2025-11-14T10:07:00.000Z',
  },
  {
    id: 'clm_018',
    number: 'IF-CLM-2026-2974',
    policyId: 'pol_002',
    policyNumber: 'IF-POL-2025-0148',
    customerId: 'cust_002',
    customerName: 'Bennett & Cole Logistics LLC',
    lineOfBusiness: 'commercial_auto',
    reportedAt: '2025-09-27T08:12:00.000Z',
    lossDate: '2025-09-25',
    lossLocation: 'Distribution yard, Phoenix, AZ',
    description:
      'Unattended trailer struck by a backing forklift; rear doors and threshold plate replaced.',
    causeOfLoss: 'Loading yard impact',
    amountClaimed: 3900,
    amountApproved: 3900,
    amountPaid: 3900,
    reserveAmount: 0,
    status: 'paid',
    severity: 'low',
    priority: 'low',
    adjusterId: 'adj_004',
    adjusterName: 'Grant McAllister',
    fraudScore: 14,
    fraudStatus: 'cleared',
    deductible: 2500,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 3900,
    subrogationPotential: 0,
    documentsRequired: ['Repair invoice'],
    documentsReceived: ['Repair invoice'],
    nextAction: 'None — file closed',
    nextActionDue: null,
    tags: ['fleet', 'yard'],
    createdAt: '2025-09-27T08:12:00.000Z',
    updatedAt: '2025-10-15T13:48:00.000Z',
  },
  {
    id: 'clm_019',
    number: 'IF-CLM-2026-2961',
    policyId: 'pol_016',
    policyNumber: 'IF-POL-2025-0810',
    customerId: 'cust_002',
    customerName: 'Bennett & Cole Logistics LLC',
    lineOfBusiness: 'commercial_auto',
    reportedAt: '2025-08-30T11:19:00.000Z',
    lossDate: '2025-08-28',
    lossLocation: 'Mile marker 61, I-10 East, El Paso, TX',
    description:
      'Trailer tire debris from a lead vehicle punctured the fuel tank and fairing on unit 27.',
    causeOfLoss: 'Road debris impact',
    amountClaimed: 15600,
    amountApproved: 15600,
    amountPaid: 15600,
    reserveAmount: 0,
    status: 'paid',
    severity: 'medium',
    priority: 'normal',
    adjusterId: 'adj_004',
    adjusterName: 'Grant McAllister',
    fraudScore: 16,
    fraudStatus: 'cleared',
    deductible: 5000,
    deductibleMet: true,
    litigationId: null,
    settlementOffer: 15600,
    subrogationPotential: 4200,
    documentsRequired: ['Repair invoice', 'Dashcam clip'],
    documentsReceived: ['Repair invoice', 'Dashcam clip'],
    nextAction: 'None — file closed',
    nextActionDue: null,
    tags: ['fleet', 'subrogation'],
    createdAt: '2025-08-30T11:19:00.000Z',
    updatedAt: '2025-10-01T09:37:00.000Z',
  },
  {
    id: 'clm_020',
    number: 'IF-CLM-2026-2947',
    policyId: 'pol_017',
    policyNumber: 'IF-POL-2026-0162',
    customerId: 'cust_006',
    customerName: 'Summit Ridge Construction Inc.',
    lineOfBusiness: 'general_liability',
    reportedAt: '2025-08-14T16:50:00.000Z',
    lossDate: '2025-08-11',
    lossLocation: 'Ridgeline Parkway jobsite, Sacramento, CA',
    description:
      'Subcontractor alleged property damage to a neighboring lot from material staging. Coverage later contested after non-payment lapse.',
    causeOfLoss: 'Third-party property damage',
    amountClaimed: 12400,
    amountApproved: null,
    amountPaid: 0,
    reserveAmount: 12400,
    status: 'reopened',
    severity: 'medium',
    priority: 'high',
    adjusterId: 'adj_004',
    adjusterName: 'Grant McAllister',
    fraudScore: 52,
    fraudStatus: 'monitoring',
    deductible: 5000,
    deductibleMet: false,
    litigationId: null,
    settlementOffer: null,
    subrogationPotential: 0,
    documentsRequired: [
      'Demand letter',
      'Neighboring lot survey',
      'Staging plan approval',
      'Coverage position letter',
    ],
    documentsReceived: ['Demand letter'],
    nextAction: 'Confirm coverage position given the 2026-09-05 lapse',
    nextActionDue: '2026-09-30',
    tags: ['liability', 'coverage-question', 'reopened'],
    createdAt: '2025-08-14T16:50:00.000Z',
    updatedAt: '2026-09-12T10:15:00.000Z',
  },
];


/* ========================================================================== */
/*  8. Adjusters — 8 records                                                  */
/* ========================================================================== */

const MOCK_ADJUSTERS_BASE: Omit<Adjuster, 'capacity' | 'avgCycleTime' | 'settlementRate' | 'rating'>[] = [
  {
    id: 'adj_001',
    name: 'Renée Castellanos',
    email: 'renee.castellanos@insureflow.dev',
    phone: '+1 (415) 555-0211',
    specialty: 'auto',
    licenseNumber: 'CA-ADJ-77214',
    licenseState: 'CA',
    licenseExpiry: '2027-04-30',
    region: 'West',
    seniority: 'senior',
    caseload: 42,
    openClaims: 31,
    closedClaims: 284,
    pendingReview: 4,
    avgCycleTimeDays: 11.4,
    closureRate: 0.94,
    satisfactionScore: 4.7,
    totalResolvedValue: 4_820_000,
    fraudCatches: 9,
    status: 'available',
    joinedAt: '2019-03-11',
    lastActiveAt: '2026-09-25T16:41:00.000Z',
    languages: ['English', 'Spanish'],
    certifications: ['CLA', 'Senior Auto Specialist'],
    supervisorId: 'adj_003',
  },
  {
    id: 'adj_002',
    name: 'Tobias Lindgren',
    email: 'tobias.lindgren@insureflow.dev',
    phone: '+1 (503) 555-0177',
    specialty: 'property',
    licenseNumber: 'OR-ADJ-40928',
    licenseState: 'OR',
    licenseExpiry: '2026-11-30',
    region: 'Pacific Northwest',
    seniority: 'senior',
    caseload: 38,
    openClaims: 27,
    closedClaims: 341,
    pendingReview: 6,
    avgCycleTimeDays: 13.2,
    closureRate: 0.91,
    satisfactionScore: 4.5,
    totalResolvedValue: 12_450_000,
    fraudCatches: 6,
    status: 'available',
    joinedAt: '2017-08-21',
    lastActiveAt: '2026-09-25T14:08:00.000Z',
    languages: ['English', 'Swedish'],
    certifications: ['CLA', 'Property Specialist', 'Xactimate Level 3'],
    supervisorId: 'adj_003',
  },
  {
    id: 'adj_003',
    name: 'Aisha Bello',
    email: 'aisha.bello@insureflow.dev',
    phone: '+1 (202) 555-0149',
    specialty: 'bodily_injury',
    licenseNumber: 'DC-ADJ-11873',
    licenseState: 'DC',
    licenseExpiry: '2028-01-15',
    region: 'Mid-Atlantic',
    seniority: 'lead',
    caseload: 29,
    openClaims: 22,
    closedClaims: 412,
    pendingReview: 3,
    avgCycleTimeDays: 18.7,
    closureRate: 0.96,
    satisfactionScore: 4.8,
    totalResolvedValue: 21_930_000,
    fraudCatches: 17,
    status: 'available',
    joinedAt: '2014-06-02',
    lastActiveAt: '2026-09-25T17:22:00.000Z',
    languages: ['English', 'French', 'Yoruba'],
    certifications: ['CLA', 'SCLA', 'Mediation Certificate'],
    supervisorId: null,
  },
  {
    id: 'adj_004',
    name: 'Grant McAllister',
    email: 'grant.mcallister@insureflow.dev',
    phone: '+1 (312) 555-0193',
    specialty: 'commercial',
    licenseNumber: 'IL-ADJ-55401',
    licenseState: 'IL',
    licenseExpiry: '2027-07-31',
    region: 'Midwest',
    seniority: 'senior',
    caseload: 47,
    openClaims: 35,
    closedClaims: 268,
    pendingReview: 8,
    avgCycleTimeDays: 15.9,
    closureRate: 0.89,
    satisfactionScore: 4.4,
    totalResolvedValue: 18_640_000,
    fraudCatches: 11,
    status: 'at_capacity',
    joinedAt: '2018-11-05',
    lastActiveAt: '2026-09-24T19:03:00.000Z',
    languages: ['English'],
    certifications: ['CLA', 'Commercial Lines Specialist'],
    supervisorId: 'adj_003',
  },
  {
    id: 'adj_005',
    name: 'Priyanka Nair',
    email: 'priyanka.nair@insureflow.dev',
    phone: '+1 (646) 555-0134',
    specialty: 'fraud',
    licenseNumber: 'NY-SIU-20187',
    licenseState: 'NY',
    licenseExpiry: '2027-02-28',
    region: 'National',
    seniority: 'lead',
    caseload: 21,
    openClaims: 16,
    closedClaims: 158,
    pendingReview: 2,
    avgCycleTimeDays: 24.5,
    closureRate: 0.97,
    satisfactionScore: 4.9,
    totalResolvedValue: 9_470_000,
    fraudCatches: 46,
    status: 'available',
    joinedAt: '2020-01-27',
    lastActiveAt: '2026-09-25T12:56:00.000Z',
    languages: ['English', 'Hindi', 'Malayalam'],
    certifications: ['AFIF', 'Certified Fraud Examiner (in progress)'],
    supervisorId: null,
  },
  {
    id: 'adj_006',
    name: 'Dominic Reyes',
    email: 'dominic.reyes@insureflow.dev',
    phone: '+1 (602) 555-0166',
    specialty: 'workers_comp',
    licenseNumber: 'AZ-ADJ-88042',
    licenseState: 'AZ',
    licenseExpiry: '2026-12-31',
    region: 'Southwest',
    seniority: 'junior',
    caseload: 26,
    openClaims: 24,
    closedClaims: 63,
    pendingReview: 9,
    avgCycleTimeDays: 21.3,
    closureRate: 0.78,
    satisfactionScore: 4.1,
    totalResolvedValue: 1_960_000,
    fraudCatches: 3,
    status: 'training',
    joinedAt: '2025-07-14',
    lastActiveAt: '2026-09-25T15:30:00.000Z',
    languages: ['English', 'Spanish'],
    certifications: ['AZ Adjuster Apprentice'],
    supervisorId: 'adj_003',
  },
  {
    id: 'adj_007',
    name: 'Hannah Whitmore',
    email: 'hannah.whitmore@insureflow.dev',
    phone: '+1 (206) 555-0125',
    specialty: 'cyber',
    licenseNumber: 'WA-ADJ-33917',
    licenseState: 'WA',
    licenseExpiry: '2028-05-31',
    region: 'National',
    seniority: 'senior',
    caseload: 18,
    openClaims: 13,
    closedClaims: 97,
    pendingReview: 1,
    avgCycleTimeDays: 16.8,
    closureRate: 0.93,
    satisfactionScore: 4.6,
    totalResolvedValue: 14_280_000,
    fraudCatches: 5,
    status: 'available',
    joinedAt: '2021-09-06',
    lastActiveAt: '2026-09-25T18:47:00.000Z',
    languages: ['English', 'German'],
    certifications: ['CLA', 'GIAC GCFE', 'Breach Response Lead'],
    supervisorId: 'adj_003',
  },
  {
    id: 'adj_008',
    name: 'Samuel Achebe',
    email: 'samuel.achebe@insureflow.dev',
    phone: '+1 (404) 555-0188',
    specialty: 'subrogation',
    licenseNumber: 'GA-ADJ-66350',
    licenseState: 'GA',
    licenseExpiry: '2027-09-30',
    region: 'Southeast',
    seniority: 'junior',
    caseload: 23,
    openClaims: 19,
    closedClaims: 71,
    pendingReview: 5,
    avgCycleTimeDays: 19.6,
    closureRate: 0.82,
    satisfactionScore: 4.2,
    totalResolvedValue: 2_340_000,
    fraudCatches: 4,
    status: 'on_leave',
    joinedAt: '2024-04-15',
    lastActiveAt: '2026-09-18T13:14:00.000Z',
    languages: ['English', 'Igbo'],
    certifications: ['CLA', 'Subrogation Fundamentals'],
    supervisorId: 'adj_004',
  },
];

/* ========================================================================== */
/*  9. Litigation matters — 6 records                                         */
/* ========================================================================== */

const MOCK_LITIGATION_BASE: Omit<
  LitigationMatter,
  'caseNumber' | 'defendant' | 'counsel' | 'nextHearing' | 'amountAtStake' | 'filingDate' | 'venue' | 'owner' | 'notes'
>[] = [
  {
    id: 'lit_001',
    matterNumber: 'IF-MAT-2026-0042',
    claimId: 'clm_012',
    claimNumber: 'IF-CLM-2026-3051',
    policyNumber: 'IF-POL-2025-0666',
    claimantName: 'Denise Kowalczyk',
    court: 'Multnomah County Circuit Court',
    jurisdiction: 'OR',
    filedAt: '2026-04-08',
    nextHearingAt: '2026-11-12T14:00:00.000Z',
    trialDate: '2027-02-08',
    status: 'mediation',
    matterType: 'bodily_injury',
    amountClaimed: 270000,
    amountReserved: 255000,
    amountSettled: null,
    defenseCounsel: 'Marguerite Halloran',
    counselFirm: 'Halloran & Voss LLP',
    hourlyRate: 415,
    legalSpendToDate: 68400,
    liabilityAssessment: 'mixed',
    probabilityOfLoss: 0.45,
    statusNotes:
      'Maintenance logs are incomplete for two months; mediation scheduled before discovery closes.',
    assignedTo: 'Aisha Bello',
  },
  {
    id: 'lit_002',
    matterNumber: 'IF-MAT-2026-0038',
    claimId: 'clm_2025_0488',
    claimNumber: 'IF-CLM-2025-0488',
    policyNumber: 'IF-POL-2025-0148',
    claimantName: 'Ortega Family Trust',
    court: 'Superior Court of California, County of Fresno',
    jurisdiction: 'CA',
    filedAt: '2026-02-19',
    nextHearingAt: '2026-10-27T09:30:00.000Z',
    trialDate: '2027-04-19',
    status: 'discovery',
    matterType: 'bodily_injury',
    amountClaimed: 1450000,
    amountReserved: 900000,
    amountSettled: null,
    defenseCounsel: 'Peter Osgood',
    counselFirm: 'Osgood Trial Group',
    hourlyRate: 520,
    legalSpendToDate: 214600,
    liabilityAssessment: 'exposed',
    probabilityOfLoss: 0.68,
    statusNotes:
      'Dash placement testimony favors claimant. Mediation demand of $1.1M served 2026-09-02.',
    assignedTo: 'Grant McAllister',
  },
  {
    id: 'lit_003',
    matterNumber: 'IF-MAT-2025-0117',
    claimId: 'clm_2025_0341',
    claimNumber: 'IF-CLM-2025-0341',
    policyNumber: 'IF-POL-2025-0666',
    claimantName: 'Vernon Haskins',
    court: 'Clark County District Court',
    jurisdiction: 'NV',
    filedAt: '2025-09-30',
    nextHearingAt: null,
    trialDate: null,
    status: 'settled',
    matterType: 'property',
    amountClaimed: 168000,
    amountReserved: 140000,
    amountSettled: 132500,
    defenseCounsel: 'Ilana Breck',
    counselFirm: 'Breck Defense PLC',
    hourlyRate: 365,
    legalSpendToDate: 41200,
    liabilityAssessment: 'mixed',
    probabilityOfLoss: 0.5,
    statusNotes:
      'Settled at mediation with structured payments over 24 months. Released 2026-06-14.',
    assignedTo: 'Tobias Lindgren',
  },
  {
    id: 'lit_004',
    matterNumber: 'IF-MAT-2026-0051',
    claimId: 'clm_2026_0712',
    claimNumber: 'IF-CLM-2026-0712',
    policyNumber: 'IF-POL-2026-0044',
    claimantName: 'Winnifred Castellano',
    court: 'Cook County Circuit Court',
    jurisdiction: 'IL',
    filedAt: '2026-07-22',
    nextHearingAt: '2026-12-03T11:00:00.000Z',
    trialDate: null,
    status: 'filed',
    matterType: 'coverage_dispute',
    amountClaimed: 96000,
    amountReserved: 88000,
    amountSettled: null,
    defenseCounsel: 'Nathan Kirby',
    counselFirm: 'Kirby Coverage Counsel',
    hourlyRate: 395,
    legalSpendToDate: 12800,
    liabilityAssessment: 'strong_defense',
    probabilityOfLoss: 0.2,
    statusNotes:
      'Claimant asserts late-renewal coverage; reservation of rights issued 2026-08-05.',
    assignedTo: 'Aisha Bello',
  },
  {
    id: 'lit_005',
    matterNumber: 'IF-MAT-2026-0029',
    claimId: 'clm_2025_0502',
    claimNumber: 'IF-CLM-2025-0502',
    policyNumber: 'IF-POL-2026-0015',
    claimantName: 'Meridian Cold Chain Ltd.',
    court: 'United States District Court, S.D. Texas',
    jurisdiction: 'TX',
    filedAt: '2026-01-14',
    nextHearingAt: '2026-10-30T10:00:00.000Z',
    trialDate: '2027-06-07',
    status: 'trial',
    matterType: 'subrogation',
    amountClaimed: 640000,
    amountReserved: 310000,
    amountSettled: null,
    defenseCounsel: 'Roland Ainsley',
    counselFirm: 'Ainsley Maritime Law',
    hourlyRate: 480,
    legalSpendToDate: 176900,
    liabilityAssessment: 'mixed',
    probabilityOfLoss: 0.4,
    statusNotes:
      'Affirmative recovery action against the reefer lessor. Trial setting conference 2026-10-30.',
    assignedTo: 'Grant McAllister',
  },
  {
    id: 'lit_006',
    matterNumber: 'IF-MAT-2025-0094',
    claimId: 'clm_2024_0119',
    claimNumber: 'IF-CLM-2024-0119',
    policyNumber: 'IF-POL-2024-0412',
    claimantName: 'Delacroix Holdings LLC',
    court: 'Louisiana 14th Judicial District Court',
    jurisdiction: 'LA',
    filedAt: '2025-04-03',
    nextHearingAt: '2027-01-19T13:30:00.000Z',
    trialDate: null,
    status: 'appeal',
    matterType: 'bad_faith',
    amountClaimed: 780000,
    amountReserved: 250000,
    amountSettled: null,
    defenseCounsel: 'Charlene Boudreaux',
    counselFirm: 'Boudreaux Appellate',
    hourlyRate: 445,
    legalSpendToDate: 298400,
    liabilityAssessment: 'exposed',
    probabilityOfLoss: 0.55,
    statusNotes:
      'Plaintiff appeal of summary judgment on the extra-contractual count; briefing completes 2026-11-20.',
    assignedTo: 'Priyanka Nair',
  },
];

/* ========================================================================== */
/*  10. Customers — 15 records                                                */
/* ========================================================================== */

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust_001',
    customerId: 'CUST-0001',
    name: 'Amelia Thornton',
    type: 'individual',
    email: 'amelia.thornton@example.com',
    phone: '+1 (415) 555-0301',
    dateOfBirth: '1988-06-14',
    address: {
      line1: '1480 Fell Street',
      line2: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94117',
      country: 'United States',
    },
    since: '2019-05-02',
    status: 'active',
    policies: 2,
    activePolicies: 2,
    lifetimeValue: 14820,
    annualPremium: 4980,
    totalPaid: 13960,
    outstandingBalance: 0,
    riskProfile: 'preferred',
    riskScore: 24,
    claimsCount: 1,
    claimsTotal: 3420,
    paymentMethod: 'card',
    autoPay: true,
    paperless: true,
    churnRisk: 8,
    satisfactionScore: 4.8,
    segment: 'gold',
    preferredContact: 'email',
    agentId: 'agnt_001',
    agentName: 'Marcus Bellweather',
    tags: ['multi-policy', 'autopay', 'referral'],
    lastContactAt: '2026-09-12T10:24:00.000Z',
  },
  {
    id: 'cust_002',
    customerId: 'CUST-0002',
    name: 'Bennett & Cole Logistics LLC',
    type: 'small_business',
    email: 'risk@bennettcole.example.com',
    phone: '+1 (713) 555-0402',
    dateOfBirth: null,
    address: {
      line1: '2200 Export Boulevard',
      line2: 'Suite 900',
      city: 'Houston',
      state: 'TX',
      postalCode: '77032',
      country: 'United States',
    },
    since: '2021-11-18',
    status: 'active',
    policies: 2,
    activePolicies: 1,
    lifetimeValue: 186400,
    annualPremium: 54550,
    totalPaid: 172300,
    outstandingBalance: 0,
    riskProfile: 'elevated',
    riskScore: 58,
    claimsCount: 5,
    claimsTotal: 75000,
    paymentMethod: 'ach',
    autoPay: true,
    paperless: true,
    churnRisk: 22,
    satisfactionScore: 4.3,
    segment: 'platinum',
    preferredContact: 'phone',
    agentId: 'agnt_002',
    agentName: 'Priya Raghunathan',
    tags: ['fleet', 'high-frequency', 'telematics'],
    lastContactAt: '2026-09-23T14:05:00.000Z',
  },
  {
    id: 'cust_003',
    customerId: 'CUST-0003',
    name: 'Rowan Delacroix',
    type: 'individual',
    email: 'rowan.delacroix@example.com',
    phone: '+1 (251) 555-0503',
    dateOfBirth: '1975-01-29',
    address: {
      line1: '412 Magnolia Lane',
      line2: '',
      city: 'Mobile',
      state: 'AL',
      postalCode: '36604',
      country: 'United States',
    },
    since: '2016-08-30',
    status: 'active',
    policies: 1,
    activePolicies: 1,
    lifetimeValue: 31740,
    annualPremium: 3120,
    totalPaid: 29850,
    outstandingBalance: 0,
    riskProfile: 'standard',
    riskScore: 33,
    claimsCount: 1,
    claimsTotal: 8700,
    paymentMethod: 'direct_debit',
    autoPay: true,
    paperless: false,
    churnRisk: 12,
    satisfactionScore: 4.6,
    segment: 'silver',
    preferredContact: 'email',
    agentId: 'agnt_003',
    agentName: 'Dana Whitfield',
    tags: ['long-tenure', 'storm-exposed'],
    lastContactAt: '2026-09-11T15:31:00.000Z',
  },
  {
    id: 'cust_004',
    customerId: 'CUST-0004',
    name: 'Harbor Point Dental Group',
    type: 'small_business',
    email: 'admin@harborpointdental.example.com',
    phone: '+1 (510) 555-0604',
    dateOfBirth: null,
    address: {
      line1: '1200 Broadway, Suite 210',
      line2: '',
      city: 'Oakland',
      state: 'CA',
      postalCode: '94612',
      country: 'United States',
    },
    since: '2023-02-14',
    status: 'active',
    policies: 2,
    activePolicies: 1,
    lifetimeValue: 38600,
    annualPremium: 7480,
    totalPaid: 22440,
    outstandingBalance: 1246,
    riskProfile: 'standard',
    riskScore: 44,
    claimsCount: 1,
    claimsTotal: 12500,
    paymentMethod: 'check',
    autoPay: false,
    paperless: true,
    churnRisk: 34,
    satisfactionScore: 4.1,
    segment: 'silver',
    preferredContact: 'email',
    agentId: 'agnt_004',
    agentName: 'Omar Haddad',
    tags: ['professional', 'payment-reminder'],
    lastContactAt: '2026-08-29T09:47:00.000Z',
  },
  {
    id: 'cust_005',
    customerId: 'CUST-0005',
    name: 'Nadia Farouk',
    type: 'individual',
    email: 'nadia.farouk@example.com',
    phone: '+1 (206) 555-0705',
    dateOfBirth: '1992-10-03',
    address: {
      line1: '730 North 45th Street',
      line2: 'Unit 12',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98103',
      country: 'United States',
    },
    since: '2021-06-20',
    status: 'at_risk',
    policies: 1,
    activePolicies: 1,
    lifetimeValue: 16450,
    annualPremium: 2410,
    totalPaid: 12980,
    outstandingBalance: 401.66,
    riskProfile: 'elevated',
    riskScore: 71,
    claimsCount: 2,
    claimsTotal: 9870,
    paymentMethod: 'card',
    autoPay: false,
    paperless: true,
    churnRisk: 62,
    satisfactionScore: 3.4,
    segment: 'bronze',
    preferredContact: 'sms',
    agentId: 'agnt_005',
    agentName: 'Sofia Marchetti',
    tags: ['at-risk', 'siu-flagged', 'telematics-offer'],
    lastContactAt: '2026-09-19T15:02:00.000Z',
  },
  {
    id: 'cust_006',
    customerId: 'CUST-0006',
    name: 'Summit Ridge Construction Inc.',
    type: 'enterprise',
    email: 'insurance@summitridge.example.com',
    phone: '+1 (916) 555-0806',
    dateOfBirth: null,
    address: {
      line1: '55 Ridgeline Parkway',
      line2: 'Building 3',
      city: 'Sacramento',
      state: 'CA',
      postalCode: '95814',
      country: 'United States',
    },
    since: '2018-04-09',
    status: 'at_risk',
    policies: 2,
    activePolicies: 1,
    lifetimeValue: 412900,
    annualPremium: 65200,
    totalPaid: 398600,
    outstandingBalance: 1533.33,
    riskProfile: 'standard',
    riskScore: 51,
    claimsCount: 2,
    claimsTotal: 168400,
    paymentMethod: 'ach',
    autoPay: false,
    paperless: true,
    churnRisk: 71,
    satisfactionScore: 3.6,
    segment: 'platinum',
    preferredContact: 'phone',
    agentId: 'agnt_006',
    agentName: 'Ethan Brackett',
    tags: ['lapse-risk', 'large-commercial', 'reinstatement'],
    lastContactAt: '2026-09-12T10:15:00.000Z',
  },
  {
    id: 'cust_007',
    customerId: 'CUST-0007',
    name: 'Julian Vasquez',
    type: 'individual',
    email: 'julian.vasquez@example.com',
    phone: '+1 (305) 555-0907',
    dateOfBirth: '1995-03-22',
    address: {
      line1: '8901 Sunset Drive',
      line2: '',
      city: 'Miami',
      state: 'FL',
      postalCode: '33143',
      country: 'United States',
    },
    since: '2026-09-09',
    status: 'prospect',
    policies: 1,
    activePolicies: 0,
    lifetimeValue: 2760,
    annualPremium: 2760,
    totalPaid: 0,
    outstandingBalance: 230,
    riskProfile: 'preferred',
    riskScore: 21,
    claimsCount: 0,
    claimsTotal: 0,
    paymentMethod: 'card',
    autoPay: false,
    paperless: true,
    churnRisk: 18,
    satisfactionScore: 0,
    segment: 'bronze',
    preferredContact: 'email',
    agentId: 'agnt_007',
    agentName: 'Grace Okonkwo',
    tags: ['new-business', 'first-installment'],
    lastContactAt: '2026-09-18T10:41:00.000Z',
  },
  {
    id: 'cust_008',
    customerId: 'CUST-0008',
    name: 'Cedar Grove Apartments LLC',
    type: 'small_business',
    email: 'property@cedargrove.example.com',
    phone: '+1 (503) 555-1008',
    dateOfBirth: null,
    address: {
      line1: '1140 Cedar Grove Road',
      line2: 'Buildings A–D',
      city: 'Portland',
      state: 'OR',
      postalCode: '97219',
      country: 'United States',
    },
    since: '2022-01-25',
    status: 'at_risk',
    policies: 1,
    activePolicies: 1,
    lifetimeValue: 128700,
    annualPremium: 38900,
    totalPaid: 96400,
    outstandingBalance: 0,
    riskProfile: 'high_risk',
    riskScore: 82,
    claimsCount: 2,
    claimsTotal: 88400,
    paymentMethod: 'ach',
    autoPay: true,
    paperless: false,
    churnRisk: 58,
    satisfactionScore: 3.8,
    segment: 'gold',
    preferredContact: 'phone',
    agentId: 'agnt_008',
    agentName: 'Victor Sorensen',
    tags: ['water-loss', 'retention-watch', 'inspection-due'],
    lastContactAt: '2026-09-10T14:02:00.000Z',
  },
  {
    id: 'cust_009',
    customerId: 'CUST-0009',
    name: 'Harper Lindqvist',
    type: 'individual',
    email: 'harper.lindqvist@example.com',
    phone: '+1 (415) 555-1109',
    dateOfBirth: '1990-11-08',
    address: {
      line1: '2210 Union Street',
      line2: 'Apt 7',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94123',
      country: 'United States',
    },
    since: '2024-04-05',
    status: 'active',
    policies: 1,
    activePolicies: 1,
    lifetimeValue: 4965,
    annualPremium: 1655,
    totalPaid: 3310,
    outstandingBalance: 0,
    riskProfile: 'preferred',
    riskScore: 17,
    claimsCount: 1,
    claimsTotal: 420,
    paymentMethod: 'card',
    autoPay: true,
    paperless: true,
    churnRisk: 6,
    satisfactionScore: 4.9,
    segment: 'gold',
    preferredContact: 'email',
    agentId: 'agnt_001',
    agentName: 'Marcus Bellweather',
    tags: ['ev-owner', 'defensive-driving'],
    lastContactAt: '2026-07-05T08:33:00.000Z',
  },
  {
    id: 'cust_010',
    customerId: 'CUST-0010',
    name: 'Quantum Layer Technologies Inc.',
    type: 'enterprise',
    email: 'legal@quantumlayer.example.com',
    phone: '+1 (628) 555-1210',
    dateOfBirth: null,
    address: {
      line1: '500 Brannan Street',
      line2: 'Floor 6',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
    },
    since: '2023-09-30',
    status: 'active',
    policies: 2,
    activePolicies: 2,
    lifetimeValue: 148300,
    annualPremium: 32900,
    totalPaid: 74200,
    outstandingBalance: 0,
    riskProfile: 'elevated',
    riskScore: 49,
    claimsCount: 1,
    claimsTotal: 640000,
    paymentMethod: 'wire',
    autoPay: true,
    paperless: true,
    churnRisk: 27,
    satisfactionScore: 4.5,
    segment: 'platinum',
    preferredContact: 'portal',
    agentId: 'agnt_002',
    agentName: 'Priya Raghunathan',
    tags: ['tech', 'cyber-claim', 'key-person'],
    lastContactAt: '2026-09-21T18:33:00.000Z',
  },
  {
    id: 'cust_011',
    customerId: 'CUST-0011',
    name: 'Marcus Oyelaran',
    type: 'small_business',
    email: 'marcus.oyelaran@example.com',
    phone: '+1 (225) 555-1311',
    dateOfBirth: '1983-07-17',
    address: {
      line1: '7 Rue Argent',
      line2: '',
      city: 'Baton Rouge',
      state: 'LA',
      postalCode: '70802',
      country: 'United States',
    },
    since: '2025-07-01',
    status: 'active',
    policies: 1,
    activePolicies: 1,
    lifetimeValue: 19800,
    annualPremium: 19800,
    totalPaid: 9900,
    outstandingBalance: 0,
    riskProfile: 'standard',
    riskScore: 46,
    claimsCount: 1,
    claimsTotal: 27400,
    paymentMethod: 'ach',
    autoPay: true,
    paperless: true,
    churnRisk: 15,
    satisfactionScore: 4.4,
    segment: 'silver',
    preferredContact: 'phone',
    agentId: 'agnt_004',
    agentName: 'Omar Haddad',
    tags: ['wc-only', 'experience-mod'],
    lastContactAt: '2026-09-04T12:56:00.000Z',
  },
  {
    id: 'cust_012',
    customerId: 'CUST-0012',
    name: 'Willowbrook Veterinary Clinic',
    type: 'small_business',
    email: 'office@willowbrookvet.example.com',
    phone: '+1 (512) 555-1412',
    dateOfBirth: null,
    address: {
      line1: '8800 Willowbrook Trail',
      line2: '',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'United States',
    },
    since: '2020-10-20',
    status: 'active',
    policies: 2,
    activePolicies: 1,
    lifetimeValue: 62400,
    annualPremium: 5960,
    totalPaid: 53640,
    outstandingBalance: 0,
    riskProfile: 'standard',
    riskScore: 39,
    claimsCount: 1,
    claimsTotal: 6300,
    paymentMethod: 'ach',
    autoPay: true,
    paperless: false,
    churnRisk: 29,
    satisfactionScore: 4.2,
    segment: 'silver',
    preferredContact: 'email',
    agentId: 'agnt_005',
    agentName: 'Sofia Marchetti',
    tags: ['multi-line', 'renewal-quoted'],
    lastContactAt: '2026-09-08T14:38:00.000Z',
  },
  {
    id: 'cust_013',
    customerId: 'CUST-0013',
    name: 'Camille Boudreaux',
    type: 'family',
    email: 'camille.boudreaux@example.com',
    phone: '+1 (251) 555-1513',
    dateOfBirth: '1986-12-02',
    address: {
      line1: '64 Renaissance Court',
      line2: '',
      city: 'Mobile',
      state: 'AL',
      postalCode: '36606',
      country: 'United States',
    },
    since: '2022-03-18',
    status: 'active',
    policies: 2,
    activePolicies: 2,
    lifetimeValue: 27860,
    annualPremium: 5660,
    totalPaid: 22640,
    outstandingBalance: 0,
    riskProfile: 'preferred',
    riskScore: 19,
    claimsCount: 1,
    claimsTotal: 4120,
    paymentMethod: 'card',
    autoPay: true,
    paperless: true,
    churnRisk: 9,
    satisfactionScore: 4.9,
    segment: 'gold',
    preferredContact: 'email',
    agentId: 'agnt_006',
    agentName: 'Ethan Brackett',
    tags: ['bundle', 'umbrella', 'coastal'],
    lastContactAt: '2026-05-03T16:04:00.000Z',
  },
  {
    id: 'cust_014',
    customerId: 'CUST-0014',
    name: 'Trident Marine Freight Co.',
    type: 'enterprise',
    email: 'risk@tridentmarine.example.com',
    phone: '+1 (562) 555-1614',
    dateOfBirth: null,
    address: {
      line1: '3700 Pier J Avenue',
      line2: 'Terminal 9',
      city: 'Long Beach',
      state: 'CA',
      postalCode: '90802',
      country: 'United States',
    },
    since: '2019-01-01',
    status: 'active',
    policies: 1,
    activePolicies: 1,
    lifetimeValue: 486300,
    annualPremium: 62400,
    totalPaid: 454800,
    outstandingBalance: 0,
    riskProfile: 'elevated',
    riskScore: 55,
    claimsCount: 1,
    claimsTotal: 310000,
    paymentMethod: 'wire',
    autoPay: false,
    paperless: true,
    churnRisk: 24,
    satisfactionScore: 4.4,
    segment: 'platinum',
    preferredContact: 'portal',
    agentId: 'agnt_008',
    agentName: 'Victor Sorensen',
    tags: ['marine', 'global-shipping', 'subro-active'],
    lastContactAt: '2026-09-04T14:19:00.000Z',
  },
  {
    id: 'cust_015',
    customerId: 'CUST-0015',
    name: 'Ethan Kimura',
    type: 'individual',
    email: 'ethan.kimura@example.com',
    phone: '+1 (619) 555-1715',
    dateOfBirth: '1981-04-26',
    address: {
      line1: '1500 Columbia Street, Suite 410',
      line2: '',
      city: 'San Diego',
      state: 'CA',
      postalCode: '92101',
      country: 'United States',
    },
    since: '2024-08-01',
    status: 'active',
    policies: 1,
    activePolicies: 1,
    lifetimeValue: 16800,
    annualPremium: 11200,
    totalPaid: 5600,
    outstandingBalance: 0,
    riskProfile: 'preferred',
    riskScore: 15,
    claimsCount: 0,
    claimsTotal: 0,
    paymentMethod: 'card',
    autoPay: true,
    paperless: true,
    churnRisk: 5,
    satisfactionScore: 4.7,
    segment: 'gold',
    preferredContact: 'email',
    agentId: 'agnt_003',
    agentName: 'Dana Whitfield',
    tags: ['pi-coverage', 'preferred', 'cross-sell'],
    lastContactAt: '2026-08-01T10:00:00.000Z',
  },
];


/* ========================================================================== */
/*  11. Agents — 8 records                                                    */
/* ========================================================================== */

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agnt_001',
    code: 'AG-1042',
    name: 'Marcus Bellweather',
    email: 'marcus.bellweather@bellweatherinsurance.example.com',
    phone: '+1 (415) 555-0242',
    licenseNumber: 'CA-PC-55120',
    licenseState: 'CA',
    agency: 'Bellweather Insurance Group',
    region: 'West',
    appointmentDate: '2018-02-12',
    status: 'active',
    bookOfBusiness: 1_420_000,
    policyCount: 612,
    customerCount: 448,
    commissionYtd: 62_140,
    commissionRate: 0.12,
    newBusinessPremium: 214_000,
    renewalPremium: 1_206_000,
    retentionRate: 0.94,
    conversionRate: 0.41,
    avgQuoteToBindDays: 6.2,
    performance: 'top',
    rating: 4.9,
    languages: ['English', 'Spanish'],
    specialties: ['personal_auto', 'homeowners'],
    teamLead: 'Sandra Villalobos',
    lastActiveAt: '2026-09-25T15:18:00.000Z',
    notes: 'Highest bundle attachment rate in the western region two years running.',
  },
  {
    id: 'agnt_002',
    code: 'AG-1077',
    name: 'Priya Raghunathan',
    email: 'priya@meridianrisk.example.com',
    phone: '+1 (646) 555-0277',
    licenseNumber: 'NY-PC-71884',
    licenseState: 'NY',
    agency: 'Meridian Risk Partners',
    region: 'Northeast',
    appointmentDate: '2019-06-03',
    status: 'active',
    bookOfBusiness: 3_860_000,
    policyCount: 274,
    customerCount: 96,
    commissionYtd: 148_900,
    commissionRate: 0.1,
    newBusinessPremium: 742_000,
    renewalPremium: 3_118_000,
    retentionRate: 0.91,
    conversionRate: 0.36,
    avgQuoteToBindDays: 11.4,
    performance: 'top',
    rating: 4.8,
    languages: ['English', 'Tamil', 'Hindi'],
    specialties: ['commercial_auto', 'cyber', 'commercial_property'],
    teamLead: 'Sandra Villalobos',
    lastActiveAt: '2026-09-25T17:02:00.000Z',
    notes: 'Handles the two largest commercial accounts in the book; strong on cyber referrals.',
  },
  {
    id: 'agnt_003',
    code: 'AG-1103',
    name: 'Dana Whitfield',
    email: 'dana@whitfieldco.example.com',
    phone: '+1 (615) 555-0303',
    licenseNumber: 'TN-PC-39471',
    licenseState: 'TN',
    agency: 'Whitfield & Co.',
    region: 'Midwest',
    appointmentDate: '2020-09-21',
    status: 'active',
    bookOfBusiness: 986_000,
    policyCount: 486,
    customerCount: 402,
    commissionYtd: 41_320,
    commissionRate: 0.11,
    newBusinessPremium: 268_000,
    renewalPremium: 718_000,
    retentionRate: 0.93,
    conversionRate: 0.44,
    avgQuoteToBindDays: 4.8,
    performance: 'above',
    rating: 4.6,
    languages: ['English'],
    specialties: ['homeowners', 'professional_indemnity', 'personal_auto'],
    teamLead: 'Owen Marchetti',
    lastActiveAt: '2026-09-24T11:47:00.000Z',
    notes: 'Fastest quote-to-bind cycle in the Midwest; perfect for small professional practices.',
  },
  {
    id: 'agnt_004',
    code: 'AG-1148',
    name: 'Omar Haddad',
    email: 'omar@harborlineagency.example.com',
    phone: '+1 (305) 555-0348',
    licenseNumber: 'FL-PC-88215',
    licenseState: 'FL',
    agency: 'Harborline Agency',
    region: 'Southeast',
    appointmentDate: '2021-04-19',
    status: 'active',
    bookOfBusiness: 1_140_000,
    policyCount: 358,
    customerCount: 264,
    commissionYtd: 49_880,
    commissionRate: 0.11,
    newBusinessPremium: 316_000,
    renewalPremium: 824_000,
    retentionRate: 0.88,
    conversionRate: 0.33,
    avgQuoteToBindDays: 8.9,
    performance: 'on_track',
    rating: 4.3,
    languages: ['English', 'Arabic'],
    specialties: ['general_liability', 'workers_compensation', 'personal_auto'],
    teamLead: 'Owen Marchetti',
    lastActiveAt: '2026-09-25T09:32:00.000Z',
    notes: 'Retention dipped after two commercial lapses; working the reinstatement pipeline.',
  },
  {
    id: 'agnt_005',
    code: 'AG-1162',
    name: 'Sofia Marchetti',
    email: 'sofia@marchetticover.example.com',
    phone: '+1 (628) 555-0362',
    licenseNumber: 'CA-PC-60413',
    licenseState: 'CA',
    agency: 'Marchetti Financial Cover',
    region: 'West',
    appointmentDate: '2021-11-08',
    status: 'active',
    bookOfBusiness: 1_680_000,
    policyCount: 421,
    customerCount: 318,
    commissionYtd: 71_450,
    commissionRate: 0.115,
    newBusinessPremium: 402_000,
    renewalPremium: 1_278_000,
    retentionRate: 0.9,
    conversionRate: 0.38,
    avgQuoteToBindDays: 7.1,
    performance: 'above',
    rating: 4.5,
    languages: ['English', 'Italian', 'Spanish'],
    specialties: ['personal_auto', 'general_liability', 'commercial_auto'],
    teamLead: 'Sandra Villalobos',
    lastActiveAt: '2026-09-25T13:55:00.000Z',
    notes: 'Strong cross-sell from personal lines into small commercial.',
  },
  {
    id: 'agnt_006',
    code: 'AG-1194',
    name: 'Ethan Brackett',
    email: 'ethan@brackettnationwide.example.com',
    phone: '+1 (720) 555-0394',
    licenseNumber: 'CO-PC-44782',
    licenseState: 'CO',
    agency: 'Brackett Nationwide',
    region: 'Mountain',
    appointmentDate: '2022-01-31',
    status: 'active',
    bookOfBusiness: 2_240_000,
    policyCount: 198,
    customerCount: 74,
    commissionYtd: 94_210,
    commissionRate: 0.1,
    newBusinessPremium: 486_000,
    renewalPremium: 1_754_000,
    retentionRate: 0.86,
    conversionRate: 0.31,
    avgQuoteToBindDays: 13.6,
    performance: 'on_track',
    rating: 4.2,
    languages: ['English'],
    specialties: ['commercial_property', 'general_liability'],
    teamLead: 'Owen Marchetti',
    lastActiveAt: '2026-09-24T16:41:00.000Z',
    notes: 'Owns the Summit Ridge relationship — currently in lapse-recovery conversations.',
  },
  {
    id: 'agnt_007',
    code: 'AG-1219',
    name: 'Grace Okonkwo',
    email: 'grace@unitybenefit.example.com',
    phone: '+1 (202) 555-0419',
    licenseNumber: 'DC-PC-27630',
    licenseState: 'DC',
    agency: 'Unity Benefit Advisors',
    region: 'Mid-Atlantic',
    appointmentDate: '2022-07-15',
    status: 'active',
    bookOfBusiness: 742_000,
    policyCount: 392,
    customerCount: 361,
    commissionYtd: 28_760,
    commissionRate: 0.105,
    newBusinessPremium: 198_000,
    renewalPremium: 544_000,
    retentionRate: 0.95,
    conversionRate: 0.47,
    avgQuoteToBindDays: 3.9,
    performance: 'above',
    rating: 4.7,
    languages: ['English', 'Igbo', 'French'],
    specialties: ['life', 'homeowners'],
    teamLead: 'Owen Marchetti',
    lastActiveAt: '2026-09-25T10:12:00.000Z',
    notes: 'Highest quote conversion rate company-wide; minimal rework on applications.',
  },
  {
    id: 'agnt_008',
    code: 'AG-1246',
    name: 'Victor Sorensen',
    email: 'victor@northwindbrokers.example.com',
    phone: '+1 (503) 555-0446',
    licenseNumber: 'OR-PC-91044',
    licenseState: 'OR',
    agency: 'Northwind Brokers',
    region: 'Pacific Northwest',
    appointmentDate: '2023-03-06',
    status: 'pending',
    bookOfBusiness: 1_320_000,
    policyCount: 84,
    customerCount: 21,
    commissionYtd: 51_640,
    commissionRate: 0.095,
    newBusinessPremium: 620_000,
    renewalPremium: 700_000,
    retentionRate: 0.82,
    conversionRate: 0.28,
    avgQuoteToBindDays: 16.8,
    performance: 'below',
    rating: 3.9,
    languages: ['English', 'Norwegian'],
    specialties: ['commercial_property', 'marine'],
    teamLead: 'Sandra Villalobos',
    lastActiveAt: '2026-09-23T14:24:00.000Z',
    notes: 'Appointment pending renewal compliance review — two overdue training modules.',
  },
];

/* ========================================================================== */
/*  12. Brokers — 6 records                                                   */
/* ========================================================================== */

export const MOCK_BROKERS: Broker[] = [
  {
    id: 'brkr_001',
    firm: 'Ashgrove & Pike Brokers',
    contactName: 'Helena Ashgrove',
    email: 'placement@ashgrovepike.example.com',
    phone: '+1 (212) 555-0501',
    website: 'https://ashgrovepike.example.com',
    brokerLicense: 'NY-BR-40188',
    tier: 'premier',
    status: 'active',
    submittedPolicies: 412,
    boundPolicies: 268,
    conversionRate: 0.65,
    premiumVolume: 18_400_000,
    commissionRate: 0.14,
    commissionPaid: 1_412_000,
    lines: ['commercial_property', 'general_liability', 'professional_indemnity'],
    territories: ['NY', 'NJ', 'CT', 'MA'],
    serviceLevel: 'platinum',
    avgTurnaroundDays: 3.4,
    lastSubmissionAt: '2026-09-24T16:08:00.000Z',
    contractRenewalAt: '2027-06-30',
    notes: 'Largest wholesale relationship; dedicated underwriting desk on Tuesdays and Thursdays.',
  },
  {
    id: 'brkr_002',
    firm: 'Cobalt Risk Wholesale',
    contactName: 'Devon Mbeki',
    email: 'submit@cobaltrisk.example.com',
    phone: '+1 (312) 555-0502',
    website: 'https://cobaltrisk.example.com',
    brokerLicense: 'IL-BR-55710',
    tier: 'preferred',
    status: 'active',
    submittedPolicies: 286,
    boundPolicies: 141,
    conversionRate: 0.49,
    premiumVolume: 9_750_000,
    commissionRate: 0.125,
    commissionPaid: 612_400,
    lines: ['cyber', 'commercial_auto', 'commercial_property'],
    territories: ['IL', 'IN', 'OH', 'MI', 'WI'],
    serviceLevel: 'gold',
    avgTurnaroundDays: 5.1,
    lastSubmissionAt: '2026-09-23T11:35:00.000Z',
    contractRenewalAt: '2027-01-31',
    notes: 'Strong cyber submissions but requires expedited turnaround to keep the relationship warm.',
  },
  {
    id: 'brkr_003',
    firm: 'Meridian Marine Placing',
    contactName: 'Yusuf Demirci',
    email: 'cargo@meridianmarine.example.com',
    phone: '+1 (562) 555-0503',
    website: 'https://meridianmarine.example.com',
    brokerLicense: 'CA-BR-61239',
    tier: 'preferred',
    status: 'active',
    submittedPolicies: 94,
    boundPolicies: 61,
    conversionRate: 0.65,
    premiumVolume: 6_240_000,
    commissionRate: 0.13,
    commissionPaid: 398_700,
    lines: ['marine', 'commercial_property'],
    territories: ['CA', 'WA', 'OR', 'TX'],
    serviceLevel: 'gold',
    avgTurnaroundDays: 4.6,
    lastSubmissionAt: '2026-09-22T08:19:00.000Z',
    contractRenewalAt: '2026-12-31',
    notes: 'Single-signature authority up to $30M on cargo; contract renewal negotiation in progress.',
  },
  {
    id: 'brkr_004',
    firm: 'Larkfield Employee Benefits',
    contactName: 'Cecily Turner',
    email: 'accounts@larkfieldbenefits.example.com',
    phone: '+1 (615) 555-0504',
    website: 'https://larkfieldbenefits.example.com',
    brokerLicense: 'TN-BR-70418',
    tier: 'standard',
    status: 'active',
    submittedPolicies: 178,
    boundPolicies: 79,
    conversionRate: 0.44,
    premiumVolume: 3_120_000,
    commissionRate: 0.11,
    commissionPaid: 168_900,
    lines: ['workers_compensation', 'general_liability'],
    territories: ['TN', 'GA', 'AL', 'KY'],
    serviceLevel: 'silver',
    avgTurnaroundDays: 7.8,
    lastSubmissionAt: '2026-09-19T13:44:00.000Z',
    contractRenewalAt: '2027-03-31',
    notes: 'Growing workers-comp volume; requests loss runs within 48 hours of submission.',
  },
  {
    id: 'brkr_005',
    firm: 'Pelican Coast Brokers',
    contactName: 'Marisol Ibarra',
    email: 'hello@pelicancoast.example.com',
    phone: '+1 (504) 555-0505',
    website: 'https://pelicancoast.example.com',
    brokerLicense: 'LA-BR-83502',
    tier: 'standard',
    status: 'probation',
    submittedPolicies: 142,
    boundPolicies: 48,
    conversionRate: 0.34,
    premiumVolume: 1_980_000,
    commissionRate: 0.11,
    commissionPaid: 94_200,
    lines: ['homeowners', 'personal_auto'],
    territories: ['LA', 'MS', 'AL'],
    serviceLevel: 'silver',
    avgTurnaroundDays: 11.2,
    lastSubmissionAt: '2026-09-16T15:52:00.000Z',
    contractRenewalAt: '2026-11-30',
    notes: 'On probation for incomplete submission data — quality review due before renewal.',
  },
  {
    id: 'brkr_006',
    firm: 'Highline Specialty Group',
    contactName: 'Anton Kowalski',
    email: 'broking@highlinespecialty.example.com',
    phone: '+1 (303) 555-0506',
    website: 'https://highlinespecialty.example.com',
    brokerLicense: 'CO-BR-92877',
    tier: 'limited',
    status: 'onboarding',
    submittedPolicies: 26,
    boundPolicies: 9,
    conversionRate: 0.35,
    premiumVolume: 640_000,
    commissionRate: 0.1,
    commissionPaid: 21_800,
    lines: ['professional_indemnity', 'cyber'],
    territories: ['CO', 'UT', 'NM', 'AZ'],
    serviceLevel: 'silver',
    avgTurnaroundDays: 6.9,
    lastSubmissionAt: '2026-09-12T10:26:00.000Z',
    contractRenewalAt: '2027-09-15',
    notes: 'Onboarding — awaiting E&O certificate and first premium reconciliation.',
  },
];

/* ========================================================================== */
/*  13. Products — 10 records                                                 */
/* ========================================================================== */

const MOCK_PRODUCTS_BASE: Omit<Product, 'basePremium' | 'avgClaimSize'>[] = [
  {
    id: 'prod_001',
    code: 'IF-AUTO-PLUS',
    name: 'AutoPlus Premier',
    lineOfBusiness: 'personal_auto',
    category: 'Personal lines',
    description:
      'Full-coverage private passenger auto with accident forgiveness, OEM parts, and embedded roadside assistance.',
    status: 'active',
    pricing: {
      basePremium: 1480,
      minPremium: 940,
      maxPremium: 5400,
      ratePerThousand: 6.4,
      currency: 'USD',
      ratingEngine: 'symbol-rate-v4',
    },
    lossRatio: 0.58,
    expenseRatio: 0.27,
    combinedRatio: 0.85,
    policiesInForce: 46_820,
    writtenPremium: 74_200_000,
    earnedPremium: 55_100_000,
    claimsIncurred: 31_958_000,
    claimsPaid: 30_410_000,
    avgPremium: 1585,
    retentionRate: 0.92,
    quoteToBindRate: 0.41,
    deductibleMin: 250,
    deductibleMax: 2500,
    limitMin: 250000,
    limitMax: 1000000,
    filingStatus: 'approved',
    filedStates: ['CA', 'OR', 'WA', 'NV', 'AZ', 'TX', 'FL', 'NY', 'IL', 'GA'],
    effectiveAt: '2025-01-01',
    features: ['Accident forgiveness after 3 clean years', 'OEM parts endorsement', 'Roadside + towing'],
    exclusions: ['Racing', 'Rideshare without endorsement', 'Commercial delivery use'],
    targetSegments: ['preferred', 'standard'],
    updatedAt: '2026-08-14T10:22:00.000Z',
  },
  {
    id: 'prod_002',
    code: 'IF-HOME-GUARD',
    name: 'HomeGuard Elite',
    lineOfBusiness: 'homeowners',
    category: 'Personal lines',
    description:
      'HO-5 open-peril homeowners form with guaranteed replacement cost, water backup, and roof surfacing credits.',
    status: 'active',
    pricing: {
      basePremium: 2650,
      minPremium: 1100,
      maxPremium: 12800,
      ratePerThousand: 4.1,
      currency: 'USD',
      ratingEngine: 'territory-form-v6',
    },
    lossRatio: 0.63,
    expenseRatio: 0.26,
    combinedRatio: 0.89,
    policiesInForce: 31_460,
    writtenPremium: 88_600_000,
    earnedPremium: 66_400_000,
    claimsIncurred: 41_832_000,
    claimsPaid: 40_120_000,
    avgPremium: 2816,
    retentionRate: 0.9,
    quoteToBindRate: 0.36,
    deductibleMin: 1000,
    deductibleMax: 10000,
    limitMin: 250000,
    limitMax: 2500000,
    filingStatus: 'approved',
    filedStates: ['CA', 'OR', 'WA', 'AL', 'FL', 'TX', 'CO', 'TN'],
    effectiveAt: '2024-07-01',
    features: ['Guaranteed replacement cost', 'Water backup included', 'Roof age credit'],
    exclusions: ['Flood', 'Earth movement', 'Wear and tear'],
    targetSegments: ['preferred', 'standard', 'elevated'],
    updatedAt: '2026-09-02T09:14:00.000Z',
  },
  {
    id: 'prod_003',
    code: 'IF-FLEET-360',
    name: 'Fleet360 Commercial',
    lineOfBusiness: 'commercial_auto',
    category: 'Commercial lines',
    description:
      'Commercial auto for fleets of 5–250 power units, with telematics scoring, hired and non-owned coverage, and cargo.',
    status: 'active',
    pricing: {
      basePremium: 18400,
      minPremium: 6200,
      maxPremium: 240000,
      ratePerThousand: 11.8,
      currency: 'USD',
      ratingEngine: 'fleet-exposure-v3',
    },
    lossRatio: 0.67,
    expenseRatio: 0.29,
    combinedRatio: 0.96,
    policiesInForce: 1_840,
    writtenPremium: 46_300_000,
    earnedPremium: 34_800_000,
    claimsIncurred: 23_316_000,
    claimsPaid: 21_940_000,
    avgPremium: 25_163,
    retentionRate: 0.87,
    quoteToBindRate: 0.31,
    deductibleMin: 1000,
    deductibleMax: 25000,
    limitMin: 500000,
    limitMax: 5000000,
    filingStatus: 'approved',
    filedStates: ['CA', 'TX', 'AZ', 'NV', 'OR', 'IL', 'GA', 'PA'],
    effectiveAt: '2025-04-01',
    features: ['Telematics discount up to 14%', 'Hired & non-owned included', 'Loss-control consulting'],
    exclusions: ['Owned vehicles outside scheduled states', 'Hazmat without endorsement'],
    targetSegments: ['small_fleet', 'mid_market'],
    updatedAt: '2026-07-28T15:41:00.000Z',
  },
  {
    id: 'prod_004',
    code: 'IF-PROP-SHIELD',
    name: 'PropertyShield BOP',
    lineOfBusiness: 'commercial_property',
    category: 'Commercial lines',
    description:
      'Business owners package combining building, contents, business interruption, and equipment breakdown.',
    status: 'active',
    pricing: {
      basePremium: 34200,
      minPremium: 8400,
      maxPremium: 420000,
      ratePerThousand: 3.2,
      currency: 'USD',
      ratingEngine: 'property-territory-v5',
    },
    lossRatio: 0.61,
    expenseRatio: 0.28,
    combinedRatio: 0.89,
    policiesInForce: 2_610,
    writtenPremium: 78_900_000,
    earnedPremium: 59_200_000,
    claimsIncurred: 36_112_000,
    claimsPaid: 34_880_000,
    avgPremium: 30_230,
    retentionRate: 0.9,
    quoteToBindRate: 0.39,
    deductibleMin: 1000,
    deductibleMax: 50000,
    limitMin: 500000,
    limitMax: 25000000,
    filingStatus: 'approved',
    filedStates: ['CA', 'OR', 'WA', 'TX', 'CO', 'IL', 'NY', 'NJ'],
    effectiveAt: '2024-10-01',
    features: ['Business income at 12 months', 'Equipment breakdown', 'Ordinance or law coverage'],
    exclusions: ['Flood', 'Earth movement', 'Pollution cleanup'],
    targetSegments: ['small_business', 'mid_market'],
    updatedAt: '2026-06-19T11:07:00.000Z',
  },
  {
    id: 'prod_005',
    code: 'IF-GL-SECURE',
    name: 'General Liability Secure',
    lineOfBusiness: 'general_liability',
    category: 'Commercial lines',
    description:
      'Occurrence-form general liability with products/completed operations, medical payments, and worldwide coverage.',
    status: 'active',
    pricing: {
      basePremium: 6400,
      minPremium: 1850,
      maxPremium: 145000,
      ratePerThousand: 5.6,
      currency: 'USD',
      ratingEngine: 'class-rate-v7',
    },
    lossRatio: 0.55,
    expenseRatio: 0.3,
    combinedRatio: 0.85,
    policiesInForce: 4_920,
    writtenPremium: 39_400_000,
    earnedPremium: 29_600_000,
    claimsIncurred: 16_280_000,
    claimsPaid: 15_140_000,
    avgPremium: 8008,
    retentionRate: 0.91,
    quoteToBindRate: 0.44,
    deductibleMin: 500,
    deductibleMax: 25000,
    limitMin: 500000,
    limitMax: 10000000,
    filingStatus: 'approved',
    filedStates: ['CA', 'TX', 'FL', 'NY', 'IL', 'GA', 'TN', 'AL', 'CO', 'WA'],
    effectiveAt: '2024-01-01',
    features: ['Products & completed operations', 'Worldwide coverage', 'Personal injury included'],
    exclusions: ['Professional services', 'Employment practices', 'Pollution'],
    targetSegments: ['small_business', 'professional'],
    updatedAt: '2026-08-05T14:52:00.000Z',
  },
  {
    id: 'prod_006',
    code: 'IF-WC-CARE',
    name: 'WorkCare Workers Comp',
    lineOfBusiness: 'workers_compensation',
    category: 'Commercial lines',
    description:
      'Statutory workers compensation with employer liability, return-to-work support, and preferred provider networks.',
    status: 'active',
    pricing: {
      basePremium: 21400,
      minPremium: 3200,
      maxPremium: 620000,
      ratePerThousand: 1.94,
      currency: 'USD',
      ratingEngine: 'class-mod-v9',
    },
    lossRatio: 0.69,
    expenseRatio: 0.25,
    combinedRatio: 0.94,
    policiesInForce: 2_140,
    writtenPremium: 54_800_000,
    earnedPremium: 41_100_000,
    claimsIncurred: 28_359_000,
    claimsPaid: 26_700_000,
    avgPremium: 25_607,
    retentionRate: 0.93,
    quoteToBindRate: 0.52,
    deductibleMin: 0,
    deductibleMax: 2500,
    limitMin: 500000,
    limitMax: 2000000,
    filingStatus: 'approved',
    filedStates: ['CA', 'TX', 'AZ', 'LA', 'GA', 'TN', 'IL', 'PA'],
    effectiveAt: '2024-01-01',
    features: ['Return-to-work program', 'Preferred provider network', 'Experience-mod review'],
    exclusions: ['Federal employees (FECA)', 'Volunteer workers'],
    targetSegments: ['small_business', 'construction'],
    updatedAt: '2026-07-11T08:36:00.000Z',
  },
  {
    id: 'prod_007',
    code: 'IF-CYBER-DEFEND',
    name: 'CyberDefend Pro',
    lineOfBusiness: 'cyber',
    category: 'Specialty',
    description:
      'First- and third-party cyber cover: forensics, notification, extortion, business interruption, and regulatory defense.',
    status: 'active',
    pricing: {
      basePremium: 19800,
      minPremium: 4200,
      maxPremium: 380000,
      ratePerThousand: 4.2,
      currency: 'USD',
      ratingEngine: 'cyber-score-v2',
    },
    lossRatio: 0.47,
    expenseRatio: 0.33,
    combinedRatio: 0.8,
    policiesInForce: 612,
    writtenPremium: 14_200_000,
    earnedPremium: 9_800_000,
    claimsIncurred: 4_606_000,
    claimsPaid: 3_940_000,
    avgPremium: 23_203,
    retentionRate: 0.88,
    quoteToBindRate: 0.34,
    deductibleMin: 10000,
    deductibleMax: 250000,
    limitMin: 1000000,
    limitMax: 20000000,
    filingStatus: 'filed',
    filedStates: ['CA', 'NY', 'TX', 'IL', 'WA', 'CO'],
    effectiveAt: '2025-06-01',
    features: ['24/7 incident response panel', 'Extortion response included', 'Dependent business interruption'],
    exclusions: ['Prior known events', 'Infrastructure failure without breach', 'Physical injury'],
    targetSegments: ['tech', 'professional', 'healthcare'],
    updatedAt: '2026-09-06T16:28:00.000Z',
  },
  {
    id: 'prod_008',
    code: 'IF-PI-ASSURE',
    name: 'ProfIndemnity Assurance',
    lineOfBusiness: 'professional_indemnity',
    category: 'Specialty',
    description:
      'Claims-made professional indemnity with retroactive dating, defense outside limits, and worldwide territory.',
    status: 'active',
    pricing: {
      basePremium: 9800,
      minPremium: 2400,
      maxPremium: 210000,
      ratePerThousand: 3.4,
      currency: 'USD',
      ratingEngine: 'prof-rate-v3',
    },
    lossRatio: 0.42,
    expenseRatio: 0.34,
    combinedRatio: 0.76,
    policiesInForce: 940,
    writtenPremium: 11_600_000,
    earnedPremium: 8_700_000,
    claimsIncurred: 3_654_000,
    claimsPaid: 3_120_000,
    avgPremium: 12_340,
    retentionRate: 0.94,
    quoteToBindRate: 0.48,
    deductibleMin: 2500,
    deductibleMax: 50000,
    limitMin: 500000,
    limitMax: 10000000,
    filingStatus: 'approved',
    filedStates: ['CA', 'NY', 'IL', 'TX', 'FL', 'MA', 'WA'],
    effectiveAt: '2024-03-01',
    features: ['Defense outside limits', 'Retroactive date coverage', 'Worldwide territory'],
    exclusions: ['Known circumstances', 'Bodily injury', 'Fraud and dishonesty'],
    targetSegments: ['architecture', 'engineering', 'consulting'],
    updatedAt: '2026-05-22T13:19:00.000Z',
  },
  {
    id: 'prod_009',
    code: 'IF-MARINE-HAUL',
    name: 'MarineHaul Cargo',
    lineOfBusiness: 'marine',
    category: 'Specialty',
    description:
      'All-risk cargo and stock-throughput cover for domestic and international shipments, including refrigerated goods.',
    status: 'active',
    pricing: {
      basePremium: 58400,
      minPremium: 9600,
      maxPremium: 640000,
      ratePerThousand: 1.15,
      currency: 'USD',
      ratingEngine: 'cargo-rate-v4',
    },
    lossRatio: 0.64,
    expenseRatio: 0.3,
    combinedRatio: 0.94,
    policiesInForce: 318,
    writtenPremium: 21_700_000,
    earnedPremium: 16_400_000,
    claimsIncurred: 10_496_000,
    claimsPaid: 9_880_000,
    avgPremium: 68_239,
    retentionRate: 0.89,
    quoteToBindRate: 0.57,
    deductibleMin: 5000,
    deductibleMax: 100000,
    limitMin: 1000000,
    limitMax: 50000000,
    filingStatus: 'approved',
    filedStates: ['CA', 'TX', 'NY', 'WA', 'GA', 'SC'],
    effectiveAt: '2024-01-01',
    features: ['All-risk cargo', 'Stock throughput', 'Temperature deviation cover'],
    exclusions: ['Inherent vice', 'War and strikes (unless endorsed)', 'Delay and loss of market'],
    targetSegments: ['logistics', 'manufacturing', 'cold_chain'],
    updatedAt: '2026-08-30T10:44:00.000Z',
  },
  {
    id: 'prod_010',
    code: 'IF-LIFE-LEGACY',
    name: 'LifeLegacy Term',
    lineOfBusiness: 'life',
    category: 'Life & benefits',
    description:
      'Level term life with 10-, 20-, and 30-year guarantees, convertible coverage, and accelerated death benefit riders.',
    status: 'active',
    pricing: {
      basePremium: 7200,
      minPremium: 360,
      maxPremium: 96000,
      ratePerThousand: 1.4,
      currency: 'USD',
      ratingEngine: 'actuarial-term-v8',
    },
    lossRatio: 0.71,
    expenseRatio: 0.19,
    combinedRatio: 0.9,
    policiesInForce: 1_260,
    writtenPremium: 9_400_000,
    earnedPremium: 7_100_000,
    claimsIncurred: 5_041_000,
    claimsPaid: 4_880_000,
    avgPremium: 7_460,
    retentionRate: 0.97,
    quoteToBindRate: 0.62,
    deductibleMin: 0,
    deductibleMax: 0,
    limitMin: 250000,
    limitMax: 5000000,
    filingStatus: 'pending',
    filedStates: ['CA', 'TX', 'FL', 'NY', 'IL'],
    effectiveAt: '2026-01-01',
    features: ['Convertible to permanent', 'Accelerated death benefit', 'Waiver of premium rider'],
    exclusions: ['Suicide within 2-year contestability', 'Material misstatement'],
    targetSegments: ['key_person', 'family'],
    updatedAt: '2026-09-15T12:03:00.000Z',
  },
];


/* ========================================================================== */
/*  14. Underwriting cases — 8 records                                        */
/* ========================================================================== */

const MOCK_UNDERWRITING_BASE: Omit<
  UnderwritingCase,
  'submission' | 'applicant' | 'product' | 'underwriter' | 'score' | 'coverageRequested' | 'date'
>[] = [
  {
    id: 'uwc_001',
    reference: 'UW-2026-0842',
    applicantName: 'Redwood Fabrication Works',
    customerId: null,
    productId: 'prod_005',
    productName: 'General Liability Secure',
    lineOfBusiness: 'general_liability',
    submittedAt: '2026-09-15T13:41:00.000Z',
    assignedTo: 'Elena Vasquez-Ortiz',
    assignedAt: '2026-09-15T14:02:00.000Z',
    decidedAt: null,
    status: 'in_review',
    decision: null,
    riskFactors: [
      { label: 'Classification hazard', score: 72, impact: 'negative', detail: 'Class 2585 fabrication carries above-median severity.' },
      { label: 'Payroll exposure', score: 64, impact: 'negative', detail: '$1.4M payroll outside the insured premises.' },
      { label: 'Loss history', score: 58, impact: 'negative', detail: 'Two losses in 3 years, combined $24k.' },
      { label: 'Safety program', score: 28, impact: 'positive', detail: 'OSHA 300A published; monthly toolbox talks documented.' },
      { label: 'Financial strength', score: 31, impact: 'positive', detail: 'D&B score 78 — meets credit threshold.' },
    ],
    riskScore: 61,
    premiumIndication: 21600,
    coverageLimit: 2000000,
    deductible: 5000,
    referralReason: 'Class hazard above referral threshold of 70 on a single factor.',
    conditions: ['Provide 5-year loss runs', 'Verify current payroll estimate at audit'],
    documentsRequired: ['Loss runs (5 years)', 'Payroll statement', 'Safety manual'],
    documentsReceived: ['Loss runs (5 years)'],
    aiRecommendation: 'refer',
    aiConfidence: 0.78,
    priority: 'high',
    notes: 'Referral underwriter wants loss runs from incumbent before binding.',
  },
  {
    id: 'uwc_002',
    reference: 'UW-2026-0836',
    applicantName: 'Priomark Digital Agency',
    customerId: null,
    productId: 'prod_007',
    productName: 'CyberDefend Pro',
    lineOfBusiness: 'cyber',
    submittedAt: '2026-08-30T16:35:00.000Z',
    assignedTo: 'Noah Farraday',
    assignedAt: '2026-08-31T09:12:00.000Z',
    decidedAt: null,
    status: 'clarification',
    decision: null,
    riskFactors: [
      { label: 'MFA coverage', score: 78, impact: 'negative', detail: 'MFA on email only; absent on VPN and admin consoles.' },
      { label: 'Backup resilience', score: 66, impact: 'negative', detail: 'No documented restore test in 24 months.' },
      { label: 'Revenue exposure', score: 44, impact: 'neutral', detail: '$12M revenue — within target band.' },
      { label: 'Incident history', score: 12, impact: 'positive', detail: 'No prior cyber events reported.' },
      { label: 'Endpoint protection', score: 30, impact: 'positive', detail: 'EDR deployed on 96% of endpoints.' },
    ],
    riskScore: 66,
    premiumIndication: 17800,
    coverageLimit: 2000000,
    deductible: 25000,
    referralReason: null,
    conditions: ['Documented MFA rollout within 60 days of inception', 'Annual restore test evidence'],
    documentsRequired: ['SOC 2 Type II', 'MFA coverage matrix', 'Backup restore test log'],
    documentsReceived: ['SOC 2 Type II (partial)'],
    aiRecommendation: 'refer',
    aiConfidence: 0.71,
    priority: 'normal',
    notes: 'Second clarification request sent 2026-09-06; applicant responsive but slow.',
  },
  {
    id: 'uwc_003',
    reference: 'UW-2026-0824',
    applicantName: 'Northgate Auto Body',
    customerId: null,
    productId: 'prod_003',
    productName: 'Fleet360 Commercial',
    lineOfBusiness: 'commercial_auto',
    submittedAt: '2026-07-21T10:49:00.000Z',
    assignedTo: 'Elena Vasquez-Ortiz',
    assignedAt: '2026-07-21T11:30:00.000Z',
    decidedAt: '2026-07-23T13:06:00.000Z',
    status: 'declined',
    decision: 'decline',
    riskFactors: [
      { label: 'Garagekeepers exposure', score: 88, impact: 'negative', detail: 'Custody of customer vehicles drives severity.' },
      { label: 'Loss ratio', score: 84, impact: 'negative', detail: '118% loss ratio over the lookback period.' },
      { label: 'Regulatory standing', score: 76, impact: 'negative', detail: 'Open DOI complaint against the applicant.' },
      { label: 'Financial stability', score: 52, impact: 'neutral', detail: 'Two consecutive loss-making years.' },
      { label: 'Risk controls', score: 40, impact: 'positive', detail: 'Camera system installed across the yard.' },
    ],
    riskScore: 74,
    premiumIndication: 33900,
    coverageLimit: 1000000,
    deductible: 10000,
    referralReason: 'Regulatory complaint and loss ratio both exceed decline guidelines.',
    conditions: [],
    documentsRequired: ['Complaint resolution letter', 'Loss runs (5 years)'],
    documentsReceived: ['Loss runs (5 years)'],
    aiRecommendation: 'decline',
    aiConfidence: 0.92,
    priority: 'normal',
    notes: 'Declined. Reconsider only after the DOI complaint is formally closed.',
  },
  {
    id: 'uwc_004',
    reference: 'UW-2026-0818',
    applicantName: 'Juniper Home Services',
    customerId: null,
    productId: 'prod_006',
    productName: 'WorkCare Workers Comp',
    lineOfBusiness: 'workers_compensation',
    submittedAt: '2026-08-13T09:07:00.000Z',
    assignedTo: 'Miles Okafor',
    assignedAt: '2026-08-13T10:15:00.000Z',
    decidedAt: '2026-08-14T11:44:00.000Z',
    status: 'withdrawn',
    decision: 'refer',
    riskFactors: [
      { label: 'Experience modifier', score: 71, impact: 'negative', detail: 'EM 1.34 — above the 1.25 referral threshold.' },
      { label: 'Class codes', score: 63, impact: 'negative', detail: 'HVAC and plumbing codes with elevated injury frequency.' },
      { label: 'Payroll growth', score: 48, impact: 'neutral', detail: 'Payroll up 18% year over year.' },
      { label: 'Return-to-work', score: 24, impact: 'positive', detail: 'Documented light-duty program in place.' },
      { label: 'Claim frequency', score: 57, impact: 'negative', detail: 'Three indemnity claims in 3 years.' },
    ],
    riskScore: 52,
    premiumIndication: 26400,
    coverageLimit: 1000000,
    deductible: 0,
    referralReason: 'Experience modifier above home-office authority.',
    conditions: ['Approved safety plan', 'Deductible option selection'],
    documentsRequired: ['Experience mod worksheet', 'Class code payroll breakdown'],
    documentsReceived: ['Experience mod worksheet'],
    aiRecommendation: 'refer',
    aiConfidence: 0.69,
    priority: 'normal',
    notes: 'Applicant withdrew — incumbent carrier offered a lower deductible option.',
  },
  {
    id: 'uwc_005',
    reference: 'UW-2026-0809',
    applicantName: 'Harborview Bakery LLC',
    customerId: null,
    productId: 'prod_005',
    productName: 'General Liability Secure',
    lineOfBusiness: 'general_liability',
    submittedAt: '2026-08-25T10:18:00.000Z',
    assignedTo: 'Elena Vasquez-Ortiz',
    assignedAt: '2026-08-25T10:20:00.000Z',
    decidedAt: '2026-08-25T10:19:00.000Z',
    status: 'approved',
    decision: 'approve',
    riskFactors: [
      { label: 'Classification hazard', score: 18, impact: 'positive', detail: 'Retail bakery — low hazard code 5812.' },
      { label: 'Premises size', score: 22, impact: 'positive', detail: '1,850 sq ft with limited seating.' },
      { label: 'Loss history', score: 8, impact: 'positive', detail: 'No liability losses in the lookback period.' },
      { label: 'Prior premium', score: 46, impact: 'negative', detail: 'Indicated 5.1% above expiring rate.' },
      { label: 'Financial standing', score: 26, impact: 'positive', detail: 'Three profitable years on file.' },
    ],
    riskScore: 26,
    premiumIndication: 4920,
    coverageLimit: 1000000,
    deductible: 1000,
    referralReason: null,
    conditions: [],
    documentsRequired: ['Application signature page'],
    documentsReceived: ['Application signature page'],
    aiRecommendation: 'approve',
    aiConfidence: 0.94,
    priority: 'normal',
    notes: 'Straight-through approval — bound the same day by the servicing agent.',
  },
  {
    id: 'uwc_006',
    reference: 'UW-2026-0794',
    applicantName: 'Sterling Heights Medical Spa',
    customerId: null,
    productId: 'prod_008',
    productName: 'ProfIndemnity Assurance',
    lineOfBusiness: 'professional_indemnity',
    submittedAt: '2026-08-04T14:26:00.000Z',
    assignedTo: 'Miles Okafor',
    assignedAt: '2026-08-05T08:44:00.000Z',
    decidedAt: '2026-08-19T15:37:00.000Z',
    status: 'approved',
    decision: 'approve_with_conditions',
    riskFactors: [
      { label: 'Procedure mix', score: 62, impact: 'negative', detail: 'Injectables and laser — elevated complication potential.' },
      { label: 'Practitioner credentials', score: 24, impact: 'positive', detail: 'Board-certified supervising physician on staff.' },
      { label: 'Claims history', score: 35, impact: 'neutral', detail: 'One closed allegation, no payment made.' },
      { label: 'Consent documentation', score: 19, impact: 'positive', detail: 'Structured consent process audited quarterly.' },
      { label: 'Revenue per procedure', score: 58, impact: 'negative', detail: 'High ticket value increases severity potential.' },
    ],
    riskScore: 48,
    premiumIndication: 16400,
    coverageLimit: 1000000,
    deductible: 10000,
    referralReason: null,
    conditions: [
      'Exclude laser hair removal without endorsement',
      'Supervising physician named on the policy',
      'Claims-made retroactive date = inception',
    ],
    documentsRequired: ['Procedure list', 'Consent form samples', 'Physician CV'],
    documentsReceived: ['Procedure list', 'Consent form samples', 'Physician CV'],
    aiRecommendation: 'refer',
    aiConfidence: 0.64,
    priority: 'normal',
    notes: 'Bound with procedure exclusions. Agent notified of the laser endorsement option.',
  },
  {
    id: 'uwc_007',
    reference: 'UW-2026-0781',
    applicantName: 'Lena Okafor',
    customerId: null,
    productId: 'prod_001',
    productName: 'AutoPlus Premier',
    lineOfBusiness: 'personal_auto',
    submittedAt: '2026-09-18T09:14:00.000Z',
    assignedTo: 'Automated engine',
    assignedAt: '2026-09-18T09:14:01.000Z',
    decidedAt: '2026-09-18T09:16:00.000Z',
    status: 'approved',
    decision: 'approve',
    riskFactors: [
      { label: 'Claims history', score: 6, impact: 'positive', detail: 'No losses in the last 3 years.' },
      { label: 'Credit tier', score: 12, impact: 'positive', detail: 'Tier 1 insured credit band.' },
      { label: 'Vehicle safety', score: 9, impact: 'positive', detail: '2025 model with IIHS Top Safety Pick+.' },
      { label: 'Annual mileage', score: 34, impact: 'neutral', detail: '9,400 miles — near portfolio median.' },
      { label: 'Territory', score: 38, impact: 'neutral', detail: 'Urban garaging — average frequency for territory 04.' },
    ],
    riskScore: 22,
    premiumIndication: 1584,
    coverageLimit: 300000,
    deductible: 500,
    referralReason: null,
    conditions: [],
    documentsRequired: [],
    documentsReceived: [],
    aiRecommendation: 'approve',
    aiConfidence: 0.97,
    priority: 'low',
    notes: 'Straight-through decision in 120 seconds.',
  },
  {
    id: 'uwc_008',
    reference: 'UW-2026-0766',
    applicantName: 'Cascade Cold Storage',
    customerId: null,
    productId: 'prod_004',
    productName: 'PropertyShield BOP',
    lineOfBusiness: 'commercial_property',
    submittedAt: '2026-07-08T09:55:00.000Z',
    assignedTo: 'Noah Farraday',
    assignedAt: '2026-07-08T13:10:00.000Z',
    decidedAt: null,
    status: 'triage',
    decision: null,
    riskFactors: [
      { label: 'Refrigeration plant age', score: 69, impact: 'negative', detail: 'Ammonia plant installed 2009 — beyond expected life.' },
      { label: 'Roof condition', score: 55, impact: 'negative', detail: 'Inspection shows 40% membrane deterioration.' },
      { label: 'Sprinkler protection', score: 21, impact: 'positive', detail: 'ESFR system, certification current.' },
      { label: 'Business interruption', score: 66, impact: 'negative', detail: '$4.8M BI exposure on perishable inventory.' },
      { label: 'Loss history', score: 33, impact: 'neutral', detail: 'One machinery claim in 2023.' },
    ],
    riskScore: 63,
    premiumIndication: 84600,
    coverageLimit: 18000000,
    deductible: 25000,
    referralReason: null,
    conditions: [],
    documentsRequired: ['Roof inspection report', 'Ammonia plant certification', 'BI worksheet'],
    documentsReceived: [],
    aiRecommendation: 'refer',
    aiConfidence: 0.74,
    priority: 'high',
    notes: 'Awaiting risk-engineering site survey scheduled 2026-10-09.',
  },
];

/* ========================================================================== */
/*  15. Risk assessments — 8 records                                          */
/* ========================================================================== */

const MOCK_RISK_BASE: Omit<
  RiskAssessment,
  'entity' | 'exposure' | 'inherentRisk' | 'residualRisk' | 'controlEffectiveness' | 'lastReview' | 'nextReview'
>[] = [
  {
    id: 'rsk_001',
    subjectId: 'pol_008',
    subjectName: 'Cedar Grove Apartments — Buildings A–D',
    subjectType: 'property',
    assessedAt: '2026-09-02T10:15:00.000Z',
    assessor: 'Risk Engineering — Tobias Lindgren',
    methodology: 'Property risk scoring model (ISO-based)',
    modelVersion: 'prop-score-v5.2',
    score: 76,
    grade: 'D',
    level: 'high',
    residualLevel: 'high',
    factors: [
      { name: 'Plumbing system age', weight: 0.25, score: 88, rating: 'unfavorable', detail: 'Galvanized supply lines original to 1978 construction.' },
      { name: 'Water damage history', weight: 0.2, score: 84, rating: 'unfavorable', detail: 'Two water losses in 14 months.' },
      { name: 'Roof condition', weight: 0.15, score: 52, rating: 'neutral', detail: 'Replaced 2019 — 7 years into a 20-year membrane.' },
      { name: 'Sprinkler protection', weight: 0.15, score: 24, rating: 'favorable', detail: 'Fully sprinklered, certification current.' },
      { name: 'Housekeeping', weight: 0.1, score: 46, rating: 'neutral', detail: 'Storage combustibles in two basement areas.' },
      { name: 'Fire department access', weight: 0.15, score: 30, rating: 'favorable', detail: 'Hydrant within 150 ft of all buildings.' },
    ],
    hazardScore: 74,
    vulnerabilityScore: 79,
    exposureScore: 71,
    mitigationScore: 38,
    recommendations: [
      'Replace galvanized supply lines in Buildings A and B within 12 months',
      'Install water-leak detection sensors on all risers',
      'Clear basement storage of combustibles and mark fire lanes',
    ],
    trend: 'deteriorating',
    status: 'current',
    nextReviewAt: '2027-03-02',
  },
  {
    id: 'rsk_002',
    subjectId: 'prod_007',
    subjectName: 'CyberDefend Pro portfolio — Q3 2026',
    subjectType: 'business',
    assessedAt: '2026-08-31T14:40:00.000Z',
    assessor: 'Portfolio Analytics — Noah Farraday',
    methodology: 'Cyber accumulation and control posture review',
    modelVersion: 'cyber-accum-v2.1',
    score: 54,
    grade: 'C',
    level: 'medium',
    residualLevel: 'medium',
    factors: [
      { name: 'Concentration risk', weight: 0.3, score: 68, rating: 'unfavorable', detail: '22% of in-force limit in the tech sector.' },
      { name: 'Control maturity', weight: 0.25, score: 52, rating: 'neutral', detail: 'Median MFA adoption of 61% across insureds.' },
      { name: 'Ransomware frequency', weight: 0.2, score: 64, rating: 'unfavorable', detail: 'Three events in the last two quarters.' },
      { name: 'Retentions adequacy', weight: 0.15, score: 32, rating: 'favorable', detail: 'Average retention $42k against $168k severity.' },
      { name: 'Reinsurance capacity', weight: 0.1, score: 26, rating: 'favorable', detail: 'Quota share covers 65% of the cyber tower.' },
    ],
    hazardScore: 58,
    vulnerabilityScore: 61,
    exposureScore: 55,
    mitigationScore: 44,
    recommendations: [
      'Introduce a minimum MFA condition for limit above $5M',
      'Reduce single-sector accumulation to 18% of in-force limit',
      'Refresh ransomware severity assumptions at 1/1 renewal',
    ],
    trend: 'stable',
    status: 'current',
    nextReviewAt: '2026-12-01',
  },
  {
    id: 'rsk_003',
    subjectId: 'pol_014',
    subjectName: 'Trident Marine — 14 active trade lanes',
    subjectType: 'policy',
    assessedAt: '2026-07-16T09:22:00.000Z',
    assessor: 'Marine Underwriting — Grant McAllister',
    methodology: 'Cargo accumulation and lane hazard review',
    modelVersion: 'cargo-risk-v3.0',
    score: 49,
    grade: 'C',
    level: 'medium',
    residualLevel: 'low',
    factors: [
      { name: 'Reefer dependency', weight: 0.3, score: 67, rating: 'unfavorable', detail: '40% of tonnage is temperature-controlled.' },
      { name: 'Lane concentration', weight: 0.2, score: 58, rating: 'neutral', detail: 'Two lanes carry 61% of annual tonnage.' },
      { name: 'Telemetry coverage', weight: 0.2, score: 14, rating: 'favorable', detail: 'Continuous temperature logging on all reefer units.' },
      { name: 'Claims experience', weight: 0.15, score: 36, rating: 'favorable', detail: 'One moderate spoilage loss in 3 years.' },
      { name: 'Packing standards', weight: 0.15, score: 28, rating: 'favorable', detail: 'Pack-out protocol audited annually.' },
    ],
    hazardScore: 52,
    vulnerabilityScore: 47,
    exposureScore: 58,
    mitigationScore: 22,
    recommendations: [
      'Keep reefer telemetry a condition of the temperature endorsement',
      'Diversify the two dominant lanes or cap accumulation per sailing',
    ],
    trend: 'improving',
    status: 'current',
    nextReviewAt: '2027-01-16',
  },
  {
    id: 'rsk_004',
    subjectId: 'cust_006',
    subjectName: 'Summit Ridge Construction Inc.',
    subjectType: 'customer',
    assessedAt: '2026-06-18T11:05:00.000Z',
    assessor: 'Risk Engineering — Miles Okafor',
    methodology: 'Commercial risk quality index',
    modelVersion: 'commercial-risk-v4.4',
    score: 58,
    grade: 'C',
    level: 'medium',
    residualLevel: 'medium',
    factors: [
      { name: 'Safety program', weight: 0.25, score: 44, rating: 'neutral', detail: 'Written program exists; audit cadence is semiannual.' },
      { name: 'Subcontractor control', weight: 0.2, score: 72, rating: 'unfavorable', detail: 'Certificates lapse for 18% of subcontractors.' },
      { name: 'Equipment maintenance', weight: 0.15, score: 40, rating: 'neutral', detail: 'Preventive maintenance logs complete for 2026.' },
      { name: 'Financial stability', weight: 0.2, score: 55, rating: 'neutral', detail: 'Current ratio 1.3; backlog of 9 months.' },
      { name: 'Weather exposure', weight: 0.2, score: 63, rating: 'unfavorable', detail: 'Three wind events affected jobsites since 2024.' },
    ],
    hazardScore: 61,
    vulnerabilityScore: 57,
    exposureScore: 64,
    mitigationScore: 48,
    recommendations: [
      'Enforce subcontractor certificate collection before site access',
      'Move to quarterly safety audits for the next two terms',
      'Review wind deductibles at the February renewal',
    ],
    trend: 'stable',
    status: 'current',
    nextReviewAt: '2026-12-18',
  },
  {
    id: 'rsk_005',
    subjectId: 'pol_010',
    subjectName: 'Quantum Layer Technologies — production cloud estate',
    subjectType: 'policy',
    assessedAt: '2026-08-27T16:12:00.000Z',
    assessor: 'Cyber Risk — Hannah Whitmore',
    methodology: 'Control-based cyber maturity assessment',
    modelVersion: 'cyber-control-v6.1',
    score: 47,
    grade: 'B',
    level: 'medium',
    residualLevel: 'low',
    factors: [
      { name: 'Identity and access', weight: 0.25, score: 34, rating: 'favorable', detail: 'SSO with hardware keys for all privileged accounts.' },
      { name: 'Backup and recovery', weight: 0.2, score: 30, rating: 'favorable', detail: 'Immutable backups tested monthly since the July event.' },
      { name: 'Endpoint detection', weight: 0.2, score: 42, rating: 'neutral', detail: 'EDR deployed across 99% of managed endpoints.' },
      { name: 'Third-party risk', weight: 0.15, score: 66, rating: 'unfavorable', detail: 'Four vendors hold production data without current audits.' },
      { name: 'Employee training', weight: 0.2, score: 51, rating: 'neutral', detail: 'Phishing simulation click rate of 6.4%.' },
    ],
    hazardScore: 44,
    vulnerabilityScore: 41,
    exposureScore: 58,
    mitigationScore: 33,
    recommendations: [
      'Complete vendor security reviews for the four unaudited suppliers',
      'Reduce phishing click rate below 4% by year end',
      'Maintain monthly restore testing as a policy condition',
    ],
    trend: 'improving',
    status: 'current',
    nextReviewAt: '2027-02-27',
  },
  {
    id: 'rsk_006',
    subjectId: 'cust_005',
    subjectName: 'Nadia Farouk — personal auto profile',
    subjectType: 'customer',
    assessedAt: '2026-09-19T15:10:00.000Z',
    assessor: 'Automated rating — auto-risk-v4',
    methodology: 'Driver behaviour and loss-cost model',
    modelVersion: 'driver-risk-v4.0',
    score: 71,
    grade: 'D',
    level: 'high',
    residualLevel: 'high',
    factors: [
      { name: 'At-fault frequency', weight: 0.35, score: 82, rating: 'unfavorable', detail: 'Two at-fault losses in 36 months.' },
      { name: 'Violations', weight: 0.2, score: 58, rating: 'unfavorable', detail: 'One speeding citation in 2025.' },
      { name: 'Telematics participation', weight: 0.15, score: 74, rating: 'unfavorable', detail: 'Declined twice — no driving data available.' },
      { name: 'Tenure', weight: 0.15, score: 18, rating: 'favorable', detail: 'Five consecutive years with InsureFlow.' },
      { name: 'Payment behaviour', weight: 0.15, score: 66, rating: 'unfavorable', detail: 'Currently in a grace period on the installment plan.' },
    ],
    hazardScore: 74,
    vulnerabilityScore: 68,
    exposureScore: 66,
    mitigationScore: 55,
    recommendations: [
      'Require telematics for the 2027 renewal term',
      'Move to paid-in-full to lift the grace-period surcharge',
      'Re-underwrite at the next renewal rather than mid-term',
    ],
    trend: 'deteriorating',
    status: 'current',
    nextReviewAt: '2027-06-20',
  },
  {
    id: 'rsk_007',
    subjectId: 'pol_006',
    subjectName: 'Summit Ridge — Ridgeline Parkway jobsite',
    subjectType: 'property',
    assessedAt: '2026-05-21T13:48:00.000Z',
    assessor: 'Risk Engineering — Miles Okafor',
    methodology: 'Construction site hazard review',
    modelVersion: 'site-hazard-v2.7',
    score: 41,
    grade: 'B',
    level: 'medium',
    residualLevel: 'low',
    factors: [
      { name: 'Wind exposure', weight: 0.3, score: 58, rating: 'neutral', detail: 'Open plain with prevailing summer winds.' },
      { name: 'Material storage', weight: 0.25, score: 36, rating: 'favorable', detail: 'Tarpaulin and ballasting protocol in force.' },
      { name: 'Temporary structures', weight: 0.2, score: 42, rating: 'neutral', detail: 'Anchored to manufacturer spec, inspected monthly.' },
      { name: 'Site security', weight: 0.15, score: 24, rating: 'favorable', detail: 'Perimeter fencing and overnight patrols.' },
      { name: 'Loss history', weight: 0.1, score: 34, rating: 'favorable', detail: 'One wind loss in 2026, mitigated by deforestation buffer.' },
    ],
    hazardScore: 46,
    vulnerabilityScore: 38,
    exposureScore: 44,
    mitigationScore: 24,
    recommendations: [
      'Re-verify ballast calculations before the winter storm season',
      'Photograph material staging weekly for claim documentation',
    ],
    trend: 'improving',
    status: 'current',
    nextReviewAt: '2026-11-21',
  },
  {
    id: 'rsk_008',
    subjectId: 'pol_002',
    subjectName: 'Bennett & Cole — 48-unit fleet',
    subjectType: 'vehicle',
    assessedAt: '2026-06-30T08:30:00.000Z',
    assessor: 'Fleet Risk — Grant McAllister',
    methodology: 'Telematics-adjusted fleet risk score',
    modelVersion: 'fleet-score-v3.6',
    score: 62,
    grade: 'D',
    level: 'high',
    residualLevel: 'medium',
    factors: [
      { name: 'Hard-braking frequency', weight: 0.25, score: 71, rating: 'unfavorable', detail: '14 events per 1,000 miles against a portfolio median of 9.' },
      { name: 'Speeding exposure', weight: 0.2, score: 64, rating: 'unfavorable', detail: '8% of miles above the posted limit + 5 mph.' },
      { name: 'Night driving share', weight: 0.15, score: 58, rating: 'neutral', detail: '23% of miles between 10pm and 5am.' },
      { name: 'Driver tenure', weight: 0.2, score: 34, rating: 'favorable', detail: 'Average driver tenure of 4.2 years.' },
      { name: 'Training completion', weight: 0.2, score: 27, rating: 'favorable', detail: 'Defensive driving completed by 91% of drivers.' },
    ],
    hazardScore: 66,
    vulnerabilityScore: 58,
    exposureScore: 63,
    mitigationScore: 42,
    recommendations: [
      'Coach the bottom-decile drivers on hard-braking events',
      'Review the 10pm–5am routing rules with the dispatcher',
      'Keep the telematics discount tied to a 12-month data window',
    ],
    trend: 'stable',
    status: 'current',
    nextReviewAt: '2026-12-30',
  },
];

/* ========================================================================== */
/*  16. Premium ledger — 9 months                                             */
/* ========================================================================== */

export const MOCK_PREMIUMS: PremiumMonth[] = [
  {
    id: 'prm_2026_01',
    month: '2026-01',
    label: 'Jan 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-01-31',
    writtenPremium: 41_200_000,
    earnedPremium: 39_840_000,
    unearnedPremium: 1_360_000,
    newBusinessPremium: 11_400_000,
    renewalPremium: 29_800_000,
    premiumCollected: 37_920_000,
    premiumOutstanding: 1_920_000,
    refundsIssued: 412_000,
    commissionPaid: 4_118_000,
    claimsIncurred: 24_180_000,
    claimsPaid: 22_640_000,
    policiesIssued: 8_420,
    policiesCancelled: 1_180,
    lossRatio: 0.607,
    expenseRatio: 0.281,
    combinedRatio: 0.888,
    growthPercent: 0,
  },
  {
    id: 'prm_2026_02',
    month: '2026-02',
    label: 'Feb 2026',
    periodStart: '2026-02-01',
    periodEnd: '2026-02-28',
    writtenPremium: 42_650_000,
    earnedPremium: 41_120_000,
    unearnedPremium: 1_530_000,
    newBusinessPremium: 12_180_000,
    renewalPremium: 30_470_000,
    premiumCollected: 39_410_000,
    premiumOutstanding: 1_710_000,
    refundsIssued: 386_000,
    commissionPaid: 4_265_000,
    claimsIncurred: 24_710_000,
    claimsPaid: 23_180_000,
    policiesIssued: 8_610,
    policiesCancelled: 1_090,
    lossRatio: 0.601,
    expenseRatio: 0.279,
    combinedRatio: 0.88,
    growthPercent: 3.52,
  },
  {
    id: 'prm_2026_03',
    month: '2026-03',
    label: 'Mar 2026',
    periodStart: '2026-03-01',
    periodEnd: '2026-03-31',
    writtenPremium: 44_180_000,
    earnedPremium: 42_610_000,
    unearnedPremium: 1_570_000,
    newBusinessPremium: 13_060_000,
    renewalPremium: 31_120_000,
    premiumCollected: 40_880_000,
    premiumOutstanding: 1_730_000,
    refundsIssued: 401_000,
    commissionPaid: 4_418_000,
    claimsIncurred: 25_940_000,
    claimsPaid: 24_020_000,
    policiesIssued: 8_940,
    policiesCancelled: 1_140,
    lossRatio: 0.609,
    expenseRatio: 0.277,
    combinedRatio: 0.886,
    growthPercent: 3.59,
  },
  {
    id: 'prm_2026_04',
    month: '2026-04',
    label: 'Apr 2026',
    periodStart: '2026-04-01',
    periodEnd: '2026-04-30',
    writtenPremium: 45_760_000,
    earnedPremium: 44_090_000,
    unearnedPremium: 1_670_000,
    newBusinessPremium: 13_740_000,
    renewalPremium: 32_020_000,
    premiumCollected: 42_140_000,
    premiumOutstanding: 1_950_000,
    refundsIssued: 438_000,
    commissionPaid: 4_576_000,
    claimsIncurred: 27_790_000,
    claimsPaid: 25_610_000,
    policiesIssued: 9_180,
    policiesCancelled: 1_220,
    lossRatio: 0.63,
    expenseRatio: 0.276,
    combinedRatio: 0.906,
    growthPercent: 3.58,
  },
  {
    id: 'prm_2026_05',
    month: '2026-05',
    label: 'May 2026',
    periodStart: '2026-05-01',
    periodEnd: '2026-05-31',
    writtenPremium: 46_940_000,
    earnedPremium: 45_380_000,
    unearnedPremium: 1_560_000,
    newBusinessPremium: 14_080_000,
    renewalPremium: 32_860_000,
    premiumCollected: 43_610_000,
    premiumOutstanding: 1_770_000,
    refundsIssued: 452_000,
    commissionPaid: 4_694_000,
    claimsIncurred: 28_540_000,
    claimsPaid: 26_930_000,
    policiesIssued: 9_310,
    policiesCancelled: 1_160,
    lossRatio: 0.629,
    expenseRatio: 0.278,
    combinedRatio: 0.907,
    growthPercent: 2.58,
  },
  {
    id: 'prm_2026_06',
    month: '2026-06',
    label: 'Jun 2026',
    periodStart: '2026-06-01',
    periodEnd: '2026-06-30',
    writtenPremium: 48_320_000,
    earnedPremium: 46_740_000,
    unearnedPremium: 1_580_000,
    newBusinessPremium: 14_960_000,
    renewalPremium: 33_360_000,
    premiumCollected: 44_980_000,
    premiumOutstanding: 1_760_000,
    refundsIssued: 467_000,
    commissionPaid: 4_832_000,
    claimsIncurred: 29_450_000,
    claimsPaid: 27_640_000,
    policiesIssued: 9_560,
    policiesCancelled: 1_210,
    lossRatio: 0.63,
    expenseRatio: 0.275,
    combinedRatio: 0.905,
    growthPercent: 2.94,
  },
  {
    id: 'prm_2026_07',
    month: '2026-07',
    label: 'Jul 2026',
    periodStart: '2026-07-01',
    periodEnd: '2026-07-31',
    writtenPremium: 49_810_000,
    earnedPremium: 48_160_000,
    unearnedPremium: 1_650_000,
    newBusinessPremium: 15_740_000,
    renewalPremium: 34_070_000,
    premiumCollected: 46_220_000,
    premiumOutstanding: 1_940_000,
    refundsIssued: 489_000,
    commissionPaid: 4_981_000,
    claimsIncurred: 31_300_000,
    claimsPaid: 28_910_000,
    policiesIssued: 9_720,
    policiesCancelled: 1_240,
    lossRatio: 0.65,
    expenseRatio: 0.276,
    combinedRatio: 0.926,
    growthPercent: 3.08,
  },
  {
    id: 'prm_2026_08',
    month: '2026-08',
    label: 'Aug 2026',
    periodStart: '2026-08-01',
    periodEnd: '2026-08-31',
    writtenPremium: 51_420_000,
    earnedPremium: 49_740_000,
    unearnedPremium: 1_680_000,
    newBusinessPremium: 16_310_000,
    renewalPremium: 35_110_000,
    premiumCollected: 47_690_000,
    premiumOutstanding: 2_030_000,
    refundsIssued: 512_000,
    commissionPaid: 5_142_000,
    claimsIncurred: 32_330_000,
    claimsPaid: 30_140_000,
    policiesIssued: 9_940,
    policiesCancelled: 1_190,
    lossRatio: 0.65,
    expenseRatio: 0.274,
    combinedRatio: 0.924,
    growthPercent: 3.23,
  },
  {
    id: 'prm_2026_09',
    month: '2026-09',
    label: 'Sep 2026',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-30',
    writtenPremium: 52_970_000,
    earnedPremium: 33_260_000,
    unearnedPremium: 19_710_000,
    newBusinessPremium: 16_840_000,
    renewalPremium: 36_130_000,
    premiumCollected: 31_480_000,
    premiumOutstanding: 1_780_000,
    refundsIssued: 528_000,
    commissionPaid: 5_297_000,
    claimsIncurred: 20_430_000,
    claimsPaid: 18_760_000,
    policiesIssued: 10_180,
    policiesCancelled: 1_070,
    lossRatio: 0.614,
    expenseRatio: 0.273,
    combinedRatio: 0.887,
    growthPercent: 3.01,
  },
];

/* ========================================================================== */
/*  17. Payments — 12 records                                                 */
/* ========================================================================== */

const MOCK_PAYMENTS_BASE: Omit<Payment, 'dueDate' | 'customer' | 'paidDate' | 'installments'>[] = [
  {
    id: 'pay_001',
    reference: 'PAY-2026-09184',
    policyId: 'pol_001',
    policyNumber: 'IF-POL-2026-0001',
    customerId: 'cust_001',
    customerName: 'Amelia Thornton',
    amount: 153.5,
    currency: 'USD',
    method: 'card',
    methodDetail: 'Visa •••• 4821',
    status: 'succeeded',
    dueAt: '2026-09-01',
    paidAt: '2026-09-01T06:12:00.000Z',
    processedAt: '2026-09-01T06:12:04.000Z',
    installment: 7,
    ofInstallments: 12,
    attemptNumber: 1,
    failureReason: null,
    feeAmount: 0.46,
    netAmount: 153.04,
    gatewayRef: 'ch_3PqR82xKd',
    receiptUrl: '/receipts/PAY-2026-09184',
    createdAt: '2026-09-01T06:12:00.000Z',
    updatedAt: '2026-09-01T06:12:04.000Z',
  },
  {
    id: 'pay_002',
    reference: 'PAY-2026-09177',
    policyId: 'pol_005',
    policyNumber: 'IF-POL-2026-0063',
    customerId: 'cust_005',
    customerName: 'Nadia Farouk',
    amount: 200.83,
    currency: 'USD',
    method: 'card',
    methodDetail: 'Mastercard •••• 6107',
    status: 'past_due',
    dueAt: '2026-09-20',
    paidAt: null,
    processedAt: null,
    installment: 4,
    ofInstallments: 12,
    attemptNumber: 2,
    failureReason: 'Insufficient funds — issuer declined',
    feeAmount: 0,
    netAmount: 0,
    gatewayRef: 'ch_3PnB41wQm',
    receiptUrl: null,
    createdAt: '2026-09-20T06:00:00.000Z',
    updatedAt: '2026-09-23T06:00:00.000Z',
  },
  {
    id: 'pay_003',
    reference: 'PAY-2026-09166',
    policyId: 'pol_006',
    policyNumber: 'IF-POL-2026-0071',
    customerId: 'cust_006',
    customerName: 'Summit Ridge Construction Inc.',
    amount: 11700,
    currency: 'USD',
    method: 'ach',
    methodDetail: 'Chase •••• 3390',
    status: 'succeeded',
    dueAt: '2026-08-01',
    paidAt: '2026-07-30T14:48:00.000Z',
    processedAt: '2026-08-02T09:15:00.000Z',
    installment: 3,
    ofInstallments: 4,
    attemptNumber: 1,
    failureReason: null,
    feeAmount: 0,
    netAmount: 11700,
    gatewayRef: 'ach_9TfL27bVc',
    receiptUrl: '/receipts/PAY-2026-09166',
    createdAt: '2026-07-30T14:48:00.000Z',
    updatedAt: '2026-08-02T09:15:00.000Z',
  },
  {
    id: 'pay_004',
    reference: 'PAY-2026-09154',
    policyId: 'pol_017',
    policyNumber: 'IF-POL-2026-0162',
    customerId: 'cust_006',
    customerName: 'Summit Ridge Construction Inc.',
    amount: 1533.33,
    currency: 'USD',
    method: 'ach',
    methodDetail: 'Chase •••• 3390',
    status: 'failed',
    dueAt: '2026-09-05',
    paidAt: null,
    processedAt: '2026-09-05T06:04:00.000Z',
    installment: 4,
    ofInstallments: 12,
    attemptNumber: 2,
    failureReason: 'Account closed — return code R02',
    feeAmount: 0,
    netAmount: 0,
    gatewayRef: 'ach_9TfL31bVc',
    receiptUrl: null,
    createdAt: '2026-08-28T06:00:00.000Z',
    updatedAt: '2026-09-05T06:04:00.000Z',
  },
  {
    id: 'pay_005',
    reference: 'PAY-2026-09142',
    policyId: 'pol_010',
    policyNumber: 'IF-POL-2026-0096',
    customerId: 'cust_010',
    customerName: 'Quantum Layer Technologies Inc.',
    amount: 6125,
    currency: 'USD',
    method: 'wire',
    methodDetail: 'Wells Fargo •••• 8874',
    status: 'succeeded',
    dueAt: '2026-09-01',
    paidAt: '2026-08-29T17:22:00.000Z',
    processedAt: '2026-08-31T10:03:00.000Z',
    installment: 3,
    ofInstallments: 4,
    attemptNumber: 1,
    failureReason: null,
    feeAmount: 15,
    netAmount: 6110,
    gatewayRef: 'wire_77hKp0sNa',
    receiptUrl: '/receipts/PAY-2026-09142',
    createdAt: '2026-08-29T17:22:00.000Z',
    updatedAt: '2026-08-31T10:03:00.000Z',
  },
  {
    id: 'pay_006',
    reference: 'PAY-2026-09131',
    policyId: 'pol_012',
    policyNumber: 'IF-POL-2025-0555',
    customerId: 'cust_012',
    customerName: 'Willowbrook Veterinary Clinic',
    amount: 496.67,
    currency: 'USD',
    method: 'direct_debit',
    methodDetail: 'Bank of America •••• 1276',
    status: 'processing',
    dueAt: '2026-09-20',
    paidAt: '2026-09-19T08:41:00.000Z',
    processedAt: null,
    installment: 12,
    ofInstallments: 12,
    attemptNumber: 1,
    failureReason: null,
    feeAmount: 0,
    netAmount: 496.67,
    gatewayRef: 'dd_5RwE84jQu',
    receiptUrl: null,
    createdAt: '2026-09-19T08:41:00.000Z',
    updatedAt: '2026-09-19T08:41:00.000Z',
  },
  {
    id: 'pay_007',
    reference: 'PAY-2026-09120',
    policyId: 'pol_019',
    policyNumber: 'IF-POL-2026-0175',
    customerId: 'cust_004',
    customerName: 'Harbor Point Dental Group',
    amount: -1246,
    currency: 'USD',
    method: 'check',
    methodDetail: 'Check #10482',
    status: 'refunded',
    dueAt: '2026-05-02',
    paidAt: '2026-05-06T11:14:00.000Z',
    processedAt: '2026-05-11T15:40:00.000Z',
    installment: 0,
    ofInstallments: 0,
    attemptNumber: 1,
    failureReason: null,
    feeAmount: 0,
    netAmount: -1246,
    gatewayRef: 'ref_2QmAz6tYi',
    receiptUrl: '/receipts/PAY-2026-09120',
    createdAt: '2026-05-06T11:14:00.000Z',
    updatedAt: '2026-05-11T15:40:00.000Z',
  },
  {
    id: 'pay_008',
    reference: 'PAY-2026-09108',
    policyId: 'pol_002',
    policyNumber: 'IF-POL-2025-0148',
    customerId: 'cust_002',
    customerName: 'Bennett & Cole Logistics LLC',
    amount: 2370.83,
    currency: 'USD',
    method: 'ach',
    methodDetail: 'Chase •••• 7741',
    status: 'succeeded',
    dueAt: '2026-09-15',
    paidAt: '2026-09-13T13:05:00.000Z',
    processedAt: '2026-09-15T08:20:00.000Z',
    installment: 11,
    ofInstallments: 12,
    attemptNumber: 1,
    failureReason: null,
    feeAmount: 0,
    netAmount: 2370.83,
    gatewayRef: 'ach_9TfL58bVc',
    receiptUrl: '/receipts/PAY-2026-09108',
    createdAt: '2026-09-13T13:05:00.000Z',
    updatedAt: '2026-09-15T08:20:00.000Z',
  },
  {
    id: 'pay_009',
    reference: 'PAY-2026-09094',
    policyId: 'pol_014',
    policyNumber: 'IF-POL-2026-0015',
    customerId: 'cust_014',
    customerName: 'Trident Marine Freight Co.',
    amount: 15600,
    currency: 'USD',
    method: 'wire',
    methodDetail: 'Citi •••• 9902',
    status: 'succeeded',
    dueAt: '2026-09-01',
    paidAt: '2026-08-31T09:52:00.000Z',
    processedAt: '2026-09-01T12:11:00.000Z',
    installment: 3,
    ofInstallments: 4,
    attemptNumber: 1,
    failureReason: null,
    feeAmount: 15,
    netAmount: 15585,
    gatewayRef: 'wire_77hKp9sNa',
    receiptUrl: '/receipts/PAY-2026-09094',
    createdAt: '2026-08-31T09:52:00.000Z',
    updatedAt: '2026-09-01T12:11:00.000Z',
  },
  {
    id: 'pay_010',
    reference: 'PAY-2026-09081',
    policyId: 'pol_008',
    policyNumber: 'IF-POL-2025-0666',
    customerId: 'cust_008',
    customerName: 'Cedar Grove Apartments LLC',
    amount: 3241.67,
    currency: 'USD',
    method: 'ach',
    methodDetail: 'US Bank •••• 5518',
    status: 'succeeded',
    dueAt: '2026-09-01',
    paidAt: '2026-08-31T16:30:00.000Z',
    processedAt: '2026-09-02T08:44:00.000Z',
    installment: 10,
    ofInstallments: 12,
    attemptNumber: 1,
    failureReason: null,
    feeAmount: 0,
    netAmount: 3241.67,
    gatewayRef: 'ach_9TfL64bVc',
    receiptUrl: '/receipts/PAY-2026-09081',
    createdAt: '2026-08-31T16:30:00.000Z',
    updatedAt: '2026-09-02T08:44:00.000Z',
  },
  {
    id: 'pay_011',
    reference: 'PAY-2026-09067',
    policyId: 'pol_011',
    policyNumber: 'IF-POL-2026-0112',
    customerId: 'cust_011',
    customerName: 'Marcus Oyelaran',
    amount: 1650,
    currency: 'USD',
    method: 'paypal',
    methodDetail: 'PayPal • marcus.o@example.com',
    status: 'canceled',
    dueAt: '2026-09-01',
    paidAt: null,
    processedAt: '2026-09-01T18:04:00.000Z',
    installment: 3,
    ofInstallments: 12,
    attemptNumber: 1,
    failureReason: 'Payer canceled the authorization at the wallet',
    feeAmount: 0,
    netAmount: 0,
    gatewayRef: 'pp_4XdW19kBr',
    receiptUrl: null,
    createdAt: '2026-08-25T18:04:00.000Z',
    updatedAt: '2026-09-01T18:04:00.000Z',
  },
  {
    id: 'pay_012',
    reference: 'PAY-2026-09052',
    policyId: 'pol_007',
    policyNumber: 'IF-POL-2026-0104',
    customerId: 'cust_007',
    customerName: 'Julian Vasquez',
    amount: 230,
    currency: 'USD',
    method: 'card',
    methodDetail: 'Visa •••• 3390',
    status: 'processing',
    dueAt: '2026-09-28',
    paidAt: '2026-09-24T20:11:00.000Z',
    processedAt: null,
    installment: 1,
    ofInstallments: 12,
    attemptNumber: 1,
    failureReason: null,
    feeAmount: 0.69,
    netAmount: 229.31,
    gatewayRef: 'ch_3PqR19xKd',
    receiptUrl: null,
    createdAt: '2026-09-24T20:11:00.000Z',
    updatedAt: '2026-09-24T20:11:00.000Z',
  },
];


/* ========================================================================== */
/*  18. Reserves — 8 records                                                  */
/* ========================================================================== */

const MOCK_RESERVES_BASE: Omit<Reserve, 'paid' | 'reserveType' | 'opened' | 'claimant' | 'adjuster' | 'lastReview'>[] = [
  {
    id: 'rsv_001',
    claimId: 'clm_012',
    claimNumber: 'IF-CLM-2026-3051',
    policyNumber: 'IF-POL-2025-0666',
    reserveCategory: 'indemnity',
    initialReserve: 180000,
    currentReserve: 255000,
    caseReserve: 255000,
    ibnrAmount: 0,
    paidToDate: 15000,
    remainingReserve: 240000,
    varianceAmount: 75000,
    monthsOpen: 8,
    status: 'increase_requested',
    setBy: 'Aisha Bello',
    reviewedBy: null,
    reviewedAt: null,
    lastChangeAt: '2026-09-23T09:52:00.000Z',
    lastChangeReason: 'Claimant medicals exceed initial prognosis ahead of mediation.',
    nextReviewAt: '2026-10-14',
  },
  {
    id: 'rsv_002',
    claimId: 'clm_007',
    claimNumber: 'IF-CLM-2026-3115',
    policyNumber: 'IF-POL-2026-0096',
    reserveCategory: 'expense',
    initialReserve: 180000,
    currentReserve: 230000,
    caseReserve: 140000,
    ibnrAmount: 90000,
    paidToDate: 410000,
    remainingReserve: 230000,
    varianceAmount: 50000,
    monthsOpen: 2,
    status: 'under_review',
    setBy: 'Hannah Whitmore',
    reviewedBy: 'Noah Farraday',
    reviewedAt: '2026-09-05T11:30:00.000Z',
    lastChangeAt: '2026-09-05T11:30:00.000Z',
    lastChangeReason: 'Business interruption worksheet projected an extra $50k of payroll continuation.',
    nextReviewAt: '2026-10-02',
  },
  {
    id: 'rsv_003',
    claimId: 'clm_002',
    claimNumber: 'IF-CLM-2026-3176',
    policyNumber: 'IF-POL-2025-0148',
    reserveCategory: 'indemnity',
    initialReserve: 320000,
    currentReserve: 450000,
    caseReserve: 450000,
    ibnrAmount: 0,
    paidToDate: 0,
    remainingReserve: 450000,
    varianceAmount: 130000,
    monthsOpen: 2,
    status: 'under_review',
    setBy: 'Grant McAllister',
    reviewedBy: 'Aisha Bello',
    reviewedAt: '2026-09-08T15:20:00.000Z',
    lastChangeAt: '2026-09-08T15:20:00.000Z',
    lastChangeReason: 'Third-party cargo claim added to the exposure after the initial reserve.',
    nextReviewAt: '2026-10-05',
  },
  {
    id: 'rsv_004',
    claimId: 'clm_003',
    claimNumber: 'IF-CLM-2026-3164',
    policyNumber: 'IF-POL-2025-0666',
    reserveCategory: 'indemnity',
    initialReserve: 45000,
    currentReserve: 28900,
    caseReserve: 28900,
    ibnrAmount: 0,
    paidToDate: 30000,
    remainingReserve: 28900,
    varianceAmount: -16100,
    monthsOpen: 2,
    status: 'adequate',
    setBy: 'Tobias Lindgren',
    reviewedBy: 'Tobias Lindgren',
    reviewedAt: '2026-09-18T16:40:00.000Z',
    lastChangeAt: '2026-09-18T16:40:00.000Z',
    lastChangeReason: 'Mold scope narrower than feared — reserve reduced after vendor scope.',
    nextReviewAt: '2026-10-06',
  },
  {
    id: 'rsv_005',
    claimId: 'clm_005',
    claimNumber: 'IF-CLM-2026-3140',
    policyNumber: 'IF-POL-2026-0057',
    reserveCategory: 'medical',
    initialReserve: 12000,
    currentReserve: 18000,
    caseReserve: 18000,
    ibnrAmount: 0,
    paidToDate: 0,
    remainingReserve: 18000,
    varianceAmount: 6000,
    monthsOpen: 4,
    status: 'under_review',
    setBy: 'Aisha Bello',
    reviewedBy: null,
    reviewedAt: null,
    lastChangeAt: '2026-08-14T10:02:00.000Z',
    lastChangeReason: 'Claimant began physical therapy — medical reserve raised accordingly.',
    nextReviewAt: '2026-09-30',
  },
  {
    id: 'rsv_006',
    claimId: 'clm_008',
    claimNumber: 'IF-CLM-2026-3102',
    policyNumber: 'IF-POL-2026-0112',
    reserveCategory: 'indemnity',
    initialReserve: 24000,
    currentReserve: 21200,
    caseReserve: 21200,
    ibnrAmount: 0,
    paidToDate: 6200,
    remainingReserve: 15000,
    varianceAmount: -2800,
    monthsOpen: 1,
    status: 'adequate',
    setBy: 'Dominic Reyes',
    reviewedBy: 'Aisha Bello',
    reviewedAt: '2026-09-17T10:22:00.000Z',
    lastChangeAt: '2026-09-17T10:22:00.000Z',
    lastChangeReason: 'Light-duty offer accepted — indemnity exposure reduced.',
    nextReviewAt: '2026-10-01',
  },
  {
    id: 'rsv_007',
    claimId: 'clm_020',
    claimNumber: 'IF-CLM-2026-2947',
    policyNumber: 'IF-POL-2026-0162',
    reserveCategory: 'legal',
    initialReserve: 8000,
    currentReserve: 12400,
    caseReserve: 12400,
    ibnrAmount: 0,
    paidToDate: 0,
    remainingReserve: 12400,
    varianceAmount: 4400,
    monthsOpen: 13,
    status: 'increase_requested',
    setBy: 'Grant McAllister',
    reviewedBy: null,
    reviewedAt: null,
    lastChangeAt: '2026-09-12T10:15:00.000Z',
    lastChangeReason: 'Reopened with a formal demand letter served on the claimant.',
    nextReviewAt: '2026-09-30',
  },
  {
    id: 'rsv_008',
    claimId: 'clm_013',
    claimNumber: 'IF-CLM-2026-3040',
    policyNumber: 'IF-POL-2026-0063',
    reserveCategory: 'indemnity',
    initialReserve: 18500,
    currentReserve: 0,
    caseReserve: 0,
    ibnrAmount: 0,
    paidToDate: 0,
    remainingReserve: 0,
    varianceAmount: -18500,
    monthsOpen: 9,
    status: 'released',
    setBy: 'Priyanka Nair',
    reviewedBy: 'Priyanka Nair',
    reviewedAt: '2026-08-30T17:26:00.000Z',
    lastChangeAt: '2026-08-30T17:26:00.000Z',
    lastChangeReason: 'Coverage denied after SIU review — reserve released in full.',
    nextReviewAt: '2026-10-05',
  },
];

/* ========================================================================== */
/*  19. Commissions — 8 records                                               */
/* ========================================================================== */

const MOCK_COMMISSIONS_BASE: Omit<Commission, 'statement' | 'payee' | 'agency' | 'grossPremium' | 'earned'>[] = [
  {
    id: 'cms_001',
    payeeId: 'agnt_001',
    payeeName: 'Marcus Bellweather',
    payeeType: 'agent',
    policyId: 'pol_001',
    policyNumber: 'IF-POL-2026-0001',
    period: '2026-09',
    basePremium: 1842,
    rate: 0.12,
    grossCommission: 221.04,
    overrideAmount: 18.42,
    netCommission: 239.46,
    status: 'approved',
    dueAt: '2026-10-15',
    paidAt: null,
    method: 'ach',
    transactionRef: null,
    ytdTotal: 62140,
    notes: 'New business first installment — includes 8% supervising override.',
  },
  {
    id: 'cms_002',
    payeeId: 'agnt_002',
    payeeName: 'Priya Raghunathan',
    payeeType: 'agent',
    policyId: 'pol_002',
    policyNumber: 'IF-POL-2025-0148',
    period: '2026-09',
    basePremium: 28450,
    rate: 0.1,
    grossCommission: 2845,
    overrideAmount: 0,
    netCommission: 2845,
    status: 'paid',
    dueAt: '2026-09-15',
    paidAt: '2026-09-14T10:22:00.000Z',
    method: 'ach',
    transactionRef: 'ACH-88421907',
    ytdTotal: 148900,
    notes: 'Annual renewal commission paid on the eleventh installment cycle.',
  },
  {
    id: 'cms_003',
    payeeId: 'brkr_001',
    payeeName: 'Ashgrove & Pike Brokers',
    payeeType: 'broker',
    policyId: 'pol_006',
    policyNumber: 'IF-POL-2026-0071',
    period: '2026-09',
    basePremium: 46800,
    rate: 0.14,
    grossCommission: 6552,
    overrideAmount: 468,
    netCommission: 7020,
    status: 'pending',
    dueAt: '2026-10-10',
    paidAt: null,
    method: 'wire',
    transactionRef: null,
    ytdTotal: 1412000,
    notes: 'Includes 1% production bonus on property lines above $40k.',
  },
  {
    id: 'cms_004',
    payeeId: 'agnt_004',
    payeeName: 'Omar Haddad',
    payeeType: 'agent',
    policyId: 'pol_017',
    policyNumber: 'IF-POL-2026-0162',
    period: '2026-09',
    basePremium: 18400,
    rate: 0.11,
    grossCommission: 2024,
    overrideAmount: 0,
    netCommission: 0,
    status: 'reversed',
    dueAt: '2026-09-30',
    paidAt: null,
    method: 'ach',
    transactionRef: 'REV-2026-0442',
    ytdTotal: 49880,
    notes: 'Clawed back after the policy lapsed for non-payment inside the 90-day window.',
  },
  {
    id: 'cms_005',
    payeeId: 'agnt_005',
    payeeName: 'Sofia Marchetti',
    payeeType: 'agent',
    policyId: 'pol_012',
    policyNumber: 'IF-POL-2025-0555',
    period: '2026-09',
    basePremium: 5960,
    rate: 0.115,
    grossCommission: 685.4,
    overrideAmount: 0,
    netCommission: 685.4,
    status: 'pending',
    dueAt: '2026-10-15',
    paidAt: null,
    method: 'ach',
    transactionRef: null,
    ytdTotal: 71450,
    notes: 'Renewal tranche — payable once the renewal is bound.',
  },
  {
    id: 'cms_006',
    payeeId: 'brkr_003',
    payeeName: 'Meridian Marine Placing',
    payeeType: 'broker',
    policyId: 'pol_014',
    policyNumber: 'IF-POL-2026-0015',
    period: '2026-08',
    basePremium: 62400,
    rate: 0.13,
    grossCommission: 8112,
    overrideAmount: 0,
    netCommission: 8112,
    status: 'paid',
    dueAt: '2026-08-31',
    paidAt: '2026-08-28T09:41:00.000Z',
    method: 'wire',
    transactionRef: 'WIRE-77290114',
    ytdTotal: 398700,
    notes: 'Quarterly installment paid ahead of schedule at broker request.',
  },
  {
    id: 'cms_007',
    payeeId: 'agnt_006',
    payeeName: 'Ethan Brackett',
    payeeType: 'agent',
    policyId: 'pol_019',
    policyNumber: 'IF-POL-2026-0175',
    period: '2026-05',
    basePremium: 2180,
    rate: 0.1,
    grossCommission: 218,
    overrideAmount: 0,
    netCommission: -684,
    status: 'clawback',
    dueAt: '2026-05-31',
    paidAt: null,
    method: 'ach',
    transactionRef: 'CLW-2026-0118',
    ytdTotal: 94210,
    notes: 'Cancellation refund offsets commissions already advanced for this policy.',
  },
  {
    id: 'cms_008',
    payeeId: 'agnt_007',
    payeeName: 'Grace Okonkwo',
    payeeType: 'agent',
    policyId: 'pol_018',
    policyNumber: 'IF-POL-2025-0472',
    period: '2026-09',
    basePremium: 8400,
    rate: 0.105,
    grossCommission: 882,
    overrideAmount: 126,
    netCommission: 1008,
    status: 'paid',
    dueAt: '2026-09-15',
    paidAt: '2026-09-12T14:08:00.000Z',
    method: 'ach',
    transactionRef: 'ACH-88423310',
    ytdTotal: 28760,
    notes: 'Includes 1.5% bonus tied to the life-product conversion target.',
  },
];

/* ========================================================================== */
/*  20. Activity feed — 10 records                                            */
/* ========================================================================== */

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'claim',
    title: 'Reserve increased on IF-CLM-2026-3051',
    description: 'Aisha Bello raised the indemnity reserve from $180k to $255k ahead of mediation.',
    actor: 'Aisha Bello',
    actorRole: 'Lead Adjuster',
    severity: 'warning',
    targetId: 'clm_012',
    targetLabel: 'IF-CLM-2026-3051',
    href: '/claims/IF-CLM-2026-3051',
    createdAt: '2026-09-23T09:52:00.000Z',
  },
  {
    id: 'act_002',
    type: 'quote',
    title: 'Quote IF-QTE-2026-4821 approved',
    description: 'Automated engine approved Lena Okafor in 120 seconds at $1,584 annual premium.',
    actor: 'Rating engine',
    actorRole: 'System',
    severity: 'success',
    targetId: 'quo_001',
    targetLabel: 'IF-QTE-2026-4821',
    href: '/quotes/IF-QTE-2026-4821',
    createdAt: '2026-09-18T09:16:00.000Z',
  },
  {
    id: 'act_003',
    type: 'payment',
    title: 'Installment failed on IF-POL-2026-0162',
    description: 'Second ACH attempt returned account closed — policy lapsed after the grace period.',
    actor: 'Billing service',
    actorRole: 'System',
    severity: 'danger',
    targetId: 'pay_004',
    targetLabel: 'PAY-2026-09154',
    href: '/payments/PAY-2026-09154',
    createdAt: '2026-09-05T06:04:00.000Z',
  },
  {
    id: 'act_004',
    type: 'policy',
    title: 'Draft policy IF-POL-2026-0188 created',
    description: 'Sofia Marchetti opened a commercial auto draft for the clinic mobile-unit submission.',
    actor: 'Sofia Marchetti',
    actorRole: 'Agent',
    severity: 'info',
    targetId: 'pol_020',
    targetLabel: 'IF-POL-2026-0188',
    href: '/policies/IF-POL-2026-0188',
    createdAt: '2026-09-21T08:47:00.000Z',
  },
  {
    id: 'act_005',
    type: 'underwriting',
    title: 'UW-2026-0842 referred to senior underwriting',
    description: 'Class 2585 hazard scored 72 — referral triggered with loss runs outstanding.',
    actor: 'Elena Vasquez-Ortiz',
    actorRole: 'Underwriter',
    severity: 'warning',
    targetId: 'uwc_001',
    targetLabel: 'UW-2026-0842',
    href: '/underwriting/UW-2026-0842',
    createdAt: '2026-09-15T14:02:00.000Z',
  },
  {
    id: 'act_006',
    type: 'customer',
    title: 'Cedar Grove Apartments flagged at-risk',
    description: 'Churn risk crossed 55 after the second water loss and a 19% renewal indication.',
    actor: 'Retention model',
    actorRole: 'System',
    severity: 'warning',
    targetId: 'cust_008',
    targetLabel: 'CUST-0008',
    href: '/customers/CUST-0008',
    createdAt: '2026-09-10T14:02:00.000Z',
  },
  {
    id: 'act_007',
    type: 'policy',
    title: 'Renewal quote accepted for IF-POL-2025-0219',
    description: 'Rowan Delacroix bound the renewal at $2,940 — a 5.77% decrease from expiring.',
    actor: 'Dana Whitfield',
    actorRole: 'Agent',
    severity: 'success',
    targetId: 'ren_001',
    targetLabel: 'IF-POL-2025-0219',
    href: '/renewals/ren_001',
    createdAt: '2026-09-11T15:31:00.000Z',
  },
  {
    id: 'act_008',
    type: 'payment',
    title: 'Commission run approved for September',
    description: '$5,964 in agent and broker commissions approved for the 2026-09 period.',
    actor: 'Finance ops',
    actorRole: 'System',
    severity: 'success',
    targetId: null,
    targetLabel: 'Period 2026-09',
    href: '/commissions',
    createdAt: '2026-09-16T11:05:00.000Z',
  },
  {
    id: 'act_009',
    type: 'team',
    title: 'Victor Sorensen appointment pending review',
    description: 'Two overdue compliance training modules block the appointment renewal.',
    actor: 'Compliance bot',
    actorRole: 'System',
    severity: 'warning',
    targetId: 'agnt_008',
    targetLabel: 'AG-1246',
    href: '/agents/AG-1246',
    createdAt: '2026-09-19T07:30:00.000Z',
  },
  {
    id: 'act_010',
    type: 'system',
    title: 'Quarterly statutory filing submitted',
    description: 'Q3 2026 statutory statement transmitted to 42 domiciliary jurisdictions.',
    actor: 'Compliance desk',
    actorRole: 'Admin',
    severity: 'info',
    targetId: null,
    targetLabel: 'Q3 2026',
    href: '/reports',
    createdAt: '2026-09-14T18:00:00.000Z',
  },
];

/* ========================================================================== */
/*  21. Notifications — 6 records                                             */
/* ========================================================================== */

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'ntf_001',
    title: 'Claim reserve needs approval',
    body: 'IF-CLM-2026-3051 requests an increase to $255k ahead of the November mediation.',
    category: 'claims',
    severity: 'warning',
    read: false,
    actionLabel: 'Review reserve',
    href: '/claims/IF-CLM-2026-3051',
    createdAt: '2026-09-23T09:52:00.000Z',
  },
  {
    id: 'ntf_002',
    title: 'Payment failed twice',
    body: 'Summit Ridge Construction missed the September installment — the policy lapsed on 2026-09-05.',
    category: 'payments',
    severity: 'danger',
    read: false,
    actionLabel: 'Send reinstatement',
    href: '/payments/PAY-2026-09154',
    createdAt: '2026-09-05T06:04:00.000Z',
  },
  {
    id: 'ntf_003',
    title: 'Renewal notice window opens',
    body: 'Willowbrook Veterinary Clinic enters its 45-day renewal window on 2026-09-05.',
    category: 'policies',
    severity: 'info',
    read: false,
    actionLabel: 'View renewal',
    href: '/renewals/ren_002',
    createdAt: '2026-09-05T09:00:00.000Z',
  },
  {
    id: 'ntf_004',
    title: 'Fraud indicator triggered',
    body: 'Key-custody inconsistencies on IF-CLM-2026-3040 pushed the fraud score to 78.',
    category: 'claims',
    severity: 'danger',
    read: true,
    actionLabel: 'Open SIU file',
    href: '/claims/IF-CLM-2026-3040',
    createdAt: '2026-08-30T17:26:00.000Z',
  },
  {
    id: 'ntf_005',
    title: 'Underwriting clarification outstanding',
    body: 'Priomark Digital has not returned the MFA coverage matrix — second request sent.',
    category: 'underwriting',
    severity: 'warning',
    read: true,
    actionLabel: 'Open case',
    href: '/underwriting/UW-2026-0836',
    createdAt: '2026-09-06T10:12:00.000Z',
  },
  {
    id: 'ntf_006',
    title: 'API key rotates in 7 days',
    body: 'The production claims key (if_live_7f2…) expires on 2026-10-02 unless rotated.',
    category: 'system',
    severity: 'info',
    read: true,
    actionLabel: 'Rotate key',
    href: '/api',
    createdAt: '2026-09-25T08:00:00.000Z',
  },
];

/* ========================================================================== */
/*  22. Team — 8 records                                                      */
/* ========================================================================== */

export const MOCK_TEAM: TeamMember[] = [
  {
    id: 'team_001',
    name: 'Katherine Yoon',
    email: 'katherine.yoon@insureflow.dev',
    role: 'owner',
    title: 'Chief Executive Officer',
    department: 'Executive',
    avatarInitials: 'KY',
    scope: 'all',
    permissions: ['*'],
    status: 'active',
    mfaEnabled: true,
    phone: '+1 (415) 555-0601',
    location: 'San Francisco, CA',
    reportsTo: null,
    policiesAssigned: 0,
    claimsAssigned: 0,
    joinedAt: '2011-04-18',
    lastActiveAt: '2026-09-25T18:12:00.000Z',
    notes: 'Founder. Full administrative access including billing and legal.',
  },
  {
    id: 'team_002',
    name: 'Elena Vasquez-Ortiz',
    email: 'elena.vasquez@insureflow.dev',
    role: 'underwriter',
    title: 'Head of Underwriting',
    department: 'Underwriting',
    avatarInitials: 'EV',
    scope: 'all',
    permissions: [
      'policies.read',
      'policies.write',
      'quotes.approve',
      'underwriting.decide',
      'products.read',
      'reports.read',
    ],
    status: 'active',
    mfaEnabled: true,
    phone: '+1 (415) 555-0602',
    location: 'San Francisco, CA',
    reportsTo: 'Katherine Yoon',
    policiesAssigned: 184,
    claimsAssigned: 0,
    joinedAt: '2016-02-29',
    lastActiveAt: '2026-09-25T16:44:00.000Z',
    notes: 'Holds referral authority above $250k limit on commercial lines.',
  },
  {
    id: 'team_003',
    name: 'Aisha Bello',
    email: 'aisha.bello@insureflow.dev',
    role: 'adjuster',
    title: 'Lead Claims Adjuster',
    department: 'Claims',
    avatarInitials: 'AB',
    scope: 'team',
    permissions: [
      'claims.read',
      'claims.write',
      'claims.reserve_approve',
      'litigation.read',
      'customers.read',
      'reports.read',
    ],
    status: 'active',
    mfaEnabled: true,
    phone: '+1 (202) 555-0603',
    location: 'Washington, DC',
    reportsTo: 'Katherine Yoon',
    policiesAssigned: 0,
    claimsAssigned: 22,
    joinedAt: '2014-06-02',
    lastActiveAt: '2026-09-25T17:22:00.000Z',
    notes: 'Supervises six adjusters; reserve authority up to $300k.',
  },
  {
    id: 'team_004',
    name: 'Noah Farraday',
    email: 'noah.farraday@insureflow.dev',
    role: 'underwriter',
    title: 'Specialty Underwriter — Cyber',
    department: 'Underwriting',
    avatarInitials: 'NF',
    scope: 'own',
    permissions: ['quotes.read', 'quotes.write', 'underwriting.decide', 'risk.read'],
    status: 'active',
    mfaEnabled: true,
    phone: '+1 (628) 555-0604',
    location: 'Remote — Portland, OR',
    reportsTo: 'Elena Vasquez-Ortiz',
    policiesAssigned: 61,
    claimsAssigned: 0,
    joinedAt: '2021-03-15',
    lastActiveAt: '2026-09-25T14:09:00.000Z',
    notes: 'Owns the CyberDefend Pro portfolio and the quarterly accumulation review.',
  },
  {
    id: 'team_005',
    name: 'Priyanka Nair',
    email: 'priyanka.nair@insureflow.dev',
    role: 'adjuster',
    title: 'SIU Investigator',
    department: 'Claims',
    avatarInitials: 'PN',
    scope: 'team',
    permissions: ['claims.read', 'claims.fraud', 'litigation.read', 'customers.read'],
    status: 'active',
    mfaEnabled: true,
    phone: '+1 (646) 555-0605',
    location: 'New York, NY',
    reportsTo: 'Aisha Bello',
    policiesAssigned: 0,
    claimsAssigned: 16,
    joinedAt: '2020-01-27',
    lastActiveAt: '2026-09-25T12:56:00.000Z',
    notes: 'Special investigations — access restricted to flagged files only.',
  },
  {
    id: 'team_006',
    name: 'Marcus Bellweather',
    email: 'marcus.bellweather@insureflow.dev',
    role: 'agent',
    title: 'Senior Agent — Personal Lines',
    department: 'Distribution',
    avatarInitials: 'MB',
    scope: 'own',
    permissions: ['quotes.read', 'quotes.write', 'policies.read', 'customers.read_own'],
    status: 'active',
    mfaEnabled: false,
    phone: '+1 (415) 555-0606',
    location: 'San Francisco, CA',
    reportsTo: 'Sandra Villalobos',
    policiesAssigned: 612,
    claimsAssigned: 0,
    joinedAt: '2018-02-12',
    lastActiveAt: '2026-09-25T15:18:00.000Z',
    notes: 'Top producer two years running. MFA enrollment reminder outstanding.',
  },
  {
    id: 'team_007',
    name: 'Sandra Villalobos',
    email: 'sandra.villalobos@insureflow.dev',
    role: 'admin',
    title: 'Director of Distribution',
    department: 'Distribution',
    avatarInitials: 'SV',
    scope: 'team',
    permissions: [
      'agents.read',
      'agents.write',
      'brokers.read',
      'commissions.read',
      'commissions.approve',
      'reports.read',
    ],
    status: 'active',
    mfaEnabled: true,
    phone: '+1 (312) 555-0607',
    location: 'Chicago, IL',
    reportsTo: 'Katherine Yoon',
    policiesAssigned: 0,
    claimsAssigned: 0,
    joinedAt: '2019-09-03',
    lastActiveAt: '2026-09-25T13:41:00.000Z',
    notes: 'Runs the Western and Pacific Northwest agent territories.',
  },
  {
    id: 'team_008',
    name: 'Devon Pryce',
    email: 'devon.pryce@insureflow.dev',
    role: 'analyst',
    title: 'Finance & Reporting Analyst',
    department: 'Finance',
    avatarInitials: 'DP',
    scope: 'team',
    permissions: ['premiums.read', 'payments.read', 'reserves.read', 'commissions.read', 'reports.read', 'reports.create'],
    status: 'invited',
    mfaEnabled: false,
    phone: '+1 (615) 555-0608',
    location: 'Nashville, TN',
    reportsTo: 'Katherine Yoon',
    policiesAssigned: 0,
    claimsAssigned: 0,
    joinedAt: '2026-09-22',
    lastActiveAt: '2026-09-22T09:14:00.000Z',
    notes: 'Invitation sent 2026-09-22 — awaiting acceptance and MFA enrollment.',
  },
];

/* ========================================================================== */
/*  23. API keys — 3 records                                                  */
/* ========================================================================== */

export const MOCK_API_KEYS: ApiKey[] = [
  {
    id: 'key_001',
    name: 'Production claims sync',
    prefix: 'if_live',
    maskedKey: 'if_live_7f2a••••••••••••••••••3c91',
    environment: 'live',
    scopes: ['claims:read', 'claims:write', 'policies:read'],
    createdBy: 'Noah Farraday',
    createdAt: '2025-11-04T10:22:00.000Z',
    lastUsedAt: '2026-09-25T17:58:00.000Z',
    expiresAt: '2026-10-02T00:00:00.000Z',
    secretRotatedAt: '2026-04-02T10:22:00.000Z',
    requestsLast30Days: 184_320,
    rateLimitPerMin: 600,
    status: 'expiring',
    ipWhitelist: ['203.0.113.24/32', '198.51.100.0/24'],
    webhookUrl: 'https://claims.internal.insureflow.dev/hooks',
  },
  {
    id: 'key_002',
    name: 'Broker portal — Ashgrove & Pike',
    prefix: 'if_live',
    maskedKey: 'if_live_b91c••••••••••••••••••e470',
    environment: 'live',
    scopes: ['quotes:read', 'quotes:write', 'policies:read', 'customers:read'],
    createdBy: 'Sandra Villalobos',
    createdAt: '2026-03-18T14:47:00.000Z',
    lastUsedAt: '2026-09-25T16:11:00.000Z',
    expiresAt: null,
    secretRotatedAt: '2026-03-18T14:47:00.000Z',
    requestsLast30Days: 62_140,
    rateLimitPerMin: 300,
    status: 'active',
    ipWhitelist: ['192.0.2.55/32'],
    webhookUrl: 'https://ashgrovepike.example.com/hooks/insureflow',
  },
  {
    id: 'key_003',
    name: 'Staging sandbox',
    prefix: 'if_test',
    maskedKey: 'if_test_44de••••••••••••••••••1a08',
    environment: 'test',
    scopes: ['*'],
    createdBy: 'Devon Pryce',
    createdAt: '2026-01-09T09:03:00.000Z',
    lastUsedAt: '2026-08-14T11:35:00.000Z',
    expiresAt: null,
    secretRotatedAt: '2026-06-09T09:03:00.000Z',
    requestsLast30Days: 4_820,
    rateLimitPerMin: 120,
    status: 'active',
    ipWhitelist: [],
    webhookUrl: null,
  },
];

/* ========================================================================== */
/*  24. Reports — 6 records                                                   */
/* ========================================================================== */

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rpt_001',
    code: 'FIN-PW-001',
    name: 'Monthly premium & earned revenue',
    description: 'Written vs. earned premium by month, product, and distribution channel.',
    category: 'financial',
    format: 'xlsx',
    cadence: 'monthly',
    scheduled: true,
    recipients: ['finance@insureflow.dev', 'katherine.yoon@insureflow.dev'],
    lastGeneratedAt: '2026-09-01T06:00:00.000Z',
    nextRunAt: '2026-10-01T06:00:00.000Z',
    rows: 48_120,
    sizeKb: 2_410,
    status: 'ready',
    owner: 'Devon Pryce',
    pinned: true,
  },
  {
    id: 'rpt_002',
    code: 'CLM-LOSS-014',
    name: 'Loss ratio by line of business',
    description: 'Incurred losses to earned premium with 12-month development factors.',
    category: 'claims',
    format: 'pdf',
    cadence: 'quarterly',
    scheduled: true,
    recipients: ['underwriting@insureflow.dev'],
    lastGeneratedAt: '2026-07-05T06:00:00.000Z',
    nextRunAt: '2026-10-05T06:00:00.000Z',
    rows: 1_240,
    sizeKb: 880,
    status: 'ready',
    owner: 'Elena Vasquez-Ortiz',
    pinned: true,
  },
  {
    id: 'rpt_003',
    code: 'OPS-CLM-CYCLE',
    name: 'Claim cycle time dashboard',
    description: 'Average days to close, reserve adequacy, and adjuster caseload distribution.',
    category: 'operational',
    format: 'csv',
    cadence: 'weekly',
    scheduled: true,
    recipients: ['claims-leads@insureflow.dev'],
    lastGeneratedAt: '2026-09-22T05:30:00.000Z',
    nextRunAt: '2026-09-29T05:30:00.000Z',
    rows: 3_118,
    sizeKb: 640,
    status: 'ready',
    owner: 'Aisha Bello',
    pinned: false,
  },
  {
    id: 'rpt_004',
    code: 'SLS-PIPE-021',
    name: 'Quote-to-bind pipeline',
    description: 'Quotes by stage, channel conversion, and agent performance ranking.',
    category: 'sales',
    format: 'xlsx',
    cadence: 'weekly',
    scheduled: true,
    recipients: ['distribution@insureflow.dev'],
    lastGeneratedAt: '2026-09-15T05:30:00.000Z',
    nextRunAt: '2026-09-22T05:30:00.000Z',
    rows: 2_640,
    sizeKb: 1_120,
    status: 'failed',
    owner: 'Sandra Villalobos',
    pinned: false,
  },
  {
    id: 'rpt_005',
    code: 'CMP-STAT-Q3',
    name: 'Statutory quarterly statement',
    description: 'Blanks package for the domiciliary filing, including schedules P and F.',
    category: 'compliance',
    format: 'pdf',
    cadence: 'quarterly',
    scheduled: true,
    recipients: ['compliance@insureflow.dev', 'auditor@example.com'],
    lastGeneratedAt: '2026-09-14T18:00:00.000Z',
    nextRunAt: '2026-12-14T18:00:00.000Z',
    rows: 9_460,
    sizeKb: 5_720,
    status: 'ready',
    owner: 'Compliance desk',
    pinned: true,
  },
  {
    id: 'rpt_006',
    code: 'RISK-FRD-008',
    name: 'Fraud indicator effectiveness',
    description: 'Trigger volume, confirmed detections, and false-positive rate per indicator.',
    category: 'operational',
    format: 'json',
    cadence: 'on_demand',
    scheduled: false,
    recipients: ['siu@insureflow.dev'],
    lastGeneratedAt: '2026-08-30T17:44:00.000Z',
    nextRunAt: null,
    rows: 486,
    sizeKb: 210,
    status: 'stale',
    owner: 'Priyanka Nair',
    pinned: false,
  },
];

/* ========================================================================== */
/*  25. Fraud indicators — 8 records                                          */
/* ========================================================================== */

export const MOCK_FRAUD_INDICATORS: FraudIndicator[] = [
  {
    id: 'frd_001',
    code: 'FRD-KEY-CUSTODY',
    name: 'Key custody inconsistency',
    category: 'claim',
    severity: 'high',
    description:
      'Detects mismatches between the reported key holder, access logs, and the theft narrative.',
    detectionRule: 'key_holder <> access_log_actor AND loss_type = theft',
    confidence: 0.82,
    falsePositiveRate: 0.11,
    status: 'confirmed',
    casesTriggered: 34,
    caughtValue: 412_000,
    modelVersion: 'siu-rules-v6',
    owner: 'Priyanka Nair',
    recommendedAction: 'Recorded statement and garage log subpoena',
    lastTriggeredAt: '2026-08-30T17:26:00.000Z',
    createdAt: '2024-05-12',
  },
  {
    id: 'frd_002',
    code: 'FRD-LOSS-TIMING',
    name: 'Loss clustered around policy change',
    category: 'claim',
    severity: 'high',
    description: 'Flags losses within 30 days of a limit increase, reinstatement, or new policy.',
    detectionRule: 'days_since_policy_change <= 30 AND amount_claimed > 10000',
    confidence: 0.74,
    falsePositiveRate: 0.18,
    status: 'investigating',
    casesTriggered: 61,
    caughtValue: 786_500,
    modelVersion: 'siu-rules-v6',
    owner: 'Priyanka Nair',
    recommendedAction: 'Compare schedule of values before and after the change',
    lastTriggeredAt: '2026-09-08T13:11:00.000Z',
    createdAt: '2024-09-03',
  },
  {
    id: 'frd_003',
    code: 'FRD-DOC-REPETITION',
    name: 'Duplicate document fingerprint',
    category: 'application',
    severity: 'medium',
    description: 'Matches uploaded invoices or estimates against previously submitted documents.',
    detectionRule: 'simhash_distance(document) < 3 AND document_type IN (invoice, estimate)',
    confidence: 0.88,
    falsePositiveRate: 0.06,
    status: 'open',
    casesTriggered: 27,
    caughtValue: 148_900,
    modelVersion: 'doc-match-v3',
    owner: 'Elena Vasquez-Ortiz',
    recommendedAction: 'Request originals with contractor letterhead',
    lastTriggeredAt: '2026-09-03T10:44:00.000Z',
    createdAt: '2025-02-18',
  },
  {
    id: 'frd_004',
    code: 'FRD-IDENTITY-OVERLAP',
    name: 'Identity overlap across applicants',
    category: 'identity',
    severity: 'critical',
    description: 'Detects shared devices, addresses, or bank accounts across unrelated applicants.',
    detectionRule: 'device_hash_shared > 1 OR bank_account_shared > 1',
    confidence: 0.79,
    falsePositiveRate: 0.09,
    status: 'investigating',
    casesTriggered: 12,
    caughtValue: 264_300,
    modelVersion: 'identity-graph-v2',
    owner: 'Priyanka Nair',
    recommendedAction: 'Escalate to SIU and suspend automated binding',
    lastTriggeredAt: '2026-07-19T09:02:00.000Z',
    createdAt: '2025-06-27',
  },
  {
    id: 'frd_005',
    code: 'FRD-PAY-VELOCITY',
    name: 'Payment velocity anomaly',
    category: 'payment',
    severity: 'medium',
    description: 'Flags rapid failed-then-successful payment attempts from changing instruments.',
    detectionRule: 'failed_attempts >= 3 AND success_within_hours <= 24',
    confidence: 0.68,
    falsePositiveRate: 0.24,
    status: 'cleared',
    casesTriggered: 48,
    caughtValue: 39_600,
    modelVersion: 'billing-guard-v4',
    owner: 'Devon Pryce',
    recommendedAction: 'Step-up verification before releasing coverage',
    lastTriggeredAt: '2026-09-20T06:14:00.000Z',
    createdAt: '2025-01-09',
  },
  {
    id: 'frd_006',
    code: 'FRD-PROVIDER-BUNDLE',
    name: 'Provider billing bundle',
    category: 'provider',
    severity: 'high',
    description: 'Identifies clinics and repair shops repeatedly appearing on the same claim sets.',
    detectionRule: 'provider_claims_count > 25 AND avg_severity > 2x_cohort',
    confidence: 0.71,
    falsePositiveRate: 0.15,
    status: 'confirmed',
    casesTriggered: 9,
    caughtValue: 921_400,
    modelVersion: 'provider-network-v5',
    owner: 'Priyanka Nair',
    recommendedAction: 'Audit billing patterns and move to pre-approval',
    lastTriggeredAt: '2026-06-24T15:38:00.000Z',
    createdAt: '2024-11-21',
  },
  {
    id: 'frd_007',
    code: 'FRD-FRAUD-RING-SCORE',
    name: 'Network fraud ring score',
    category: 'claim',
    severity: 'critical',
    description:
      'Graph model scoring clusters of claimants, witnesses, and providers that co-occur repeatedly.',
    detectionRule: 'graph_cluster_density > 0.6 AND ring_score >= 70',
    confidence: 0.76,
    falsePositiveRate: 0.13,
    status: 'open',
    casesTriggered: 5,
    caughtValue: 1_480_000,
    modelVersion: 'graph-siu-v1',
    owner: 'Priyanka Nair',
    recommendedAction: 'Refer cluster to outside counsel for coordinated investigation',
    lastTriggeredAt: '2026-05-11T11:26:00.000Z',
    createdAt: '2026-01-30',
  },
  {
    id: 'frd_008',
    code: 'FRD-QUOTE-HOPPING',
    name: 'Cross-carrier quote hopping',
    category: 'application',
    severity: 'low',
    description:
      'Spots applications that mirror recently declined submissions across partner carriers.',
    detectionRule: 'field_similarity(app, declined_pool) > 0.92',
    confidence: 0.61,
    falsePositiveRate: 0.29,
    status: 'open',
    casesTriggered: 19,
    caughtValue: 84_200,
    modelVersion: 'app-fraud-v2',
    owner: 'Elena Vasquez-Ortiz',
    recommendedAction: 'Route to manual underwriting for verification',
    lastTriggeredAt: '2026-09-14T08:51:00.000Z',
    createdAt: '2025-10-15',
  },
];

/* -------------------------------------------------------------------------- */
/*  Compatibility aliases                                                     */
/*  The dashboard screens address records through both their canonical field  */
/*  names and a set of display aliases; the aliases are derived here so the   */
/*  ledgers above remain the single source of truth.                          */
/* -------------------------------------------------------------------------- */

const toTitleCase = (value: string): string =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const formatMonthDay = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });

const RISK_LEVEL_LABEL: Record<RiskLevel, 'Low' | 'Moderate' | 'High' | 'Critical'> = {
  low: 'Low',
  medium: 'Moderate',
  high: 'High',
  critical: 'Critical',
};

export const MOCK_CLAIMS: Claim[] = MOCK_CLAIMS_BASE.map((claim) => ({
  ...claim,
  claimNumber: claim.number,
  claimant: claim.customerName,
  lossType: claim.causeOfLoss,
  adjuster: claim.adjusterName,
  amountReserved: claim.reserveAmount,
  dateOfLoss: claim.lossDate,
}));

export const MOCK_ADJUSTERS: Adjuster[] = MOCK_ADJUSTERS_BASE.map((adjuster) => ({
  ...adjuster,
  capacity: Math.ceil((adjuster.caseload * 6) / 5),
  avgCycleTime: adjuster.avgCycleTimeDays,
  settlementRate: Math.round(adjuster.closureRate * 100),
  rating: adjuster.satisfactionScore,
}));

export const MOCK_LITIGATION: LitigationMatter[] = MOCK_LITIGATION_BASE.map((matter) => ({
  ...matter,
  caseNumber: matter.matterNumber,
  defendant: matter.claimantName,
  counsel: matter.defenseCounsel,
  nextHearing: matter.nextHearingAt ?? matter.trialDate ?? '',
  amountAtStake: matter.amountClaimed,
  filingDate: matter.filedAt,
  venue: matter.court,
  owner: matter.assignedTo,
  notes: matter.statusNotes,
}));

export const MOCK_PRODUCTS: Product[] = MOCK_PRODUCTS_BASE.map((product) => ({
  ...product,
  basePremium: product.pricing.basePremium,
  avgClaimSize: Math.round(product.avgPremium * product.lossRatio),
}));

export const MOCK_UNDERWRITING: UnderwritingCase[] = MOCK_UNDERWRITING_BASE.map((item) => ({
  ...item,
  submission: item.reference,
  applicant: item.applicantName,
  product: item.productName,
  underwriter: item.assignedTo,
  score: 100 - item.riskScore,
  coverageRequested: item.coverageLimit,
  date: item.decidedAt ?? item.submittedAt,
}));

export const MOCK_RISK: RiskAssessment[] = MOCK_RISK_BASE.map((assessment) => ({
  ...assessment,
  entity: assessment.subjectName,
  exposure: toTitleCase(assessment.subjectType),
  inherentRisk: RISK_LEVEL_LABEL[assessment.level],
  residualRisk: RISK_LEVEL_LABEL[assessment.residualLevel],
  controlEffectiveness: assessment.mitigationScore,
  lastReview: assessment.assessedAt,
  nextReview: assessment.nextReviewAt,
}));

export const MOCK_PAYMENTS: Payment[] = MOCK_PAYMENTS_BASE.map((payment) => ({
  ...payment,
  dueDate: payment.dueAt,
  customer: payment.customerName,
  paidDate: payment.paidAt,
  installments: payment.ofInstallments,
}));

export const MOCK_RESERVES: Reserve[] = MOCK_RESERVES_BASE.map((reserve) => {
  const claim = MOCK_CLAIMS.find((item) => item.number === reserve.claimNumber);
  const openedAt = new Date(Date.UTC(2026, 8 - reserve.monthsOpen, 1));
  return {
    ...reserve,
    paid: reserve.paidToDate,
    reserveType:
      reserve.reserveCategory === 'subrogation' ? 'Salvage' : reserve.ibnrAmount > 0 ? 'IBNR' : 'Case',
    opened: openedAt.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
    claimant: claim?.customerName ?? '—',
    adjuster: claim?.adjusterName ?? '—',
    lastReview: formatMonthDay(reserve.reviewedAt ?? reserve.lastChangeAt),
  };
});

export const MOCK_COMMISSIONS: Commission[] = MOCK_COMMISSIONS_BASE.map((entry) => {
  const agent = MOCK_AGENTS.find((item) => item.id === entry.payeeId);
  const broker = agent ? undefined : MOCK_BROKERS.find((item) => item.id === entry.payeeId);
  return {
    ...entry,
    statement: `STMT-${entry.period}-${entry.id.split('_').pop()}`,
    payee: entry.payeeName,
    agency: agent?.agency ?? broker?.firm ?? 'InsureFlow Direct',
    grossPremium: entry.basePremium,
    earned: entry.grossCommission,
  };
});

/* ========================================================================== */
/*  Derived helpers                                                           */
/* ========================================================================== */

/** Policies that are live (issued and not closed out). */
export const ACTIVE_POLICIES = MOCK_POLICIES.filter((policy) => policy.status === 'active');

/** Claims that still need work — everything except the terminal states. */
export const OPEN_CLAIMS = MOCK_CLAIMS.filter(
  (claim) => claim.status !== 'paid' && claim.status !== 'denied'
);

/** Convenience lookup for policy number → policy record. */
export const POLICY_BY_NUMBER: Record<string, Policy> = Object.fromEntries(
  MOCK_POLICIES.map((policy) => [policy.number, policy])
);

/** Convenience lookup for customer id → customer record. */
export const CUSTOMER_BY_ID: Record<string, Customer> = Object.fromEntries(
  MOCK_CUSTOMERS.map((customer) => [customer.id, customer])
);

/* ========================================================================== */
/*  Dashboard & chart fixtures                                                */
/*  Datasets consumed by the overview, analytics, reports and navigation      */
/*  surfaces; monthly series are derived from the ledgers above.              */
/* ========================================================================== */

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

const round2 = (value: number): number => Math.round(value * 100) / 100;

const writtenPremiumTotal = MOCK_PREMIUMS.reduce((sum, entry) => sum + entry.writtenPremium, 0);
const earnedPremiumTotal = MOCK_PREMIUMS.reduce((sum, entry) => sum + entry.earnedPremium, 0);
const claimsPaidTotal = MOCK_PREMIUMS.reduce((sum, entry) => sum + entry.claimsPaid, 0);
const retentionAverage =
  MOCK_AGENTS.reduce((sum, agent) => sum + agent.retentionRate, 0) / Math.max(MOCK_AGENTS.length, 1);
const criticalClaims = MOCK_CLAIMS.filter((claim) => claim.severity === 'critical').length;
const highClaims = MOCK_CLAIMS.filter((claim) => claim.severity === 'high').length;

export const MOCK_DASHBOARD_METRICS: DashboardMetric[] = [
  {
    key: 'written-premium',
    label: 'Written premium',
    value: writtenPremiumTotal,
    format: 'currency',
    delta: 12.4,
    deltaLabel: 'vs last year',
    hint: 'Year to date',
    trend: 'up',
  },
  {
    key: 'loss-ratio',
    label: 'Loss ratio',
    value: round2(claimsPaidTotal / earnedPremiumTotal),
    format: 'percent',
    delta: 2.4,
    deltaLabel: 'pts better than target',
    hint: 'Target 62.0%',
    trend: 'up',
  },
  {
    key: 'open-claims',
    label: 'Open claims',
    value: OPEN_CLAIMS.length,
    format: 'number',
    delta: -6.1,
    deltaLabel: 'vs last month',
    hint: `${criticalClaims} critical · ${highClaims} high`,
    trend: 'down',
  },
  {
    key: 'retention-rate',
    label: 'Retention rate',
    value: round2(retentionAverage),
    format: 'percent',
    delta: 1.3,
    deltaLabel: 'pts vs last year',
    hint: '12-month rolling',
    trend: 'up',
  },
];

/** Written premium vs claims paid, per month. */
export const MOCK_PREMIUM_CLAIMS: { month: string; premium: number; claims: number }[] =
  MOCK_PREMIUMS.map((entry) => ({
    month: entry.label.split(' ')[0],
    premium: entry.writtenPremium,
    claims: entry.claimsPaid,
  }));

export type SeverityLabel = 'Critical' | 'High' | 'Medium' | 'Low';

const toSeverityLabel = (severity: Severity): SeverityLabel =>
  severity === 'critical'
    ? 'Critical'
    : severity === 'high'
      ? 'High'
      : severity === 'medium'
        ? 'Medium'
        : 'Low';

export interface OpenClaim {
  id: string;
  claimNumber: string;
  claimant: string;
  type: string;
  severity: SeverityLabel;
  amount: number;
  filed: string;
}

export const MOCK_OPEN_CLAIMS: OpenClaim[] = OPEN_CLAIMS.slice()
  .sort((a, b) => b.amountClaimed - a.amountClaimed)
  .slice(0, 6)
  .map((claim) => ({
    id: claim.id,
    claimNumber: claim.number,
    claimant: claim.customerName,
    type: claim.causeOfLoss,
    severity: toSeverityLabel(claim.severity),
    amount: claim.amountClaimed,
    filed: claim.reportedAt.slice(0, 10),
  }));

export interface TopAgent {
  name: string;
  agency: string;
  book: number;
  policies: number;
  /** Fraction, e.g. 0.96. */
  retention: number;
}

export const MOCK_TOP_AGENTS: TopAgent[] = MOCK_AGENTS.slice()
  .sort((a, b) => b.bookOfBusiness - a.bookOfBusiness)
  .slice(0, 5)
  .map((agent) => ({
    name: agent.name,
    agency: agent.agency,
    book: agent.bookOfBusiness,
    policies: agent.policyCount,
    retention: agent.retentionRate,
  }));

const POLICY_STATUS_DELTA: Record<PolicyStatus, number> = {
  active: 1.8,
  pending: -0.9,
  renewal_due: 3.2,
  expired: -1.4,
  cancelled: -0.6,
  lapsed: -1.1,
  draft: 0.4,
};

export const MOCK_POLICY_STATUS: { label: string; count: number; delta: number }[] = Object.entries(
  MOCK_POLICIES.reduce<Record<string, number>>((counts, policy) => {
    counts[policy.status] = (counts[policy.status] ?? 0) + 1;
    return counts;
  }, {})
).map(([status, count]) => ({
  label: toTitleCase(status),
  count,
  delta: POLICY_STATUS_DELTA[status as PolicyStatus] ?? 0,
}));

export interface FeedActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone?: 'default' | 'muted';
}

export const MOCK_ACTIVITY_FEED: FeedActivityItem[] = [
  {
    id: 'feed_1',
    title: 'Policy IF-POL-2026-0001 renewed',
    detail: 'Marcus Bellweather · Personal auto · $1,842 premium',
    time: '4 min ago',
  },
  {
    id: 'feed_2',
    title: 'Claim IF-CLM-2026-3182 escalated to High',
    detail: 'Rear-end collision · assigned to complex claims desk',
    time: '22 min ago',
    tone: 'muted',
  },
  {
    id: 'feed_3',
    title: 'New quote request from Delacroix Hardware',
    detail: 'General liability · $1.2M revenue band',
    time: '1 hr ago',
  },
  {
    id: 'feed_4',
    title: 'Underwriting decision routed to referral',
    detail: 'UW-2026-0842 · General Liability Secure · Elena Vasquez-Ortiz',
    time: '3 hr ago',
    tone: 'muted',
  },
  {
    id: 'feed_5',
    title: 'Commission payout processed',
    detail: 'September cycle · 42 agents · $612,400',
    time: '6 hr ago',
  },
];

/** Written premium, current year vs prior year, per month. */
export const MOCK_PREMIUM_GROWTH: { month: string; current: number; prior: number }[] =
  MOCK_PREMIUMS.map((entry) => ({
    month: entry.label.split(' ')[0],
    current: entry.writtenPremium,
    prior: Math.round(entry.writtenPremium / (1 + entry.growthPercent / 100)),
  }));

/** Loss ratio per product, as a percentage number (68.4 → 68.4%). */
export const MOCK_LOSS_RATIO_BY_PRODUCT: { product: string; lossRatio: number }[] =
  MOCK_PRODUCTS.map((product) => ({
    product: product.name,
    lossRatio: Math.round(product.lossRatio * 1000) / 10,
  }));

/** Open claims bucketed by severity. */
export const MOCK_CLAIMS_SEVERITY: { severity: SeverityLabel; value: number }[] = (
  ['critical', 'high', 'medium', 'low'] as const
).map((severity) => ({
  severity: toSeverityLabel(severity),
  value: MOCK_CLAIMS.filter((claim) => claim.severity === severity).length,
}));

/** Policy count per line of business. */
export const MOCK_POLICY_MIX: { type: string; value: number }[] = Object.entries(
  MOCK_POLICIES.reduce<Record<string, number>>((counts, policy) => {
    counts[policy.lineOfBusiness] = (counts[policy.lineOfBusiness] ?? 0) + 1;
    return counts;
  }, {})
).map(([type, value]) => ({ type: toTitleCase(type), value }));

/** 12-month rolling retention, as a percentage number (93.4 → 93.4%). */
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

/** Commission outflow vs written premium, per month. */
export const MOCK_COMMISSION_SPEND: { month: string; commission: number; premium: number }[] =
  MOCK_PREMIUMS.map((entry) => ({
    month: entry.label.split(' ')[0],
    commission: entry.commissionPaid,
    premium: entry.writtenPremium,
  }));
