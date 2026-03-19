import { useState } from 'react';
import { SECTIONS, evaluateKpi, STATUS_COLORS, getAllKpis } from '../../data/kpiDefinitions';

function MiniTrend({ values }) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const step = width / (values.length - 1);

  const points = values.map((v, i) => ({
    x: i * step,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const lastVal = values[values.length - 1];
  const prevVal = values[values.length - 2];
  const color = lastVal > prevVal ? '#22C55E' : lastVal < prevVal ? '#FF3333' : '#F59E0B';

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2.5" fill={color} />
    </svg>
  );
}

export default function HistoryView({ entries, onDelete }) {
  const [selectedKpi, setSelectedKpi] = useState(null);
  const allKpis = getAllKpis();

  // Get unique KPI IDs that have data
  const kpiIdsWithData = new Set();
  entries.forEach(entry => {
    Object.keys(entry.values).forEach(k => {
      if (entry.values[k] !== null && entry.values[k] !== undefined) {
        kpiIdsWithData.add(k);
      }
    });
  });

  // Build trend data for a specific KPI
  function getTrendData(kpiId) {
    return entries
      .filter(e => e.values[kpiId] !== null && e.values[kpiId] !== undefined)
      .map(e => ({
        date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: parseFloat(e.values[kpiId]),
      }))
      .reverse(); // oldest first
  }

  if (entries.length === 0) {
    return (
      <div className="animate-fade-in text-center py-16">
        <div className="text-4xl mb-4">📋</div>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white mb-2">
          No History Yet
        </h2>
        <p className="text-sm text-brand-gray max-w-xs mx-auto">
          Start tracking your LPIs weekly and monthly. Your history will appear here so you can see growth over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Trend Overview */}
      <div className="bg-brand-card rounded-2xl p-5 border border-brand-border">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white mb-1">
          Performance History
        </h2>
        <p className="text-sm text-brand-gray">
          {entries.length} scorecard{entries.length !== 1 ? 's' : ''} recorded
        </p>
      </div>

      {/* KPI Trend Cards */}
      <div className="space-y-2">
        {allKpis.filter(k => kpiIdsWithData.has(k.id)).map(kpi => {
          const trend = getTrendData(kpi.id);
          const latestVal = trend.length > 0 ? trend[trend.length - 1].value : null;
          const status = evaluateKpi(kpi, latestVal);
          const color = STATUS_COLORS[status];
          const isSelected = selectedKpi === kpi.id;

          return (
            <button
              key={kpi.id}
              onClick={() => setSelectedKpi(isSelected ? null : kpi.id)}
              className="w-full text-left bg-brand-card rounded-xl p-4 border border-brand-border hover:border-brand-border/80 transition-all"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.bg }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{kpi.label}</p>
                  <p className="text-[11px] text-brand-gray">
                    Latest: {latestVal !== null ? `${latestVal}${kpi.unit}` : '—'}
                  </p>
                </div>
                {trend.length >= 2 && <MiniTrend values={trend.map(t => t.value)} />}
              </div>

              {/* Expanded detail */}
              {isSelected && trend.length > 0 && (
                <div className="mt-3 pt-3 border-t border-brand-border">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {trend.map((t, i) => (
                      <div key={i} className="text-center">
                        <p className="text-[10px] text-brand-gray">{t.date}</p>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: STATUS_COLORS[evaluateKpi(kpi, t.value)].bg }}
                        >
                          {t.value}{kpi.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Entry List */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-gray px-1">
          All Entries
        </h3>
        {entries.map(entry => {
          const filledCount = Object.values(entry.values).filter(v => v !== null && v !== undefined).length;
          const date = new Date(entry.date);

          return (
            <div key={entry.id} className="bg-brand-card rounded-xl p-4 border border-brand-border flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-[11px] text-brand-gray mt-0.5">
                  {entry.cadence === 'weekly' ? 'Weekly' : 'Monthly'} — {filledCount} KPIs tracked
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this entry?')) onDelete(entry.id);
                }}
                className="text-xs text-brand-gray hover:text-red-400 transition-colors px-2 py-1"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
