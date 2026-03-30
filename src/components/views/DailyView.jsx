import { SECTIONS } from '../../data/kpiDefinitions';
import SectionHeader from '../ui/SectionHeader';
import { CalendarDays, ArrowRight, TrendingUp } from 'lucide-react';

function DailyKpiRow({ kpi, dayEntries, weekDays, onUpdate }) {
  const values = weekDays.map(d => dayEntries?.[d.date] ?? null);
  const filled = values.filter(v => v !== null && v !== undefined && v !== '');
  const total = filled.length > 0 ? filled.reduce((s, v) => s + parseFloat(v), 0) : null;

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl p-4 animate-fade-in">
      {/* KPI label + weekly total */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-white leading-snug flex-1 min-w-0 pr-3">{kpi.label}</p>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[10px] text-brand-gray uppercase tracking-wider font-bold">Week</span>
          <span className={`text-sm font-bold tabular-nums ${total !== null ? 'text-brand-red' : 'text-brand-gray/40'}`}>
            {total !== null ? `${Math.round(total * 100) / 100}${kpi.unit}` : '—'}
          </span>
        </div>
      </div>

      {/* Day inputs grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day) => {
          const val = dayEntries?.[day.date] ?? '';
          return (
            <div key={day.date} className="flex flex-col items-center gap-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${day.isToday ? 'text-brand-red' : 'text-brand-gray'}`}>
                {day.label}
              </span>
              <input
                type="number"
                value={val === null ? '' : val}
                onChange={(e) => {
                  const v = e.target.value === '' ? null : parseFloat(e.target.value);
                  onUpdate(kpi.id, day.date, v);
                }}
                placeholder="–"
                className={`w-full text-center bg-brand-dark border rounded-lg px-1 py-2 text-sm font-medium text-white focus:outline-none focus:border-brand-red transition-colors placeholder:text-brand-gray/30 tabular-nums ${
                  day.isToday ? 'border-brand-red/40' : 'border-brand-border'
                }`}
                step="any"
              />
              <span className="text-[9px] text-brand-gray/50">{day.shortDate}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyTotalsSummary({ dailyData, weekDays }) {
  const allKpis = [];
  SECTIONS.weekly.forEach(s => s.kpis.forEach(k => allKpis.push(k)));
  SECTIONS.leading.kpis.forEach(k => allKpis.push(k));

  const totals = {};
  for (const kpi of allKpis) {
    const dayEntries = dailyData[kpi.id] || {};
    const values = weekDays.map(d => dayEntries[d.date]).filter(v => v !== null && v !== undefined && v !== '');
    if (values.length > 0) {
      totals[kpi.id] = {
        total: Math.round(values.reduce((s, v) => s + parseFloat(v), 0) * 100) / 100,
        daysLogged: values.length,
        label: kpi.label,
        unit: kpi.unit,
      };
    }
  }

  const entries = Object.values(totals);
  if (entries.length === 0) return null;

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <TrendingUp size={16} className="text-brand-red" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Running Totals</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {entries.map((item) => (
          <div key={item.label} className="bg-brand-dark rounded-xl px-3 py-2.5 border border-brand-border">
            <p className="text-xs text-brand-gray truncate">{item.label}</p>
            <p className="text-lg font-bold text-white tabular-nums mt-0.5">
              {item.total}{item.unit}
            </p>
            <p className="text-[10px] text-brand-gray/60">{item.daysLogged} day{item.daysLogged !== 1 ? 's' : ''} logged</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DailyView({ dailyData, weekDays, weekId, onUpdateDaily, onGoToWeekly }) {
  const sections = SECTIONS.weekly;

  // Format week range for display
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="bg-brand-card rounded-2xl p-6 sm:p-8 border border-brand-border border-l-4 border-l-brand-red">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-white flex items-center gap-2.5">
              <CalendarDays size={22} className="text-brand-red" />
              Daily Log
            </h2>
            <p className="text-base text-brand-lightGray mt-2">
              Log your numbers every day. Totals flow into your weekly scorecard.
            </p>
            <p className="text-sm text-brand-gray mt-1">
              Week of {weekStart.shortDate} — {weekEnd.shortDate}
            </p>
          </div>
        </div>
      </div>

      {/* Running totals summary */}
      <WeeklyTotalsSummary dailyData={dailyData} weekDays={weekDays} />

      {/* Daily KPI Sections */}
      {sections.map(section => (
        <div key={section.id} className="space-y-3">
          <SectionHeader section={section} />
          {section.kpis.map(kpi => (
            <DailyKpiRow
              key={kpi.id}
              kpi={kpi}
              dayEntries={dailyData[kpi.id] || {}}
              weekDays={weekDays}
              onUpdate={onUpdateDaily}
            />
          ))}
        </div>
      ))}

      {/* Leading Indicators */}
      <div className="space-y-3">
        <SectionHeader section={SECTIONS.leading} />
        {SECTIONS.leading.kpis.map(kpi => (
          <DailyKpiRow
            key={kpi.id}
            kpi={kpi}
            dayEntries={dailyData[kpi.id] || {}}
            weekDays={weekDays}
            onUpdate={onUpdateDaily}
          />
        ))}
      </div>

      {/* Go to Weekly */}
      <button
        onClick={onGoToWeekly}
        className="w-full py-4 bg-brand-dark hover:bg-brand-card border border-brand-border hover:border-brand-red/40 text-white font-display text-base font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5"
      >
        <ArrowRight size={18} strokeWidth={2.5} />
        Review & Submit Weekly Scorecard
      </button>
    </div>
  );
}
