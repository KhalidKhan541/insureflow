'use client';

import { MotionConfig, motion } from 'framer-motion';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Icon({ children, className = 'h-5 w-5' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Logo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-[0_6px_16px_-6px_rgba(13,148,136,0.7)]">
        <Icon className="h-[18px] w-[18px]">
          <path d="M12 3l7 3v5.5c0 4.3-2.9 7.3-7 8.5-4.1-1.2-7-4.2-7-8.5V6l7-3z" />
          <path d="M9.2 12.2l1.9 1.9 3.7-3.9" />
        </Icon>
      </span>
      <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">
        Insure<span className="text-teal-600 dark:text-teal-400">Flow</span>
      </span>
    </span>
  );
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
  { label: 'Docs', href: '#docs' },
];

const FEATURES = [
  {
    title: 'Policies',
    tag: 'Policy admin',
    icon: (
      <>
        <path d="M12 3l7 3v5.5c0 4.3-2.9 7.3-7 8.5-4.1-1.2-7-4.2-7-8.5V6l7-3z" />
        <path d="M9.2 12.2l1.9 1.9 3.7-3.9" />
      </>
    ),
    description:
      'Quote, bind, endorse and cancel with a complete version history — certificates and documents generated on demand.',
  },
  {
    title: 'Claims',
    tag: 'Claims desk',
    icon: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4.5h6M8.5 10h7M8.5 14h5" />
      </>
    ),
    description:
      'FNOL intake, assignment, reserves, settlements and payment runs — one timeline from first notice to closure.',
  },
  {
    title: 'Underwriting',
    tag: 'Risk selection',
    icon: (
      <>
        <path d="M12 4v16M7 20h10M5 8h14" />
        <path d="M5 8l-2.2 4.4a3 3 0 004.4 0L5 8zM19 8l-2.2 4.4a3 3 0 004.4 0L19 8z" />
      </>
    ),
    description:
      'Appetite rules, risk scoring and referral workflows that keep underwriters in control of every submission.',
  },
  {
    title: 'Renewals',
    tag: 'Retention',
    icon: (
      <>
        <path d="M4 12a8 8 0 0113.7-5.6L20 8.5" />
        <path d="M20 4.5v4h-4" />
        <path d="M20 12a8 8 0 01-13.7 5.6L4 15.5" />
        <path d="M4 19.5v-4h4" />
      </>
    ),
    description:
      'A prioritised renewal queue with lapse-risk scoring, re-rating and one-click re-quote before coverage expires.',
  },
  {
    title: 'Agents',
    tag: 'Distribution',
    icon: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19.5a5.5 5.5 0 0111 0" />
        <path d="M16 5.6a3.2 3.2 0 010 5.6M17.5 14.6a5.5 5.5 0 013 4.9" />
      </>
    ),
    description:
      'Appointments, books of business, commission plans and production goals with real-time leaderboard reporting.',
  },
  {
    title: 'Payments',
    tag: 'Premiums',
    icon: (
      <>
        <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
        <path d="M3 10h18M6.5 14.6h3.5" />
      </>
    ),
    description:
      'Premium billing, instalments, refunds and reconciliation across card, ACH and cheque — with dunning built in.',
  },
  {
    title: 'Fraud',
    tag: 'Integrity',
    icon: (
      <>
        <path d="M12 3.5l7 2.8v5c0 4.2-2.8 7.2-7 8.4-4.2-1.2-7-4.2-7-8.4v-5l7-2.8z" />
        <path d="M12 9v3.4M12 15.4v.1" />
      </>
    ),
    description:
      'Rules and anomaly scoring that flag suspicious claims and provider patterns before they hit your loss ratio.',
  },
  {
    title: 'Analytics',
    tag: 'Insights',
    icon: (
      <>
        <path d="M4 20V4M4 20h16" />
        <path d="M8 16.5v-4M12.5 16.5V8M17 16.5v-6" />
      </>
    ),
    description:
      'Loss ratio, combined ratio, reserve adequacy and leakage — live dashboards instead of a monthly deck.',
  },
];

const STATS = [
  { value: '1.8M+', label: 'Policies administered' },
  { value: '$940M', label: 'Claims processed / yr' },
  { value: '42%', label: 'Faster claims cycle' },
  { value: '99.98%', label: 'Platform uptime' },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$99',
    cadence: '/ month',
    blurb: 'For boutique agencies and MGAs getting their operations onto one system.',
    cta: 'Start free trial',
    href: '/dashboard',
    highlighted: false,
    features: [
      'Up to 500 active policies',
      'Claims & policy management',
      '3 team members',
      'Standard reports',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '$349',
    cadence: '/ month',
    blurb: 'For growing carriers scaling across lines of business and distribution channels.',
    cta: 'Start free trial',
    href: '/dashboard',
    highlighted: true,
    features: [
      'Unlimited policies & claims',
      'Automated renewals & commissions',
      'Fraud rules engine',
      'Advanced analytics suite',
      '25 team members',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    blurb: 'For carriers with complex compliance, integration and deployment needs.',
    cta: 'Talk to sales',
    href: '/dashboard',
    highlighted: false,
    features: [
      'Everything in Growth',
      'SSO / SAML & audit logs',
      'Custom integrations & API limits',
      'Dedicated CSM & 99.9% SLA',
      'Private cloud deployment',
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      'We cut our claims cycle time from eleven days to four. Adjusters finally have every document, reserve and payment in one timeline instead of five tabs.',
    name: 'Maria Alvarez',
    role: 'VP of Claims, Harborline Mutual',
    initials: 'MA',
    tone: 'bg-teal-600',
  },
  {
    quote:
      'Renewals used to be a spreadsheet ritual. InsureFlow\u2019s lapse-risk queue means we touch every policy 45 days out — retention is up 9 points.',
    name: 'Daniel Okafor',
    role: 'COO, Crestpoint Underwriters',
    initials: 'DO',
    tone: 'bg-sky-600',
  },
  {
    quote:
      'Our producers see their book, commissions and renewals in real time. Forecasting went from a monthly scramble to a dashboard we trust.',
    name: 'Priya Raman',
    role: 'Head of Distribution, Northwind Brokers',
    initials: 'PR',
    tone: 'bg-slate-700',
  },
];

const FOOTER_COLUMNS = [
  {
    heading: 'Product',
    links: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  },
  {
    heading: 'Platform',
    links: ['Policy admin', 'Claims desk', 'Underwriting', 'Payments'],
  },
  {
    heading: 'Developers',
    links: ['Documentation', 'API reference', 'System status', 'Integrations'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Contact', 'Security'],
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        {/* ── Sticky nav ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
          <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" aria-label="InsureFlow home">
              <Logo />
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-slate-700 transition-colors hover:text-teal-600 dark:text-slate-200 dark:hover:text-teal-400"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-10px_rgba(13,148,136,0.9)] transition hover:bg-teal-700"
              >
                Get started
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden dark:border-slate-700 dark:text-slate-200"
            >
              <Icon className="h-5 w-5">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </Icon>
            </button>
          </nav>

          {menuOpen && (
            <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 rounded-lg bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_55%_at_50%_0%,rgba(13,148,136,0.18),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-700 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                  </span>
                  New — automated claims triage is live
                </span>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  Insurance operations,{' '}
                  <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-sky-500 bg-clip-text text-transparent">
                    unified
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                  Policies, claims, underwriting, renewals, agents, payments, fraud and analytics in
                  one operating system — so your teams stop reconciling spreadsheets and start
                  serving policyholders.
                </p>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/dashboard"
                    className="w-full rounded-xl bg-teal-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_-15px_rgba(13,148,136,0.95)] transition hover:bg-teal-700 sm:w-auto"
                  >
                    Start free trial
                  </Link>
                  <a
                    href="#features"
                    className="w-full rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-teal-400 hover:text-teal-700 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-teal-600 dark:hover:text-teal-300"
                  >
                    Explore the platform
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.32}>
                <p className="mt-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  No credit card required · SOC 2 ready · Cancel anytime
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.4}>
              <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-5 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <p className="text-2xl font-extrabold tracking-tight text-teal-600 dark:text-teal-400">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────────── */}
        <section id="features" className="border-t border-slate-200 bg-slate-50/70 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                Platform
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Eight modules. One source of truth.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Every part of the insurance lifecycle shares the same policy, claim and party data —
                no exports, no nightly syncs, no arguments about which number is right.
              </p>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, index) => (
                <Reveal key={feature.title} delay={(index % 4) * 0.07}>
                  <article className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_18px_40px_-24px_rgba(13,148,136,0.65)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-950/70 dark:text-teal-400 dark:group-hover:bg-teal-600 dark:group-hover:text-white">
                      <Icon>{feature.icon}</Icon>
                    </span>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {feature.tag}
                    </p>
                    <h3 className="mt-1 text-lg font-bold tracking-tight">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ────────────────────────────────────────────── */}
        <section id="pricing" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                Pricing
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Plans that scale with your book
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Start on a 14-day trial with full access. Upgrade, downgrade or talk to us about
                volume pricing whenever you&apos;re ready.
              </p>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {PRICING.map((tier, index) => (
                <Reveal key={tier.name} delay={index * 0.09}>
                  <div
                    className={`flex h-full flex-col rounded-2xl border p-7 ${
                      tier.highlighted
                        ? 'border-teal-500 bg-white shadow-[0_25px_60px_-30px_rgba(13,148,136,0.75)] ring-1 ring-teal-500 dark:bg-slate-900'
                        : 'border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold tracking-tight">{tier.name}</h3>
                      {tier.highlighted && (
                        <span className="rounded-full bg-teal-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                          Most popular
                        </span>
                      )}
                    </div>

                    <p className="mt-4 flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                      {tier.cadence && (
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          {tier.cadence}
                        </span>
                      )}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {tier.blurb}
                    </p>

                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.features.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950/70 dark:text-teal-400">
                            <Icon className="h-3.5 w-3.5">
                              <path d="M5 12.5l4.2 4.2L19 7" />
                            </Icon>
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={tier.href}
                      className={`mt-7 rounded-xl px-5 py-3 text-center text-sm font-semibold transition ${
                        tier.highlighted
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'border border-slate-300 text-slate-800 hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:text-slate-100 dark:hover:border-teal-600 dark:hover:text-teal-300'
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────────────────── */}
        <section
          id="customers"
          className="border-t border-slate-200 bg-slate-50/70 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                Customers
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Trusted by carriers, MGAs and brokers
              </h2>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {TESTIMONIALS.map((item, index) => (
                <Reveal key={item.name} delay={index * 0.09}>
                  <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex gap-1 text-teal-500" aria-label="5 out of 5 stars">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <Icon key={star} className="h-4 w-4 fill-current">
                          <path d="M12 3.6l2.5 5.1 5.6.8-4 3.9 1 5.6L12 16.4l-5.1 2.6 1-5.6-4-3.9 5.6-.8L12 3.6z" />
                        </Icon>
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${item.tone}`}
                      >
                        {item.initials}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{item.name}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          {item.role}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA band ───────────────────────────────────────────── */}
        <section id="docs" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-sky-700 px-6 py-14 text-center shadow-[0_30px_70px_-35px_rgba(13,148,136,0.9)] sm:px-12">
                <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />

                <div className="relative">
                  <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Bring every policy, claim and payment into one operating system
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-teal-50/90 sm:text-base">
                    Spin up a full InsureFlow workspace with realistic sample data in under two
                    minutes — see your entire book on one screen.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href="/dashboard"
                      className="w-full rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-teal-700 shadow-lg transition hover:bg-teal-50 sm:w-auto"
                    >
                      Start free trial
                    </Link>
                    <Link
                      href="/dashboard/analytics"
                      className="w-full rounded-xl border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                    >
                      View live demo
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="border-t border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
              <div className="col-span-2">
                <Logo />
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  The unified insurance operations platform for carriers, MGAs and brokers —
                  built for the people who actually run the book.
                </p>
              </div>

              {FOOTER_COLUMNS.map((column) => (
                <nav key={column.heading} aria-label={column.heading}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                    {column.heading}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {column.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#features"
                          className="text-sm text-slate-600 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                © 2026 InsureFlow. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <a href="#features" className="transition-colors hover:text-teal-600">
                  Privacy
                </a>
                <a href="#features" className="transition-colors hover:text-teal-600">
                  Terms
                </a>
                <a href="/api/health" className="transition-colors hover:text-teal-600">
                  Status
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
