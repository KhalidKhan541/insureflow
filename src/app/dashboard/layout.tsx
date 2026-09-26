import type { Metadata } from 'next';

import DashboardShell from '@/components/layout/DashboardShell';

/**
 * Server layout for every `/dashboard/*` route.
 *
 * Declares route-group metadata (title template is applied by the root
 * layout) and wraps the client `DashboardShell`, which renders the sidebar,
 * sticky top bar and padded main region.
 */

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'InsureFlow operations dashboard — book performance, open claims exposure, agency activity and policy analytics at a glance.',
  keywords: [
    'insurance dashboard',
    'claims dashboard',
    'policy analytics',
    'insurance operations',
    'InsureFlow',
  ],
  openGraph: {
    title: 'InsureFlow Dashboard',
    description:
      'Book performance, claims exposure and agency activity in one operations dashboard.',
    type: 'website',
  },
  robots: { index: false, follow: true },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
