import { evaluateKpi, STATUS_COLORS } from '../../data/kpiDefinitions';
import StatusBadge from './StatusBadge';
import { useState } from 'react';

export default function KpiInput({ kpi, value, onChange }) {
  const [showAction, setShowAction] = useState(false);
  const status = evaluateKpi(kpi, value);
  const color = STATUS_COLORS[status];

  return (
    <div
      className="animate-fade-in rounded-2xl p-5 sm:p-6 transition-all duration-300"
      style={{
        backgroundColor: '#1A1A1A',
        borderLeft: `4px solid ${status === 'none' ? '#333' : color.bg}`,
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-white leading-snug">{kpi.label}</p>
          <p className="text-xs text-brand-gray mt-1">Target: {kpi.target}</p>
        </div>
        <StatusBadge status={status} size="lg" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <div className="relative flex-1 max-w-[160px]">
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(kpi.id, e.target.value === '' ? null : parseFloat(e.target.value))}
            placeholder="—"
            className="w-full bg-brand-black border border-brand-border rounded-lg px-4 py-3 text-white text-base font-medium focus:outline-none focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(45,156,219,0.15)] transition-all placeholder:text-brand-gray/50"
            step="any"
          />
          {kpi.unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-brand-gray pointer-events-none">
              {kpi.unit}
            </span>
          )}
        </div>

        {/* Threshold labels */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-400">{kpi.green.label}</span>
          <span className="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400">{kpi.yellow.label}</span>
          <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400">{kpi.red.label}</span>
        </div>
      </div>

      {/* If Red action */}
      {status === 'red' && (
        <button
          onClick={() => setShowAction(!showAction)}
          className="mt-4 w-full text-left"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-red-400 uppercase tracking-wider">
            <span className="pulse-red inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
            Action Required
            <span className="text-brand-gray ml-auto">{showAction ? '▲' : '▼'}</span>
          </div>
          {showAction && (
            <p className="mt-3 text-sm text-red-200/80 leading-relaxed pl-5 border-l-2 border-red-500/30">
              {kpi.ifRed}
            </p>
          )}
        </button>
      )}
    </div>
  );
}
