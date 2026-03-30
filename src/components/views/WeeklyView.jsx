import { SECTIONS } from '../../data/kpiDefinitions';
import KpiInput from '../ui/KpiInput';
import SectionHeader from '../ui/SectionHeader';
import { Save, ClipboardList } from 'lucide-react';

export default function WeeklyView({ currentValues, onUpdate, onSubmit }) {
  const sections = SECTIONS.weekly;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="rounded-2xl p-6 sm:p-8 border border-brand-blue/10 bg-gradient-to-br from-brand-blue/[0.04] to-transparent">
        <h2 className="font-display text-xl sm:text-2xl font-semibold uppercase tracking-wider text-white">
          Weekly CEO Scorecard
        </h2>
        <p className="text-[15px] text-brand-gray/50 mt-2 leading-relaxed max-w-xl">
          Review every Monday in 15 minutes. Control the week before it controls you.
        </p>
      </div>

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
        className="w-full py-4 bg-brand-red/90 hover:bg-brand-red text-white font-display text-base font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/15 flex items-center justify-center gap-2.5"
      >
        <Save size={18} strokeWidth={2} />
        Save Weekly Scorecard
      </button>

      {/* Meeting Agenda */}
      <div className="rounded-2xl p-6 sm:p-8 border border-brand-blue/8 bg-brand-blue/[0.02]">
        <div className="flex items-center gap-2.5 mb-5">
          <ClipboardList size={18} className="text-brand-blue/60" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-blue/70">
            15-Min Weekly Meeting Agenda
          </h3>
        </div>
        <div className="space-y-3 text-[15px] text-brand-gray/50">
          <p><span className="text-white/60 font-medium">1.</span> What's red?</p>
          <p><span className="text-white/60 font-medium">2.</span> What's leaking this week (schedule, conversion, hygiene)?</p>
          <p><span className="text-white/60 font-medium">3.</span> One action to fix it before Friday</p>
          <p><span className="text-white/60 font-medium">4.</span> Who owns it?</p>
        </div>
        <p className="mt-5 text-[13px] text-brand-gray/30 italic">That's it. No drama. No spreadsheets spiraling into hell.</p>
      </div>
    </div>
  );
}
