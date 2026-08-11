// Minimal client for reading a public Google Sheet as structured rows.
//
// Uses the Google Visualization "gviz" endpoint, which returns JSON for any
// sheet shared as "Anyone with the link can view" without requiring an API
// key. This keeps data-fetching isolated from rendering: callers get back
// plain objects keyed by normalized column header.

/**
 * Normalize a sheet header ("Date Read", " overall score ") into a
 * lookup key ("dateread", "overallscore").
 * @param {string} label
 */
export function normalizeKey(label) {
  return String(label || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Fetch a public Google Sheet tab and return an array of row objects keyed
 * by normalized header names, plus the raw headers for reference.
 *
 * @param {string} sheetId
 * @param {string} sheetName
 * @returns {Promise<{rows: Record<string, string>[], headers: string[]}>}
 */
export async function fetchSheetRows(sheetId, sheetName) {
  if (!sheetId || sheetId.startsWith("YOUR_")) {
    throw new Error("Sheet is not configured yet.");
  }

  const url =
    `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}` +
    `/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  const response = await fetch(url, { credentials: "omit" });
  if (!response.ok) {
    throw new Error(`Sheet request failed (${response.status}).`);
  }

  const text = await response.text();
  const json = parseGvizResponse(text);

  if (!json || !json.table) {
    throw new Error("Unexpected sheet response format.");
  }

  const cols = json.table.cols.map((col, i) => normalizeKey(col.label || col.id || `col${i}`));
  const rows = (json.table.rows || []).map((row) => {
    const obj = {};
    row.c.forEach((cell, i) => {
      const key = cols[i];
      if (!key) return;
      obj[key] = cell && cell.f != null ? cell.f : cell && cell.v != null ? cell.v : "";
    });
    return obj;
  });

  return { rows, headers: cols };
}

/**
 * The gviz endpoint wraps its JSON payload in a JS callback:
 * `google.visualization.Query.setResponse({...});`
 * @param {string} text
 */
function parseGvizResponse(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

/**
 * Interpret common truthy spreadsheet values ("TRUE", "yes", "y", 1) as booleans.
 * @param {unknown} value
 */
export function isTruthyCell(value) {
  const v = String(value ?? "").trim().toLowerCase();
  return v === "true" || v === "yes" || v === "y" || v === "1" || v === "published";
}

/**
 * Fetch a public Google Sheet tab as raw CSV rows (array of string arrays,
 * no header interpretation). Prefer this over `fetchSheetRows` when a
 * sheet has extra rows above its header (e.g. category weights) or numeric
 * columns whose header text would otherwise get lost: the gviz JSON
 * endpoint infers a type per column from the data and silently nulls out
 * any header cell it can't parse as that type (e.g. a text label sitting
 * above a column of numbers).
 *
 * @param {string} sheetId
 * @param {number|string} [gid] sheet/tab id (0 for the first tab)
 * @returns {Promise<string[][]>}
 */
export async function fetchSheetCsv(sheetId, gid = 0) {
  if (!sheetId || sheetId.startsWith("YOUR_")) {
    throw new Error("Sheet is not configured yet.");
  }

  const url =
    `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}` +
    `/export?format=csv&gid=${encodeURIComponent(gid)}`;

  const response = await fetch(url, { credentials: "omit" });
  if (!response.ok) {
    throw new Error(`Sheet request failed (${response.status}).`);
  }

  return parseCsv(await response.text());
}

/**
 * Minimal RFC 4180 CSV parser: handles quoted fields, embedded commas,
 * escaped quotes (""), and quoted newlines.
 * @param {string} text
 * @returns {string[][]}
 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}
