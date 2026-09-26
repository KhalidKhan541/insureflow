'use client';

import { useMemo, useState, type ReactNode } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'company', label: 'Company profile', hint: 'Legal entity, addresses, licenses' },
  { id: 'appearance', label: 'Appearance', hint: 'Theme, accent, density' },
  { id: 'underwriting', label: 'Underwriting', hint: 'Lines of business, referral rules' },
  { id: 'integrations', label: 'Integrations', hint: 'Policy admin, CRM, payments' },
  { id: 'notifications', label: 'Notifications', hint: 'Channels and digests' },
  { id: 'security', label: 'Security & compliance', hint: '2FA, allowlist, audit log' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

const ACCENT_SWATCHES = [
  { id: 'teal', label: 'Teal', hex: '#0d9488', ring: 'ring-teal-600/40' },
  { id: 'emerald', label: 'Emerald', hex: '#059669', ring: 'ring-emerald-600/40' },
  { id: 'sky', label: 'Sky', hex: '#0284c7', ring: 'ring-sky-600/40' },
  { id: 'indigo', label: 'Indigo', hex: '#4f46e5', ring: 'ring-indigo-600/40' },
  { id: 'violet', label: 'Violet', hex: '#7c3aed', ring: 'ring-violet-600/40' },
  { id: 'amber', label: 'Amber', hex: '#d97706', ring: 'ring-amber-600/40' },
  { id: 'rose', label: 'Rose', hex: '#e11d48', ring: 'ring-rose-600/40' },
  { id: 'slate', label: 'Slate', hex: '#475569', ring: 'ring-slate-600/40' },
];

const LINES_OF_BUSINESS = [
  { id: 'auto', label: 'Personal auto', premium: '$18.4M', policies: 4210 },
  { id: 'home', label: 'Homeowners', premium: '$12.1M', policies: 2680 },
  { id: 'commercial', label: 'Commercial property', premium: '$9.8M', policies: 1520 },
  { id: 'life', label: 'Life', premium: '$4.3M', policies: 980 },
  { id: 'health', label: 'Health', premium: '$2.6M', policies: 760 },
  { id: 'umbrella', label: 'Umbrella', premium: '$1.0M', policies: 410 },
  { id: 'cyber', label: 'Cyber', premium: '$0.6M', policies: 240 },
  { id: 'workers-comp', label: "Workers' comp", premium: '$1.4M', policies: 388 },
];

const INTEGRATIONS = [
  {
    id: 'policy-admin',
    name: 'Policy admin system',
    vendor: 'Guidewire PolicyCenter',
    detail: 'Bi-directional sync of policies, endorsements and renewals every 15 minutes.',
    status: 'Connected' as const,
    fields: [
      { key: 'endpoint', label: 'API endpoint', value: 'https://gw.insureflow.io/policy/v3' },
      { key: 'sync', label: 'Sync cadence', value: 'Every 15 min' },
      { key: 'last', label: 'Last sync', value: '2 min ago · 1,284 records' },
    ],
  },
  {
    id: 'crm',
    name: 'CRM',
    vendor: 'Salesforce Financial Services Cloud',
    detail: 'Pushes quotes, accounts and agent activity into your sales pipeline.',
    status: 'Connected' as const,
    fields: [
      { key: 'endpoint', label: 'Connected app', value: 'InsureFlow Sync (OAuth 2.0)' },
      { key: 'sync', label: 'Sync cadence', value: 'Every hour' },
      { key: 'last', label: 'Last sync', value: '24 min ago · 318 records' },
    ],
  },
  {
    id: 'payments',
    name: 'Payments',
    vendor: 'Stripe + ACH via Modern Treasury',
    detail: 'Premium collection, instalment plans, refunds and commission payouts.',
    status: 'Action needed' as const,
    fields: [
      { key: 'endpoint', label: 'Processor account', value: 'acct_1P···  (live mode)' },
      { key: 'sync', label: 'Payout schedule', value: 'Weekly · Tuesdays' },
      { key: 'last', label: 'Webhook health', value: '2 failing events in 24h' },
    ],
  },
];

const NOTIFICATION_CHANNELS = [
  { id: 'email', label: 'Email', detail: 'notifications@insureflow.io', enabled: true },
  { id: 'sms', label: 'SMS', detail: '+1 (415) 555-0184 · on-call rotation', enabled: true },
  { id: 'slack', label: 'Slack', detail: '#insureflow-alerts via workflow webhook', enabled: true },
  { id: 'inapp', label: 'In-app', detail: 'Bell tray and dashboard banners', enabled: true },
  { id: 'pager', label: 'PagerDuty', detail: 'Critical severity only', enabled: false },
];

const NOTIFICATION_RULES = [
  { id: 'critical-claim', label: 'Critical claim filed', channel: 'SMS + Pager', scope: 'Immediate' },
  { id: 'reserve-hike', label: 'Reserve increased > 25%', channel: 'Email', scope: 'Immediate' },
  { id: 'renewal', label: 'Policy renewal due (30 days)', channel: 'Email + in-app', scope: 'Daily 08:00' },
  { id: 'kyc', label: 'KYC document expiring', channel: 'Email', scope: 'Weekly Monday' },
  { id: 'digest', label: 'Executive portfolio digest', channel: 'Email', scope: 'Weekly Friday 07:00' },
  { id: 'invoice', label: 'Commission invoice approved', channel: 'In-app', scope: 'Immediate' },
];

const AUDIT_EVENTS = [
  { actor: 'Priya Raman', action: 'Updated referral threshold', target: 'Commercial property', time: '14 min ago' },
  { actor: 'Marcus Idowu', action: 'Exported claims register', target: 'CSV · 4,182 rows', time: '1 hr ago' },
  { actor: 'Elena Brooks', action: 'Rotated API key', target: 'live_publishable', time: '3 hr ago' },
  { actor: 'System', action: 'Blocked sign-in from new IP', target: '88.198.44.12 · Amsterdam', time: '6 hr ago' },
];

const REGULATORY_BADGES: { label: string; detail: string; variant: BadgeVariant }[] = [
  { label: 'NAIC registered', detail: 'Company code 41872', variant: 'success' },
  { label: 'State DOI licensed', detail: '50 jurisdictions', variant: 'success' },
  { label: 'SOC 2 Type II', detail: 'Renews Nov 2026', variant: 'success' },
  { label: 'HIPAA BAA', detail: 'Executed Jan 2026', variant: 'success' },
  { label: 'GDPR / CCPA', detail: 'DPA on file', variant: 'success' },
  { label: 'AML program', detail: 'Q3 attestation due', variant: 'warning' },
];

/* ------------------------------------------------------------------ */
/* Form state                                                          */
/* ------------------------------------------------------------------ */

interface SettingsState {
  // Company
  legalName: string;
  dba: string;
  naicCode: string;
  fein: string;
  website: string;
  supportEmail: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  domicile: string;
  timezone: string;
  // Appearance
  theme: 'light' | 'dark' | 'system';
  accent: string;
  density: 'comfortable' | 'compact';
  sidebar: 'expanded' | 'collapsed';
  motion: boolean;
  // Underwriting
  enabledLines: string[];
  referralPremium: string;
  referralLossRatio: string;
  referralDeviations: number;
  autoBindLimit: string;
  newBusinessAppetite: string;
  binderRenewalDays: number;
  // Integrations (connection toggles)
  connectedApps: string[];
  // Notifications
  channels: string[];
  digestDay: string;
  quietHours: boolean;
  // Security
  enforce2fa: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  ipAllowlist: string;
  allowlistEnabled: boolean;
  auditRetention: number;
}

const INITIAL_STATE: SettingsState = {
  legalName: 'InsureFlow Technologies, Inc.',
  dba: 'InsureFlow',
  naicCode: '41872',
  fein: '87-4410923',
  website: 'https://insureflow.io',
  supportEmail: 'support@insureflow.io',
  phone: '+1 (415) 555-0100',
  addressLine1: '548 Market Street, Suite 920',
  city: 'San Francisco',
  state: 'CA',
  zip: '94104',
  domicile: 'Delaware',
  timezone: 'America/Los_Angeles',
  theme: 'system',
  accent: 'teal',
  density: 'comfortable',
  sidebar: 'expanded',
  motion: true,
  enabledLines: ['auto', 'home', 'commercial', 'life', 'health', 'umbrella'],
  referralPremium: '250000',
  referralLossRatio: '75',
  referralDeviations: 2,
  autoBindLimit: '150000',
  newBusinessAppetite: 'Selective',
  binderRenewalDays: 30,
  connectedApps: ['policy-admin', 'crm'],
  channels: ['email', 'sms', 'slack', 'inapp'],
  digestDay: 'Friday',
  quietHours: true,
  enforce2fa: true,
  sessionTimeout: 30,
  passwordExpiry: 90,
  ipAllowlist: '203.0.113.0/24\n198.51.100.42\n10.0.0.0/8',
  allowlistEnabled: false,
  auditRetention: 2555,
};

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

const labelClass = 'mb-1 block text-xs font-medium text-slate-600';

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
      {hint ? <p className="mt-1 text-[11px] text-slate-400">{hint}</p> : null}
    </div>
  );
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

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function CompanySection({
  state,
  update,
}: {
  state: SettingsState;
  update: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Legal entity</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Appears on declarations pages, invoices and regulatory filings.
            </p>
          </div>
          <Badge variant="success">Verified</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Legal name">
            <input
              className={inputClass}
              value={state.legalName}
              onChange={(e) => update('legalName', e.target.value)}
            />
          </Field>
          <Field label="Doing business as">
            <input
              className={inputClass}
              value={state.dba}
              onChange={(e) => update('dba', e.target.value)}
            />
          </Field>
          <Field label="NAIC company code" hint="Used on the annual statement.">
            <input
              className={inputClass}
              value={state.naicCode}
              onChange={(e) => update('naicCode', e.target.value)}
            />
          </Field>
          <Field label="FEIN">
            <input
              className={inputClass}
              value={state.fein}
              onChange={(e) => update('fein', e.target.value)}
            />
          </Field>
          <Field label="Website">
            <input
              className={inputClass}
              value={state.website}
              onChange={(e) => update('website', e.target.value)}
            />
          </Field>
          <Field label="Support email">
            <input
              className={inputClass}
              value={state.supportEmail}
              onChange={(e) => update('supportEmail', e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              value={state.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </Field>
          <Field label="Domicile state">
            <input
              className={inputClass}
              value={state.domicile}
              onChange={(e) => update('domicile', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="mb-4">
          <CardTitle>Registered address & locale</CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            Mailing address of record and default timezone for scheduled jobs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <Field label="Street address" className="sm:col-span-6">
            <input
              className={inputClass}
              value={state.addressLine1}
              onChange={(e) => update('addressLine1', e.target.value)}
            />
          </Field>
          <Field label="City" className="sm:col-span-3">
            <input
              className={inputClass}
              value={state.city}
              onChange={(e) => update('city', e.target.value)}
            />
          </Field>
          <Field label="State" className="sm:col-span-1">
            <input
              className={inputClass}
              value={state.state}
              onChange={(e) => update('state', e.target.value)}
            />
          </Field>
          <Field label="ZIP" className="sm:col-span-2">
            <input
              className={inputClass}
              value={state.zip}
              onChange={(e) => update('zip', e.target.value)}
            />
          </Field>
          <Field label="Timezone" className="sm:col-span-3">
            <select
              className={inputClass}
              value={state.timezone}
              onChange={(e) => update('timezone', e.target.value)}
            >
              {['America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York', 'Europe/London'].map(
                (tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ),
              )}
            </select>
          </Field>
        </div>
      </Card>
    </div>
  );
}

function AppearanceSection({
  state,
  update,
}: {
  state: SettingsState;
  update: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4">
          <CardTitle>Theme</CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            Applies to every signed-in user on this workspace.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(['light', 'dark', 'system'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => update('theme', mode)}
              className={cn(
                'rounded-xl border p-4 text-left transition',
                state.theme === mode
                  ? 'border-teal-500 ring-2 ring-teal-500/20'
                  : 'border-slate-200 hover:border-slate-300',
              )}
            >
              <div
                className={cn(
                  'mb-3 h-16 w-full rounded-lg border',
                  mode === 'light' && 'border-slate-200 bg-white',
                  mode === 'dark' && 'border-slate-700 bg-slate-900',
                  mode === 'system' && 'border-slate-200 bg-gradient-to-r from-white to-slate-900',
                )}
              />
              <p className="text-sm font-medium capitalize text-slate-800">{mode}</p>
              <p className="text-xs text-slate-500">
                {mode === 'light'
                  ? 'Bright surfaces, teal accents'
                  : mode === 'dark'
                    ? 'Low-light ops rooms'
                    : 'Follow the OS setting'}
              </p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4">
          <CardTitle>Accent colour</CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            Used for primary buttons, links, chart series and active nav.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {ACCENT_SWATCHES.map((swatch) => (
            <button
              key={swatch.id}
              type="button"
              onClick={() => update('accent', swatch.id)}
              aria-label={swatch.label}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-offset-2 transition',
                state.accent === swatch.id ? swatch.ring : 'ring-transparent',
              )}
              style={{ backgroundColor: swatch.hex }}
            >
              {state.accent === swatch.id ? (
                <span className="text-sm font-bold text-white">✓</span>
              ) : null}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <Button size="sm">Primary action</Button>
          <Button size="sm" variant="outline">
            Secondary
          </Button>
          <Badge variant="default">In force</Badge>
          <span className="text-xs text-slate-500">Live preview</span>
        </div>
      </Card>

      <Card>
        <div className="mb-4">
          <CardTitle>Layout</CardTitle>
          <p className="mt-1 text-xs text-slate-500">Density and chrome preferences.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Row density">
            <div className="flex gap-2">
              {(['comfortable', 'compact'] as const).map((density) => (
                <button
                  key={density}
                  type="button"
                  onClick={() => update('density', density)}
                  className={cn(
                    'flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition',
                    state.density === density
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300',
                  )}
                >
                  {density}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Sidebar default">
            <div className="flex gap-2">
              {(['expanded', 'collapsed'] as const).map((sidebar) => (
                <button
                  key={sidebar}
                  type="button"
                  onClick={() => update('sidebar', sidebar)}
                  className={cn(
                    'flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition',
                    state.sidebar === sidebar
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300',
                  )}
                >
                  {sidebar}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div>
            <p className="text-sm font-medium text-slate-700">Reduced motion</p>
            <p className="text-xs text-slate-500">Minimise chart and panel animations.</p>
          </div>
          <Toggle
            label="Reduced motion"
            checked={!state.motion}
            onChange={(next) => update('motion', !next)}
          />
        </div>
      </Card>
    </div>
  );
}

function UnderwritingSection({
  state,
  update,
}: {
  state: SettingsState;
  update: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}) {
  function toggleLine(id: string) {
    update(
      'enabledLines',
      state.enabledLines.includes(id)
        ? state.enabledLines.filter((line) => line !== id)
        : [...state.enabledLines, id],
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Lines of business</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Enabled products are available to underwriters and rating APIs.
            </p>
          </div>
          <Badge variant="outline">
            {state.enabledLines.length} of {LINES_OF_BUSINESS.length} enabled
          </Badge>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {LINES_OF_BUSINESS.map((line) => {
            const enabled = state.enabledLines.includes(line.id);
            return (
              <li key={line.id}>
                <button
                  type="button"
                  onClick={() => toggleLine(line.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition',
                    enabled
                      ? 'border-teal-300 bg-teal-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold',
                      enabled ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-transparent',
                    )}
                  >
                    ✓
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800">
                      {line.label}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {line.premium} premium · {line.policies.toLocaleString()} policies
                    </span>
                  </span>
                  <Badge variant={enabled ? 'default' : 'secondary'}>{enabled ? 'Live' : 'Off'}</Badge>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <div className="mb-4">
          <CardTitle>Referral thresholds</CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            Risks above these limits route to a senior underwriter instead of auto-binding.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="TIV referral threshold" hint="Total insured value in USD.">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                $
              </span>
              <input
                type="number"
                className={cn(inputClass, 'pl-7')}
                value={state.referralPremium}
                onChange={(e) => update('referralPremium', e.target.value)}
              />
            </div>
          </Field>
          <Field label="Target loss ratio ceiling" hint="Above this, quote is referred.">
            <div className="relative">
              <input
                type="number"
                className={cn(inputClass, 'pr-8')}
                value={state.referralLossRatio}
                onChange={(e) => update('referralLossRatio', e.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                %
              </span>
            </div>
          </Field>
          <Field label="Manual rating deviations" hint="Allowed before referral, per risk.">
            <input
              type="number"
              className={inputClass}
              value={state.referralDeviations}
              onChange={(e) => update('referralDeviations', Number(e.target.value))}
            />
          </Field>
          <Field label="Auto-bind limit" hint="Straight-through processing ceiling.">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                $
              </span>
              <input
                type="number"
                className={cn(inputClass, 'pl-7')}
                value={state.autoBindLimit}
                onChange={(e) => update('autoBindLimit', e.target.value)}
              />
            </div>
          </Field>
          <Field label="New-business appetite">
            <select
              className={inputClass}
              value={state.newBusinessAppetite}
              onChange={(e) => update('newBusinessAppetite', e.target.value)}
            >
              {['Open', 'Selective', 'Conservative', 'Renewals only'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Binder renewal reminder" hint="Days before binder expiry.">
            <input
              type="number"
              className={inputClass}
              value={state.binderRenewalDays}
              onChange={(e) => update('binderRenewalDays', Number(e.target.value))}
            />
          </Field>
        </div>
      </Card>
    </div>
  );
}

function IntegrationsSection({
  state,
  update,
}: {
  state: SettingsState;
  update: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}) {
  function toggleApp(id: string) {
    update(
      'connectedApps',
      state.connectedApps.includes(id)
        ? state.connectedApps.filter((app) => app !== id)
        : [...state.connectedApps, id],
    );
  }

  return (
    <div className="space-y-6">
      {INTEGRATIONS.map((integration) => {
        const connected = state.connectedApps.includes(integration.id);
        return (
          <Card key={integration.id}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{integration.name}</CardTitle>
                  <Badge variant={connected ? 'success' : 'secondary'}>
                    {connected ? integration.status : 'Disconnected'}
                  </Badge>
                  {!connected && integration.status === 'Action needed' ? (
                    <Badge variant="warning">{integration.status}</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {integration.vendor} · {integration.detail}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  Configure
                </Button>
                <Button
                  size="sm"
                  variant={connected ? 'secondary' : 'primary'}
                  onClick={() => toggleApp(integration.id)}
                >
                  {connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {integration.fields.map((field) => (
                <div
                  key={field.key}
                  className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3"
                >
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    {field.label}
                  </dt>
                  <dd className="mt-1 truncate text-sm font-medium text-slate-700">{field.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        );
      })}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>API & webhooks</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Programmatic access — keys, scopes and event destinations.
            </p>
          </div>
          <Button size="sm" variant="outline">
            Open developer console
          </Button>
        </div>
      </Card>
    </div>
  );
}

function NotificationsSection({
  state,
  update,
}: {
  state: SettingsState;
  update: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}) {
  function toggleChannel(id: string) {
    update(
      'channels',
      state.channels.includes(id)
        ? state.channels.filter((channel) => channel !== id)
        : [...state.channels, id],
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4">
          <CardTitle>Delivery channels</CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            Choose where operational alerts are delivered for your account.
          </p>
        </div>
        <ul className="space-y-2">
          {NOTIFICATION_CHANNELS.map((channel) => {
            const enabled = state.channels.includes(channel.id);
            return (
              <li
                key={channel.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200/80 bg-slate-50/60 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{channel.label}</p>
                  <p className="text-xs text-slate-500">{channel.detail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={enabled ? 'success' : 'secondary'}>{enabled ? 'On' : 'Off'}</Badge>
                  <Toggle label={channel.label} checked={enabled} onChange={() => toggleChannel(channel.id)} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Rules & digests</CardTitle>
            <p className="mt-1 text-xs text-slate-500">What triggers a notification, and when.</p>
          </div>
          <Badge variant="outline">{NOTIFICATION_RULES.length} active rules</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <th className="pb-2">Event</th>
                <th className="pb-2">Channels</th>
                <th className="pb-2">Cadence</th>
              </tr>
            </thead>
            <tbody>
              {NOTIFICATION_RULES.map((rule) => (
                <tr key={rule.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-slate-700">{rule.label}</td>
                  <td className="py-2.5 pr-4 text-slate-500">{rule.channel}</td>
                  <td className="py-2.5">
                    <Badge variant="outline">{rule.scope}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Executive digest day">
            <select
              className={inputClass}
              value={state.digestDay}
              onChange={(e) => update('digestDay', e.target.value)}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex items-end">
            <div className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Quiet hours</p>
                <p className="text-xs text-slate-500">22:00–07:00 local · non-critical only</p>
              </div>
              <Toggle
                label="Quiet hours"
                checked={state.quietHours}
                onChange={(next) => update('quietHours', next)}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SecuritySection({
  state,
  update,
}: {
  state: SettingsState;
  update: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Regulatory standing</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Certifications and filings maintained by InsureFlow.
            </p>
          </div>
          <Badge variant="success">6 of 6 current</Badge>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REGULATORY_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">{badge.label}</p>
                <Badge variant={badge.variant}>{badge.variant === 'success' ? 'Current' : 'Due'}</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500">{badge.detail}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4">
          <CardTitle>Authentication policy</CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            Enforced for every member of the workspace, including owners.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Require two-factor authentication</p>
              <p className="text-xs text-slate-500">
                TOTP authenticator apps or hardware security keys (WebAuthn).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={state.enforce2fa ? 'success' : 'warning'}>
                {state.enforce2fa ? 'Enforced' : 'Optional'}
              </Badge>
              <Toggle
                label="Require 2FA"
                checked={state.enforce2fa}
                onChange={(next) => update('enforce2fa', next)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Session timeout" hint="Minutes of inactivity before re-auth.">
              <div className="relative">
                <input
                  type="number"
                  className={cn(inputClass, 'pr-14')}
                  value={state.sessionTimeout}
                  onChange={(e) => update('sessionTimeout', Number(e.target.value))}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  min
                </span>
              </div>
            </Field>
            <Field label="Password expiry" hint="Days until a reset is required.">
              <div className="relative">
                <input
                  type="number"
                  className={cn(inputClass, 'pr-14')}
                  value={state.passwordExpiry}
                  onChange={(e) => update('passwordExpiry', Number(e.target.value))}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  days
                </span>
              </div>
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>IP allowlist</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              One CIDR range or address per line. Applies to dashboard and API sessions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={state.allowlistEnabled ? 'success' : 'secondary'}>
              {state.allowlistEnabled ? 'Enforcing' : 'Monitor only'}
            </Badge>
            <Toggle
              label="Enable IP allowlist"
              checked={state.allowlistEnabled}
              onChange={(next) => update('allowlistEnabled', next)}
            />
          </div>
        </div>
        <textarea
          rows={5}
          className={cn(inputClass, 'font-mono text-xs')}
          value={state.ipAllowlist}
          onChange={(e) => update('ipAllowlist', e.target.value)}
          spellCheck={false}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Allowed:</span>
          {state.ipAllowlist
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((entry) => (
              <Badge key={entry} variant="outline" className="font-mono">
                {entry}
              </Badge>
            ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Audit log</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Immutable record of every privileged action, retained for {state.auditRetention} days.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Retention</Badge>
            <select
              className={cn(inputClass, 'w-auto !py-1 text-xs')}
              value={state.auditRetention}
              onChange={(e) => update('auditRetention', Number(e.target.value))}
            >
              <option value={365}>1 year</option>
              <option value={1825}>5 years</option>
              <option value={2555}>7 years (NAIC)</option>
              <option value={3650}>10 years</option>
            </select>
          </div>
        </div>
        <ol className="space-y-2">
          {AUDIT_EVENTS.map((event, index) => (
            <li
              key={`${event.action}-${index}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200/80 bg-slate-50/60 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-700">
                  <span className="font-medium text-slate-900">{event.actor}</span> · {event.action}
                </p>
                <p className="truncate text-xs text-slate-500">{event.target}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{event.time}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-500">Showing 4 of 128,940 events</span>
          <Button size="sm" variant="outline">
            Export audit log
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('company');
  const [saved, setSaved] = useState<SettingsState>(INITIAL_STATE);
  const [draft, setDraft] = useState<SettingsState>(INITIAL_STATE);
  const [savedAt, setSavedAt] = useState<string | null>('09:42');

  const dirtyFields = useMemo(
    () =>
      (Object.keys(INITIAL_STATE) as (keyof SettingsState)[]).filter(
        (key) => JSON.stringify(saved[key]) !== JSON.stringify(draft[key]),
      ),
    [saved, draft],
  );
  const isDirty = dirtyFields.length > 0;

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    setSaved(draft);
    setSavedAt(
      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    );
  }

  function handleDiscard() {
    setDraft(saved);
  }

  const current = SECTIONS.find((section) => section.id === activeSection)!;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Workspace configuration, underwriting rules, integrations and compliance controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {savedAt ? `Last saved ${savedAt}` : 'Never saved'}
          </Badge>
          {isDirty ? <Badge variant="warning">{dirtyFields.length} unsaved changes</Badge> : null}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* ---------- Section nav ---------- */}
        <nav className="space-y-1 lg:sticky lg:top-6 lg:self-start">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'w-full rounded-lg border px-3 py-2.5 text-left transition',
                activeSection === section.id
                  ? 'border-teal-300 bg-teal-50/70'
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-50',
              )}
            >
              <span
                className={cn(
                  'block text-sm font-medium',
                  activeSection === section.id ? 'text-teal-800' : 'text-slate-700',
                )}
              >
                {section.label}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">{section.hint}</span>
            </button>
          ))}

          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <p className="text-xs font-medium text-slate-600">Changes</p>
            <p className="mt-1 text-xs text-slate-500">
              {isDirty
                ? `${dirtyFields.length} field${dirtyFields.length === 1 ? '' : 's'} modified — save to apply workspace-wide.`
                : 'Everything is in sync with the saved configuration.'}
            </p>
          </div>
        </nav>

        {/* ---------- Section body ---------- */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{current.label}</h2>
              <p className="text-xs text-slate-500">{current.hint}</p>
            </div>
            <Badge variant="outline">Workspace · InsureFlow</Badge>
          </div>

          {activeSection === 'company' ? <CompanySection state={draft} update={update} /> : null}
          {activeSection === 'appearance' ? <AppearanceSection state={draft} update={update} /> : null}
          {activeSection === 'underwriting' ? <UnderwritingSection state={draft} update={update} /> : null}
          {activeSection === 'integrations' ? <IntegrationsSection state={draft} update={update} /> : null}
          {activeSection === 'notifications' ? <NotificationsSection state={draft} update={update} /> : null}
          {activeSection === 'security' ? <SecuritySection state={draft} update={update} /> : null}
        </div>
      </div>

      {/* ---------- Sticky save bar ---------- */}
      <div
        className={cn(
          'sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all',
          isDirty
            ? 'border-teal-300 bg-white/95 backdrop-blur opacity-100 translate-y-0'
            : 'pointer-events-none border-slate-200 bg-white/80 opacity-0 translate-y-2',
        )}
        aria-hidden={!isDirty}
      >
        <div className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              isDirty ? 'animate-pulse bg-amber-500' : 'bg-slate-300',
            )}
          />
          <span className="font-medium text-slate-700">
            {isDirty ? 'Unsaved changes' : 'No changes'}
          </span>
          <span className="text-xs text-slate-500">
            {isDirty
              ? `${dirtyFields.length} field${dirtyFields.length === 1 ? '' : 's'} differ from the saved configuration.`
              : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDiscard} disabled={!isDirty}>
            Discard
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!isDirty}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
