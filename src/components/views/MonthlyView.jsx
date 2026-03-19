import { SECTIONS } from '../../data/kpiDefinitions';
import KpiInput from '../ui/KpiInput';

export default function MonthlyView({ currentValues, onUpdate, onSubmit }) {
  const sections = SECTIONS.monthly;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-brand-card rounded-2xl p-6 sm:p-8 border border-brand-border border-l-4 border-l-brand-blue/60">
        <h2 className="font-display text-xl sm:text-2xl font-semibold uppercase tracking-wide text-white">
          Monthly Profit & Capacity
        </h2>
        <p className="text-base text-brand-gray mt-2">
          Reviewed 1st week of each month. Protect your margin.
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

      <button
        onClick={() => onSubmit('monthly')}
        className="w-full py-4 bg-brand-red hover:bg-brand-redGlow text-white font-display text-base font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20"
      >
        Save Monthly Scorecard
      </button>

      <div className="bg-brand-card rounded-2xl p-6 sm:p-8 border border-brand-border text-center">
        <p className="text-base text-brand-gray leading-relaxed">
          <span className="text-white font-semibold">FFS excellence = margin discipline.</span><br />
          If overhead creeps past 60%, freedom disappears.
        </p>
      </div>
    </div>
  );
}
