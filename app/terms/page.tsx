import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Service — DocumentNest',
  description:
    'DocumentNest Terms of Service, usage conditions, and limitations.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <Breadcrumbs items={[{ name: 'Terms of Service', href: '/terms' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last updated: September 4, 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using DocumentNest, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our utilities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Acceptable Use</h2>
          <p>
            You may use DocumentNest for personal, educational, and commercial document processing purposes. You agree not to use the service to process unlawful or malicious files or attempt to reverse-engineer client assets.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Disclaimer of Warranties</h2>
          <p>
            DocumentNest is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. While our client-side WebAssembly engines aim for high fidelity, we do not warrant that all document layouts or font encodings will be 100% error-free. Always keep backups of your original documents.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Limitation of Liability</h2>
          <p>
            In no event shall DocumentNest or its contributors be held liable for any damages or data loss resulting from the use or inability to use this platform.
          </p>
        </section>
      </div>
    </div>
  );
}
