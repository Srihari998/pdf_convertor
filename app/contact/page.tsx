import { Metadata } from 'next';
import { Mail, MessageSquare, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact DocumentNest Support & Feedback',
  description:
    'Contact the DocumentNest team for tool suggestions, feature requests, or technical feedback.',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <Breadcrumbs items={[{ name: 'Contact Us', href: '/contact' }]} />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Feedback &amp; Suggestions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          Contact DocumentNest
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Have a suggestion for a new PDF or document utility? Found an issue with a specific document layout? Let us know and we will look into it!
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-xs">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Direct Email
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Send us an email and our engineering team will get back to you promptly.
            </p>
            <a
              href="mailto:contact@documentnest.com"
              className="inline-block mt-3 font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline text-base"
            >
              contact@documentnest.com
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Suggest a New Document Utility
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Tell us what file format or conversion tool you need and we will engineer a browser-compatible solution for it.
          </p>
        </div>
      </div>
    </div>
  );
}
