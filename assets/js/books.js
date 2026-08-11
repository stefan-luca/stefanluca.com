// Renders the books page from a public Google Sheet. The sheet holds a
// per-dimension weights row, a header row, then one data row per book —
// see assets/js/config.js for the exact layout and column names.
//
// All rendering goes through textContent / created elements, never
// innerHTML, so no sheet content is ever parsed as markup.
import { CONFIG } from "./config.js";
import { fetchSheetCsv, normalizeKey } from "./gsheets.js";

const DIMENSIONS = [
  { header: "ideasandconceptualoriginality", label: "Ideas & originality" },
  { header: "philosophicalintellectualdepth", label: "Philosophical depth" },
  { header: "worldbuildingandspeculativecoherence", label: "World-building" },
  { header: "plotandstructure", label: "Plot & structure" },
  { header: "charactersandhumaninsight", label: "Characters" },
  { header: "proseandstyle", label: "Prose & style" },
  { header: "emotionalimpact", label: "Emotional impact" },
  { header: "lastingimpact", label: "Lasting impact" },
];

const listEl = document.getElementById("book-list");
const stateEl = document.getElementById("list-state");
const countEl = document.getElementById("results-count");
const weightsNoteEl = document.getElementById("weights-note");
const sortEl = document.getElementById("sort-select");
const searchEl = document.getElementById("search-input");

let books = [];

async function init() {
  let table;
  try {
    table = await fetchSheetCsv(CONFIG.booksSheetId, CONFIG.booksSheetGid);
  } catch (err) {
    console.error(err);
    setState("Unable to load books right now. Please check back later.", true);
    return;
  }

  const headerRowIndex = table.findIndex((row) => row.some((cell) => normalizeKey(cell) === "booktitle"));
  if (headerRowIndex === -1) {
    setState("Unable to read the books sheet — its layout may have changed.", true);
    return;
  }

  const headers = table[headerRowIndex].map(normalizeKey);
  const weightsRow = headerRowIndex > 0 ? table[headerRowIndex - 1] : null;

  books = table
    .slice(headerRowIndex + 1)
    .map((row) => rowToBook(row, headers))
    .filter((book) => book.title);

  if (books.length === 0) {
    setState("No books listed yet — check back soon.", false);
    return;
  }

  stateEl.hidden = true;
  renderWeightsNote(headers, weightsRow);
  bindControls();
  applyAndRender();
}

function rowToBook(row, headers) {
  const get = (headerKey) => {
    const idx = headers.indexOf(headerKey);
    return idx === -1 ? "" : (row[idx] || "").trim();
  };

  const dimensions = DIMENSIONS.map((d) => ({
    label: d.label,
    value: toNumber(get(d.header)),
  })).filter((d) => d.value != null);

  return {
    title: get("booktitle"),
    author: get("author"),
    dateRead: get("dateread"),
    dateReviewed: get("datereviewed"),
    overall: toNumber(get("overall")),
    personalEnjoyment: toNumber(get("personalenjoymentoverall")),
    dimensions,
  };
}

function toNumber(value) {
  if (value === "") return null;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function renderWeightsNote(headers, weightsRow) {
  if (!weightsNoteEl || !weightsRow) return;

  const parts = DIMENSIONS.map((d) => {
    const idx = headers.indexOf(d.header);
    const weight = idx === -1 ? null : parseFloat(weightsRow[idx]);
    return Number.isFinite(weight) ? `${d.label} ${Math.round(weight * 100)}%` : null;
  }).filter(Boolean);

  if (parts.length) {
    weightsNoteEl.textContent = `"Overall" is a weighted average across dimensions: ${parts.join(" · ")}.`;
  }
}

function bindControls() {
  sortEl.addEventListener("change", applyAndRender);
  searchEl.addEventListener("input", applyAndRender);
}

function applyAndRender() {
  const query = searchEl.value.trim().toLowerCase();

  let filtered = books.filter(
    (b) => !query || b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
  );

  filtered = sortBooks(filtered, sortEl.value);

  countEl.textContent = `${filtered.length} book${filtered.length === 1 ? "" : "s"}`;
  render(filtered);
}

function sortBooks(list, mode) {
  const copy = [...list];
  const dateValue = (b) => new Date(b.dateRead || b.dateReviewed || 0).getTime() || 0;

  switch (mode) {
    case "date-asc":
      return copy.sort((a, b) => dateValue(a) - dateValue(b));
    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "personal-desc":
      return copy.sort((a, b) => (b.personalEnjoyment ?? -Infinity) - (a.personalEnjoyment ?? -Infinity));
    case "date-desc":
      return copy.sort((a, b) => dateValue(b) - dateValue(a));
    case "overall-desc":
    default:
      return copy.sort((a, b) => (b.overall ?? -Infinity) - (a.overall ?? -Infinity));
  }
}

function render(list) {
  listEl.innerHTML = "";

  if (list.length === 0) {
    const li = document.createElement("li");
    li.className = "state-message";
    li.textContent = "No books match your search.";
    listEl.appendChild(li);
    return;
  }

  for (const book of list) {
    listEl.appendChild(renderItem(book));
  }
}

function renderItem(book) {
  const li = document.createElement("li");
  li.className = "book-item";

  const header = document.createElement("div");
  header.className = "book-item-header";

  const title = document.createElement("p");
  title.className = "book-title";
  title.textContent = book.title;
  header.appendChild(title);

  if (book.overall != null) {
    const score = document.createElement("span");
    score.className = "book-score";
    score.title = "Overall score";
    score.textContent = formatScore(book.overall);
    header.appendChild(score);
  }

  li.appendChild(header);

  const metaParts = [book.author, formatDateLabel(book)].filter(Boolean);
  if (metaParts.length) {
    const meta = document.createElement("p");
    meta.className = "book-meta";
    meta.textContent = metaParts.join(" · ");
    li.appendChild(meta);
  }

  if (book.personalEnjoyment != null) {
    const personal = document.createElement("p");
    personal.className = "book-meta";
    personal.textContent = `Personal enjoyment: ${formatScore(book.personalEnjoyment)}`;
    li.appendChild(personal);
  }

  if (book.dimensions.length) {
    const details = document.createElement("details");
    details.className = "book-breakdown";

    const summary = document.createElement("summary");
    summary.textContent = "Rating breakdown";
    details.appendChild(summary);

    const dl = document.createElement("dl");
    for (const d of book.dimensions) {
      const dt = document.createElement("dt");
      dt.textContent = d.label;
      const dd = document.createElement("dd");
      dd.textContent = formatScore(d.value);
      dl.appendChild(dt);
      dl.appendChild(dd);
    }
    details.appendChild(dl);

    li.appendChild(details);
  }

  return li;
}

function formatScore(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function formatDateLabel(book) {
  if (book.dateRead) return `Read ${formatDate(book.dateRead)}`;
  if (book.dateReviewed) return `Reviewed ${formatDate(book.dateReviewed)}`;
  return "";
}

function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function setState(message, isError) {
  stateEl.hidden = false;
  stateEl.textContent = message;
  stateEl.classList.toggle("is-error", isError);
}

init();
