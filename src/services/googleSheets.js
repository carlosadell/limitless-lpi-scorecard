// Google Sheets integration via Google Apps Script Web App
//
// HOW TO SET UP:
// 1. Create a Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Paste the Apps Script code (see /docs/apps-script.js)
// 4. Deploy as Web App (Execute as: Me, Access: Anyone)
// 5. Copy the deployment URL and set it below or in environment
//
// The Apps Script acts as a simple REST API:
//   POST /exec { action: 'save', entry: {...} }    → saves an entry
//   POST /exec { action: 'load' }                  → returns all entries
//   POST /exec { action: 'delete', entryId: '...'} → deletes an entry
//   POST /exec { action: 'saveCurrent', data: {} } → saves current week values

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
        headers: { 'Content-Type': 'text/plain' }, // Apps Script requires this for CORS
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) {
        console.error('Google Sheets error:', data.error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Google Sheets sync failed:', err);
      return null;
    }
  }

  async loadAll() {
    return this._post({ action: 'load' });
  }

  async saveEntry(entry) {
    return this._post({ action: 'save', entry });
  }

  async deleteEntry(entryId) {
    return this._post({ action: 'delete', entryId });
  }

  async saveCurrentWeek(currentWeek) {
    return this._post({ action: 'saveCurrent', data: currentWeek });
  }
}

export const sheetsService = new GoogleSheetsService();
