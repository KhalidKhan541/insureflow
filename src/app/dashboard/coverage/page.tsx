'use client';

import { useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_COVERAGE, MOCK_PRODUCTS } from '@/lib/mock-data';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

const TEAL = '#0d9488';
const TARGET_LOSS_RATIO = 0.62;

const CATEGORY_LABEL: Record<string, string> = {
  liability: 'Liability',
  property: 'Property',
  collision: 'Collision',
  injury: 'Injury',
  cyber: 'Cyber',
  specialty: 'Specialty',
};

/**
 * Every coverage category maps onto the product lines that carry its exposure,
 * so the loss ratio bar reuses real product earnings/claims instead of a made
 * up number.
 */
const LOB_BY_CATEGORY: Record<string, string[]> = {
  liability: ['general_liability', 'professional_indemnity'],
  property: ['homeowners', 'commercial_property', 'marine'],
  collision: ['personal_auto', 'commercial_auto'],
  injury: ['workers_compensation'],
  cyber: ['cyber'],
  specialty: ['life'],
};

/** category → { earned, incurred } aggregated from the product catalog. */
const EXPOSURE_BY_CATEGORY: Record<string, { earned: number; incurred: number }> =
  Object.fromEntries(
    Object.entries(LOB_BY_CATEGORY).map(([category, lobs]) => {
      const rows = MOCK_PRODUCTS.filter((product) => lobs.includes(product.lineOfBusiness));
      return [
        category,
        {
          earned: rows.reduce((sum, product) => sum + product.earnedPremium, 0),
          incurred: rows.reduce((sum, product) => sum + product.claimsIncurred, 0),
        },
      ];
    }),
  );

const TOTAL_EARNED = Object.values(EXPOSURE_BY_CATEGORY).reduce((sum, v) => sum + v.earned, 0);
const TOTAL_INCURRED = Object.values(EXPOSURE_BY_CATEGORY).reduce(
  (sum, v) => sum + v.incurred,
  0,
);

function lossRatioFor(category: string): number | null {
  const entry = EXPOSURE_BY_CATEGORY[category];
  if (!entry || entry.earned <= 0) return null;
  return entry.incurred / entry.earned;
}

function lossTone(ratio: number): { color: string; label: string; variant: BadgeVariant } {
  if (ratio <= TARGET_LOSS_RATIO) {
    return { color: TEAL, label: 'Within target', variant: 'success' };
  }
  if (ratio <= 0.68) return { color: '#f59e0b', label: 'Watch', variant: 'warning' };
  return { color: '#e11d48', label: 'Adverse', variant: 'destructive' };
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40',
        checked ? 'bg-teal-600' : 'bg-slate-300',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

export default function CoveragePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  /** Availability overrides so underwriters can toggle a coverage off inline. */
  const [availability, setAvailability] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MOCK_COVERAGE.map((item) => [item.id, item.isActive])),
  );

  const categories = useMemo(
    () => [...new Set(MOCK_COVERAGE.map((item) => item.category))].sort(),
    [],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return MOCK_COVERAGE.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!term) return true;
      return [
        item.name,
        item.code,
        item.description,
        item.category,
        CATEGORY_LABEL[item.category] ?? item.category,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [query, category]);

  const stats = useMemo(() => {
    const available = MOCK_COVERAGE.filter((item) => availability[item.id]).length;
    const exposure = MOCK_COVERAGE.reduce(
      (sum, item) => sum + item.policiesEnrolled * item.defaultLimit,
      0,
    );
    const enrolled = MOCK_COVERAGE.reduce((sum, item) => sum + item.policiesEnrolled, 0);
    const avgClaim =
      MOCK_COVERAGE.reduce((sum, item) => sum + item.avgClaimCost, 0) / (MOCK_COVERAGE.length || 1);
    return {
      total: MOCK_COVERAGE.length,
      available,
      unavailable: MOCK_COVERAGE.length - available,
      exposure,
      enrolled,
      avgClaim,
      blendedLossRatio: TOTAL_EARNED > 0 ? TOTAL_INCURRED / TOTAL_EARNED : 0,
    };
  }, [availability]);

  const hasFilters = query.trim().length > 0 || category !== 'all';

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
  };

  const toggleAvailability = (id: string) => {
    setAvailability((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const cards = [
    {
      label: 'Coverage types',
      value: formatNumber(stats.total),
      hint: `${stats.available} available · ${stats.unavailable} unavailable`,
    },
    {
      label: 'Policies in force',
      value: formatNumber(stats.enrolled),
      hint: 'Total enrolments across coverages',
    },
    {
      label: 'Aggregate exposure',
      value: formatCurrency(stats.exposure, 'USD', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }),
      hint: 'Sum of in-force limits at default option',
    },
    {
      label: 'Blended loss ratio',
      value: formatPercent(stats.blendedLossRatio, { digits: 1 }),
      hint: `Target ≤ ${formatPercent(TARGET_LOSS_RATIO, { digits: 0 })} · avg claim ${formatCurrency(stats.avgClaim, 'USD', { maximumFractionDigits: 0 })}`,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Coverage</h1>
          <p className="mt-1 text-sm text-slate-500">
            Coverage catalog with in-force counts, exposure, claims performance and availability.
          </p>
        </div>
        <Badge variant="outline">
          {stats.available} of {stats.total} available for quoting
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            >
              <path
                d="m17 17-3.5-3.5m1.5-4.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, code or description…"
              aria-label="Search coverage types"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition',
                category === 'all'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-700',
              )}
            >
              All categories
            </button>
            {categories.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition',
                  category === value
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-700',
                )}
              >
                {CATEGORY_LABEL[value] ?? value}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
            {stats.total} coverage types ·{' '}
            <span className="font-semibold text-slate-700">{formatNumber(stats.enrolled)}</span>{' '}
            enrolments
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-medium text-teal-600 transition hover:text-teal-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* ---------- Coverage table ---------- */}
      <Card className="!p-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <CardTitle>Coverage catalog</CardTitle>
          <Badge variant="secondary">Exposure · claims · availability</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1140px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Coverage type</th>
                <th className="px-3 py-3 font-medium">Description</th>
                <th className="px-3 py-3 font-medium">Policies in force</th>
                <th className="px-3 py-3 font-medium">Total exposure</th>
                <th className="px-3 py-3 font-medium">Avg claim</th>
                <th className="px-3 py-3 font-medium">Loss ratio</th>
                <th className="px-5 py-3 font-medium">Available</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const ratio = lossRatioFor(item.category);
                const tone = ratio !== null ? lossTone(ratio) : null;
                const enabled = availability[item.id];
                const exposure = item.policiesEnrolled * item.defaultLimit;

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      'border-b border-slate-100 transition last:border-0 hover:bg-teal-50/40',
                      !enabled && 'bg-slate-50/60 opacity-70',
                    )}
                  >
                    <td className="px-5 py-3.5 align-top">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline">{item.code}</Badge>
                        <Badge variant="secondary">
                          {CATEGORY_LABEL[item.category] ?? item.category}
                        </Badge>
                        {item.isRecommended ? <Badge variant="default">Recommended</Badge> : null}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 align-top text-xs leading-relaxed text-slate-500">
                      <span className="line-clamp-3 block max-w-[22rem]">{item.description}</span>
                    </td>
                    <td className="px-3 py-3.5 align-top">
                      <span className="font-semibold tabular-nums text-slate-800">
                        {formatNumber(item.policiesEnrolled)}
                      </span>
                      <span className="mt-0.5 block text-[11px] tabular-nums text-slate-400">
                        default limit{' '}
                        {formatCurrency(item.defaultLimit, 'USD', { maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 align-top font-semibold tabular-nums text-slate-800">
                      {formatCurrency(exposure, 'USD', {
                        notation: 'compact',
                        maximumFractionDigits: 1,
                      })}
                    </td>
                    <td className="px-3 py-3.5 align-top tabular-nums text-slate-600">
                      {formatCurrency(item.avgClaimCost, 'USD', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-3 py-3.5 align-top">
                      {ratio !== null && tone ? (
                        <div className="min-w-[150px]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold tabular-nums text-slate-800">
                              {formatPercent(ratio, { digits: 1 })}
                            </span>
                            <Badge variant={tone.variant}>{tone.label}</Badge>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, ratio * 100)}%`,
                                background: tone.color,
                              }}
                            />
                          </div>
                          <span className="mt-1 block text-[11px] text-slate-400">
                            {CATEGORY_LABEL[item.category] ?? item.category} line · target{' '}
                            {formatPercent(TARGET_LOSS_RATIO, { digits: 0 })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">No earned premium yet</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <div className="flex items-center gap-2">
                        <Toggle
                          checked={enabled}
                          onChange={() => toggleAvailability(item.id)}
                          label={`${enabled ? 'Disable' : 'Enable'} ${item.name}`}
                        />
                        <Badge variant={enabled ? 'success' : 'secondary'}>
                          {enabled ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      <span className="mt-1 block text-[11px] text-slate-400">
                        {enabled ? 'Quotable on new business' : 'Hidden from the quote builder'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <div className="border-t border-slate-100 px-5 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">No coverage types match</p>
            <p className="mt-1 text-xs text-slate-500">
              Try a different category, or clear the search.
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
