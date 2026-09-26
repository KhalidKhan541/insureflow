'use client';

import { useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import { MOCK_AGENTS } from '@/lib/mock-data';
import { formatCurrency, formatNumber, formatPercent, getInitials } from '@/lib/utils';

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

interface Agent {
  id: string;
  name: string;
  agency: string;
  book: number;
  policies: number;
  /** Always normalized to a 0–1 fraction. */
  retention: number;
  commission: number;
  /** Always normalized to a 0–5 scale. */
  rating: number;
  territory: string;
  status: string;
}

const normalizeRetention = (value: number): number => {
  if (value <= 0) return 0;
  return value > 1 ? Math.min(value / 100, 1) : value;
};

const normalizeRating = (value: number): number => {
  if (value <= 0) return 0;
  if (value <= 5) return value;
  if (value <= 10) return value / 2;
  return Math.min(value / 20, 5);
};

const AGENTS: Agent[] = (MOCK_AGENTS as unknown[]).map((raw, index) => {
  const row = raw as Row;
  const name = readText(row, ['name', 'agentName', 'fullName'], `Agent ${index + 1}`);

  return {
    id: readText(row, ['id', 'agentId'], `AGT-${210 + index}`),
    name,
    agency: readText(row, ['agency', 'agencyName', 'firm'], 'Independent'),
    book: readNumber(row, ['book', 'bookOfBusiness', 'bookValue', 'bookValueTotal']),
    policies: readNumber(row, ['policies', 'policiesSold', 'policyCount', 'sold']),
    retention: normalizeRetention(readNumber(row, ['retention', 'retentionRate', 'renewalRate'], 0)),
    commission: readNumber(row, [
      'commission',
      'commissionYtd',
      'commissionEarned',
      'commissionYTD',
    ]),
    rating: normalizeRating(readNumber(row, ['rating', 'score', 'performance'], 0)),
    territory: readText(row, ['territory', 'region', 'area'], 'Unassigned'),
    status: readText(row, ['status', 'state'], 'Active'),
  };
});

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  Active: 'success',
  'Top Performer': 'success',
  Probation: 'warning',
  'On Leave': 'secondary',
  Provisional: 'warning',
  Inactive: 'outline',
  Terminated: 'destructive',
};

const statusVariant = (status: string): BadgeVariant => STATUS_VARIANT[status] ?? 'secondary';

const TEAL = '#0d9488';
const TEAL_SOFT = '#5eead4';

function InitialAvatar({ name }: { name: string }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-sm font-semibold text-white ring-2 ring-white">
      {getInitials(name)}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="text-xs leading-none tracking-tight text-amber-400" aria-label={`${rating.toFixed(1)} out of 5`}>
      {'★'.repeat(filled)}
      <span className="text-slate-300">{'★'.repeat(Math.max(0, 5 - filled))}</span>
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

export default function AgentsPage() {
  const [query, setQuery] = useState('');
  const [territory, setTerritory] = useState('All');

  const territoryOptions = useMemo(
    () => ['All', ...Array.from(new Set(AGENTS.map((agent) => agent.territory)))],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AGENTS.filter((agent) => {
      const matchesQuery =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        agent.agency.toLowerCase().includes(q) ||
        agent.territory.toLowerCase().includes(q);
      const matchesTerritory = territory === 'All' || agent.territory === territory;
      return matchesQuery && matchesTerritory;
    });
  }, [query, territory]);

  const totalBook = AGENTS.reduce((sum, agent) => sum + agent.book, 0);
  const totalPolicies = AGENTS.reduce((sum, agent) => sum + agent.policies, 0);
  const totalCommission = AGENTS.reduce((sum, agent) => sum + agent.commission, 0);
  const avgRetention =
    AGENTS.length > 0
      ? AGENTS.reduce((sum, agent) => sum + agent.retention, 0) / AGENTS.length
      : 0;

  const leaderboard = useMemo(
    () => [...AGENTS].sort((a, b) => b.book - a.book).slice(0, 8),
    [],
  );
  const maxBook = Math.max(...leaderboard.map((agent) => agent.book), 1);
  const hasFilters = query.trim() !== '' || territory !== 'All';

  const clearFilters = () => {
    setQuery('');
    setTerritory('All');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Agents</h1>
          <p className="mt-1 text-sm text-slate-500">
            Field force performance, book growth and commission earning across territories.
          </p>
        </div>
        <Badge variant="outline">
          {formatNumber(AGENTS.length)} agents · {formatNumber(territoryOptions.length - 1)}{' '}
          territories
        </Badge>
      </header>

      {/* ---------- Summary ---------- */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          label="Book of business"
          value={formatCurrency(totalBook)}
          hint="Total managed premium"
        />
        <StatTile
          label="Policies sold"
          value={formatNumber(totalPolicies)}
          hint="Year to date"
        />
        <StatTile
          label="Avg retention"
          value={formatPercent(avgRetention, { digits: 1 })}
          hint="12-month rolling"
        />
        <StatTile
          label="Commission YTD"
          value={formatCurrency(totalCommission)}
          hint="Across all territories"
        />
      </div>

      {/* ---------- Filters ---------- */}
      <Card>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label htmlFor="agent-search" className="mb-1.5 block text-xs font-medium text-slate-500">
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
                id="agent-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by agent, agency or territory…"
                className={`${controlClass} pl-9`}
              />
            </div>
          </div>

          <div className="lg:w-56">
            <label htmlFor="agent-territory" className="mb-1.5 block text-xs font-medium text-slate-500">
              Territory
            </label>
            <select
              id="agent-territory"
              value={territory}
              onChange={(event) => setTerritory(event.target.value)}
              className={controlClass}
            >
              {territoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'All' ? 'All territories' : option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <span className="text-xs text-slate-500">
              Showing {formatNumber(filtered.length)} of {formatNumber(AGENTS.length)}
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

      {/* ---------- Leaderboard ---------- */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Leaderboard — book of business</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Top agents ranked by managed premium volume
            </p>
          </div>
          <Badge variant="default">YTD</Badge>
        </div>

        <ul className="space-y-4">
          {leaderboard.map((agent, index) => (
            <li key={agent.id}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2 font-medium text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal-700">
                    {index + 1}
                  </span>
                  <span className="truncate">{agent.name}</span>
                  <span className="truncate text-xs font-normal text-slate-400">
                    {agent.agency}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-slate-500">
                    {formatNumber(agent.policies)} policies
                  </span>
                  <span className="font-semibold tabular-nums text-slate-800">
                    {formatCurrency(agent.book, 'USD', { maximumFractionDigits: 0 })}
                  </span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max((agent.book / maxBook) * 100, 4)}%`,
                    background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_SOFT} 100%)`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* ---------- Agent cards ---------- */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-slate-800">
            Agent roster
          </h2>
          <span className="text-xs text-slate-500">
            {formatNumber(filtered.length)} of {formatNumber(AGENTS.length)} shown
          </span>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-600">No agents match your filters</p>
              <p className="mt-1 text-xs text-slate-400">
                Try a different search term or clear the territory filter.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-teal-700"
              >
                Clear filters
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((agent) => {
              const share = totalBook > 0 ? agent.book / totalBook : 0;
              return (
                <Card key={agent.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <InitialAvatar name={agent.name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {agent.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">{agent.agency}</p>
                      </div>
                    </div>
                    <Badge variant={statusVariant(agent.status)}>{agent.status}</Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{agent.territory}</Badge>
                    <span className="flex items-center gap-1.5">
                      <Stars rating={agent.rating} />
                      <span className="text-xs font-medium tabular-nums text-slate-600">
                        {agent.rating.toFixed(1)}
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Book of business
                      </p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
                        {formatCurrency(agent.book, 'USD', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Policies sold
                      </p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
                        {formatNumber(agent.policies)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Retention
                      </p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
                        {formatPercent(agent.retention, { digits: 1 })}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Commission YTD
                      </p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-slate-800">
                        {formatCurrency(agent.commission, 'USD', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Share of total book</span>
                      <span className="font-semibold tabular-nums text-teal-700">
                        {formatPercent(share, { digits: 1 })}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(share * 100, 2)}%`,
                          background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_SOFT} 100%)`,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
