// Renders the books page from a public Google Sheet, with client-side
// sorting, genre filtering, and text search. All rendering is done via
// textContent / created elements — no HTML from the sheet is ever injected.
import { CONFIG } from "./config.js";
import { fetchSheetRows, isTruthyCell } from "./gsheets.js";

const gridEl = document.getElementById("book-grid");
const stateEl = document.getElementById("list-state");
const countEl = document.getElementById("results-count");
const sortEl = document.getElementById("sort-select");
const genreEl = document.getElementById("genre-select");
const searchEl = document.getElementById("search-input");

let books = [];

async function init() {
  try {
    const { rows } = await fetchSheetRows(CONFIG.booksSheetId, CONFIG.booksSheetName);
    books = rows.filter((r) => r.title).map(normalizeBook);
  } catch (err) {
    console.error(err);
    setState("Unable to load books right now. Please check back later.", true);
    return;
  }

  if (books.length === 0) {
    setState("No books listed yet — check back soon.", false);
    return;
  }

  stateEl.hidden = true;
  populateGenres(books);
  bindControls();
  applyAndRender();
}

function normalizeBook(r) {
  const ratingRaw = r.overallscore ?? r.rating ?? "";
  const ratingNum = parseFloat(String(ratingRaw).replace(/[^\d.]/g, ""));

  return {
    title: r.title || "",
    author: r.author || "",
    year: r.year || "",
    dateRead: r.dateread || "",
    genre: r.genre || "",
    rating: Number.isFinite(ratingNum) ? ratingNum : null,
    ratingLabel: ratingRaw ? String(ratingRaw) : "",
    review: r.review || "",
    recommended: isTruthyCell(r.recommendation),
    coverUrl: r.coverimageurl || "",
  };
}

function populateGenres(list) {
  const genres = [...new Set(list.map((b) => b.genre).filter(Boolean))].sort();
  for (const genre of genres) {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreEl.appendChild(option);
  }
}

function bindControls() {
  sortEl.addEventListener("change", applyAndRender);
  genreEl.addEventListener("change", applyAndRender);
  searchEl.addEventListener("input", applyAndRender);
}

function applyAndRender() {
  const genre = genreEl.value;
  const query = searchEl.value.trim().toLowerCase();

  let filtered = books.filter((b) => {
    const matchesGenre = !genre || b.genre === genre;
    const matchesQuery =
      !query || b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
    return matchesGenre && matchesQuery;
  });

  filtered = sortBooks(filtered, sortEl.value);

  countEl.textContent = `${filtered.length} book${filtered.length === 1 ? "" : "s"}`;
  render(filtered);
}

function sortBooks(list, mode) {
  const copy = [...list];
  switch (mode) {
    case "date-asc":
      return copy.sort((a, b) => new Date(a.dateRead || 0) - new Date(b.dateRead || 0));
    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "rating-desc":
      return copy.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    case "date-desc":
    default:
      return copy.sort((a, b) => new Date(b.dateRead || 0) - new Date(a.dateRead || 0));
  }
}

function render(list) {
  gridEl.innerHTML = "";

  if (list.length === 0) {
    const li = document.createElement("li");
    li.className = "state-message";
    li.textContent = "No books match your filters.";
    gridEl.appendChild(li);
    return;
  }

  for (const book of list) {
    gridEl.appendChild(renderCard(book));
  }
}

function renderCard(book) {
  const li = document.createElement("li");
  li.className = "book-card";

  if (book.coverUrl) {
    const img = document.createElement("img");
    img.className = "book-cover";
    img.src = book.coverUrl;
    img.alt = `Cover of ${book.title}`;
    img.loading = "lazy";
    img.addEventListener("error", () => {
      img.replaceWith(coverPlaceholder(book.title));
    });
    li.appendChild(img);
  } else {
    li.appendChild(coverPlaceholder(book.title));
  }

  if (book.recommended) {
    const badge = document.createElement("span");
    badge.className = "book-badge";
    badge.textContent = "Recommended";
    li.appendChild(badge);
  }

  const title = document.createElement("p");
  title.className = "book-title";
  title.textContent = book.title;
  li.appendChild(title);

  if (book.author) {
    const author = document.createElement("p");
    author.className = "book-author";
    author.textContent = book.author;
    li.appendChild(author);
  }

  const metaParts = [book.genre, book.year].filter(Boolean);
  if (metaParts.length) {
    const meta = document.createElement("p");
    meta.className = "book-meta";
    meta.textContent = metaParts.join(" · ");
    li.appendChild(meta);
  }

  if (book.ratingLabel) {
    const rating = document.createElement("p");
    rating.className = "book-rating";
    rating.textContent = book.rating != null ? `★ ${book.ratingLabel}` : book.ratingLabel;
    li.appendChild(rating);
  }

  if (book.review) {
    const review = document.createElement("p");
    review.className = "book-review";
    review.textContent = book.review;
    li.appendChild(review);
  }

  return li;
}

function coverPlaceholder(title) {
  const div = document.createElement("div");
  div.className = "book-cover-placeholder";
  div.setAttribute("aria-hidden", "true");
  div.textContent = (title || "?").trim().charAt(0).toUpperCase();
  return div;
}

function setState(message, isError) {
  stateEl.hidden = false;
  stateEl.textContent = message;
  stateEl.classList.toggle("is-error", isError);
}

init();
