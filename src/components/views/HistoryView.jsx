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
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill={color} />
    </svg>
  );
}

function TrendIcon({ values }) {
  if (values.length < 2) return <Minus size={14} className="text-brand-gray" />;
  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  if (last > prev) return <TrendingUp size={14} className="text-green-400" />;
  if (last < prev) return <TrendingDown size={14} className="text-red-400" />;
  return <Minus size={14} className="text-yellow-400" />;
}

function KpiDetailChart({ kpi, trend }) {
  if (trend.length < 2) return null;

  const greenMin = kpi.green?.min;

  return (
    <div className="mt-4 pt-4 border-t border-brand-border">
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={trend} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#2A2A2A' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '10px',
              fontSize: '12px',
              color: '#fff',
            }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          {greenMin != null && !kpi.invertScale && (
            <ReferenceLine y={greenMin} stroke="rgba(34,197,94,0.3)" strokeDasharray="4 4" />
          )}
          {kpi.invertScale && kpi.green?.max != null && (
            <ReferenceLine y={kpi.green.max} stroke="rgba(34,197,94,0.3)" strokeDasharray="4 4" />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FF3333"
            strokeWidth={2}
            dot={{ fill: '#FF3333', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#FF4444', r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3">
        {trend.map((t, i) => (
          <div key={i} className="text-center">
            <p className="text-[10px] text-brand-gray">{t.date}</p>
            <p
              className="text-sm font-bold tabular-nums"
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

  const kpiIdsWithData = new Set();
  entries.forEach(entry => {
    Object.keys(entry.values).forEach(k => {
      if (entry.values[k] !== null && entry.values[k] !== undefined) {
        kpiIdsWithData.add(k);
      }
    });
  });

  function getTrendData(kpiId) {
    return entries
      .filter(e => e.values[kpiId] !== null && e.values[kpiId] !== undefined)
      .map(e => ({
        date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: parseFloat(e.values[kpiId]),
      }))
      .reverse();
  }

  if (entries.length === 0) {
    return (
      <div className="animate-fade-in text-center py-16">
        <div className="text-4xl mb-4">
          <ClipboardList size={48} className="text-brand-red mx-auto" />
        </div>
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-2">
          No History Yet
        </h2>
        <p className="text-sm text-brand-lightGray max-w-xs mx-auto">
          Start tracking your LPIs weekly and monthly. Your history and trends will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-brand-card rounded-2xl p-5 border border-brand-border">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-1">
          Performance History
        </h2>
        <p className="text-sm text-brand-lightGray">
          {entries.length} scorecard{entries.length !== 1 ? 's' : ''} recorded — tap any KPI to see trends
        </p>
      </div>

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
              className="w-full text-left bg-brand-card rounded-xl p-4 border border-brand-border hover:border-brand-red/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.bg }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{kpi.label}</p>
                  <p className="text-xs text-brand-gray mt-0.5">
                    Latest: <span className="font-bold tabular-nums" style={{ color: color.bg }}>{latestVal !== null ? `${latestVal}${kpi.unit}` : '—'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {trend.length >= 2 && <MiniTrend values={trend.map(t => t.value)} />}
                  <TrendIcon values={trend.map(t => t.value)} />
                  {isSelected ? <ChevronUp size={14} className="text-brand-gray" /> : <ChevronDown size={14} className="text-brand-gray" />}
                </div>
              </div>

              {isSelected && <KpiDetailChart kpi={kpi} trend={trend} />}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-gray px-1">
          All Entries
        </h3>
        {entries.map(entry => {
          const filledCount = Object.values(entry.values).filter(v => v !== null && v !== undefined).length;
          const date = new Date(entry.date);

          return (
            <div key={entry.id} className="bg-brand-card rounded-xl p-4 border border-brand-border flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs text-brand-gray mt-0.5">
                  {entry.cadence === 'weekly' ? 'Weekly' : 'Monthly'} — {filledCount} KPIs tracked
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this entry?')) onDelete(entry.id);
                }}
                className="text-brand-gray hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
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
