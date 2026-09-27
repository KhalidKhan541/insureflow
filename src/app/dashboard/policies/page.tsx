'use client';

import { Fragment, useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_COVERAGE, MOCK_POLICIES } from '@/lib/mock-data';
import { cn, formatCurrency, formatDate, formatNumber } from '@/lib/utils';

/** Fixed reference date keeps term countdowns deterministic in this demo. */
const TODAY_UTC = Date.UTC(2026, 8, 27);
const DAY_MS = 86_400_000;

const LOB_LABEL: Record<string, string> = {
  personal_auto: 'Personal auto',
  commercial_auto: 'Commercial auto',
  homeowners: 'Homeowners',
  commercial_property: 'Commercial property',
  general_liability: 'General liability',
  workers_compensation: "Workers' compensation",
  cyber: 'Cyber',
  professional_indemnity: 'Professional indemnity',
  marine: 'Marine',
  life: 'Life',
};

const STATUS_META: Record<string, { label: string; variant: BadgeVariant }> = {
  active: { label: 'Active', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  renewal_due: { label: 'Expiring', variant: 'warning' },
  expired: { label: 'Expired', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'secondary' },
  lapsed: { label: 'Lapsed', variant: 'destructive' },
  draft: { label: 'Draft', variant: 'outline' },
};

const PAYMENT_LABEL: Record<string, string> = {
  current: 'Current',
  auto_pay: 'Auto-pay',
  past_due: 'Past due',
  grace_period: 'Grace period',
  unbilled: 'Unbilled',
};

const RISK_LABEL: Record<string, string> = {
  preferred: 'Preferred',
  standard: 'Standard',
  elevated: 'Elevated',
  high_risk: 'High risk',
};

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

function lobLabel(value: string): string {
  return (
    LOB_LABEL[value] ??
    value.replace(/_/g, ' ').replace(/^\w/, (char) => char.toUpperCase())
  );
}

function statusMeta(value: string) {
  return STATUS_META[value] ?? { label: lobLabel(value), variant: 'secondary' as BadgeVariant };
}

/** Whole days from the demo "today" to an ISO date (negative = in the past). */
function daysUntil(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return 0;
  return Math.round((Date.UTC(year, month - 1, day) - TODAY_UTC) / DAY_MS);
}

function matches(value: string | undefined, term: string): boolean {
  if (!term) return true;
  return (value ?? '').toLowerCase().includes(term);
}

export default function PoliciesPage() {
  const [query, setQuery] = useState('');
  const [lob, setLob] = useState('all');
  const [status, setStatus] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const lobOptions = useMemo(
    () => [...new Set(MOCK_POLICIES.map((policy) => policy.lineOfBusiness))].sort(),
    [],
  );

  const coverageNameById = useMemo(
    () => Object.fromEntries(MOCK_COVERAGE.map((item) => [item.id, item.name])),
    [],
  );

  const stats = useMemo(() => {
    const active = MOCK_POLICIES.filter((policy) => policy.status === 'active');
    const expiringSoon = MOCK_POLICIES.filter((policy) => {
      if (policy.status === 'renewal_due') return true;
      if (policy.status !== 'active') return false;
      const days = daysUntil(policy.expirationDate);
      return days >= 0 && days <= 60;
    });
    const inactive = MOCK_POLICIES.filter(
      (policy) => policy.status === 'lapsed' || policy.status === 'cancelled',
    );
    const coverageLimit = active.reduce((sum, policy) => sum + policy.coverageLimit, 0);
    const premium = active.reduce((sum, policy) => sum + policy.premium, 0);
    const monthly = active.reduce((sum, policy) => sum + policy.monthlyPremium, 0);
    return {
      total: MOCK_POLICIES.length,
      active: active.length,
      inactive: inactive.length,
      expiringSoon: expiringSoon.length,
      coverageLimit,
      avgCoverage: active.length > 0 ? coverageLimit / active.length : 0,
      premium,
      monthly,
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return MOCK_POLICIES.filter((policy) => {
      if (lob !== 'all' && policy.lineOfBusiness !== lob) return false;
      if (status !== 'all' && policy.status !== status) return false;
      if (!term) return true;
      return (
        matches(policy.number, term) ||
        matches(policy.customerName, term) ||
        matches(policy.productName, term) ||
        matches(policy.agentName, term) ||
        matches(policy.lineOfBusiness, term) ||
        matches(lobLabel(policy.lineOfBusiness), term)
      );
    });
  }, [query, lob, status]);

  const shownPremium = filtered.reduce((sum, policy) => sum + policy.premium, 0);
  const hasFilters = query.trim().length > 0 || lob !== 'all' || status !== 'all';

  const clearFilters = () => {
    setQuery('');
    setLob('all');
    setStatus('all');
  };

  const cards = [
    {
      label: 'Policies on book',
      value: formatNumber(stats.total),
      hint: `${stats.active} active · ${stats.inactive} lapsed or cancelled`,
    },
    {
      label: 'In-force coverage limit',
      value: formatCurrency(stats.coverageLimit, 'USD', { maximumFractionDigits: 0 }),
      hint: `Avg ${formatCurrency(stats.avgCoverage, 'USD', { maximumFractionDigits: 0 })} per active policy`,
    },
    {
      label: 'Active annual premium',
      value: formatCurrency(stats.premium, 'USD', { maximumFractionDigits: 0 }),
      hint: `${formatCurrency(stats.monthly, 'USD', { maximumFractionDigits: 0 })} billed monthly`,
    },
    {
      label: 'Expiring ≤ 60 days',
      value: formatNumber(stats.expiringSoon),
      hint: 'Renewal desk workload',
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Policies</h1>
          <p className="mt-1 text-sm text-slate-500">
            In-force register with limits, deductibles, term dates and lapse tracking.
          </p>
        </div>
        <Badge variant="outline">
          {stats.active} active · {formatNumber(stats.coverageLimit)} in limits
        </Badge>
      </header>

      {/* ---------- Stat cards ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard key={card.label} label={card.label} value={card.value} hint={card.hint} />
        ))}
      </div>

      {/* ---------- Filters ---------- */}
      <Card>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label htmlFor="policy-search" className="mb-1.5 block text-xs font-medium text-slate-500">
              Search policies
            </label>
            <input
              id="policy-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Policy #, customer, product, agent or line of business…"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[24rem]">
            <div>
              <label htmlFor="policy-type" className="mb-1.5 block text-xs font-medium text-slate-500">
                Type
              </label>
              <select
                id="policy-type"
                value={lob}
                onChange={(event) => setLob(event.target.value)}
                className={inputClass}
              >
                <option value="all">All types</option>
                {lobOptions.map((value) => (
                  <option key={value} value={value}>
                    {lobLabel(value)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="policy-status" className="mb-1.5 block text-xs font-medium text-slate-500">
                Status
              </label>
              <select
                id="policy-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={inputClass}
              >
                <option value="all">All statuses</option>
                {Object.entries(STATUS_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              {formatNumber(filtered.length)} of {formatNumber(stats.total)} shown
            </span>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg px-2.5 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            Filtered premium:{' '}
            <span className="font-semibold text-slate-700">
              {formatCurrency(shownPremium, 'USD', { maximumFractionDigits: 0 })}
            </span>
          </span>
          <span>Click a row to expand the policy detail</span>
        </div>
      </Card>

      {/* ---------- Policy table ---------- */}
      <Card className="!p-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <CardTitle>Policy register</CardTitle>
          <Badge variant="secondary">Limits · deductibles · term</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3 font-medium" aria-label="Expand" />
                <th className="px-3 py-3 font-medium">Policy #</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Coverage limit</th>
                <th className="px-3 py-3 font-medium">Deductible</th>
                <th className="px-3 py-3 font-medium">Premium</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Term</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((policy) => {
                const meta = statusMeta(policy.status);
                const expanded = expandedId === policy.id;
                const termDays = daysUntil(policy.expirationDate);
                const remaining =
                  policy.status === 'active' || policy.status === 'renewal_due'
                    ? termDays > 0
                      ? `${termDays}d left`
                      : 'Ended'
                    : `${policy.termMonths} mo term`;

                return (
                  <Fragment key={policy.id}>
                    <tr
                      onClick={() => setExpandedId(expanded ? null : policy.id)}
                      className={cn(
                        'cursor-pointer border-b border-slate-100 transition hover:bg-teal-50/40',
                        expanded && 'bg-teal-50/60',
                      )}
                    >
                      <td className="px-3 py-3.5">
                        <span
                          aria-hidden="true"
                          className={cn(
                            'inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-500 transition',
                            expanded && 'bg-teal-600 text-white',
                          )}
                        >
                          {expanded ? '−' : '+'}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="font-semibold tabular-nums text-teal-700">
                          {policy.number}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-slate-400">
                          {policy.productName}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 font-medium text-slate-800">
                        {policy.customerName}
                        <span className="mt-0.5 block text-[11px] font-normal text-slate-400">
                          {policy.agentName}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{lobLabel(policy.lineOfBusiness)}</td>
                      <td className="px-3 py-3.5 font-semibold tabular-nums text-slate-800">
                        {formatCurrency(policy.coverageLimit, 'USD', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-3 py-3.5 tabular-nums text-slate-600">
                        {formatCurrency(policy.deductible, 'USD', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="font-semibold tabular-nums text-slate-800">
                          {formatCurrency(policy.premium, 'USD', { maximumFractionDigits: 0 })}
                        </span>
                        <span className="mt-0.5 block text-[11px] tabular-nums text-slate-400">
                          {formatCurrency(policy.monthlyPremium)} / mo
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                        {formatDate(policy.effectiveDate)} → {formatDate(policy.expirationDate)}
                        <span
                          className={cn(
                            'mt-0.5 block text-[11px] font-medium',
                            termDays < 0 ? 'text-slate-400' : termDays <= 60 ? 'text-amber-600' : 'text-teal-600',
                          )}
                        >
                          {remaining}
                        </span>
                      </td>
                    </tr>

                    {expanded ? (
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        <td colSpan={9} className="px-5 py-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Issuing agent
                              </p>
                              <p className="mt-1 text-sm font-medium text-slate-700">
                                {policy.agentName}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                Issued {formatDate(policy.issuedAt)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Billing
                              </p>
                              <p className="mt-1 text-sm font-medium text-slate-700 capitalize">
                                {policy.billingFrequency} ·{' '}
                                {PAYMENT_LABEL[policy.paymentStatus] ?? policy.paymentStatus}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {policy.paidThrough
                                  ? `Paid through ${formatDate(policy.paidThrough)}`
                                  : 'No payments posted'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Claims on policy
                              </p>
                              <p className="mt-1 text-sm font-medium text-slate-700">
                                {policy.claimsCount} open ·{' '}
                                {formatCurrency(policy.claimsTotal, 'USD', { maximumFractionDigits: 0 })} incurred
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                Risk profile: {RISK_LABEL[policy.riskProfile] ?? policy.riskProfile}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Coverages bound
                              </p>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {policy.coverageCodes.map((code) => (
                                  <Badge key={code} variant="outline">
                                    {coverageNameById[code] ?? code}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="mt-4 border-t border-slate-200 pt-3 text-xs leading-relaxed text-slate-500">
                            {policy.notes}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                            <span>
                              Effective: <span className="font-medium text-slate-700">{formatDate(policy.effectiveDate)}</span>
                            </span>
                            <span>
                              Expires: <span className="font-medium text-slate-700">{formatDate(policy.expirationDate)}</span>
                            </span>
                            <span>
                              Auto-pay:{' '}
                              <span className="font-medium text-slate-700">
                                {policy.hasAutoPay ? 'Enrolled' : 'Off'}
                              </span>
                            </span>
                            <span>
                              Paperless:{' '}
                              <span className="font-medium text-slate-700">
                                {policy.paperless ? 'On' : 'Off'}
                              </span>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <div className="border-t border-slate-100 px-5 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">No policies match these filters</p>
            <p className="mt-1 text-xs text-slate-500">
              Try a different line of business or status, or clear the search.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
            >
              Reset filters
            </button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
