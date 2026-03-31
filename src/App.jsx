import { useState, useCallback, useEffect } from 'react';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import DashboardView from './components/views/DashboardView';
import DailyView from './components/views/DailyView';
import WeeklyView from './components/views/WeeklyView';
import MonthlyView from './components/views/MonthlyView';
import HistoryView from './components/views/HistoryView';
import AuthScreen from './components/views/AuthScreen';
import { useLpiData } from './hooks/useLpiData';
import { useDailyLog } from './hooks/useDailyLog';
import { sheetsService } from './services/googleSheets';
import PromoPopup from './components/ui/PromoPopup';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const AUTH_KEY = 'limitless-lpi-user';

function loadUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export default function App() {
  const [user, setUser] = useState(loadUser);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const {
    entries,
    currentWeek,
    updateCurrentWeek,
    submitEntry,
    deleteEntry,
  } = useLpiData(user?.email);

  const {
    dailyData,
    weekDays,
    weekId,
    updateDaily,
    getWeeklyTotals,
  } = useDailyLog(user?.email);

  // When switching to Weekly view, pre-fill from daily totals
  const dailyTotals = getWeeklyTotals();

  // Auto-populate weekly fields from daily totals when they change
  useEffect(() => {
    if (!user?.email) return;
    const totals = dailyTotals;
    for (const [kpiId, total] of Object.entries(totals)) {
      // Only pre-fill if the user hasn't manually entered a value in the weekly view
      if (currentWeek[kpiId] === undefined || currentWeek[kpiId] === null) {
        updateCurrentWeek(kpiId, total);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekId]); // Only run when week changes, not on every daily update

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleLogin = useCallback(async ({ name, email, password, isSignUp }) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      if (sheetsService.isEnabled()) {
        let result;
        if (isSignUp) {
          result = await sheetsService.signup(email, name, password);
        } else {
          result = await sheetsService.login(email, password);
        }

        if (result && result.error) {
          setAuthError(result.error);
          setAuthLoading(false);
          return;
        }

        if (result && result.success) {
          const userData = { name: result.user.name, email: result.user.email };
          setUser(userData);
          saveUser(userData);
          setAuthLoading(false);
          return;
        }

        setAuthError('Something went wrong. Please try again.');
        setAuthLoading(false);
        return;
      }

      const userData = { name: name || email.split('@')[0], email };
      setUser(userData);
      saveUser(userData);
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('Connection failed. Please try again.');
    }
    setAuthLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    saveUser(null);
    setActiveView('dashboard');
    setAuthError('');
  }, []);

  const handleSubmit = useCallback((cadence) => {
    const filled = Object.values(currentWeek).filter(v => v !== null && v !== undefined).length;
    if (filled === 0) {
      showToast('Enter at least one KPI value before saving.', 'error');
      return;
    }
    submitEntry(cadence);
    showToast(`${cadence === 'weekly' ? 'Weekly' : 'Monthly'} scorecard saved!`);
    setActiveView('dashboard');
  }, [currentWeek, submitEntry, showToast]);

  // Apply daily totals to weekly (user-triggered from Daily view or Weekly view)
  const applyDailyTotals = useCallback(() => {
    const totals = getWeeklyTotals();
    for (const [kpiId, total] of Object.entries(totals)) {
      updateCurrentWeek(kpiId, total);
    }
    showToast('Daily totals applied to weekly scorecard!');
  }, [getWeeklyTotals, updateCurrentWeek, showToast]);

  if (!user) {
    return <AuthScreen onLogin={handleLogin} loading={authLoading} error={authError} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeView={activeView} setActiveView={setActiveView} user={user} onLogout={handleLogout} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-8">
        {activeView === 'dashboard' && (
          <DashboardView currentValues={currentWeek} entries={entries} user={user} />
        )}
        {activeView === 'daily' && (
          <DailyView
            dailyData={dailyData}
            weekDays={weekDays}
            weekId={weekId}
            onUpdateDaily={updateDaily}
            onGoToWeekly={() => {
              applyDailyTotals();
              setActiveView('weekly');
            }}
          />
        )}
        {activeView === 'weekly' && (
          <WeeklyView
            currentValues={currentWeek}
            onUpdate={updateCurrentWeek}
            onSubmit={handleSubmit}
            dailyTotals={dailyTotals}
            onApplyDailyTotals={applyDailyTotals}
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

      {/* Promo Popup */}
      <PromoPopup />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-brand-card border border-brand-border rounded-xl px-5 py-3 shadow-xl flex items-center gap-2.5">
            {toast.type === 'error'
              ? <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              : <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
            }
            <p className="text-sm text-white font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
