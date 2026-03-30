import { useState, useCallback } from 'react';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import DashboardView from './components/views/DashboardView';
import WeeklyView from './components/views/WeeklyView';
import MonthlyView from './components/views/MonthlyView';
import HistoryView from './components/views/HistoryView';
import { useLpiData } from './hooks/useLpiData';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const {
    entries,
    currentWeek,
    updateCurrentWeek,
    submitEntry,
    deleteEntry,
  } = useLpiData();

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSubmit = useCallback((cadence) => {
    const filled = Object.values(currentWeek).filter(v => v !== null && v !== undefined).length;
    if (filled === 0) {
      showToast('Enter at least one KPI value before saving.', 'error');
      return;
    }
    submitEntry(cadence);
    showToast(`${cadence === 'weekly' ? 'Weekly' : 'Monthly'} scorecard saved.`);
    setActiveView('dashboard');
  }, [currentWeek, submitEntry, showToast]);

  return (
    <div className="min-h-screen bg-brand-black flex flex-col">
      <Header activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-8">
        {activeView === 'dashboard' && (
          <DashboardView currentValues={currentWeek} entries={entries} />
        )}
        {activeView === 'weekly' && (
          <WeeklyView
            currentValues={currentWeek}
            onUpdate={updateCurrentWeek}
            onSubmit={handleSubmit}
          />
        )}
        {activeView === 'monthly' && (
          <MonthlyView
            currentValues={currentWeek}
            onUpdate={updateCurrentWeek}
            onSubmit={handleSubmit}
          />
        )}
        {activeView === 'history' && (
          <HistoryView entries={entries} onDelete={deleteEntry} />
        )}
      </main>

      <Footer />

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-[#111111] border border-white/[0.06] rounded-xl px-5 py-3 shadow-2xl shadow-black/50 flex items-center gap-2.5">
            {toast.type === 'error'
              ? <AlertCircle size={16} className="text-red-400/70 flex-shrink-0" />
              : <CheckCircle2 size={16} className="text-green-400/70 flex-shrink-0" />
            }
            <p className="text-[13px] text-white/70 font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
