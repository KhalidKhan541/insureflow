'use client';

import { useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_CLAIMS, MOCK_PRODUCTS } from '@/lib/mock-data';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

const TEAL = '#0d9488';
const TARGET_LOSS_RATIO = 0.62;

/** Catalog category (auto / home / life / commercial / cyber) per line of business. */
const CATEGORY_BY_LOB: Record<string, string> = {
  personal_auto: 'auto',
  homeowners: 'home',
  life: 'life',
  cyber: 'cyber',
  commercial_auto: 'commercial',
  commercial_property: 'commercial',
  general_liability: 'commercial',
  workers_compensation: 'commercial',
  professional_indemnity: 'commercial',
  marine: 'commercial',
};

const CATEGORY_ORDER = ['auto', 'home', 'life', 'commercial', 'cyber'];

const CATEGORY_LABEL: Record<string, string> = {
  auto: 'Auto',
  home: 'Home',
  life: 'Life',
  commercial: 'Commercial',
  cyber: 'Cyber',
};

const STATUS_META: Record<string, { label: string; variant: BadgeVariant }> = {
  live: { label: 'Live', variant: 'success' },
  active: { label: 'Live', variant: 'success' },
  draft: { label: 'Draft', variant: 'warning' },
  deprecated: { label: 'Deprecated', variant: 'secondary' },
  paused: { label: 'Paused', variant: 'secondary' },
};

function lossTone(fraction: number) {
  if (fraction <= TARGET_LOSS_RATIO) return { color: TEAL, label: 'Within target' };
  if (fraction <= 0.7) return { color: '#f59e0b', label: 'Watch' };
  return { color: '#e11d48', label: 'Adverse' };
}

function labelFor(value: string, map: Record<string, string>): string {
  const key = value.toLowerCase();
  if (map[key]) return map[key];
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function statusMeta(value: string) {
  return STATUS_META[value.toLowerCase()] ?? { label: labelFor(value, STATUS_LABEL), variant: 'outline' as BadgeVariant };
}

const STATUS_LABEL: Record<string, string> = {};

function categoryOf(lineOfBusiness: string): string {
  return CATEGORY_BY_LOB[lineOfBusiness] ?? 'other';
}

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  /** Average claim size per line of business — each line maps to one product. */
  const claimStats = useMemo(() => {
    const acc = new Map<string, { sum: number; count: number }>();
    for (const claim of MOCK_CLAIMS) {
      const entry = acc.get(claim.lineOfBusiness) ?? { sum: 0, count: 0 };
      entry.sum += claim.amountClaimed;
      entry.count += 1;
      acc.set(claim.lineOfBusiness, entry);
    }
    return acc;
  }, []);

  const categories = useMemo(() => {
    const present = new Set(MOCK_PRODUCTS.map((product) => categoryOf(product.lineOfBusiness)));
    const ordered = CATEGORY_ORDER.filter((value) => present.has(value));
    for (const value of present) if (!CATEGORY_ORDER.includes(value)) ordered.push(value);
    return ['all', ...ordered];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PRODUCTS.filter((product) => {
      const group = categoryOf(product.lineOfBusiness);
      if (category !== 'all' && group !== category) return false;
      if (!q) return true;
      return [
        product.name,
        product.code,
        product.category,
        product.lineOfBusiness,
        group,
        labelFor(group, CATEGORY_LABEL),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [query, category]);

  const totalPolicies = MOCK_PRODUCTS.reduce((sum, product) => sum + product.policiesInForce, 0);
  const totalWritten = MOCK_PRODUCTS.reduce((sum, product) => sum + product.writtenPremium, 0);
  const blendedLossRatio =
    MOCK_PRODUCTS.reduce((sum, product) => sum + product.lossRatio, 0) / MOCK_PRODUCTS.length;

  const statusCounts = MOCK_PRODUCTS.reduce<Record<string, number>>((acc, product) => {
    const key = statusMeta(product.status).label.toLowerCase();
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const hasFilters = query.trim().length > 0 || category !== 'all';

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
  };

  const avgClaimFor = (lineOfBusiness: string): number | null => {
    const entry = claimStats.get(lineOfBusiness);
    return entry && entry.count > 0 ? entry.sum / entry.count : null;
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Product catalog with pricing, in-force counts and profitability by line.
          </p>
        </div>
        <Badge variant="outline">
          {MOCK_PRODUCTS.length} products · {formatNumber(totalPolicies)} policies
        </Badge>
      </header>

      {/* ---------- Summary ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Catalog products"
          value={formatNumber(MOCK_PRODUCTS.length)}
          hint={`${statusCounts.live ?? 0} live · ${statusCounts.draft ?? 0} draft · ${
            statusCounts.deprecated ?? 0
          } deprecated`}
        />
        <MetricCard
          label="Policies in force"
          value={formatNumber(totalPolicies)}
          hint="Across all product lines"
        />
        <MetricCard
          label="Written premium (YTD)"
          value={formatCurrency(totalWritten)}
          hint={`${formatCurrency(totalWritten / MOCK_PRODUCTS.length)} avg per product`}
        />
        <MetricCard
          label="Blended loss ratio"
          value={formatPercent(blendedLossRatio, { digits: 1 })}
          hint={`Target ≤ ${formatPercent(TARGET_LOSS_RATIO, { digits: 0 })}`}
        />
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
              placeholder="Search by name, code or category…"
              aria-label="Search products"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((value) => {
              const active = category === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition',
                    active
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-700',
                  )}
                >
                  {value === 'all' ? 'All categories' : labelFor(value, CATEGORY_LABEL)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
            {MOCK_PRODUCTS.length} products
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

      {/* ---------- Product cards ---------- */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => {
            const group = categoryOf(product.lineOfBusiness);
            const tone = lossTone(product.lossRatio);
            const status = statusMeta(product.status);
            const claimSize = avgClaimFor(product.lineOfBusiness);

            return (
              <Card key={product.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      {product.code} · {labelFor(group, CATEGORY_LABEL)}
                    </p>
                    <h2 className="mt-1 truncate text-sm font-semibold text-slate-800">
                      {product.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {product.description}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Base premium
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
                      {formatCurrency(product.pricing.basePremium)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      In force
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
                      {formatNumber(product.policiesInForce)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Written premium
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
                      {formatCurrency(product.writtenPremium)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Avg claim size
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
                      {claimSize === null ? '—' : formatCurrency(claimSize)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200/80 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">Loss ratio</span>
                    <span className="font-semibold tabular-nums" style={{ color: tone.color }}>
                      {formatPercent(product.lossRatio, { digits: 1 })}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(Math.max(product.lossRatio, 0), 1) * 100}%`,
                        background: `linear-gradient(90deg, ${tone.color}66 0%, ${tone.color} 100%)`,
                      }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span style={{ color: tone.color }}>{tone.label}</span>
                    <span>Target ≤ {formatPercent(TARGET_LOSS_RATIO, { digits: 0 })}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <CardTitle>No products found</CardTitle>
          <p className="mt-2 text-sm text-slate-500">
            Nothing matches “{query}”
            {category !== 'all' ? ` in ${labelFor(category, CATEGORY_LABEL)}` : ''}.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Clear filters
          </button>
        </Card>
      )}
    </div>
  );
}
