export default function Header({ activeView, setActiveView }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'history', label: 'History' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-black/95 backdrop-blur-md border-b border-brand-blue/15">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/icon-192.png" alt="Limitless" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className="font-display text-xl font-semibold tracking-wide uppercase text-white leading-none">
                LPI Scorecard
              </h1>
              <p className="text-xs text-brand-gray tracking-widest uppercase mt-0.5">
                Limitless Performance Indicators
              </p>
            </div>
          </div>
        </div>

        <nav className="flex gap-0 -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeView === tab.id
                  ? 'border-brand-red text-white'
                  : 'border-transparent text-brand-gray hover:text-white hover:border-brand-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
