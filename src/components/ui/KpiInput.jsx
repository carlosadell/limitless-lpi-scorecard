import { evaluateKpi, STATUS_COLORS } from '../../data/kpiDefinitions';
import StatusBadge from './StatusBadge';
import { useState, useRef, useEffect } from 'react';
import { Info, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

function Tooltip({ kpi, isOpen, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={ref} className="absolute z-40 top-full left-0 right-0 mt-2 animate-fade-in">
      <div className="bg-[#111111] border border-brand-blue/20 rounded-xl p-5 shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="text-sm font-semibold text-brand-blue uppercase tracking-wider flex items-center gap-2">
            <Info size={14} />
            What is this?
          </h4>
          <button onClick={onClose} className="text-brand-gray hover:text-white text-xs transition-colors">Close</button>
        </div>
        <p className="text-sm text-brand-lightGray leading-relaxed mb-4">{kpi.description}</p>
        {kpi.formula && (
          <div className="bg-brand-black/80 rounded-lg px-4 py-3 border border-brand-border/40">
            <p className="text-[11px] text-brand-gray uppercase tracking-[0.15em] mb-1.5 font-semibold">How to calculate</p>
            <p className="text-[13px] text-white/90 font-mono leading-relaxed">{kpi.formula}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KpiInput({ kpi, value, onChange }) {
  const [showAction, setShowAction] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const status = evaluateKpi(kpi, value);
  const color = STATUS_COLORS[status];

  const borderColor = status === 'none' ? 'rgba(45, 156, 219, 0.08)' : `${color.bg}50`;

  return (
    <div
      className="relative animate-fade-in rounded-2xl p-5 sm:p-6 transition-all duration-300"
      style={{
        backgroundColor: '#131313',
        borderLeft: `3px solid ${borderColor}`,
        boxShadow: status === 'red' ? '0 0 24px rgba(255, 51, 51, 0.04)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-medium text-white leading-snug">{kpi.label}</p>
            {kpi.description && (
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="flex-shrink-0 text-brand-gray/40 hover:text-brand-blue transition-colors duration-200"
                title="Learn more about this KPI"
              >
                <Info size={15} />
              </button>
            )}
          </div>
          <p className="text-xs text-brand-gray/60 mt-1 tracking-wide">
            Target: <span className="text-brand-gray/80 font-medium">{kpi.target}</span>
          </p>
        </div>
        <StatusBadge status={status} size="lg" />
      </div>

      {/* Tooltip overlay */}
      <Tooltip kpi={kpi} isOpen={showTooltip} onClose={() => setShowTooltip(false)} />

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <div className="relative flex-1 max-w-[180px]">
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(kpi.id, e.target.value === '' ? null : parseFloat(e.target.value))}
            placeholder="--"
            className="w-full bg-brand-black/80 border border-white/[0.06] rounded-xl px-4 py-3 text-white text-base font-medium focus:outline-none focus:border-brand-blue/50 focus:shadow-[0_0_0_3px_rgba(45,156,219,0.08)] transition-all duration-200 placeholder:text-white/10"
            step="any"
          />
          {kpi.unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-brand-gray/50 pointer-events-none font-medium">
              {kpi.unit}
            </span>
          )}
        </div>

        {/* Threshold pills */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-green-500/[0.06] text-green-400/70 border border-green-500/10">{kpi.green.label}</span>
          <span className="px-2.5 py-1 rounded-lg bg-yellow-500/[0.06] text-yellow-400/70 border border-yellow-500/10">{kpi.yellow.label}</span>
          <span className="px-2.5 py-1 rounded-lg bg-red-500/[0.06] text-red-400/70 border border-red-500/10">{kpi.red.label}</span>
        </div>
      </div>

      {/* If Red action */}
      {status === 'red' && (
        <button
          onClick={() => setShowAction(!showAction)}
          className="mt-4 w-full text-left"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-red-400 uppercase tracking-wider">
            <AlertTriangle size={14} className="flex-shrink-0" />
            <span>Action Required</span>
            {showAction
              ? <ChevronUp size={14} className="ml-auto text-brand-gray" />
              : <ChevronDown size={14} className="ml-auto text-brand-gray" />
            }
          </div>
          {showAction && (
            <p className="mt-3 text-sm text-red-200/60 leading-relaxed pl-5 border-l-2 border-red-500/15">
              {kpi.ifRed}
            </p>
          )}
        </button>
      )}
    </div>
  );
}
