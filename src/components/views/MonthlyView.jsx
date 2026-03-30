import { SECTIONS } from '../../data/kpiDefinitions';
import KpiInput from '../ui/KpiInput';
import SectionHeader from '../ui/SectionHeader';
import { Save } from 'lucide-react';

export default function MonthlyView({ currentValues, onUpdate, onSubmit }) {
  const sections = SECTIONS.monthly;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="rounded-2xl p-6 sm:p-8 border border-brand-blue/10 bg-gradient-to-br from-brand-blue/[0.04] to-transparent">
        <h2 className="font-display text-xl sm:text-2xl font-semibold uppercase tracking-wider text-white">
          Monthly Profit & Capacity
        </h2>
        <p className="text-[15px] text-brand-gray/50 mt-2 leading-relaxed max-w-xl">
          Reviewed 1st week of each month. This is where you protect your margin and measure leverage.
        </p>
      </div>

      {/* Monthly KPI Sections */}
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

      {/* Save Button */}
      <button
        onClick={() => onSubmit('monthly')}
        className="w-full py-4 bg-brand-red/90 hover:bg-brand-red text-white font-display text-base font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/15 flex items-center justify-center gap-2.5"
      >
        <Save size={18} strokeWidth={2} />
        Save Monthly Scorecard
      </button>

      {/* Bottom quote */}
      <div className="rounded-2xl p-6 sm:p-8 border border-white/[0.03] text-center bg-white/[0.01]">
        <p className="text-[15px] text-brand-gray/40 leading-relaxed">
          <span className="text-white/70 font-semibold">FFS excellence = margin discipline.</span><br />
          If overhead creeps past 60%, freedom disappears.
        </p>
      </div>
    </div>
  );
}
