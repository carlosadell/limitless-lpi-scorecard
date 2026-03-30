/**
 * LPI Scorecard — Google Apps Script Backend
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet (this will store all LPI data)
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click Deploy > New Deployment
 * 5. Choose "Web app" as the type
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone" (or "Anyone with Google Account" for auth)
 * 8. Click Deploy and copy the Web App URL
 * 9. Add that URL to your .env file as VITE_GOOGLE_SCRIPT_URL
 *
 * SHEET STRUCTURE (auto-created):
 * Sheet "Entries" — columns: id | date | cadence | values (JSON string)
 * Sheet "Current" — columns: key | value (stores current week KPI values)
 */

const ENTRIES_SHEET = 'Entries';
const CURRENT_SHEET = 'Current';

function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === ENTRIES_SHEET) {
      sheet.appendRow(['id', 'date', 'cadence', 'values']);
    } else if (name === CURRENT_SHEET) {
      sheet.appendRow(['key', 'value']);
    }
  }
  return sheet;
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    if (action === 'load') {
      return handleLoad();
    } else if (action === 'save') {
      return handleSave(body.entry);
    } else if (action === 'delete') {
      return handleDelete(body.entryId);
    } else if (action === 'saveCurrent') {
      return handleSaveCurrent(body.data);
    }

    return jsonResponse({ error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

function doGet(e) {
  return handleLoad();
}

function handleLoad() {
  const entriesSheet = getOrCreateSheet(ENTRIES_SHEET);
  const currentSheet = getOrCreateSheet(CURRENT_SHEET);

  // Load entries
  const entriesData = entriesSheet.getDataRange().getValues();
  const entries = [];
  for (let i = 1; i < entriesData.length; i++) {
    const row = entriesData[i];
    if (row[0]) {
      entries.push({
        id: String(row[0]),
        date: row[1],
        cadence: row[2],
        values: JSON.parse(row[3] || '{}'),
      });
    }
  }

  // Load current week
  const currentData = currentSheet.getDataRange().getValues();
  const currentWeek = {};
  for (let i = 1; i < currentData.length; i++) {
    const row = currentData[i];
    if (row[0]) {
      currentWeek[row[0]] = row[1] === '' ? null : Number(row[1]);
    }
  }

  // Return newest first
  entries.reverse();

  return jsonResponse({ entries, currentWeek });
}

function handleSave(entry) {
  const sheet = getOrCreateSheet(ENTRIES_SHEET);
  sheet.appendRow([
    entry.id,
    entry.date,
    entry.cadence,
    JSON.stringify(entry.values),
  ]);
  return jsonResponse({ success: true });
}

function handleDelete(entryId) {
  const sheet = getOrCreateSheet(ENTRIES_SHEET);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(entryId)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  return jsonResponse({ success: true });
}

function handleSaveCurrent(data) {
  const sheet = getOrCreateSheet(CURRENT_SHEET);
  sheet.clear();
  sheet.appendRow(['key', 'value']);

  const keys = Object.keys(data || {});
  for (const key of keys) {
    const val = data[key];
    if (val !== null && val !== undefined) {
      sheet.appendRow([key, val]);
    }
  }
  return jsonResponse({ success: true });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
