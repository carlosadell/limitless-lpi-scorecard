import { useState, useCallback, useEffect } from 'react';
import { sheetsService } from '../services/googleSheets';

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
  const [syncing, setSyncing] = useState(false);

  // On mount: try to load from Google Sheets (if enabled)
  useEffect(() => {
    if (!sheetsService.isEnabled()) return;
    let cancelled = false;

    async function syncFromSheets() {
      setSyncing(true);
      const remote = await sheetsService.loadAll();
      if (remote && !cancelled) {
        const merged = {
          entries: remote.entries || [],
          currentWeek: remote.currentWeek || {},
        };
        // Only overwrite local if remote has data
        if (merged.entries.length > 0 || Object.keys(merged.currentWeek).length > 0) {
          setData(merged);
          saveData(merged);
        }
      }
      if (!cancelled) setSyncing(false);
    }

    syncFromSheets();
    return () => { cancelled = true; };
  }, []);

  const updateCurrentWeek = useCallback((kpiId, value) => {
    setData(prev => {
      const next = {
        ...prev,
        currentWeek: { ...prev.currentWeek, [kpiId]: value },
      };
      saveData(next);
      // Debounced sync to Google Sheets (fire and forget)
      if (sheetsService.isEnabled()) {
        sheetsService.saveCurrentWeek(next.currentWeek);
      }
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
      const next = {
        ...prev,
        entries: [entry, ...prev.entries],
      };
      saveData(next);
      // Sync to Google Sheets
      if (sheetsService.isEnabled()) {
        sheetsService.saveEntry(entry);
      }
      return next;
    });
  }, []);

  const clearCurrentWeek = useCallback(() => {
    setData(prev => {
      const next = { ...prev, currentWeek: {} };
      saveData(next);
      if (sheetsService.isEnabled()) {
        sheetsService.saveCurrentWeek({});
      }
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
      if (sheetsService.isEnabled()) {
        sheetsService.deleteEntry(entryId);
      }
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
    syncing,
    sheetsEnabled: sheetsService.isEnabled(),
  };
}
