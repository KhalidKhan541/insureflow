'use client';

import { useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import { MOCK_BROKERS } from '@/lib/mock-data';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

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

interface Contact {
  name: string;
  email: string;
  phone: string;
}

interface Carriers {
  count: number;
  names: string[];
}

interface Broker {
  id: string;
  firm: string;
  contact: Contact;
  carriers: Carriers;
  submissions: number;
  /** Normalized to a 0–1 fraction. */
  hitRatio: number;
  commission: string;
  status: string;
}

const rate = (value: number): string =>
  formatPercent(value > 1 ? value / 100 : value, { digits: 0 });

const readContact = (row: Row): Contact => {
  const value = pick(row, ['contact', 'contactName', 'primaryContact', 'rep', 'broker']);
  if (value && typeof value === 'object') {
    const contact = value as Row;
    return {
      name: readText(contact, ['name', 'fullName'], '—'),
      email: readText(contact, ['email', 'emailAddress']),
      phone: readText(contact, ['phone', 'mobile', 'phoneNumber']),
    };
  }
  return {
    name: typeof value === 'string' ? value : readText(row, ['firmContact', 'rep'], '—'),
    email: readText(row, ['email', 'contactEmail']),
    phone: readText(row, ['phone', 'contactPhone']),
  };
};

const readCarriers = (row: Row): Carriers => {
  const value = pick(row, ['carriers', 'appointedCarriers', 'carrierCount', 'carriersAppointed']);

  if (Array.isArray(value)) {
    const names = value.map((carrier) =>
      typeof carrier === 'string' ? carrier : readText(carrier as Row, ['name', 'carrier'], ''),
    );
    return { count: names.length, names };
  }

  if (typeof value === 'number') return { count: value, names: [] };

  if (typeof value === 'string') {
    if (value.includes(',')) {
      const names = value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);
      return { count: names.length, names };
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return { count: numeric, names: [] };
    return { count: 1, names: [value] };
  }

  return { count: readNumber(row, ['carrierCount']), names: [] };
};

const readCommission = (row: Row): string => {
  const direct = pick(row, ['commissionSchedule', 'commissionScheduleLabel', 'commission']);

  if (typeof direct === 'string') return direct;
  if (typeof direct === 'number') return `${rate(direct)} schedule`;

  if (direct && typeof direct === 'object') {
    const schedule = direct as Row;
    const newRate = pick(schedule, ['new', 'newBusiness', 'newRate']);
    const renewalRate = pick(schedule, ['renewal', 'renewalRate']);
    if (newRate !== undefined || renewalRate !== undefined) {
      const label = (value: unknown) =>
        typeof value === 'number' ? rate(value) : typeof value === 'string' ? value : '—';
      return `${label(newRate)} new · ${label(renewalRate)} renewal`;
    }
  }

  const newRate = pick(row, ['commissionNew', 'newBusinessCommission', 'newRate']);
  const renewalRate = pick(row, ['commissionRenewal', 'renewalCommission', 'renewalRate']);
  if (newRate !== undefined || renewalRate !== undefined) {
    const label = (value: unknown) =>
      typeof value === 'number' ? rate(value) : typeof value === 'string' ? value : '—';
    return `${label(newRate)} new · ${label(renewalRate)} renewal`;
  }

  return '—';
};

const normalizeHitRatio = (value: number): number => {
  if (value <= 0) return 0;
  return value > 1 ? Math.min(value / 100, 1) : value;
};

const BROKERS: Broker[] = (MOCK_BROKERS as unknown[]).map((raw, index) => {
  const row = raw as Row;

  return {
    id: readText(row, ['id', 'brokerId'], `BRK-${310 + index}`),
    firm: readText(row, ['firm', 'firmName', 'name', 'brokerage', 'company'], `Broker ${index + 1}`),
    contact: readContact(row),
    carriers: readCarriers(row),
    submissions: readNumber(row, [
      'submissions',
      'submissionVolume',
      'submissionsYtd',
      'submissionCount',
    ]),
    hitRatio: normalizeHitRatio(readNumber(row, ['hitRatio', 'hitRate', 'conversion', 'wins'])),
    commission: readCommission(row),
    status: readText(row, ['status', 'state'], 'Prospect'),
  };
});

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  Appointed: 'success',
  'In Appointment': 'success',
  Prospect: 'warning',
  Pending: 'secondary',
  'Under Review': 'default',
  Terminated: 'destructive',
  Lapsed: 'destructive',
};

const statusVariant = (status: string): BadgeVariant => STATUS_VARIANT[status] ?? 'secondary';

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

export default function BrokersPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const statusOptions = useMemo(
    () => ['All', ...Array.from(new Set(BROKERS.map((broker) => broker.status)))],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BROKERS.filter((broker) => {
      const matchesQuery =
        !q ||
        broker.firm.toLowerCase().includes(q) ||
        broker.contact.name.toLowerCase().includes(q) ||
        broker.contact.email.toLowerCase().includes(q) ||
        broker.carriers.names.some((name) => name.toLowerCase().includes(q));
      const matchesStatus = status === 'All' || broker.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const totalSubmissions = BROKERS.reduce((sum, broker) => sum + broker.submissions, 0);
  const appointed = BROKERS.filter((broker) => broker.status.toLowerCase() === 'appointed');
  const avgHitRatio =
    BROKERS.length > 0
      ? BROKERS.reduce((sum, broker) => sum + broker.hitRatio, 0) / BROKERS.length
      : 0;
  const totalCarriers = BROKERS.reduce((sum, broker) => sum + broker.carriers.count, 0);
  const hasFilters = query.trim() !== '' || status !== 'All';

  const clearFilters = () => {
    setQuery('');
    setStatus('All');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Brokers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Brokerage partners, appointment status and submission funnel performance.
          </p>
        </div>
        <Badge variant="outline">
          {formatNumber(BROKERS.length)} firms · {formatNumber(appointed.length)} appointed
        </Badge>
      </header>

      {/* ---------- Summary ---------- */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          label="Broker firms"
          value={formatNumber(BROKERS.length)}
          hint={`${formatNumber(appointed.length)} currently appointed`}
        />
        <StatTile
          label="Appointed carriers"
          value={formatNumber(totalCarriers)}
          hint="Across all broker relationships"
        />
        <StatTile
          label="Submissions"
          value={formatNumber(totalSubmissions)}
          hint="Year to date"
        />
        <StatTile
          label="Avg hit ratio"
          value={formatPercent(avgHitRatio, { digits: 1 })}
          hint="Quoted → bound"
        />
      </div>

      {/* ---------- Filters ---------- */}
      <Card>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label htmlFor="broker-search" className="mb-1.5 block text-xs font-medium text-slate-500">
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
                id="broker-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by firm, contact or carrier…"
                className={`${controlClass} pl-9`}
              />
            </div>
          </div>

          <div className="lg:w-56">
            <label htmlFor="broker-status" className="mb-1.5 block text-xs font-medium text-slate-500">
              Appointment status
            </label>
            <select
              id="broker-status"
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
              Showing {formatNumber(filtered.length)} of {formatNumber(BROKERS.length)}
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

      {/* ---------- Directory ---------- */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Broker directory</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Hit ratio = bound policies ÷ submissions quoted
            </p>
          </div>
          <Badge variant="secondary">{formatNumber(filtered.length)} firms</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2.5 font-medium">Firm</th>
                <th className="px-3 py-2.5 font-medium">Contact</th>
                <th className="px-3 py-2.5 font-medium">Appointed carriers</th>
                <th className="px-3 py-2.5 text-right font-medium">Submissions</th>
                <th className="px-3 py-2.5 font-medium">Hit ratio</th>
                <th className="px-3 py-2.5 font-medium">Commission</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((broker) => (
                <tr
                  key={broker.id}
                  className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                >
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 text-[11px] font-semibold text-white">
                        {broker.firm
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join('')
                          .toUpperCase() || 'BR'}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{broker.firm}</p>
                        <p className="truncate text-xs text-slate-500">{broker.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3.5">
                    <p className="font-medium text-slate-700">{broker.contact.name}</p>
                    <p className="text-xs text-slate-500">
                      {broker.contact.email || '—'}
                      {broker.contact.phone ? ` · ${broker.contact.phone}` : ''}
                    </p>
                  </td>

                  <td className="px-3 py-3.5">
                    {broker.carriers.names.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {broker.carriers.names.slice(0, 3).map((name) => (
                          <Badge key={name} variant="outline">
                            {name}
                          </Badge>
                        ))}
                        {broker.carriers.names.length > 3 && (
                          <Badge variant="secondary">
                            +{broker.carriers.names.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-600">
                        {broker.carriers.count} carrier{broker.carriers.count === 1 ? '' : 's'}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-3.5 text-right font-medium tabular-nums text-slate-800">
                    {formatNumber(broker.submissions)}
                  </td>

                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-teal-600"
                          style={{ width: `${Math.max(broker.hitRatio * 100, 2)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-slate-700">
                        {formatPercent(broker.hitRatio, { digits: 1 })}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5 text-xs text-slate-600">
                    {broker.commission}
                  </td>

                  <td className="px-3 py-3.5">
                    <Badge variant={statusVariant(broker.status)}>{broker.status}</Badge>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-12 text-center">
                    <p className="text-sm font-medium text-slate-600">
                      No broker firms match your filters
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try a different firm, contact or carrier name.
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

      {/* ---------- Commission benchmark ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Submission volume by firm</CardTitle>
            <Badge variant="outline">YTD</Badge>
          </div>
          <ul className="space-y-4">
            {[...filtered]
              .sort((a, b) => b.submissions - a.submissions)
              .slice(0, 6)
              .map((broker) => {
                const maxSubmissions = Math.max(
                  ...filtered.map((entry) => entry.submissions),
                  1,
                );
                return (
                  <li key={broker.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 font-medium text-slate-700">
                        <span className="truncate">{broker.firm}</span>
                        <span className="shrink-0 text-xs font-normal text-slate-400">
                          {formatPercent(broker.hitRatio, { digits: 0 })} hit
                        </span>
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-slate-800">
                        {formatNumber(broker.submissions)}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max((broker.submissions / maxSubmissions) * 100, 4)}%`,
                          background: 'linear-gradient(90deg, #0d9488 0%, #5eead4 100%)',
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            {filtered.length === 0 && (
              <li className="py-6 text-center text-xs text-slate-400">
                No firms to chart for the current filters.
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <CardTitle>Appointment status</CardTitle>
            <span className="text-xs text-slate-500">{formatNumber(BROKERS.length)} total</span>
          </div>
          <ul className="space-y-3">
            {statusOptions
              .filter((option) => option !== 'All')
              .map((option) => {
                const count = BROKERS.filter((broker) => broker.status === option).length;
                const share = BROKERS.length > 0 ? count / BROKERS.length : 0;
                return (
                  <li
                    key={option}
                    className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={statusVariant(option)}>{option}</Badge>
                      <span className="text-sm font-semibold tabular-nums text-slate-800">
                        {formatNumber(count)}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-600"
                        style={{ width: `${Math.max(share * 100, 2)}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      {formatPercent(share, { digits: 0 })} of directory
                    </p>
                  </li>
                );
              })}
          </ul>

          <div className="mt-4 rounded-lg border border-teal-100 bg-teal-50/60 p-3">
            <p className="text-xs font-semibold text-teal-800">Blended hit ratio</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-teal-900">
              {formatPercent(avgHitRatio, { digits: 1 })}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-teal-900/70">
              Bound policies ÷ submissions across {formatNumber(BROKERS.length)} brokerage
              relationships.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
