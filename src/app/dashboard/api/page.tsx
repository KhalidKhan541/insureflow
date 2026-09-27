'use client';

import { useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { MOCK_API_KEYS, type ApiKey } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const TEAL = '#0d9488';

/* Scope catalogue — matches the strings used in `ApiKey.scopes`. */
const SCOPES = [
  { id: 'policies:read', label: 'Policies', detail: 'Read policies, coverages and endorsements' },
  { id: 'quotes:read', label: 'Quotes read', detail: 'Read quotes and rating responses' },
  { id: 'quotes:write', label: 'Quotes write', detail: 'Create, amend and bind quotes' },
  { id: 'claims:read', label: 'Claims read', detail: 'Read claim files, reserves and payments' },
  { id: 'claims:write', label: 'Claims write', detail: 'Update reserves and add claim notes' },
  { id: 'customers:read', label: 'Customers', detail: 'Read customer and contact records' },
] as const;

const SNIPPETS: { id: 'curl' | 'node' | 'python'; label: string }[] = [
  { id: 'curl', label: 'cURL' },
  { id: 'node', label: 'Node.js' },
  { id: 'python', label: 'Python' },
];

const RATE_LIMITS = [
  { id: 'core', label: 'Core API', used: 8_420, limit: 10_000, unit: 'req / 24h' },
  { id: 'quotes', label: 'Rating & quotes', used: 1_860, limit: 2_500, unit: 'req / 24h' },
  { id: 'webhooks', label: 'Webhook deliveries', used: 12_480, limit: 15_000, unit: 'events / 24h' },
  { id: 'exports', label: 'Bulk exports', used: 42, limit: 60, unit: 'jobs / 24h' },
];

/* Recent API traffic — status codes, latency and the key that authenticated it. */
interface RequestLog {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  status: number;
  latency: number;
  key: string;
  time: string;
  note?: string;
}

const REQUEST_LOGS: RequestLog[] = [
  { id: 'rq_1', method: 'GET', path: '/v1/policies?status=active&limit=50', status: 200, latency: 92, key: 'if_live_7f2a', time: '12:04:18' },
  { id: 'rq_2', method: 'POST', path: '/v1/claims/IF-CLM-2026-3051/reserves', status: 200, latency: 148, key: 'if_live_7f2a', time: '12:03:55', note: 'reserve updated' },
  { id: 'rq_3', method: 'POST', path: '/v1/quotes', status: 201, latency: 312, key: 'if_live_b91c', time: '12:03:41' },
  { id: 'rq_4', method: 'GET', path: '/v1/customers/cust_008', status: 404, latency: 61, key: 'if_live_b91c', time: '12:02:09', note: 'soft-deleted record' },
  { id: 'rq_5', method: 'PATCH', path: '/v1/policies/pol_020', status: 422, latency: 87, key: 'if_live_7f2a', time: '12:01:47', note: 'premium below minimum' },
  { id: 'rq_6', method: 'GET', path: '/v1/quotes/rate', status: 429, latency: 14, key: 'if_live_b91c', time: '12:01:12', note: 'rate limit exceeded' },
  { id: 'rq_7', method: 'POST', path: '/v1/webhooks/test', status: 200, latency: 604, key: 'if_test_44de', time: '11:58:33', note: 'slow endpoint' },
  { id: 'rq_8', method: 'DELETE', path: '/v1/api-keys/key_009', status: 401, latency: 38, key: 'if_test_44de', time: '11:57:04', note: 'expired secret' },
  { id: 'rq_9', method: 'GET', path: '/v1/claims?severity=critical', status: 200, latency: 205, key: 'if_live_7f2a', time: '11:55:50' },
  { id: 'rq_10', method: 'POST', path: '/v1/policies/pol_019/renewals', status: 200, latency: 176, key: 'if_live_b91c', time: '11:54:22' },
];

const statusVariant: Record<number, BadgeVariant> = {
  200: 'success',
  201: 'success',
  204: 'success',
  400: 'warning',
  401: 'destructive',
  403: 'destructive',
  404: 'warning',
  409: 'warning',
  422: 'warning',
  429: 'destructive',
};

const keyStatusVariant: Record<ApiKey['status'], BadgeVariant> = {
  active: 'success',
  expiring: 'warning',
  revoked: 'destructive',
};

function latencyTone(ms: number): string {
  if (ms >= 400) return 'text-rose-600';
  if (ms >= 200) return 'text-amber-600';
  return 'text-teal-600';
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Never';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildSnippet(language: 'curl' | 'node' | 'python', baseUrl: string, key: string): string {
  if (language === 'curl') {
    return [
      `curl -X GET "${baseUrl}/v1/policies?status=active&limit=50" \\`,
      `  -H "Authorization: Bearer ${key}" \\`,
      `  -H "InsureFlow-Version: 2026-04-01" \\`,
      `  -H "Accept: application/json"`,
    ].join('\n');
  }
  if (language === 'node') {
    return [
      `import { InsureFlow } from '@insureflow/node';`,
      ``,
      `const client = new InsureFlow({ apiKey: '${key}' });`,
      ``,
      `const policies = await client.policies.list({`,
      `  status: 'active',`,
      `  limit: 50,`,
      `});`,
      ``,
      `console.log(policies.data);`,
    ].join('\n');
  }
  return [
    `from insureflow import InsureFlow`,
    ``,
    `client = InsureFlow(api_key="${key}")`,
    ``,
    `policies = client.policies.list(status="active", limit=50)`,
    ``,
    `for policy in policies.data:`,
    `    print(policy.number, policy.premium)`,
  ].join('\n');
}

function CopyButton({
  value,
  label = 'Copy',
  size = 'xs',
}: {
  value: string;
  label?: string;
  size?: 'xs' | 'sm';
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard unavailable (insecure context) — keep the UI responsive.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button size={size} variant="outline" soft={copied} onClick={handleCopy}>
      {copied ? 'Copied ✓' : label}
    </Button>
  );
}

/* ------------------------------------------------------------------ */

export default function ApiPage() {
  const [environment, setEnvironment] = useState<'sandbox' | 'live'>('sandbox');
  const [language, setLanguage] = useState<'curl' | 'node' | 'python'>('curl');
  const [revokedIds, setRevokedIds] = useState<string[]>([]);
  const [createdKeys, setCreatedKeys] = useState<ApiKey[]>([]);
  const [selectedKeyId, setSelectedKeyId] = useState<string>(MOCK_API_KEYS[0]?.id ?? '');
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);

  const desiredEnv = environment === 'live' ? 'live' : 'test';
  const baseUrl =
    environment === 'live' ? 'https://api.insureflow.dev' : 'https://sandbox.api.insureflow.dev';

  const keys = useMemo(
    () =>
      [...createdKeys, ...MOCK_API_KEYS].filter(
        (key) => key.environment === desiredEnv && !revokedIds.includes(key.id),
      ),
    [createdKeys, revokedIds, desiredEnv],
  );

  const selectedKey = keys.find((key) => key.id === selectedKeyId) ?? keys[0];

  const exampleSecret =
    environment === 'live'
      ? 'if_live_7f2a3d9c1b8e4f06a52d7c3e91b0'
      : 'if_test_44de19c7a2b54f83d0e6a1c4b7f9';

  const snippet = useMemo(
    () => buildSnippet(language, baseUrl, exampleSecret),
    [language, baseUrl, exampleSecret],
  );

  const totalUsed = RATE_LIMITS.reduce((sum, bucket) => sum + bucket.used, 0);
  const totalLimit = RATE_LIMITS.reduce((sum, bucket) => sum + bucket.limit, 0);

  function handleCreateKey() {
    const id = `key_${Math.random().toString(36).slice(2, 8)}`;
    const created: ApiKey = {
      id,
      name: `New ${environment === 'live' ? 'production' : 'sandbox'} key`,
      prefix: environment === 'live' ? 'if_live' : 'if_test',
      maskedKey: `${environment === 'live' ? 'if_live' : 'if_test'}_new1••••••••••••••••••${Math.random()
        .toString(36)
        .slice(2, 6)}`,
      environment: environment === 'live' ? 'live' : 'test',
      scopes: ['policies:read'],
      createdBy: 'Katherine Yoon',
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      expiresAt: null,
      secretRotatedAt: new Date().toISOString(),
      requestsLast30Days: 0,
      rateLimitPerMin: 120,
      status: 'active',
      ipWhitelist: [],
      webhookUrl: null,
    };
    setCreatedKeys((prev) => [created, ...prev]);
    setSelectedKeyId(id);
    setNewSecret(
      `${created.prefix}_${Math.random().toString(36).slice(2, 10)}${Math.random()
        .toString(36)
        .slice(2, 14)}`,
    );
  }

  function handleRevoke(id: string) {
    setRevokedIds((prev) => [...prev, id]);
    setConfirmRevokeId(null);
    if (selectedKeyId === id) {
      const remaining = keys.filter((key) => key.id !== id);
      setSelectedKeyId(remaining[0]?.id ?? '');
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Developer API</h1>
          <p className="mt-1 text-sm text-slate-500">
            REST + webhooks for policies, quotes, claims and payments. v1 is stable until April 2027.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">OpenAPI 3.1</Badge>
          <Badge variant="success">99.98% uptime</Badge>
        </div>
      </header>

      {/* ---------- Environment toggle + quick stats ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="!p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Environment
          </p>
          <div className="mt-2 flex rounded-lg bg-slate-100 p-1">
            {(['sandbox', 'live'] as const).map((env) => (
              <button
                key={env}
                type="button"
                onClick={() => setEnvironment(env)}
                className={cn(
                  'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition',
                  environment === env
                    ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-700',
                )}
              >
                {env}
              </button>
            ))}
          </div>
          <p className="mt-2 truncate font-mono text-[11px] text-slate-500">{baseUrl}</p>
        </Card>

        <Card className="!p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Requests (24h)
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">112,480</p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full" style={{ width: '64%', background: TEAL }} />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">64% of plan allowance</p>
        </Card>

        <Card className="!p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            p95 latency
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">184 ms</p>
          <p className="mt-1.5 text-xs text-teal-600">▼ 22 ms vs last week</p>
        </Card>

        <Card className="!p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Error rate
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">0.42%</p>
          <p className="mt-1.5 text-xs text-slate-500">4xx + 5xx · 472 of 112,480</p>
        </Card>
      </div>

      {/* ---------- API keys ---------- */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>API keys</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Scoped credentials per environment. Secrets are shown once at creation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{keys.length} in {environment}</Badge>
            <Button size="sm" onClick={handleCreateKey}>
              Create key
            </Button>
          </div>
        </div>

        {newSecret ? (
          <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-teal-800">
                  Copy this secret now — it is not shown again.
                </p>
                <p className="mt-1 truncate font-mono text-xs text-teal-900">{newSecret}</p>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton value={newSecret} size="sm" />
                <Button size="xs" variant="ghost" onClick={() => setNewSecret(null)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <th className="pb-2">Name</th>
                <th className="pb-2">Key</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Scopes</th>
                <th className="pb-2">Requests 30d</th>
                <th className="pb-2">Last used</th>
                <th className="pb-2">Expires</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr
                  key={key.id}
                  className={cn(
                    'border-b border-slate-100 last:border-0',
                    selectedKey?.id === key.id && 'bg-teal-50/40',
                  )}
                >
                  <td className="py-3 pr-4">
                    <button
                      type="button"
                      onClick={() => setSelectedKeyId(key.id)}
                      className="text-left font-medium text-slate-800 hover:text-teal-700"
                    >
                      {key.name}
                    </button>
                    <p className="text-xs text-slate-400">by {key.createdBy}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs text-slate-600">{key.maskedKey}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={keyStatusVariant[key.status]}>{key.status}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.includes('*') ? (
                        <Badge variant="warning" className="font-mono">
                          * (full access)
                        </Badge>
                      ) : (
                        key.scopes.slice(0, 2).map((scope) => (
                          <Badge key={scope} variant="outline" className="font-mono">
                            {scope}
                          </Badge>
                        ))
                      )}
                      {!key.scopes.includes('*') && key.scopes.length > 2 ? (
                        <Badge variant="secondary">+{key.scopes.length - 2}</Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-slate-600">
                    {key.requestsLast30Days.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-500">
                    {formatDate(key.lastUsedAt)}
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-500">
                    {key.expiresAt ? formatDate(key.expiresAt) : 'Never'}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <CopyButton
                        value={key.maskedKey}
                        label={copiedId === key.id ? 'Copied ✓' : 'Copy'}
                      />
                      {confirmRevokeId === key.id ? (
                        <>
                          <Button size="xs" variant="danger" onClick={() => handleRevoke(key.id)}>
                            Confirm
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => setConfirmRevokeId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => setConfirmRevokeId(key.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {keys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-sm text-slate-500">
                    No keys in {environment}. Create one to start calling the API.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ---------- Scoped permissions ---------- */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Scoped permissions</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {selectedKey
                ? `Granted to “${selectedKey.name}” · ${selectedKey.rateLimitPerMin} req/min`
                : 'Select a key to review its scopes'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedKey ? (
              <Badge variant="outline">
                {selectedKey.ipWhitelist.length > 0
                  ? `${selectedKey.ipWhitelist.length} IP rules`
                  : 'No IP restriction'}
              </Badge>
            ) : null}
            <Button size="sm" variant="outline" disabled={!selectedKey}>
              Edit scopes
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SCOPES.map((scope) => {
            const wildcard = selectedKey?.scopes.includes('*') ?? false;
            const granted = wildcard || (selectedKey?.scopes.includes(scope.id) ?? false);
            return (
              <div
                key={scope.id}
                className={cn(
                  'rounded-lg border p-3 transition',
                  granted ? 'border-teal-300 bg-teal-50/60' : 'border-slate-200 bg-slate-50/60',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs font-semibold text-slate-700">{scope.id}</p>
                  <Badge variant={granted ? 'success' : 'secondary'}>
                    {granted ? 'Granted' : 'No access'}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">{scope.detail}</p>
              </div>
            );
          })}
        </div>
        {selectedKey?.scopes.includes('*') ? (
          <p className="mt-3 text-xs text-amber-600">
            This key carries wildcard access — restrict it before going live.
          </p>
        ) : null}
      </Card>

      {/* ---------- Snippets + rate limits ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Quick start</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Authenticated against {environment === 'live' ? 'production' : 'the sandbox'}.
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              {SNIPPETS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setLanguage(option.id)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition',
                    language === option.id
                      ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-700',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-slate-700 bg-slate-900 px-3 py-2">
            <span className="truncate font-mono text-[11px] text-slate-400">
              GET {baseUrl}/v1/policies
            </span>
            <CopyButton value={snippet} label="Copy snippet" />
          </div>
          <pre className="overflow-x-auto rounded-b-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-teal-200">
            {snippet}
          </pre>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <Badge variant="outline">Base URL: {baseUrl}</Badge>
            <Badge variant="outline">Auth: Bearer token</Badge>
            <Badge variant="outline">Version header required</Badge>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <CardTitle>Rate limits</CardTitle>
              <Badge variant="outline">{((totalUsed / totalLimit) * 100).toFixed(0)}% used</Badge>
            </div>
            <ul className="space-y-4">
              {RATE_LIMITS.map((bucket) => {
                const pct = (bucket.used / bucket.limit) * 100;
                const tone = pct >= 90 ? '#e11d48' : pct >= 75 ? '#f59e0b' : TEAL;
                return (
                  <li key={bucket.id}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{bucket.label}</span>
                      <span className="tabular-nums text-slate-500">
                        {bucket.used.toLocaleString()} / {bucket.limit.toLocaleString()} {bucket.unit}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: tone }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Exceeding a bucket returns <span className="font-mono text-slate-700">429</span> with
              a <span className="font-mono text-slate-700">Retry-After</span> header.
            </p>
          </Card>

          <Card>
            <div className="mb-3">
              <CardTitle>Webhooks</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                policy.bound, claim.status_changed, payment.failed and 9 more events.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  <span className="text-sm font-medium text-slate-700">3 endpoints live</span>
                </div>
                <Badge variant="success">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-slate-700">2 retries pending</span>
                </div>
                <Badge variant="warning">Degraded</Badge>
              </div>
              <div className="pt-1">
                <Button size="sm" variant="outline" className="w-full">
                  Configure webhooks →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ---------- Request logs ---------- */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Request logs</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Last 24 hours · {environment === 'live' ? 'live' : 'sandbox'} traffic, retained 7 days.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Live tail</Badge>
            <Button size="sm" variant="outline">
              Export logs
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <th className="pb-2">Method</th>
                <th className="pb-2">Endpoint</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Latency</th>
                <th className="pb-2">Key</th>
                <th className="pb-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {REQUEST_LOGS.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold',
                        log.method === 'GET' && 'bg-teal-50 text-teal-700',
                        log.method === 'POST' && 'bg-sky-50 text-sky-700',
                        log.method === 'PATCH' && 'bg-amber-50 text-amber-700',
                        log.method === 'DELETE' && 'bg-rose-50 text-rose-700',
                      )}
                    >
                      {log.method}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs text-slate-700">{log.path}</span>
                    {log.note ? <span className="ml-2 text-xs text-slate-400">{log.note}</span> : null}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusVariant[log.status] ?? 'secondary'}>{log.status}</Badge>
                  </td>
                  <td
                    className={cn('py-3 pr-4 font-mono text-xs tabular-nums', latencyTone(log.latency))}
                  >
                    {log.latency} ms
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500">{log.key}</td>
                  <td className="py-3 text-xs text-slate-400">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-500">Showing 10 of 112,480 requests</span>
          <Button size="sm" variant="ghost">
            Load more
          </Button>
        </div>
      </Card>

      <p className="text-center text-xs text-slate-400">
        Docs at docs.insureflow.dev · SDKs for Node, Python, Go and Ruby · support@insureflow.dev
      </p>
    </div>
  );
}
