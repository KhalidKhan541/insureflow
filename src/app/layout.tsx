import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import { NotificationProvider } from '@/contexts/NotificationContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--if-font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://insureflow.app'),
  title: {
    default: 'InsureFlow — Insurance & Claims Platform',
    template: '%s — InsureFlow',
  },
  description:
    'InsureFlow unifies policies, quotes, claims, underwriting, renewals, premiums, reserves and commissions in one modern insurance operations platform.',
  keywords: [
    'insurance platform',
    'claims management',
    'policy management',
    'underwriting software',
    'insurance claims software',
    'MGA platform',
    'insurance analytics',
    'InsureFlow',
  ],
  authors: [{ name: 'KhalidKhan541' }],
  creator: 'KhalidKhan541',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://insureflow.app',
    siteName: 'InsureFlow',
    title: 'InsureFlow — Insurance & Claims Platform',
    description:
      'Policies, claims, underwriting, renewals, agents, payments, fraud and analytics — unified in a single insurance operations platform.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InsureFlow — Insurance & Claims Platform',
    description:
      'Policies, claims, underwriting, renewals, agents, payments, fraud and analytics — unified in a single insurance operations platform.',
    creator: '@insureflow',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d9488',
};

/**
 * Applies the stored `if-theme` class to <html> before hydration so the first
 * paint already matches the user's saved theme (no flash of the wrong theme).
 */
const themeScript = `(function(){try{var t=localStorage.getItem('if-theme');if(!t)return;var theme=t;try{var p=JSON.parse(t);if(p&&typeof p==='object')theme=p.theme||p.mode||t;}catch(e){}if(theme==='system'){theme=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(theme!=='dark'&&theme!=='light')return;var el=document.documentElement;el.classList.remove('light','dark');el.classList.add(theme);el.style.colorScheme=theme;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider>
          <SidebarProvider>
            <NotificationProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  className: 'if-toast',
                  style: { borderRadius: '12px', fontSize: '0.875rem' },
                }}
              />
            </NotificationProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
