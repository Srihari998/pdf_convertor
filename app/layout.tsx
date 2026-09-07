import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/layout/ThemeProvider';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://calcnest.com'),
  title: {
    default: 'CalcNest — Free Calculators and Useful Online Tools',
    template: '%s | CalcNest',
  },
  description:
    'Free online calculators and fast utility tools. Calculate loan EMI, CGPA, attendance thresholds, percentages, convert units, format JSON, and generate passwords instantly.',
  keywords: [
    'free calculators',
    'online calculators',
    'emi calculator',
    'cgpa calculator',
    'attendance calculator',
    'percentage calculator',
    'unit converter',
    'json formatter',
    'calcnest',
  ],
  authors: [{ name: 'CalcNest Team' }],
  creator: 'CalcNest',
  publisher: 'CalcNest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://calcnest.com',
    siteName: 'CalcNest',
    title: 'CalcNest — Free Calculators and Useful Online Tools',
    description:
      'Calculate, convert, generate, and solve everyday academic, financial, and developer problems instantly.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalcNest — Free Calculators and Useful Online Tools',
    description:
      'Free calculators and fast utility tools that run 100% locally in your browser.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
