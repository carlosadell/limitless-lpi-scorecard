import { BarChart3, CalendarDays, CalendarCheck, History } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'weekly', label: 'Weekly', icon: CalendarDays },
  { id: 'monthly', label: 'Monthly', icon: CalendarCheck },
  { id: 'history', label: 'History', icon: History },
];

export default function Header({ activeView, setActiveView }) {
  return (
    <header className="sticky top-0 z-50 bg-brand-black/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/icon-192.png" alt="Limitless" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className="font-display text-xl font-bold tracking-wider uppercase text-white leading-none">
                LPI Scorecard
              </h1>
              <p className="text-xs text-brand-gray tracking-widest uppercase mt-0.5">
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
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'border-brand-red text-white'
                    : 'border-transparent text-brand-gray hover:text-white hover:border-brand-border'
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
