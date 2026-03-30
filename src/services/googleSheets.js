// Google Sheets integration via Google Apps Script Web App (v3 — Multi-User with Passwords)

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

class GoogleSheetsService {
  constructor() {
    this.enabled = !!SCRIPT_URL;
    this.syncing = false;
  }

  isEnabled() {
    return this.enabled;
  }

  async _post(payload) {
    if (!this.enabled) return null;
    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) {
        return { error: data.error };
      }
      return data;
    } catch (err) {
      console.error('Google Sheets sync failed:', err);
      return { error: 'Connection failed. Please try again.' };
    }
  }

  // Sign up — creates a new user account
  async signup(email, name, password) {
    return this._post({ action: 'signup', email, name, password });
  }

  // Login — verifies email + password
  async login(email, password) {
    return this._post({ action: 'login', email, password });
  }

  // Load all entries + currentWeek for a specific user
  async loadAll(email) {
    return this._post({ action: 'load', email });
  }

  // Save an entry for a specific user
  async saveEntry(email, entry) {
    return this._post({ action: 'save', email, entry });
  }

  // Delete an entry for a specific user
  async deleteEntry(email, entryId) {
    return this._post({ action: 'delete', email, entryId });
  }

  // Save current week values for a specific user
  async saveCurrentWeek(email, currentWeek) {
    return this._post({ action: 'saveCurrent', email, data: currentWeek });
  }
}

export const sheetsService = new GoogleSheetsService();
