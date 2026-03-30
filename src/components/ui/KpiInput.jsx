import { evaluateKpi, STATUS_COLORS } from '../../data/kpiDefinitions';
import StatusBadge from './StatusBadge';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Info, ChevronDown, ChevronUp, AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

function HoverTooltip({ kpi, triggerRef, onClose }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 320;
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      // Keep tooltip within viewport
      if (left < 12) left = 12;
      if (left + tooltipWidth > window.innerWidth - 12) left = window.innerWidth - 12 - tooltipWidth;
      setPosition({
        top: rect.bottom + 8,
        left,
      });
    }
  }, [triggerRef]);

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[9999] w-80 animate-fade-in pointer-events-none"
      style={{ top: position.top, left: position.left }}
    >
      <div className="bg-brand-dark border border-brand-border rounded-xl p-4 shadow-2xl">
        <p className="text-xs font-bold text-brand-red uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Info size={12} />
          What is this?
        </p>
        <p className="text-sm text-brand-lightGray leading-relaxed">{kpi.description}</p>
        {kpi.formula && (
          <div className="bg-brand-black rounded-lg px-3 py-2 border border-brand-border mt-3">
            <p className="text-[10px] text-brand-red uppercase tracking-widest mb-1 font-bold">Formula</p>
            <p className="text-xs text-white font-mono leading-relaxed">{kpi.formula}</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function MobileTooltip({ kpi, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

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

// Detect touch device
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export default function KpiInput({ kpi, value, onChange }) {
  const [showAction, setShowAction] = useState(false);
  const [hoverTooltip, setHoverTooltip] = useState(false);
  const [mobileTooltip, setMobileTooltip] = useState(false);
  const triggerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const status = evaluateKpi(kpi, value);
  const color = STATUS_COLORS[status];

  const borderColor = status === 'none' ? '#2A2A2A' : color.bg;

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice()) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverTooltip(true);
    }, 200); // small delay to avoid flickering
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoverTooltip(false);
  }, []);

  const handleClick = useCallback(() => {
    if (isTouchDevice()) {
      setMobileTooltip(true);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
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

      {/* Desktop hover tooltip */}
      {hoverTooltip && !isTouchDevice() && (
        <HoverTooltip kpi={kpi} triggerRef={triggerRef} onClose={() => setHoverTooltip(false)} />
      )}

      {/* Mobile tap tooltip (modal) */}
      {mobileTooltip && (
        <MobileTooltip kpi={kpi} onClose={() => setMobileTooltip(false)} />
      )}

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
