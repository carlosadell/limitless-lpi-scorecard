import { useState, useCallback, useEffect } from 'react';
import { sheetsService } from '../services/googleSheets';

const STORAGE_PREFIX = 'limitless-lpi-';

function getStorageKey(email) {
  return STORAGE_PREFIX + (email || 'anonymous');
}

function loadData(email) {
  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (!raw) return { entries: [], currentWeek: {} };
    return JSON.parse(raw);
  } catch {
    return { entries: [], currentWeek: {} };
  }
}

function saveData(email, data) {
  try {
    localStorage.setItem(getStorageKey(email), JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save LPI data:', e);
  }
}

export function useLpiData(userEmail) {
  const [data, setData] = useState(() => loadData(userEmail));
  const [syncing, setSyncing] = useState(false);

  // On mount or email change: try to load from Google Sheets (if enabled)
  useEffect(() => {
    if (!sheetsService.isEnabled() || !userEmail) return;
    let cancelled = false;

    async function syncFromSheets() {
      setSyncing(true);
      const remote = await sheetsService.loadAll(userEmail);
      if (remote && !cancelled) {
        const merged = {
          entries: remote.entries || [],
          currentWeek: remote.currentWeek || {},
        };
        // Only overwrite local if remote has data
        if (merged.entries.length > 0 || Object.keys(merged.currentWeek).length > 0) {
          setData(merged);
          saveData(userEmail, merged);
        }
      }
      if (!cancelled) setSyncing(false);
    }

    syncFromSheets();
    return () => { cancelled = true; };
  }, [userEmail]);

  const updateCurrentWeek = useCallback((kpiId, value) => {
    setData(prev => {
      const next = {
        ...prev,
        currentWeek: { ...prev.currentWeek, [kpiId]: value },
      };
      saveData(userEmail, next);
      // Sync to Google Sheets (fire and forget)
      if (sheetsService.isEnabled() && userEmail) {
        sheetsService.saveCurrentWeek(userEmail, next.currentWeek);
      }
      return next;
    });
  }, [userEmail]);

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
      saveData(userEmail, next);
      // Sync to Google Sheets
      if (sheetsService.isEnabled() && userEmail) {
        sheetsService.saveEntry(userEmail, entry);
      }
      return next;
    });
  }, [userEmail]);

  const clearCurrentWeek = useCallback(() => {
    setData(prev => {
      const next = { ...prev, currentWeek: {} };
      saveData(userEmail, next);
      if (sheetsService.isEnabled() && userEmail) {
        sheetsService.saveCurrentWeek(userEmail, {});
      }
      return next;
    });
  }, [userEmail]);

  const deleteEntry = useCallback((entryId) => {
    setData(prev => {
      const next = {
        ...prev,
        entries: prev.entries.filter(e => e.id !== entryId),
      };
      saveData(userEmail, next);
      if (sheetsService.isEnabled() && userEmail) {
        sheetsService.deleteEntry(userEmail, entryId);
      }
      return next;
    });
  }, [userEmail]);

  const resetAll = useCallback(() => {
    const fresh = { entries: [], currentWeek: {} };
    saveData(userEmail, fresh);
    setData(fresh);
  }, [userEmail]);

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
