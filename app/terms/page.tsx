import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Service — CalcNest',
  description:
    'CalcNest Terms of Service and general website usage conditions, warranties, and informational disclaimers.',
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
          Last updated: September 1, 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using CalcNest (&ldquo;the website&rdquo;), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Educational &amp; Informational Disclaimers</h2>
          <p>
            <strong>Financial Calculations:</strong> Results provided by loan EMI, SIP, mutual fund, salary, GST, and investment calculators are estimates for informational and educational purposes only. They do not constitute certified financial advice or loan commitments. Actual rates and payments may vary based on financial institutions and tax laws.
          </p>
          <p>
            <strong>Health Tools:</strong> BMI, BMR, and hydration calculations are general health estimates and do not replace certified medical diagnosis or clinical healthcare consultation.
          </p>
          <p>
            <strong>Academic Tools:</strong> Grade conversions and attendance calculators are tools to aid student planning. University grading policies and attendance shortage regulations vary by institution.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Disclaimer of Warranties</h2>
          <p>
            CalcNest provides all calculators and utilities on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied. While we take pride in mathematical precision, we do not guarantee that the tools will be completely error-free or uninterrupted.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Limitation of Liability</h2>
          <p>
            In no event shall CalcNest or its creators be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use any tool on this website.
          </p>
        </section>
      </div>
    </div>
  );
}
