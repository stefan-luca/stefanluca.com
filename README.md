# stefanluca.com

Personal site, hosted on GitHub Pages. Plain HTML/CSS/JS — no build step,
no server, no frameworks.

## Structure

```
index.html          Home
resume/index.html   Résumé (static, edit directly)
blog/index.html      Blog index (metadata from Google Sheets)
blog/post.html        Blog article (content from Apps Script)
books/index.html      Books (data from Google Sheets)
assets/css/style.css  Shared styles
assets/js/            Shared + per-page JS modules
404.html, robots.txt, sitemap.xml
CNAME                 Custom domain for GitHub Pages
```

## Local development

No build tooling required, but the blog/books pages use ES modules and
`fetch`, which don't work from a `file://` URL. Serve the folder over HTTP:

```bash
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`.

## Editing static content

- **Home** (`index.html`) and **Résumé** (`resume/index.html`) are plain
  HTML — edit the `[bracketed placeholders]` directly. Anything marked
  `class="placeholder"` is a stand-in and should be replaced with real
  content (nothing on the live site should ship with a placeholder).
- To enable the résumé PDF download button, add the file at
  `resume/Stefan-Luca-Resume.pdf` (path configurable in
  `assets/js/config.js`) — the button only appears once that file exists.

## Books (Google Sheets)

Data comes from a live sheet:
<https://docs.google.com/spreadsheets/d/1-qDnH5USIArDEhbRvo46Qw2b2G-WQf5glJDklyOv-Cg/edit>
(`booksSheetId` / `booksSheetGid` in `assets/js/config.js`), shared as
"Anyone with the link" (Viewer). It's fetched as CSV (`fetchSheetCsv` in
`assets/js/gsheets.js`) rather than the gviz JSON endpoint, because gviz
infers a type per column from the data and silently drops header text it
can't parse as that type — which happens on this sheet's numeric rating
columns.

Sheet layout, top to bottom:

1. A **weights row** — one weight per rating dimension (must sum to 1.0),
   e.g. `0.2, 0.2, 0.15, 0.15, 0.1, 0.1, 0.05, 0.05`.
2. A **header row**: `Book title`, `Author`, `Date read`, `Date reviewed`,
   `Ideas and conceptual originality`, `Philosophical / intellectual depth`,
   `World building and speculative coherence`, `Plot and structure`,
   `Characters and human insight`, `Prose and style`, `Emotional impact`,
   `Lasting impact`, `Overall`, `Personal enjoyment / overall`.
3. One **data row per book**. `Overall` and `Personal enjoyment` are
   expected to already be computed in the sheet (e.g. `Overall` as the
   weighted average of the eight dimension scores using the weights row).

`assets/js/books.js` locates the header row by scanning for a
`Book title` cell (so extra rows above it, like the weights row, are fine),
reads the weights row immediately above it to build the "Overall is a
weighted average of…" note at the top of the page, and treats every row
below the header as a book. Missing values degrade gracefully — a book
with no `Personal enjoyment` value just omits that line, dimensions with no
score are left out of its "Rating breakdown". Sorting (by Overall, personal
enjoyment, date, or title) and text search (title/author) run client-side.

## Blog metadata (Google Sheets)

1. Create a separate sheet/tab with columns: `Title`, `Date`, `Description`,
   `Tags` (comma-separated), `Slug`, `Published` (`TRUE`/`FALSE`).
2. Share the same way as the books sheet, and set `blogSheetId` /
   `blogSheetName` in `assets/js/config.js`.
3. Only rows with `Published` set to a truthy value (`TRUE`, `yes`, `1`) are
   shown. Because the sheet itself is link-readable, treat "unpublished" as
   "not yet ready to be public" — don't stage sensitive drafts there.

The blog index (`blog/index.html`) sorts by date descending and links each
post to `blog/post.html?slug=<slug>`.

## Blog content (Google Docs → Apps Script)

Article bodies are fetched at read time from a Google Apps Script Web App,
keyed by `slug`, expected to return JSON:

```json
{ "slug": "my-post", "title": "My Post", "html": "<p>…</p>" }
```

Set the deployed Web App's `/exec` URL as `blogContentEndpoint` in
`assets/js/config.js`. The returned HTML is inserted after stripping
`<script>`/`<style>`/`on*` handlers client-side (see
`assets/js/blog-post.js`), so keep the endpoint itself trustworthy — it's
part of your own publishing pipeline, not third-party content.

A starting-point Apps Script (`Code.gs`), assuming a mapping sheet of
`slug → Google Doc ID`:

```js
function doGet(e) {
  var slug = e.parameter.slug;
  var docId = lookupDocId(slug); // read from a "Slug"/"DocId" sheet, or a Script Property map
  if (!docId) {
    return jsonResponse({ error: "not found" });
  }

  var url = "https://docs.google.com/feeds/download/documents/export/Export"
    + "?id=" + docId + "&exportFormat=html";
  var response = UrlFetchApp.fetch(url, {
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
  });

  return jsonResponse({
    slug: slug,
    html: response.getContentText(),
  });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy as **Web App → Execute as: Me → Who has access: Anyone**. Exported
Doc HTML includes Google's own inline styles/classes; you may want to strip
those server-side before returning, so the article inherits the site's
typography instead. Never put credentials in this script beyond what Apps
Script manages for you — nothing here needs an API key.

## Deployment

GitHub Pages serves directly from `main` at the repo root — no build step.
`CNAME` pins the custom domain. Pushing to `main` deploys immediately, so
verify changes locally first.

## Notes / known limitations

- Blog/book content is fetched client-side, so it won't appear in "view
  source" and isn't in `sitemap.xml` (only the static index pages are,
  since post slugs live in a spreadsheet, not the repo). This is a
  deliberate trade-off for a zero-backend, zero-build site.
- No analytics or tracking is included.
