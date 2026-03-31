import { useState, useEffect } from 'react';
import { X, Zap, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import { PROMO } from '../../data/resources';

const PROMO_DISMISSED_KEY = 'limitless-promo-dismissed';

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!PROMO.active) return;

    // Only show once per session
    const dismissed = sessionStorage.getItem(PROMO_DISMISSED_KEY);
    if (dismissed) return;

    // Small delay so it doesn't feel jarring on load
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(PROMO_DISMISSED_KEY, 'true');
  };

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5" onClick={dismiss}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      <div
        className="relative z-10 w-full max-w-lg animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-brand-card border border-brand-red/30 rounded-2xl overflow-hidden shadow-2xl shadow-red-500/10">
          {/* Red accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-brand-red via-brand-redGlow to-brand-red" />

          <div className="p-7 sm:p-8">
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-brand-dark border border-brand-border flex items-center justify-center text-brand-gray hover:text-white hover:border-brand-red/40 transition-all"
            >
              <X size={16} />
            </button>

            {/* Badge */}
            {PROMO.badge && (
              <div className="inline-flex items-center gap-1.5 bg-brand-red/15 border border-brand-red/30 rounded-full px-3 py-1 mb-5">
                <Zap size={12} className="text-brand-red" />
                <span className="text-[11px] font-bold text-brand-red uppercase tracking-wider">{PROMO.badge}</span>
              </div>
            )}

            {/* Content */}
            {PROMO.subtitle && (
              <p className="text-xs text-brand-gray uppercase tracking-widest font-bold mb-2">{PROMO.subtitle}</p>
            )}
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white leading-tight">
              {PROMO.title}
            </h2>
            <p className="text-sm text-brand-lightGray mt-4 leading-relaxed">
              {PROMO.description}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={PROMO.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-brand-red hover:bg-brand-redGlow text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 no-underline hover:shadow-lg hover:shadow-red-500/20"
                onClick={dismiss}
              >
                {PROMO.cta}
                <ArrowRight size={16} />
              </a>
              <button
                onClick={dismiss}
                className="py-3.5 px-5 bg-brand-dark border border-brand-border text-brand-gray hover:text-white font-semibold text-sm rounded-xl transition-all duration-200"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
