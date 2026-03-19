import { useState, useCallback } from 'react';

const STORAGE_KEY = 'limitless-lpi-data';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [], currentWeek: {} };
    return JSON.parse(raw);
  } catch {
    return { entries: [], currentWeek: {} };
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save LPI data:', e);
  }
}

export function useLpiData() {
  const [data, setData] = useState(loadData);

  const updateCurrentWeek = useCallback((kpiId, value) => {
    setData(prev => {
      const next = {
        ...prev,
        currentWeek: { ...prev.currentWeek, [kpiId]: value },
      };
      saveData(next);
      return next;
    });
  }, []);

  const submitEntry = useCallback((cadence) => {
    setData(prev => {
      const entry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        cadence,
        values: { ...prev.currentWeek },
      };
      // Only include KPIs relevant to this cadence
      const next = {
        ...prev,
        entries: [entry, ...prev.entries],
        // Don't clear — keep values for the other cadence
      };
      saveData(next);
      return next;
    });
  }, []);

  const clearCurrentWeek = useCallback(() => {
    setData(prev => {
      const next = { ...prev, currentWeek: {} };
      saveData(next);
      return next;
    });
  }, []);

  const deleteEntry = useCallback((entryId) => {
    setData(prev => {
      const next = {
        ...prev,
        entries: prev.entries.filter(e => e.id !== entryId),
      };
      saveData(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    const fresh = { entries: [], currentWeek: {} };
    saveData(fresh);
    setData(fresh);
  }, []);

  return {
    entries: data.entries,
    currentWeek: data.currentWeek,
    updateCurrentWeek,
    submitEntry,
    clearCurrentWeek,
    deleteEntry,
    resetAll,
  };
}
