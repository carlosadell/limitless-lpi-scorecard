import { useState, useCallback } from 'react';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import DashboardView from './components/views/DashboardView';
import WeeklyView from './components/views/WeeklyView';
import MonthlyView from './components/views/MonthlyView';
import HistoryView from './components/views/HistoryView';
import AuthScreen from './components/views/AuthScreen';
import { useLpiData } from './hooks/useLpiData';
import { sheetsService } from './services/googleSheets';
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
  const [activeView, setActiveView] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const {
    entries,
    currentWeek,
    updateCurrentWeek,
    submitEntry,
    deleteEntry,
  } = useLpiData(user?.email);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleLogin = useCallback(async ({ name, email }) => {
    setAuthLoading(true);
    try {
      // Try to register/login via Google Sheets
      if (sheetsService.isEnabled()) {
        const result = await sheetsService.login(email, name);
        if (result && result.success) {
          const userData = { name: result.user.name, email: result.user.email };
          setUser(userData);
          saveUser(userData);
          setAuthLoading(false);
          return;
        }
      }
      // Fallback: just store locally
      const userData = { name, email };
      setUser(userData);
      saveUser(userData);
    } catch (err) {
      console.error('Login error:', err);
      // Fallback to local
      const userData = { name, email };
      setUser(userData);
      saveUser(userData);
    }
    setAuthLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    saveUser(null);
    setActiveView('dashboard');
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

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen onLogin={handleLogin} loading={authLoading} />;
  }

  return (
    <div className="min-h-screen bg-brand-black flex flex-col">
      <Header activeView={activeView} setActiveView={setActiveView} user={user} onLogout={handleLogout} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-8">
        {activeView === 'dashboard' && (
          <DashboardView currentValues={currentWeek} entries={entries} user={user} />
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
