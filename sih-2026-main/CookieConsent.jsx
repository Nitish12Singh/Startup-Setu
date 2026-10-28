import React from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';

export default function CookieConsent({ onAccept, onDecline }) {
  return (
    <aside
      role="dialog"
      aria-label="Cookie and activity tracking consent"
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:flex sm:items-center sm:gap-6"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-blue-50 p-2 text-blue-700">
          <Cookie className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Cookies and activity tracking</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Allow cookies to help us record navigation, clicks, form submissions, and other
            product steps for platform auditing. We do not record form values or passwords.
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            You can decline and use the platform without activity tracking.
          </p>
        </div>
      </div>
      <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
        <button onClick={onDecline} className="gov-btn-secondary text-sm">
          Decline
        </button>
        <button onClick={onAccept} className="gov-btn-primary text-sm">
          Accept cookies
        </button>
      </div>
    </aside>
  );
}
