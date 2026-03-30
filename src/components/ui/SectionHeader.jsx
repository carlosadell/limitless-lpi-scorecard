import { useState } from 'react';
import { Activity, TrendingUp, RefreshCw, DollarSign, Zap, Star, ChevronDown, ChevronUp } from 'lucide-react';

const ICON_MAP = {
  'activity': Activity,
  'trending-up': TrendingUp,
  'refresh-cw': RefreshCw,
  'dollar-sign': DollarSign,
  'zap': Zap,
  'star': Star,
};

export default function SectionHeader({ section }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[section.icon] || Activity;

  return (
    <div className="px-1">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-blue/[0.07] border border-brand-blue/10 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-brand-blue/70" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-semibold uppercase tracking-wider text-white">
            {section.title}
          </h3>
          <p className="text-[11px] text-brand-gray/50 uppercase tracking-[0.15em] mt-0.5">{section.subtitle}</p>
        </div>
        {section.description && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-[11px] text-brand-gray/40 hover:text-brand-blue transition-colors duration-200 uppercase tracking-wider font-medium flex-shrink-0"
          >
            <span className="hidden sm:inline">{expanded ? 'Less' : 'About'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {expanded && section.description && (
        <div className="mt-3 ml-12 animate-fade-in">
          <p className="text-[13px] text-brand-gray/60 leading-relaxed max-w-2xl">
            {section.description}
          </p>
        </div>
      )}
    </div>
  );
}
