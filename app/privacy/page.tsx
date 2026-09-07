import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy — CalcNest',
  description:
    'CalcNest Privacy Policy explaining our local browser-first architecture, zero personal data harvesting, and cookie usage.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <Breadcrumbs items={[{ name: 'Privacy Policy', href: '/privacy' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last updated: September 1, 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Client-Side Execution</h2>
          <p>
            CalcNest is designed with a strict privacy-first architecture. All calculation inputs, numerical values, strings, passwords, and JSON data provided in our calculator tools are processed <strong>100% locally in your web browser</strong>. We do not transmit, collect, or store your calculation entries on our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. No Account Registration</h2>
          <p>
            You do not need to create an account, log in, or provide any personal details (such as your name, email address, or phone number) to use any tool on CalcNest.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Local Storage</h2>
          <p>
            To enhance user experience, CalcNest may use your browser&apos;s <code>localStorage</code> to remember your favorite tools and recently used tools. This data stays entirely on your local device and is never uploaded to any remote database. You can clear this anytime by clearing your browser cache.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Advertising and Third-Party Services</h2>
          <p>
            CalcNest may display non-intrusive advertisements from legitimate ad networks (such as Google AdSense) to keep the service free for all users. These third-party vendors may use standard cookies to serve ads based on your visits to this and other websites. You may opt out of personalized advertising by visiting Google Ad Settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact Information</h2>
          <p>
            If you have questions or feedback regarding this Privacy Policy, you may contact us at <code>privacy@calcnest.com</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
