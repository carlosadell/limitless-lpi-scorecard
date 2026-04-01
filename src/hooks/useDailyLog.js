import { useState, useCallback, useEffect } from 'react';
import { sheetsService } from '../services/googleSheets';

const STORAGE_PREFIX = 'limitless-daily-';

// Get Monday of the current week (ISO week start)
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Format date as YYYY-MM-DD (local timezone)
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Get array of 7 day labels + dates for the current week
export function getWeekDays(weekStart) {
  const days = [];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    days.push({
      label: labels[i],
      date: formatDate(d),
      shortDate: `${d.getMonth() + 1}/${d.getDate()}`,
      isToday: formatDate(d) === formatDate(new Date()),
    });
  }
  return days;
}

function getStorageKey(email, weekId) {
  return `${STORAGE_PREFIX}${email || 'anonymous'}-${weekId}`;
}

/**
 * Daily log data structure:
 * {
 *   [kpiId]: {
 *     [dateString]: number | null
 *   }
 * }
 */
export function useDailyLog(userEmail) {
  const weekStart = getWeekStart();
  const weekId = formatDate(weekStart);

  const [dailyData, setDailyData] = useState(() => {
    try {
      const raw = localStorage.getItem(getStorageKey(userEmail, weekId));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [syncing, setSyncing] = useState(false);

  // Persist to localStorage
  const persist = useCallback((data) => {
    try {
      localStorage.setItem(getStorageKey(userEmail, weekId), JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save daily log:', e);
    }
  }, [userEmail, weekId]);

  // Load from Google Sheets on mount
  useEffect(() => {
    if (!sheetsService.isEnabled() || !userEmail) return;
    let cancelled = false;

    async function loadFromSheets() {
      setSyncing(true);
      const remote = await sheetsService.loadDaily(userEmail, weekId);
      if (remote && remote.dailyData && !cancelled) {
        if (Object.keys(remote.dailyData).length > 0) {
          setDailyData(remote.dailyData);
          persist(remote.dailyData);
        }
      }
      if (!cancelled) setSyncing(false);
    }

    loadFromSheets();
    return () => { cancelled = true; };
  }, [userEmail, weekId, persist]);

  // Update a single cell
  const updateDaily = useCallback((kpiId, dateStr, value) => {
    setDailyData(prev => {
      const next = {
        ...prev,
        [kpiId]: {
          ...(prev[kpiId] || {}),
          [dateStr]: value,
        },
      };
      persist(next);
      // Sync to Sheets
      if (sheetsService.isEnabled() && userEmail) {
        sheetsService.saveDaily(userEmail, weekId, next);
      }
      return next;
    });
  }, [userEmail, weekId, persist]);

  // Calculate weekly totals from daily data
  const getWeeklyTotals = useCallback(() => {
    const totals = {};
    for (const [kpiId, days] of Object.entries(dailyData)) {
      const values = Object.values(days).filter(v => v !== null && v !== undefined && v !== '');
      if (values.length > 0) {
        totals[kpiId] = values.reduce((sum, v) => sum + parseFloat(v), 0);
      }
    }
    return totals;
  }, [dailyData]);

  return {
    dailyData,
    weekId,
    weekStart,
    weekDays: getWeekDays(weekStart),
    updateDaily,
    getWeeklyTotals,
    syncing,
  };
}
