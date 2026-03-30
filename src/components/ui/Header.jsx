import { BarChart3, CalendarDays, CalendarCheck, History } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'weekly', label: 'Weekly', icon: CalendarDays },
  { id: 'monthly', label: 'Monthly', icon: CalendarCheck },
  { id: 'history', label: 'History', icon: History },
];

export default function Header({ activeView, setActiveView }) {
  return (
    <header className="sticky top-0 z-50 bg-brand-black/90 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-5 pb-0">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3.5">
            <img src="/icon-192.png" alt="Limitless" className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/[0.06]" />
            <div>
              <h1 className="font-display text-xl font-semibold tracking-wider uppercase text-white leading-none">
                LPI Scorecard
              </h1>
              <p className="text-[11px] text-brand-gray/50 tracking-[0.2em] uppercase mt-1 font-medium">
                Limitless Performance Indicators
              </p>
            </div>
          </div>
        </div>

        <nav className="flex gap-0 -mb-px">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'border-brand-red text-white'
                    : 'border-transparent text-brand-gray/50 hover:text-white/70 hover:border-white/[0.06]'
                }`}
              >
                <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
