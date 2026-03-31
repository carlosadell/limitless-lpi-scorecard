import { BarChart3, CalendarDays, Calendar, CalendarCheck, History, LogOut, User } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'daily', label: 'Daily', icon: Calendar },
  { id: 'weekly', label: 'Weekly', icon: CalendarDays },
  { id: 'monthly', label: 'Monthly', icon: CalendarCheck },
  { id: 'history', label: 'History', icon: History },
];

export default function Header({ activeView, setActiveView, user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-[rgba(7,7,9,0.8)] backdrop-blur-xl border-b border-brand-border">
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

          {/* User Info + Logout */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 bg-brand-dark border border-brand-border rounded-xl px-3.5 py-2">
                <div className="w-7 h-7 rounded-full bg-brand-red/15 border border-brand-red/30 flex items-center justify-center">
                  <User size={14} className="text-brand-red" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-xs text-brand-gray leading-tight">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-9 h-9 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center text-brand-gray hover:text-white hover:border-brand-red/40 transition-all"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
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
