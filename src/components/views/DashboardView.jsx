import { SECTIONS, evaluateKpi, STATUS_COLORS } from '../../data/kpiDefinitions';
import StatusBadge from '../ui/StatusBadge';
import { Activity, TrendingUp, RefreshCw, DollarSign, Zap, Star, AlertTriangle } from 'lucide-react';

const ICON_MAP = {
  'activity': Activity,
  'trending-up': TrendingUp,
  'refresh-cw': RefreshCw,
  'dollar-sign': DollarSign,
  'zap': Zap,
  'star': Star,
};

function SectionSummary({ section, currentValues }) {
  const statuses = section.kpis.map(kpi => evaluateKpi(kpi, currentValues[kpi.id]));
  const redCount = statuses.filter(s => s === 'red').length;
  const greenCount = statuses.filter(s => s === 'green').length;
  const yellowCount = statuses.filter(s => s === 'yellow').length;
  const noData = statuses.filter(s => s === 'none').length;
  const filled = statuses.length - noData;

  let overallStatus = 'none';
  if (filled > 0) {
    if (redCount > 0) overallStatus = 'red';
    else if (yellowCount > 0) overallStatus = 'yellow';
    else overallStatus = 'green';
  }

  const Icon = ICON_MAP[section.icon] || Activity;

  return (
    <div className="bg-[#111111] rounded-2xl p-5 sm:p-6 border border-white/[0.04] hover:border-brand-blue/15 transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-blue/[0.06] border border-brand-blue/8 flex items-center justify-center">
            <Icon size={17} className="text-brand-blue/60" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">{section.title}</h3>
            <p className="text-[11px] text-brand-gray/40 uppercase tracking-[0.12em] mt-0.5">{section.subtitle}</p>
          </div>
        </div>
        <StatusBadge status={overallStatus} size="lg" />
      </div>

      <div className="space-y-2">
        {section.kpis.map(kpi => {
          const st = evaluateKpi(kpi, currentValues[kpi.id]);
          const color = STATUS_COLORS[st];
          return (
            <div key={kpi.id} className="flex items-center gap-3 py-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color.bg }}
              />
              <span className="text-[13px] text-brand-gray/50 flex-1 truncate">{kpi.label}</span>
              <span className="text-[13px] font-medium tabular-nums" style={{ color: color.bg }}>
                {currentValues[kpi.id] !== undefined && currentValues[kpi.id] !== null
                  ? `${currentValues[kpi.id]}${kpi.unit}`
                  : '--'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreRing({ sections, currentValues }) {
  const allKpis = [];
  sections.forEach(s => s.kpis.forEach(k => allKpis.push(k)));

  const statuses = allKpis.map(kpi => evaluateKpi(kpi, currentValues[kpi.id]));
  const green = statuses.filter(s => s === 'green').length;
  const yellow = statuses.filter(s => s === 'yellow').length;
  const red = statuses.filter(s => s === 'red').length;
  const filled = green + yellow + red;
  const score = filled > 0 ? Math.round((green / filled) * 100) : 0;

  const circumference = 2 * Math.PI * 52;
  const greenPct = filled > 0 ? (green / filled) : 0;
  const yellowPct = filled > 0 ? (yellow / filled) : 0;
  const redPct = filled > 0 ? (red / filled) : 0;

  // Score color
  let scoreColor = '#555';
  if (filled > 0) {
    if (score >= 70) scoreColor = '#22C55E';
    else if (score >= 40) scoreColor = '#F59E0B';
    else scoreColor = '#FF3333';
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 sm:w-48 sm:h-48">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Background track */}
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
          {/* Green segment */}
          <circle
            cx="60" cy="60" r="52" fill="none" stroke="#22C55E" strokeWidth="6"
            strokeDasharray={`${circumference * greenPct} ${circumference * (1 - greenPct)}`}
            strokeLinecap="round"
            className="transition-all duration-700"
            opacity="0.85"
          />
          {/* Yellow segment */}
          <circle
            cx="60" cy="60" r="52" fill="none" stroke="#F59E0B" strokeWidth="6"
            strokeDasharray={`${circumference * yellowPct} ${circumference * (1 - yellowPct)}`}
            strokeDashoffset={-circumference * greenPct}
            strokeLinecap="round"
            className="transition-all duration-700"
            opacity="0.85"
          />
          {/* Red segment */}
          {red > 0 && (
            <circle
              cx="60" cy="60" r="52" fill="none" stroke="#FF3333" strokeWidth="6"
              strokeDasharray={`${circumference * redPct} ${circumference * (1 - redPct)}`}
              strokeDashoffset={-circumference * (greenPct + yellowPct)}
              strokeLinecap="round"
              className="transition-all duration-700"
              opacity="0.85"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl sm:text-5xl font-display font-bold transition-colors duration-500"
            style={{ color: scoreColor }}
          >
            {filled > 0 ? score : '--'}
          </span>
          <span className="text-[11px] text-brand-gray/40 uppercase tracking-[0.2em] mt-1 font-medium">Score</span>
        </div>
      </div>

      <div className="flex items-center gap-5 mt-5 text-[13px]">
        <span className="flex items-center gap-2 text-brand-gray/50">
          <span className="w-2 h-2 rounded-full bg-green-500/80" /> {green} on track
        </span>
        <span className="flex items-center gap-2 text-brand-gray/50">
          <span className="w-2 h-2 rounded-full bg-yellow-500/80" /> {yellow} watch
        </span>
        <span className="flex items-center gap-2 text-brand-gray/50">
          <span className="w-2 h-2 rounded-full bg-red-500/80" /> {red} action
        </span>
      </div>
    </div>
  );
}

export default function DashboardView({ currentValues, entries }) {
  const allSections = [...SECTIONS.weekly, ...SECTIONS.monthly];
  const lastEntry = entries.length > 0 ? entries[0] : null;

  const redKpis = [];
  allSections.forEach(section => {
    section.kpis.forEach(kpi => {
      if (evaluateKpi(kpi, currentValues[kpi.id]) === 'red') {
        redKpis.push({ kpi, section });
      }
    });
  });
  SECTIONS.leading.kpis.forEach(kpi => {
    if (evaluateKpi(kpi, currentValues[kpi.id]) === 'red') {
      redKpis.push({ kpi, section: SECTIONS.leading });
    }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Score Ring */}
      <div className="bg-[#0D0D0D] rounded-2xl p-8 sm:p-10 border border-brand-blue/8">
        <ScoreRing sections={allSections} currentValues={currentValues} />
        {lastEntry && (
          <p className="text-center text-[12px] text-brand-gray/30 mt-6 tracking-wide">
            Last entry: {new Date(lastEntry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>

      {/* Action Required */}
      {redKpis.length > 0 && (
        <div className="bg-red-500/[0.03] border border-red-500/10 rounded-2xl p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-red-400/80 mb-5 flex items-center gap-2.5">
            <AlertTriangle size={16} />
            Action Required — {redKpis.length} KPI{redKpis.length > 1 ? 's' : ''}
          </h2>
          <div className="space-y-4">
            {redKpis.map(({ kpi }) => (
              <div key={kpi.id} className="pl-5 border-l-2 border-red-500/15">
                <p className="text-[15px] font-medium text-white/80">{kpi.label}</p>
                <p className="text-[13px] text-red-200/40 mt-1 leading-relaxed">{kpi.ifRed}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allSections.map(section => (
          <SectionSummary key={section.id} section={section} currentValues={currentValues} />
        ))}
      </div>

      {/* Leading Indicators */}
      <SectionSummary section={SECTIONS.leading} currentValues={currentValues} />

      {/* FFS Truth */}
      <div className="rounded-2xl p-6 sm:p-8 border border-white/[0.03] text-center bg-white/[0.01]">
        <p className="font-display text-[13px] uppercase tracking-[0.2em] text-brand-red/50 mb-3">The Core FFS Truth</p>
        <p className="text-[15px] text-brand-gray/40 leading-relaxed">
          FFS practices do not scale on volume.<br />
          They scale on <span className="text-white/60 font-semibold">clarity</span>, <span className="text-white/60 font-semibold">conviction</span>, and <span className="text-white/60 font-semibold">conversion</span>.
        </p>
      </div>
    </div>
  );
}
