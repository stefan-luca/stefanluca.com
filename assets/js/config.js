// Site-wide configuration for external data sources.
//
// Nothing in this file is a secret: Google Sheet IDs and Apps Script "exec"
// URLs published as "Anyone with the link" are meant to be publicly
// readable, the same way the rendered page itself is public. Never put an
// API key, service-account credential, or OAuth secret here.
//
// --- Books ---
// Sheet shared as "Anyone with the link" (Viewer), read via CSV export
// (see fetchSheetCsv in gsheets.js — the gviz JSON endpoint loses header
// text on this sheet because it infers numeric/date column types).
// booksSheetGid is the tab's gid (the number after "gid=" in its URL; the
// first tab is 0).
//
// Expected layout: a row of per-dimension weights, then a header row, then
// one data row per book. Recognized headers (case/spacing-insensitive):
// Book title, Author, Date read, Date reviewed, Ideas and conceptual
// originality, Philosophical / intellectual depth, World building and
// speculative coherence, Plot and structure, Characters and human insight,
// Prose and style, Emotional impact, Lasting impact, Overall, Personal
// enjoyment / overall. See assets/js/books.js for the exact mapping.
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
  booksSheetId: "1-qDnH5USIArDEhbRvo46Qw2b2G-WQf5glJDklyOv-Cg",
  booksSheetGid: 0,

  blogSheetId: "YOUR_BLOG_SHEET_ID",
  blogSheetName: "Posts",

  blogContentEndpoint: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",

  resumePdfPath: "/resume/Stefan-Luca-Resume.pdf",
};
