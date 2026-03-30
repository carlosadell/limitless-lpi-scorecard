import { useState } from 'react';
import { SECTIONS, evaluateKpi, STATUS_COLORS, getAllKpis } from '../../data/kpiDefinitions';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Trash2, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, ClipboardList } from 'lucide-react';

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
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2" fill={color} opacity="0.9" />
    </svg>
  );
}

function TrendIcon({ values }) {
  if (values.length < 2) return <Minus size={14} className="text-brand-gray/30" />;
  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  if (last > prev) return <TrendingUp size={14} className="text-green-400/70" />;
  if (last < prev) return <TrendingDown size={14} className="text-red-400/70" />;
  return <Minus size={14} className="text-yellow-400/70" />;
}

function KpiDetailChart({ kpi, trend }) {
  if (trend.length < 2) return null;

  const greenMin = kpi.green?.min;
  const redMax = kpi.red?.max;

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.03]">
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={trend} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.04)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: '#111',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              fontSize: '12px',
              color: '#fff',
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
          />
          {greenMin != null && !kpi.invertScale && (
            <ReferenceLine y={greenMin} stroke="rgba(34,197,94,0.2)" strokeDasharray="4 4" />
          )}
          {kpi.invertScale && kpi.green?.max != null && (
            <ReferenceLine y={kpi.green.max} stroke="rgba(34,197,94,0.2)" strokeDasharray="4 4" />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2D9CDB"
            strokeWidth={2}
            dot={{ fill: '#2D9CDB', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#3DAEE8', r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Data points grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3">
        {trend.map((t, i) => (
          <div key={i} className="text-center">
            <p className="text-[10px] text-brand-gray/30">{t.date}</p>
            <p
              className="text-[13px] font-semibold tabular-nums"
              style={{ color: STATUS_COLORS[evaluateKpi(kpi, t.value)].bg }}
            >
              {t.value}{kpi.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
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
      <div className="animate-fade-in text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-brand-blue/[0.05] border border-brand-blue/10 flex items-center justify-center mx-auto mb-5">
          <ClipboardList size={28} className="text-brand-blue/30" />
        </div>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wider text-white mb-2">
          No History Yet
        </h2>
        <p className="text-[14px] text-brand-gray/40 max-w-xs mx-auto leading-relaxed">
          Start tracking your LPIs weekly and monthly. Your history and trends will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-[#111111] rounded-2xl p-5 border border-white/[0.04]">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wider text-white mb-1">
          Performance History
        </h2>
        <p className="text-[13px] text-brand-gray/40">
          {entries.length} scorecard{entries.length !== 1 ? 's' : ''} recorded — tap any KPI to see trends
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
              className="w-full text-left bg-[#111111] rounded-xl p-4 border border-white/[0.04] hover:border-brand-blue/10 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.bg }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white/80 truncate">{kpi.label}</p>
                  <p className="text-[11px] text-brand-gray/30 mt-0.5">
                    Latest: <span className="tabular-nums" style={{ color: color.bg }}>{latestVal !== null ? `${latestVal}${kpi.unit}` : '--'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {trend.length >= 2 && <MiniTrend values={trend.map(t => t.value)} />}
                  <TrendIcon values={trend.map(t => t.value)} />
                  {isSelected ? <ChevronUp size={14} className="text-brand-gray/30" /> : <ChevronDown size={14} className="text-brand-gray/20" />}
                </div>
              </div>

              {/* Expanded chart */}
              {isSelected && <KpiDetailChart kpi={kpi} trend={trend} />}
            </button>
          );
        })}
      </div>

      {/* Entry List */}
      <div className="space-y-3">
        <h3 className="font-display text-[12px] font-semibold uppercase tracking-[0.15em] text-brand-gray/30 px-1">
          All Entries
        </h3>
        {entries.map(entry => {
          const filledCount = Object.values(entry.values).filter(v => v !== null && v !== undefined).length;
          const date = new Date(entry.date);

          return (
            <div key={entry.id} className="bg-[#111111] rounded-xl p-4 border border-white/[0.04] flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-white/70">
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-[11px] text-brand-gray/30 mt-0.5">
                  {entry.cadence === 'weekly' ? 'Weekly' : 'Monthly'} — {filledCount} KPIs tracked
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this entry?')) onDelete(entry.id);
                }}
                className="text-brand-gray/20 hover:text-red-400/70 transition-colors p-2 rounded-lg hover:bg-red-500/[0.05]"
                title="Delete entry"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
