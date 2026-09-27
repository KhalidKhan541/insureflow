'use client';

import { useMemo, useState } from 'react';

import { Avatar } from '@/components/ui/Avatar';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { MOCK_TEAM, type TeamMember, type TeamRole } from '@/lib/mock-data';
import { cn, formatDate, formatNumber } from '@/lib/utils';

/* The six roles the workspace assigns — `agent` and `viewer` seats map to
 * Support, which is the front-line distribution role. */
type SeatRole = 'Owner' | 'Admin' | 'Underwriter' | 'Adjuster' | 'Analyst' | 'Support';

const SEAT_ROLES: SeatRole[] = [
  'Owner',
  'Admin',
  'Underwriter',
  'Adjuster',
  'Analyst',
  'Support',
];

const ROLE_LABEL: Record<TeamRole, SeatRole> = {
  owner: 'Owner',
  admin: 'Admin',
  underwriter: 'Underwriter',
  adjuster: 'Adjuster',
  analyst: 'Analyst',
  agent: 'Support',
  viewer: 'Support',
};

const ROLE_VARIANT: Record<SeatRole, BadgeVariant> = {
  Owner: 'default',
  Admin: 'default',
  Underwriter: 'outline',
  Adjuster: 'outline',
  Analyst: 'secondary',
  Support: 'secondary',
};

const ROLE_META: Record<
  SeatRole,
  { description: string; permissions: string[]; tone: string }
> = {
  Owner: {
    description: 'Full administrative control including billing, legal and API key custody.',
    permissions: ['All permissions', 'Billing & legal', 'API keys', 'Delete workspace'],
    tone: 'text-teal-700 border-teal-300 bg-teal-50/60',
  },
  Admin: {
    description: 'Runs day-to-day operations: team, integrations, underwriting config.',
    permissions: ['Team management', 'Integrations', 'Settings', 'Approve referrals'],
    tone: 'text-teal-700 border-teal-300 bg-teal-50/60',
  },
  Underwriter: {
    description: 'Prices and binds risk, applies referral authority within limits.',
    permissions: ['Quotes approve', 'Underwriting decide', 'Policies write', 'Reports read'],
    tone: 'text-sky-700 border-sky-300 bg-sky-50/60',
  },
  Adjuster: {
    description: 'Handles claim files, reserves and litigation with reserve authority.',
    permissions: ['Claims write', 'Reserve approve', 'Litigation read', 'SIU flags'],
    tone: 'text-violet-700 border-violet-300 bg-violet-50/60',
  },
  Analyst: {
    description: 'Read-only across finance with the ability to build and share reports.',
    permissions: ['Premiums read', 'Payments read', 'Reports create', 'Exports'],
    tone: 'text-amber-700 border-amber-300 bg-amber-50/60',
  },
  Support: {
    description: 'Front-line service: customer records, quotes in progress, no approvals.',
    permissions: ['Customers read', 'Quotes write', 'Policies read', 'No approvals'],
    tone: 'text-slate-600 border-slate-300 bg-slate-50/60',
  },
};

/* 7 × 6 permission matrix — rows are capabilities, columns are seats. */
type MatrixLevel = 'full' | 'edit' | 'read' | 'none';

const MATRIX_ROWS: { label: string; detail: string; cells: Record<SeatRole, MatrixLevel> }[] = [
  {
    label: 'Policies',
    detail: 'View, issue and endorse policies',
    cells: { Owner: 'full', Admin: 'edit', Underwriter: 'edit', Adjuster: 'read', Analyst: 'read', Support: 'read' },
  },
  {
    label: 'Quotes & underwriting',
    detail: 'Rate, approve and bind risk',
    cells: { Owner: 'full', Admin: 'edit', Underwriter: 'full', Adjuster: 'read', Analyst: 'none', Support: 'edit' },
  },
  {
    label: 'Claims',
    detail: 'Files, reserves and settlements',
    cells: { Owner: 'full', Admin: 'edit', Underwriter: 'read', Adjuster: 'full', Analyst: 'read', Support: 'read' },
  },
  {
    label: 'Finance',
    detail: 'Premiums, payments, commissions',
    cells: { Owner: 'full', Admin: 'edit', Underwriter: 'read', Adjuster: 'read', Analyst: 'full', Support: 'none' },
  },
  {
    label: 'Reports & exports',
    detail: 'Build, schedule and download',
    cells: { Owner: 'full', Admin: 'full', Underwriter: 'read', Adjuster: 'read', Analyst: 'full', Support: 'read' },
  },
  {
    label: 'Team & roles',
    detail: 'Invite, suspend and re-role members',
    cells: { Owner: 'full', Admin: 'full', Underwriter: 'none', Adjuster: 'none', Analyst: 'none', Support: 'none' },
  },
  {
    label: 'Settings & security',
    detail: 'Workspace, integrations, audit log',
    cells: { Owner: 'full', Admin: 'edit', Underwriter: 'none', Adjuster: 'none', Analyst: 'none', Support: 'none' },
  },
];

const LEVEL_META: Record<MatrixLevel, { label: string; className: string }> = {
  full: { label: 'Full', className: 'bg-teal-600 text-white ring-teal-600' },
  edit: { label: 'Edit', className: 'bg-teal-100 text-teal-800 ring-teal-600/20' },
  read: { label: 'Read', className: 'bg-slate-100 text-slate-600 ring-slate-500/10' },
  none: { label: '—', className: 'bg-slate-50 text-slate-300 ring-slate-200/60' },
};

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

interface PendingInvite {
  id: string;
  email: string;
  role: SeatRole;
  department: string;
  invitedBy: string;
  sentAt: string;
  expiresAt: string;
}

const INITIAL_INVITES: PendingInvite[] = [
  {
    id: 'inv_1',
    email: 'harper.quinn@insureflow.dev',
    role: 'Adjuster',
    department: 'Claims',
    invitedBy: 'Aisha Bello',
    sentAt: '2026-09-24',
    expiresAt: '2026-10-01',
  },
  {
    id: 'inv_2',
    email: 'noor.haddad@insureflow.dev',
    role: 'Analyst',
    department: 'Finance',
    invitedBy: 'Devon Pryce',
    sentAt: '2026-09-26',
    expiresAt: '2026-10-03',
  },
];

function roleBadgeVariant(role: SeatRole): BadgeVariant {
  return ROLE_VARIANT[role];
}

/** "4 min ago" / "Sep 22" label for the last-active column. */
function lastActiveLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const days = (Date.now() - date.getTime()) / 86_400_000;
  if (days < 1) return formatDate(iso, 'relative');
  if (days < 7) return formatDate(iso, 'relative');
  return formatDate(iso, 'short');
}

function mfaTone(mfaEnabled: boolean, status: TeamMember['status']): BadgeVariant {
  if (status === 'invited') return 'secondary';
  return mfaEnabled ? 'success' : 'warning';
}

/* ------------------------------------------------------------------ */
/* Invite modal                                                        */
/* ------------------------------------------------------------------ */

function InviteModal({
  open,
  onClose,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (invite: PendingInvite) => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SeatRole>('Underwriter');
  const [department, setDepartment] = useState('Underwriting');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid work email address.');
      return;
    }
    setError(null);
    onInvite({
      id: `inv_${Math.random().toString(36).slice(2, 8)}`,
      email: trimmed,
      role,
      department,
      invitedBy: 'Katherine Yoon',
      sentAt: new Date().toISOString().slice(0, 10),
      expiresAt: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10),
    });
    setEmail('');
    setNote('');
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Invite a team member"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Invite a team member</h2>
            <p className="mt-1 text-xs text-slate-500">
              They will receive an email link that expires in 7 days. MFA enrollment is required on
              first sign-in.
            </p>
          </div>
          <Button size="xs" variant="ghost" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="invite-email">
              Work email
            </label>
            <input
              id="invite-email"
              type="email"
              className={INPUT_CLASS}
              placeholder="jordan.lee@insureflow.dev"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoFocus
            />
            {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="invite-role">
                Role
              </label>
              <select
                id="invite-role"
                className={INPUT_CLASS}
                value={role}
                onChange={(event) => setRole(event.target.value as SeatRole)}
              >
                {SEAT_ROLES.map((seat) => (
                  <option key={seat} value={seat}>
                    {seat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="invite-dept">
                Department
              </label>
              <select
                id="invite-dept"
                className={INPUT_CLASS}
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
              >
                {['Executive', 'Underwriting', 'Claims', 'Distribution', 'Finance', 'Compliance', 'Support'].map(
                  (dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-600">Included permissions</p>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_META[role].permissions.map((permission) => (
                <Badge key={permission} variant="outline">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="invite-note">
              Message <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              id="invite-note"
              rows={3}
              className={INPUT_CLASS}
              placeholder="Welcome aboard — your queue is in Claims › Intake."
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            Send invitation
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TeamPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [invites, setInvites] = useState<PendingInvite[]>(INITIAL_INVITES);
  const [roleFilter, setRoleFilter] = useState<'all' | SeatRole>('all');
  const [revokedId, setRevokedId] = useState<string | null>(null);

  const members = MOCK_TEAM;

  const visibleMembers = useMemo(
    () => (roleFilter === 'all' ? members : members.filter((m) => ROLE_LABEL[m.role] === roleFilter)),
    [members, roleFilter],
  );

  const mfaCount = members.filter((member) => member.mfaEnabled).length;
  const mfaPct = Math.round((mfaCount / members.length) * 100);
  const missingMfa = members.filter((member) => !member.mfaEnabled && member.status === 'active');
  const activeCount = members.filter((member) => member.status === 'active').length;

  const roleCounts = useMemo(() => {
    const counts = new Map<SeatRole, number>();
    for (const role of SEAT_ROLES) counts.set(role, 0);
    for (const member of members) {
      const seat = ROLE_LABEL[member.role];
      counts.set(seat, (counts.get(seat) ?? 0) + 1);
    }
    return counts;
  }, [members]);

  function handleInvite(invite: PendingInvite) {
    setInvites((prev) => [invite, ...prev]);
  }

  function handleRevoke(inviteId: string) {
    setRevokedId(inviteId);
    window.setTimeout(() => {
      setInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
      setRevokedId(null);
    }, 600);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Team</h1>
          <p className="mt-1 text-sm text-slate-500">
            Members, roles, permissions matrix and multi-factor authentication coverage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {activeCount} active · {invites.length} pending
          </Badge>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            Invite member
          </Button>
        </div>
      </header>

      {/* ---------- Stats: MFA + seats ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="!p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            MFA coverage
          </p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-2xl font-semibold tabular-nums text-slate-900">{mfaPct}%</p>
            <p className="text-xs text-slate-500">
              {mfaCount} of {members.length}
            </p>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400"
              style={{ width: `${mfaPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            {missingMfa.length > 0
              ? `${missingMfa.length} active member${missingMfa.length === 1 ? '' : 's'} missing MFA`
              : 'All active members enrolled'}
          </p>
        </Card>

        <Card className="!p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Seats used
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">
            {members.length}
            <span className="text-base font-medium text-slate-400"> / 25</span>
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400"
              style={{ width: `${(members.length / 25) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Business plan · renews Jan 2027</p>
        </Card>

        <Card className="!p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Pending invites
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">
            {invites.length}
          </p>
          <p className="mt-1.5 text-xs text-slate-500">Expire 7 days after sending</p>
        </Card>

        <Card className="!p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Open roles
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">2</p>
          <p className="mt-1.5 text-xs text-slate-500">Claims adjuster · Compliance analyst</p>
        </Card>
      </div>

      {/* ---------- Role cards ---------- */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Roles</h2>
          <span className="text-xs text-slate-500">{SEAT_ROLES.length} roles · click to filter</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SEAT_ROLES.map((role) => {
            const meta = ROLE_META[role];
            const count = roleCounts.get(role) ?? 0;
            const selected = roleFilter === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(selected ? 'all' : role)}
                className={cn(
                  'rounded-xl border p-4 text-left transition',
                  selected
                    ? 'border-teal-500 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{role}</span>
                  <Badge variant={selected ? 'default' : 'secondary'}>
                    {count} member{count === 1 ? '' : 's'}
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{meta.description}</p>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {meta.permissions.map((permission) => (
                    <span
                      key={permission}
                      className={cn(
                        'rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                        meta.tone,
                      )}
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- Members ---------- */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Members</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {visibleMembers.length} of {members.length} shown
              {roleFilter !== 'all' ? ` · filtered to ${roleFilter}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {(['all', ...SEAT_ROLES] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setRoleFilter(filter)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition',
                  roleFilter === filter
                    ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-700',
                )}
              >
                {filter === 'all' ? 'All' : filter}
              </button>
            ))}
          </div>
        </div>

        <ul className="space-y-3">
          {visibleMembers.map((member) => {
            const seat = ROLE_LABEL[member.role];
            return (
              <li
                key={member.id}
                className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition hover:border-teal-300 hover:bg-teal-50/30"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <Avatar
                    name={member.name}
                    initials={member.avatarInitials}
                    size="lg"
                    status={member.status === 'active' ? 'online' : 'offline'}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                      <Badge variant={roleBadgeVariant(seat)}>{seat}</Badge>
                      <Badge variant={member.status === 'active' ? 'success' : 'secondary'}>
                        {member.status}
                      </Badge>
                      <Badge variant={mfaTone(member.mfaEnabled, member.status)}>
                        {member.status === 'invited'
                          ? 'MFA pending'
                          : member.mfaEnabled
                            ? 'MFA on'
                            : 'MFA off'}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {member.title} · {member.department} · {member.email}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {member.permissions.includes('*') ? (
                        <Badge variant="default" className="font-mono">
                          * all permissions
                        </Badge>
                      ) : (
                        member.permissions.slice(0, 5).map((permission) => (
                          <Badge key={permission} variant="outline" className="font-mono">
                            {permission}
                          </Badge>
                        ))
                      )}
                      {!member.permissions.includes('*') && member.permissions.length > 5 ? (
                        <Badge variant="secondary">+{member.permissions.length - 5}</Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-right text-xs sm:flex sm:items-start sm:gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">Scope</p>
                      <p className="font-medium capitalize text-slate-700">{member.scope}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">Workload</p>
                      <p className="font-medium text-slate-700">
                        {formatNumber(member.policiesAssigned)} pol ·{' '}
                        {formatNumber(member.claimsAssigned)} clm
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">Last active</p>
                      <p className="font-medium text-slate-700">
                        {lastActiveLabel(member.lastActiveAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">Joined</p>
                      <p className="font-medium text-slate-700">{formatDate(member.joinedAt, 'short')}</p>
                    </div>
                  </div>

                  <div className="flex w-full justify-end gap-2 sm:w-auto">
                    <Button size="xs" variant="outline">
                      Manage
                    </Button>
                    <Button size="xs" variant="ghost">
                      Reset MFA
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
          {visibleMembers.length === 0 ? (
            <li className="rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
              No members hold the {roleFilter} role yet.
            </li>
          ) : null}
        </ul>
      </Card>

      {/* ---------- Pending invites ---------- */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Pending invites</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Invitations expire 7 days after they are sent.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
            Invite member
          </Button>
        </div>

        {invites.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
            No outstanding invitations.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <th className="pb-2">Invitee</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Invited by</th>
                  <th className="pb-2">Sent</th>
                  <th className="pb-2">Expires</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={invite.email} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-800">{invite.email}</p>
                          <p className="text-xs text-slate-400">{invite.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={roleBadgeVariant(invite.role)}>{invite.role}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{invite.invitedBy}</td>
                    <td className="py-3 pr-4 text-xs text-slate-500">
                      {formatDate(invite.sentAt, 'short')}
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500">
                      {formatDate(invite.expiresAt, 'short')}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button size="xs" variant="outline" onClick={() => handleInvite(invite)}>
                          Resend
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleRevoke(invite.id)}
                          disabled={revokedId === invite.id}
                        >
                          {revokedId === invite.id ? 'Revoking…' : 'Revoke'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ---------- 7 × 6 permissions matrix ---------- */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Permissions matrix</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {MATRIX_ROWS.length} capabilities × {SEAT_ROLES.length} roles — the source of truth for
              every role preset.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(['full', 'edit', 'read', 'none'] as const).map((level) => (
              <span
                key={level}
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
                  LEVEL_META[level].className,
                )}
              >
                {LEVEL_META[level].label}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Capability
                </th>
                {SEAT_ROLES.map((role) => (
                  <th
                    key={role}
                    className="pb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-800">{row.label}</p>
                    <p className="text-xs text-slate-400">{row.detail}</p>
                  </td>
                  {SEAT_ROLES.map((role) => {
                    const level = row.cells[role];
                    const meta = LEVEL_META[level];
                    return (
                      <td key={role} className="py-3 text-center">
                        <span
                          className={cn(
                            'inline-flex min-w-[56px] justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
                            meta.className,
                          )}
                        >
                          {meta.label}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ---------- MFA detail ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Multi-factor authentication</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Enforcement policy: required for Admin, Owner and anyone approving reserves.
              </p>
            </div>
            <Badge variant={mfaPct === 100 ? 'success' : 'warning'}>
              {mfaCount}/{members.length} enrolled
            </Badge>
          </div>
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200/80 bg-slate-50/60 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={member.name} initials={member.avatarInitials} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{member.name}</p>
                    <p className="text-xs text-slate-400">
                      {ROLE_LABEL[member.role]} · {member.department}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.mfaEnabled ? 'success' : 'warning'}>
                    {member.mfaEnabled ? 'TOTP enrolled' : 'Not enrolled'}
                  </Badge>
                  <Badge variant={member.mfaEnabled ? 'secondary' : 'destructive'}>
                    {member.mfaEnabled ? 'Recovery codes ✓' : 'No recovery codes'}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-3">
            <CardTitle>Enforcement</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Workspace-wide authentication policy.</p>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Require MFA for admins</span>
              <Badge variant="success">Enforced</Badge>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Hardware keys (WebAuthn)</span>
              <Badge variant="success">Allowed</Badge>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Session length</span>
              <Badge variant="outline">8 hours</Badge>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Grace period for new seats</span>
              <Badge variant="warning">48 hours</Badge>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Last policy review</span>
              <Badge variant="outline">Sep 1, 2026</Badge>
            </li>
          </ul>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-semibold text-amber-800">Action needed</p>
            <p className="mt-1 text-xs text-amber-700">
              {missingMfa.length > 0
                ? `${missingMfa.map((member) => member.name).join(', ')} must enroll before the next
                  compliance review.`
                : 'Every active member is enrolled — nothing to do.'}
            </p>
            <Button size="xs" variant="outline" className="mt-2">
              Send MFA reminder
            </Button>
          </div>
        </Card>
      </div>

      <p className="text-center text-xs text-slate-400">
        Role changes are written to the audit log · Last reviewed Sep 1, 2026
      </p>

      <InviteModal open={modalOpen} onClose={() => setModalOpen(false)} onInvite={handleInvite} />
    </div>
  );
}
