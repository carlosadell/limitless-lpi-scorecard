import { SECTIONS, evaluateKpi, STATUS_COLORS } from '../../data/kpiDefinitions';
import StatusBadge from '../ui/StatusBadge';

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

  return (
    <div className="bg-brand-card rounded-2xl p-5 sm:p-6 border border-brand-border hover:border-brand-blue/30 hover:shadow-[0_0_20px_rgba(45,156,219,0.06)] transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <div>
            <h3 className="text-base font-semibold text-white">{section.title}</h3>
            <p className="text-xs text-brand-gray uppercase tracking-wider mt-0.5">{section.subtitle}</p>
          </div>
        </div>
        <StatusBadge status={overallStatus} size="lg" />
      </div>

      <div className="space-y-2.5">
        {section.kpis.map(kpi => {
          const st = evaluateKpi(kpi, currentValues[kpi.id]);
          const color = STATUS_COLORS[st];
          return (
            <div key={kpi.id} className="flex items-center gap-3 py-1">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color.bg }}
              />
              <span className="text-sm text-brand-gray flex-1">{kpi.label}</span>
              <span className="text-sm font-medium" style={{ color: color.bg }}>
                {currentValues[kpi.id] !== undefined && currentValues[kpi.id] !== null
                  ? `${currentValues[kpi.id]}${kpi.unit}`
                  : '—'}
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

  const circumference = 2 * Math.PI * 54;
  const greenPct = filled > 0 ? (green / filled) : 0;
  const yellowPct = filled > 0 ? (yellow / filled) : 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 score-ring-glow">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#2A2A2A" strokeWidth="7" />
          <circle
            cx="60" cy="60" r="54" fill="none" stroke="#22C55E" strokeWidth="7"
            strokeDasharray={`${circumference * greenPct} ${circumference * (1 - greenPct)}`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
          <circle
            cx="60" cy="60" r="54" fill="none" stroke="#F59E0B" strokeWidth="7"
            strokeDasharray={`${circumference * yellowPct} ${circumference * (1 - yellowPct)}`}
            strokeDashoffset={-circumference * greenPct}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
          {red > 0 && (
            <circle
              cx="60" cy="60" r="54" fill="none" stroke="#FF3333" strokeWidth="7"
              strokeDasharray={`${circumference * (red / filled)} ${circumference * (1 - red / filled)}`}
              strokeDashoffset={-circumference * (greenPct + yellowPct)}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-display font-bold text-white">{filled > 0 ? score : '—'}</span>
          <span className="text-xs text-brand-gray uppercase tracking-widest mt-1">Score</span>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> {green} green
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> {yellow} watch
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> {red} red
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
      <div className="bg-brand-card rounded-2xl p-8 sm:p-10 border border-brand-blue/20 glow-blue">
        <ScoreRing sections={allSections} currentValues={currentValues} />
        {lastEntry && (
          <p className="text-center text-xs text-brand-gray mt-5">
            Last entry: {new Date(lastEntry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>

      {/* Action Required */}
      {redKpis.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          <h2 className="font-display text-base font-semibold uppercase tracking-wider text-red-400 mb-4 flex items-center gap-2">
            <span className="pulse-red inline-block w-3 h-3 rounded-full bg-red-500" />
            Action Required — {redKpis.length} KPI{redKpis.length > 1 ? 's' : ''}
          </h2>
          <div className="space-y-4">
            {redKpis.map(({ kpi }) => (
              <div key={kpi.id} className="pl-5 border-l-2 border-red-500/30">
                <p className="text-base font-medium text-white">{kpi.label}</p>
                <p className="text-sm text-red-200/70 mt-1 leading-relaxed">{kpi.ifRed}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section cards — 3 columns on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allSections.map(section => (
          <SectionSummary key={section.id} section={section} currentValues={currentValues} />
        ))}
      </div>

      {/* Leading Indicators */}
      <SectionSummary section={SECTIONS.leading} currentValues={currentValues} />

      {/* FFS Truth */}
      <div className="bg-brand-card rounded-2xl p-6 sm:p-8 border border-brand-border text-center">
        <p className="font-display text-base uppercase tracking-widest text-brand-red mb-3">The Core FFS Truth</p>
        <p className="text-base text-brand-gray leading-relaxed">
          FFS practices do not scale on volume.<br />
          They scale on <span className="text-white font-semibold">clarity</span>, <span className="text-white font-semibold">conviction</span>, and <span className="text-white font-semibold">conversion</span>.
        </p>
      </div>
    </div>
  );
}
