// Site-wide configuration for external data sources.
//
// Nothing in this file is a secret: Google Sheet IDs and Apps Script "exec"
// URLs published as "Anyone with the link" are meant to be publicly
// readable, the same way the rendered page itself is public. Never put an
// API key, service-account credential, or OAuth secret here.
//
// --- Books ---
// 1. Create a Google Sheet with a header row and one row per book.
// 2. File > Share > General access > "Anyone with the link" (Viewer).
// 3. Copy the Sheet ID from its URL:
//    https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit
// 4. Set booksSheetId below. booksSheetName is the tab name (bottom of screen).
//
// Recognized column headers (case/spacing-insensitive): Title, Author, Year,
// Date Read, Genre, Rating, Overall Score, Review, Recommendation,
// Cover Image URL.
//
// --- Blog metadata ---
// Same setup as Books, on a separate sheet/tab. Recognized headers: Title,
// Date, Description, Tags, Slug, Published. A row is shown publicly only
// when Published is TRUE/"yes". Only put rows in this sheet that are OK to
// be publicly readable — anyone with the sheet link can see every row,
// including ones marked unpublished, so keep drafts out of the sheet
// entirely until ready.
//
// --- Blog content ---
// Article bodies are fetched from a Google Apps Script Web App deployed as
// "Execute as: Me" / "Who has access: Anyone", which reads a Google Doc and
// returns JSON like:
//   { "slug": "my-post", "title": "My Post", "html": "<p>...</p>" }
// for a request to `${blogContentEndpoint}?slug=my-post`.

export const CONFIG = {
  booksSheetId: "YOUR_BOOKS_SHEET_ID",
  booksSheetName: "Books",

  blogSheetId: "YOUR_BLOG_SHEET_ID",
  blogSheetName: "Posts",

  blogContentEndpoint: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",

  resumePdfPath: "/resume/Stefan-Luca-Resume.pdf",
};
