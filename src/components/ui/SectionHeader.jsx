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
        <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center flex-shrink-0">
          <Icon size={20} className="text-brand-red" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
            {section.title}
          </h3>
          <p className="text-xs text-brand-gray uppercase tracking-widest mt-0.5">{section.subtitle}</p>
        </div>
        {section.description && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-brand-gray hover:text-brand-red transition-colors duration-200 uppercase tracking-wider font-bold flex-shrink-0"
          >
            <span className="hidden sm:inline">{expanded ? 'Less' : 'About'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {expanded && section.description && (
        <div className="mt-3 ml-[52px] animate-fade-in">
          <p className="text-sm text-brand-lightGray leading-relaxed max-w-2xl">
            {section.description}
          </p>
        </div>
      )}
    </div>
  );
}
