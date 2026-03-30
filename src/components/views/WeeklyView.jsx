import { SECTIONS } from '../../data/kpiDefinitions';
import KpiInput from '../ui/KpiInput';
import SectionHeader from '../ui/SectionHeader';
import { Save, ClipboardList, ArrowDown, Calendar } from 'lucide-react';

export default function WeeklyView({ currentValues, onUpdate, onSubmit, dailyTotals, onApplyDailyTotals }) {
  const sections = SECTIONS.weekly;
  const hasDailyData = dailyTotals && Object.keys(dailyTotals).length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="bg-brand-card rounded-2xl p-6 sm:p-8 border border-brand-border border-l-4 border-l-brand-red">
        <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
          Weekly CEO Scorecard
        </h2>
        <p className="text-base text-brand-lightGray mt-2">
          Review every Monday in 15 minutes. Control the week before it controls you.
        </p>
      </div>

      {/* Daily totals banner */}
      {hasDailyData && (
        <button
          onClick={onApplyDailyTotals}
          className="w-full bg-brand-red/10 hover:bg-brand-red/15 border border-brand-red/30 rounded-xl px-5 py-4 flex items-center gap-3 transition-all duration-200 group"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-red/20 flex items-center justify-center flex-shrink-0">
            <Calendar size={18} className="text-brand-red" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-white">Daily Log Totals Available</p>
            <p className="text-xs text-brand-gray mt-0.5">
              {Object.keys(dailyTotals).length} KPI{Object.keys(dailyTotals).length !== 1 ? 's' : ''} tracked this week — tap to update values
            </p>
          </div>
          <ArrowDown size={16} className="text-brand-red group-hover:translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Weekly KPI Sections */}
      {sections.map(section => (
        <div key={section.id} className="space-y-4">
          <SectionHeader section={section} />
          <div className="space-y-3">
            {section.kpis.map(kpi => (
              <KpiInput key={kpi.id} kpi={kpi} value={currentValues[kpi.id]} onChange={onUpdate} />
            ))}
          </div>
        </div>
      ))}

      {/* Leading Indicators */}
      <div className="space-y-4">
        <SectionHeader section={SECTIONS.leading} />
        <div className="space-y-3">
          {SECTIONS.leading.kpis.map(kpi => (
            <KpiInput key={kpi.id} kpi={kpi} value={currentValues[kpi.id]} onChange={onUpdate} />
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={() => onSubmit('weekly')}
        className="w-full py-4 bg-brand-red hover:bg-brand-redGlow text-white font-display text-base font-bold uppercase tracking-wider rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2.5"
      >
        <Save size={18} strokeWidth={2.5} />
        Save Weekly Scorecard
      </button>

      {/* Meeting Agenda */}
      <div className="bg-brand-card rounded-2xl p-6 sm:p-8 border border-brand-red/20">
        <div className="flex items-center gap-2.5 mb-4">
          <ClipboardList size={18} className="text-brand-red" />
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-brand-red">
            15-Min Weekly Meeting Agenda
          </h3>
        </div>
        <div className="space-y-3 text-base text-brand-lightGray">
          <p><span className="text-white font-bold">1.</span> What's red?</p>
          <p><span className="text-white font-bold">2.</span> What's leaking this week (schedule, conversion, hygiene)?</p>
          <p><span className="text-white font-bold">3.</span> One action to fix it before Friday</p>
          <p><span className="text-white font-bold">4.</span> Who owns it?</p>
        </div>
        <p className="mt-4 text-sm text-brand-gray italic">That's it. No drama. No spreadsheets spiraling into hell.</p>
      </div>
    </div>
  );
}
