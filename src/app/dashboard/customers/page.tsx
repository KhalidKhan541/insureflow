'use client';

import { useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import { MOCK_CUSTOMERS } from '@/lib/mock-data';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  getInitials,
} from '@/lib/utils';

type Row = Record<string, any>;

const pick = (row: Row, keys: string[]): unknown => {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
};

const readText = (row: Row, keys: string[], fallback = ''): string => {
  const value = pick(row, keys);
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
};

const readNumber = (row: Row, keys: string[], fallback = 0): number => {
  const value = pick(row, keys);
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.-]/g, ''));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

type RiskProfile = 'Preferred' | 'Standard' | 'Substandard';

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  policies: number;
  premium: number;
  claims: number;
  risk: RiskProfile;
  status: string;
  joined: string;
  phone: string;
  location: string;
}

const normalizeRisk = (value: string): RiskProfile => {
  const normalized = value.trim().toLowerCase().replace(/_/g, ' ');
  if (normalized.startsWith('pref')) return 'Preferred';
  if (normalized.startsWith('sub') || normalized.startsWith('high') || normalized.startsWith('elev')) {
    return 'Substandard';
  }
  return 'Standard';
};

/** 'at_risk' → 'At Risk' */
const normalizeStatus = (value: string, fallback = 'Active'): string => {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed
    .replace(/_/g, ' ')
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const readLocation = (row: Row): string => {
  const address = pick(row, ['address', 'location', 'mailingAddress']);
  if (address && typeof address === 'object') {
    const parts = [
      readText(address as Row, ['city']),
      readText(address as Row, ['state', 'region']),
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(', ');
  }
  if (typeof address === 'string') return address;
  return readText(row, ['city', 'region']);
};

const CUSTOMERS: Customer[] = (MOCK_CUSTOMERS as unknown[]).map((raw, index) => {
  const row = raw as Row;
  const name = readText(row, ['name', 'fullName', 'customer'], `Customer ${index + 1}`);
  const joined = pick(row, ['since', 'joined', 'joinedDate', 'memberSince', 'startDate', 'createdAt']);

  return {
    id: readText(row, ['customerId', 'customerNo', 'id'], `CUST-${1041 + index}`),
    name,
    email: readText(row, ['email', 'emailAddress']),
    avatar: readText(row, ['avatar', 'avatarUrl', 'initials', 'image']),
    policies: readNumber(row, ['policies', 'policyCount', 'activePolicies', 'policiesCount']),
    premium: readNumber(row, [
      'lifetimePremium',
      'lifetimeValue',
      'totalPaid',
      'premium',
      'totalPremium',
    ]),
    claims: readNumber(row, ['claims', 'claimsCount', 'claimsHistory', 'claimsMade']),
    risk: normalizeRisk(readText(row, ['riskProfile', 'risk', 'riskTier', 'riskClass'], 'Standard')),
    status: normalizeStatus(readText(row, ['status', 'state'], 'Active')),
    joined: formatDate(joined as string | number | Date | null | undefined, 'medium'),
    phone: readText(row, ['phone', 'phoneNumber', 'mobile']),
    location: readLocation(row),
  };
});

const RISK_VARIANT: Record<RiskProfile, BadgeVariant> = {
  Preferred: 'success',
  Standard: 'default',
  Substandard: 'warning',
};

const RISK_NOTE: Record<RiskProfile, string> = {
  Preferred:
    'Low loss frequency and clean claims record — eligible for preferred rate tiers and accelerated renewal.',
  Standard:
    'Priced against base rate tables with standard underwriting review at each renewal cycle.',
  Substandard:
    'Elevated exposure — referred to manual underwriting, surcharge applied and reviewed quarterly.',
};

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  Active: 'success',
  Inforce: 'success',
  'In Force': 'success',
  Prospect: 'secondary',
  'Pending Renewal': 'warning',
  'In Underwriting': 'default',
  Lapsed: 'destructive',
  Cancelled: 'destructive',
  Inactive: 'outline',
  Churned: 'destructive',
  'At Risk': 'warning',
};

const statusVariant = (status: string): BadgeVariant => STATUS_VARIANT[status] ?? 'secondary';

function Avatar({
  name,
  src,
  size = 'h-9 w-9 text-[11px]',
}: {
  name: string;
  src?: string;
  size?: string;
}) {
  const [failed, setFailed] = useState(false);
  const isImage = !!src && (/^https?:\/\//i.test(src) || src.startsWith('/'));

  if (isImage && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white`}
      />
    );
  }

  return (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 font-semibold text-white ring-2 ring-white`}
    >
      {getInitials(name)}
    </span>
  );
}

function StatTile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>
    </div>
  );
}

const controlClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

export default function CustomersPage() {
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('All');
  const [status, setStatus] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(CUSTOMERS[0]?.id ?? null);

  const statusOptions = useMemo(
    () => ['All', ...Array.from(new Set(CUSTOMERS.map((customer) => customer.status)))],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CUSTOMERS.filter((customer) => {
      const matchesQuery =
        !q ||
        customer.name.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q) ||
        customer.id.toLowerCase().includes(q);
      const matchesRisk = risk === 'All' || customer.risk === risk;
      const matchesStatus = status === 'All' || customer.status === status;
      return matchesQuery && matchesRisk && matchesStatus;
    });
  }, [query, risk, status]);

  const selected =
    filtered.find((customer) => customer.id === selectedId) ?? filtered[0] ?? null;

  const totalPolicies = CUSTOMERS.reduce((sum, customer) => sum + customer.policies, 0);
  const totalPremium = CUSTOMERS.reduce((sum, customer) => sum + customer.premium, 0);
  const totalClaims = CUSTOMERS.reduce((sum, customer) => sum + customer.claims, 0);
  const activeCustomers = CUSTOMERS.filter(
    (customer) => customer.status.toLowerCase() === 'active',
  ).length;
  const hasFilters = query.trim() !== '' || risk !== 'All' || status !== 'All';

  const clearFilters = () => {
    setQuery('');
    setRisk('All');
    setStatus('All');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Policyholders, lifetime value and risk segmentation across the book.
          </p>
        </div>
        <Badge variant="outline">
          {formatNumber(CUSTOMERS.length)} policyholders · Updated 6 min ago
        </Badge>
      </header>

      {/* ---------- Summary ---------- */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          label="Customers"
          value={formatNumber(CUSTOMERS.length)}
          hint={`${formatNumber(activeCustomers)} active`}
        />
        <StatTile
          label="Policies in force"
          value={formatNumber(totalPolicies)}
          hint={`${formatNumber(CUSTOMERS.length ? Math.round(totalPolicies / CUSTOMERS.length) : 0)} avg per customer`}
        />
        <StatTile
          label="Lifetime premium"
          value={formatCurrency(totalPremium)}
          hint="Billed across all products"
        />
        <StatTile
          label="Claims history"
          value={formatNumber(totalClaims)}
          hint={
            totalPolicies > 0
              ? `${formatPercent(totalClaims / totalPolicies, { digits: 1 })} of policies with a claim`
              : 'No policies recorded'
          }
        />
      </div>

      {/* ---------- Filters ---------- */}
      <Card>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label
              htmlFor="customer-search"
              className="mb-1.5 block text-xs font-medium text-slate-500"
            >
              Search
            </label>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                id="customer-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, email or customer ID…"
                className={`${controlClass} pl-9`}
              />
            </div>
          </div>

          <div className="lg:w-52">
            <label htmlFor="customer-risk" className="mb-1.5 block text-xs font-medium text-slate-500">
              Risk profile
            </label>
            <select
              id="customer-risk"
              value={risk}
              onChange={(event) => setRisk(event.target.value)}
              className={controlClass}
            >
              {['All', 'Preferred', 'Standard', 'Substandard'].map((option) => (
                <option key={option} value={option}>
                  {option === 'All' ? 'All risk profiles' : option}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:w-52">
            <label htmlFor="customer-status" className="mb-1.5 block text-xs font-medium text-slate-500">
              Status
            </label>
            <select
              id="customer-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={controlClass}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'All' ? 'All statuses' : option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <span className="text-xs text-slate-500">
              Showing {formatNumber(filtered.length)} of {formatNumber(CUSTOMERS.length)}
            </span>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* ---------- Table + detail panel ---------- */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Customer directory</CardTitle>
            <Badge variant="secondary">Click a row for details</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2.5 font-medium">Customer</th>
                  <th className="px-3 py-2.5 text-right font-medium">Policies</th>
                  <th className="px-3 py-2.5 text-right font-medium">Lifetime premium</th>
                  <th className="px-3 py-2.5 text-right font-medium">Claims</th>
                  <th className="px-3 py-2.5 font-medium">Risk</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => {
                  const isActive = selected?.id === customer.id;
                  return (
                    <tr
                      key={customer.id}
                      tabIndex={0}
                      onClick={() => setSelectedId(customer.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedId(customer.id);
                        }
                      }}
                      className={`cursor-pointer border-b border-slate-100 outline-none transition last:border-0 focus-visible:ring-2 focus-visible:ring-teal-500/40 ${
                        isActive ? 'bg-teal-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={customer.name} src={customer.avatar} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-800">{customer.name}</p>
                            <p className="truncate text-xs text-slate-500">
                              {customer.email || '—'} · {customer.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-slate-700">
                        {formatNumber(customer.policies)}
                      </td>
                      <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-800">
                        {formatCurrency(customer.premium)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-slate-700">
                        {formatNumber(customer.claims)}
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant={RISK_VARIANT[customer.risk]}>{customer.risk}</Badge>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant={statusVariant(customer.status)}>{customer.status}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
                        {customer.joined}
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-12 text-center">
                      <p className="text-sm font-medium text-slate-600">
                        No customers match your filters
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Try a different search term or clear the filters.
                      </p>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-teal-700"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="lg:sticky lg:top-6">
          {selected ? (
            <div>
              <div className="flex items-start gap-3">
                <Avatar name={selected.name} src={selected.avatar} size="h-14 w-14 text-base" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-slate-900">
                    {selected.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {selected.email || 'No email on file'}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                    {selected.id}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={RISK_VARIANT[selected.risk]}>{selected.risk} risk</Badge>
                <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
                <Badge variant="outline">Joined {selected.joined}</Badge>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: 'Policies', value: formatNumber(selected.policies) },
                  { label: 'Lifetime premium', value: formatCurrency(selected.premium) },
                  { label: 'Claims history', value: formatNumber(selected.claims) },
                  {
                    label: 'Avg premium / policy',
                    value: formatCurrency(
                      selected.policies > 0 ? selected.premium / selected.policies : 0,
                    ),
                  },
                ].map((tile) => (
                  <div
                    key={tile.label}
                    className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {tile.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
                      {tile.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-teal-100 bg-teal-50/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-teal-800">Risk assessment</p>
                  <span className="text-[11px] font-medium text-teal-700">
                    {selected.policies > 0
                      ? `${formatPercent(selected.claims / selected.policies, { digits: 1 })} claim rate`
                      : 'No policies yet'}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-teal-900/80">
                  {RISK_NOTE[selected.risk]}
                </p>
              </div>

              <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs">
                {[
                  { label: 'Customer since', value: selected.joined },
                  { label: 'Status', value: selected.status },
                  { label: 'Phone', value: selected.phone || '—' },
                  { label: 'Location', value: selected.location || '—' },
                  {
                    label: 'Claims frequency',
                    value:
                      selected.policies > 0
                        ? `${(selected.claims / selected.policies).toFixed(2)} per policy`
                        : '—',
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">{row.label}</dt>
                    <dd className="font-medium text-slate-700">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="py-10 text-center">
              <CardTitle>Customer details</CardTitle>
              <p className="mt-2 text-xs text-slate-500">
                Select a customer from the table to view their profile, risk notes and account
                history.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
