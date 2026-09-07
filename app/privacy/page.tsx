import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy — DocumentNest',
  description:
    'DocumentNest Privacy Policy detailing our client-side processing architecture, zero server uploads, and complete user privacy.',
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
          Last updated: September 4, 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Local In-Browser Processing Guarantee</h2>
          <p>
            DocumentNest is engineered so that <strong>your files are never uploaded to any remote server or third-party cloud</strong> for browser-compatible operations. When you merge, split, compress, edit, or OCR documents, the binary data is read, transformed, and packaged entirely inside your local device memory using WebAssembly and client-side JavaScript.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. No Document Storage or Retention</h2>
          <p>
            Because no document data is ever transmitted to our hosting infrastructure, DocumentNest does not and cannot store, inspect, sell, or retain any copies of your files. When you close or refresh your browser tab, all temporary memory references are cleared.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Local Storage Usage</h2>
          <p>
            DocumentNest uses your browser&apos;s <code>localStorage</code> solely to persist user interface preferences:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
            <li>Light, Dark, or System color theme preference</li>
            <li>Your list of favorited tool identifiers (e.g., <code>merge-pdf</code>)</li>
            <li>Recently opened tool identifiers (slug names only; never document contents)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Advertisements &amp; Cookies</h2>
          <p>
            DocumentNest may display standard, non-intrusive advertisements from legitimate ad networks to keep the platform 100% free. These third-party vendors may use standard cookies to serve relevant advertisements. We do not sell personal data to advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact Information</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact us at <code>privacy@documentnest.com</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
