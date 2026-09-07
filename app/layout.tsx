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
  metadataBase: new URL('https://documentnest.vercel.app'),
  title: {
    default: 'DocumentNest — Free Online PDF, Document & Image Tools',
    template: '%s | DocumentNest',
  },
  description:
    'Free online tools to merge, split, compress, rotate, edit, and convert PDF documents, images, and text files. 100% private in-browser WebAssembly processing.',
  keywords: [
    'merge pdf',
    'split pdf',
    'compress pdf',
    'pdf editor',
    'image to pdf',
    'pdf to jpg',
    'image ocr',
    'compress image',
    'free pdf tools',
    'documentnest',
  ],
  authors: [{ name: 'DocumentNest Team' }],
  creator: 'DocumentNest',
  publisher: 'DocumentNest',
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
    url: 'https://documentnest.vercel.app',
    siteName: 'DocumentNest',
    title: 'DocumentNest — Free Online PDF, Document & Image Tools',
    description:
      'Edit, convert, merge, split, compress and manage your documents directly in your browser with 100% privacy.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocumentNest — Free Online PDF, Document & Image Tools',
    description:
      'Fast, private, and free document utilities running entirely inside your web browser.',
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
