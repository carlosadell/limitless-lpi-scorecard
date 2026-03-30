import { evaluateKpi, STATUS_COLORS } from '../../data/kpiDefinitions';
import StatusBadge from './StatusBadge';
import { useState, useRef, useEffect } from 'react';
import { Info, ChevronDown, ChevronUp, AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

function Tooltip({ kpi, isOpen, onClose, triggerRef }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target) && triggerRef.current && !triggerRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  // Use a portal so the tooltip renders on top of everything
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60" />
      <div
        ref={ref}
        className="relative z-10 w-full max-w-md animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-brand-dark border border-brand-border rounded-2xl p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h4 className="text-sm font-bold text-brand-red uppercase tracking-wider flex items-center gap-2">
              <Info size={14} />
              What is this?
            </h4>
            <button onClick={onClose} className="text-brand-gray hover:text-white transition-colors p-1">
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-brand-lightGray leading-relaxed mb-4">{kpi.description}</p>
          {kpi.formula && (
            <div className="bg-brand-black rounded-xl px-4 py-3 border border-brand-border">
              <p className="text-[11px] text-brand-red uppercase tracking-widest mb-2 font-bold">How to calculate</p>
              <p className="text-sm text-white font-mono leading-relaxed">{kpi.formula}</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function KpiInput({ kpi, value, onChange }) {
  const [showAction, setShowAction] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const triggerRef = useRef(null);
  const status = evaluateKpi(kpi, value);
  const color = STATUS_COLORS[status];

  const borderColor = status === 'none' ? '#2A2A2A' : color.bg;

  return (
    <div
      className="animate-fade-in rounded-2xl p-5 sm:p-6 transition-all duration-300 bg-brand-card border border-brand-border"
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: borderColor,
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-white leading-snug">{kpi.label}</p>
            {kpi.description && (
              <button
                ref={triggerRef}
                onClick={() => setShowTooltip(!showTooltip)}
                className="flex-shrink-0 text-brand-gray hover:text-brand-red transition-colors duration-200"
                title="Learn more about this KPI"
              >
                <Info size={16} />
              </button>
            )}
          </div>
          <p className="text-xs text-brand-gray mt-1">
            Target: <span className="text-brand-lightGray font-medium">{kpi.target}</span>
          </p>
        </div>
        <StatusBadge status={status} size="lg" />
      </div>

      {/* Tooltip as portal overlay */}
      <Tooltip kpi={kpi} isOpen={showTooltip} onClose={() => setShowTooltip(false)} triggerRef={triggerRef} />

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <div className="relative flex-1 max-w-[180px]">
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(kpi.id, e.target.value === '' ? null : parseFloat(e.target.value))}
            placeholder="--"
            className="w-full bg-brand-black border border-brand-border rounded-xl px-4 py-3 text-white text-base font-medium focus:outline-none focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(255,51,51,0.15)] transition-all duration-200 placeholder:text-brand-gray/50"
            step="any"
          />
          {kpi.unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-brand-gray pointer-events-none font-medium">
              {kpi.unit}
            </span>
          )}
        </div>

        {/* Threshold pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-green-500/15 text-green-400 border border-green-500/20 font-medium">{kpi.green.label}</span>
          <span className="px-2.5 py-1 rounded-lg bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 font-medium">{kpi.yellow.label}</span>
          <span className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 border border-red-500/20 font-medium">{kpi.red.label}</span>
        </div>
      </div>

      {/* If Red action */}
      {status === 'red' && (
        <button
          onClick={() => setShowAction(!showAction)}
          className="mt-4 w-full text-left"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase tracking-wider">
            <AlertTriangle size={14} className="flex-shrink-0" />
            <span>Action Required</span>
            {showAction
              ? <ChevronUp size={14} className="ml-auto text-brand-gray" />
              : <ChevronDown size={14} className="ml-auto text-brand-gray" />
            }
          </div>
          {showAction && (
            <p className="mt-3 text-sm text-red-200 leading-relaxed pl-5 border-l-2 border-red-500/40">
              {kpi.ifRed}
            </p>
          )}
        </button>
      )}
    </div>
  );
}
