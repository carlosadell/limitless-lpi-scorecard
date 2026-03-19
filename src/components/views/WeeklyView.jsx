import { SECTIONS } from '../../data/kpiDefinitions';
import KpiInput from '../ui/KpiInput';

export default function WeeklyView({ currentValues, onUpdate, onSubmit }) {
  const sections = SECTIONS.weekly;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-brand-card rounded-2xl p-6 sm:p-8 border border-brand-border border-l-4 border-l-brand-blue/60">
        <h2 className="font-display text-xl sm:text-2xl font-semibold uppercase tracking-wide text-white">
          Weekly CEO Scorecard
        </h2>
        <p className="text-base text-brand-gray mt-2">
          Review every Monday. Control the week before it controls you.
        </p>
      </div>

      {sections.map(section => (
        <div key={section.id} className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <span className="text-2xl">{section.icon}</span>
            <div>
              <h3 className="font-display text-base font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h3>
              <p className="text-xs text-brand-gray uppercase tracking-widest mt-0.5">{section.subtitle}</p>
            </div>
          </div>
          <div className="space-y-3">
            {section.kpis.map(kpi => (
              <KpiInput key={kpi.id} kpi={kpi} value={currentValues[kpi.id]} onChange={onUpdate} />
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <span className="text-2xl">{SECTIONS.leading.icon}</span>
          <div>
            <h3 className="font-display text-base font-semibold uppercase tracking-wider text-white">
              {SECTIONS.leading.title}
            </h3>
            <p className="text-xs text-brand-gray uppercase tracking-widest mt-0.5">{SECTIONS.leading.subtitle}</p>
          </div>
        </div>
        <div className="space-y-3">
          {SECTIONS.leading.kpis.map(kpi => (
            <KpiInput key={kpi.id} kpi={kpi} value={currentValues[kpi.id]} onChange={onUpdate} />
          ))}
        </div>
      </div>

      <button
        onClick={() => onSubmit('weekly')}
        className="w-full py-4 bg-brand-red hover:bg-brand-redGlow text-white font-display text-base font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20"
      >
        Save Weekly Scorecard
      </button>

      <div className="bg-brand-card rounded-2xl p-6 sm:p-8 border border-brand-blue/15">
        <h3 className="font-display text-base font-semibold uppercase tracking-wider text-brand-blue mb-4">
          15-Min Weekly Meeting Agenda
        </h3>
        <div className="space-y-3 text-base text-brand-gray">
          <p>1. What's red?</p>
          <p>2. What's leaking this week (schedule, conversion, hygiene)?</p>
          <p>3. One action to fix it before Friday</p>
          <p>4. Who owns it?</p>
        </div>
        <p className="mt-4 text-sm text-brand-gray/60 italic">That's it. No drama. No spreadsheets spiraling into hell.</p>
      </div>
    </div>
  );
}
