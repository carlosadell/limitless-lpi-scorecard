/**
 * LPI Scorecard — Google Apps Script Backend (v3 — Multi-User with Passwords)
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your existing LPI Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete ALL existing code and paste this entire file
 * 4. Click Deploy > Manage Deployments > Edit (pencil icon)
 * 5. Set version to "New version" and click Deploy
 *    (This updates the existing Web App URL — no need to change anything in Vercel)
 *
 * SHEET STRUCTURE (auto-created):
 * Sheet "Users"   — columns: email | name | password | createdAt | lastLogin
 * Sheet "Entries" — columns: email | id | date | cadence | values (JSON string)
 * Sheet "Current" — columns: email | key | value
 */

const USERS_SHEET = 'Users';
const ENTRIES_SHEET = 'Entries';
const CURRENT_SHEET = 'Current';

function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === USERS_SHEET) {
      sheet.appendRow(['email', 'name', 'password', 'createdAt', 'lastLogin']);
    } else if (name === ENTRIES_SHEET) {
      sheet.appendRow(['email', 'id', 'date', 'cadence', 'values']);
    } else if (name === CURRENT_SHEET) {
      sheet.appendRow(['email', 'key', 'value']);
    }
  }
  return sheet;
}

// Simple hash function for passwords (not cryptographic, but good enough
// to avoid storing plain text in the sheet)
function simpleHash(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to positive hex string
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const email = (body.email || '').toLowerCase().trim();

    if (action === 'signup') {
      return handleSignup(email, body.name || '', body.password || '');
    } else if (action === 'login') {
      return handleLogin(email, body.password || '');
    }

    // All other actions require an email
    if (!email) {
      return jsonResponse({ error: 'Email is required' });
    }

    if (action === 'load') {
      return handleLoad(email);
    } else if (action === 'save') {
      return handleSave(email, body.entry);
    } else if (action === 'delete') {
      return handleDelete(email, body.entryId);
    } else if (action === 'saveCurrent') {
      return handleSaveCurrent(email, body.data);
    }

    return jsonResponse({ error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

function doGet(e) {
  return jsonResponse({ status: 'LPI Scorecard API v3' });
}

// ─── SIGN UP ────────────────────────────────────────────────────────

function handleSignup(email, name, password) {
  if (!email) {
    return jsonResponse({ error: 'Email is required' });
  }
  if (!password) {
    return jsonResponse({ error: 'Password is required' });
  }
  if (!name) {
    return jsonResponse({ error: 'Name is required' });
  }

  const sheet = getOrCreateSheet(USERS_SHEET);
  const data = sheet.getDataRange().getValues();
  const now = new Date().toISOString();

  // Check if user already exists
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase().trim() === email) {
      return jsonResponse({ error: 'An account with this email already exists. Please sign in.' });
    }
  }

  // Create new user with hashed password
  const hashedPassword = simpleHash(password);
  sheet.appendRow([email, name, hashedPassword, now, now]);

  return jsonResponse({
    success: true,
    user: { email: email, name: name },
  });
}

// ─── LOGIN ──────────────────────────────────────────────────────────

function handleLogin(email, password) {
  if (!email) {
    return jsonResponse({ error: 'Email is required' });
  }
  if (!password) {
    return jsonResponse({ error: 'Password is required' });
  }

  const sheet = getOrCreateSheet(USERS_SHEET);
  const data = sheet.getDataRange().getValues();
  const now = new Date().toISOString();
  const hashedPassword = simpleHash(password);

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase().trim() === email) {
      const storedHash = String(data[i][2]);

      // Check password
      if (storedHash !== hashedPassword) {
        return jsonResponse({ error: 'Incorrect password.' });
      }

      // Update lastLogin
      sheet.getRange(i + 1, 5).setValue(now);

      return jsonResponse({
        success: true,
        user: { email: email, name: data[i][1] },
      });
    }
  }

  return jsonResponse({ error: 'No account found with this email. Please sign up first.' });
}

// ─── LOAD (scoped by email) ─────────────────────────────────────────

function handleLoad(email) {
  const entriesSheet = getOrCreateSheet(ENTRIES_SHEET);
  const currentSheet = getOrCreateSheet(CURRENT_SHEET);

  // Load entries for this user
  const entriesData = entriesSheet.getDataRange().getValues();
  const entries = [];
  for (let i = 1; i < entriesData.length; i++) {
    const row = entriesData[i];
    if (String(row[0]).toLowerCase().trim() === email && row[1]) {
      entries.push({
        id: String(row[1]),
        date: row[2],
        cadence: row[3],
        values: JSON.parse(row[4] || '{}'),
      });
    }
  }

  // Load current week for this user
  const currentData = currentSheet.getDataRange().getValues();
  const currentWeek = {};
  for (let i = 1; i < currentData.length; i++) {
    const row = currentData[i];
    if (String(row[0]).toLowerCase().trim() === email && row[1]) {
      currentWeek[row[1]] = row[2] === '' ? null : Number(row[2]);
    }
  }

  // Return newest first
  entries.reverse();

  return jsonResponse({ entries, currentWeek });
}

// ─── SAVE ENTRY (scoped by email) ───────────────────────────────────

function handleSave(email, entry) {
  const sheet = getOrCreateSheet(ENTRIES_SHEET);
  sheet.appendRow([
    email,
    entry.id,
    entry.date,
    entry.cadence,
    JSON.stringify(entry.values),
  ]);
  return jsonResponse({ success: true });
}

// ─── DELETE ENTRY (scoped by email) ─────────────────────────────────

function handleDelete(email, entryId) {
  const sheet = getOrCreateSheet(ENTRIES_SHEET);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (
      String(data[i][0]).toLowerCase().trim() === email &&
      String(data[i][1]) === String(entryId)
    ) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  return jsonResponse({ success: true });
}

// ─── SAVE CURRENT WEEK (scoped by email) ────────────────────────────

function handleSaveCurrent(email, data) {
  const sheet = getOrCreateSheet(CURRENT_SHEET);
  const existing = sheet.getDataRange().getValues();

  // Remove old rows for this user
  for (let i = existing.length - 1; i >= 1; i--) {
    if (String(existing[i][0]).toLowerCase().trim() === email) {
      sheet.deleteRow(i + 1);
    }
  }

  // Write new rows
  const keys = Object.keys(data || {});
  for (const key of keys) {
    const val = data[key];
    if (val !== null && val !== undefined) {
      sheet.appendRow([email, key, val]);
    }
  }
  return jsonResponse({ success: true });
}

// ─── HELPER ─────────────────────────────────────────────────────────

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
