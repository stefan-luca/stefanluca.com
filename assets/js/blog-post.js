// Loads one article: metadata from the blog Google Sheet (also used to
// enforce that only published slugs render), body from the Apps
// Script content endpoint.
import { CONFIG } from "./config.js";
import { fetchSheetRows, isTruthyCell } from "./gsheets.js";

const slug = new URLSearchParams(location.search).get("slug");

const headerEl = document.querySelector(".article-header");
const titleEl = document.getElementById("article-title");
const metaEl = document.getElementById("article-meta");
const tagsEl = document.getElementById("article-tags");
const bodyEl = document.getElementById("article-body");
const stateEl = document.getElementById("post-state");

async function init() {
  if (!slug) {
    showError("No post was specified.");
    return;
  }

  let meta;
  try {
    const { rows } = await fetchSheetRows(CONFIG.blogSheetId, CONFIG.blogSheetName);
    meta = rows.find((r) => r.slug === slug && isTruthyCell(r.published));
  } catch (err) {
    console.error(err);
    showError("Unable to load this article right now. Please check back later.");
    return;
  }

  if (!meta) {
    showError("This post could not be found.");
    return;
  }

  document.title = `${meta.title} — Stefan Luca`;
  titleEl.textContent = meta.title;
  metaEl.textContent = formatDate(meta.date);
  headerEl.hidden = false;

  const tags = String(meta.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  for (const tag of tags) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    tagsEl.appendChild(span);
  }

  await loadContent();
}

async function loadContent() {
  try {
    const url = `${CONFIG.blogContentEndpoint}?slug=${encodeURIComponent(slug)}`;
    const response = await fetch(url, { credentials: "omit" });
    if (!response.ok) throw new Error(`Content request failed (${response.status}).`);

    const data = await response.json();
    const html = data && (data.html || data.content);
    if (!html) throw new Error("Empty content response.");

    bodyEl.innerHTML = sanitizeHtml(html);
    stateEl.hidden = true;
  } catch (err) {
    console.error(err);
    bodyEl.innerHTML = "";
    stateEl.hidden = false;
    stateEl.textContent = "Unable to load the article content right now. Please check back later.";
    stateEl.classList.add("is-error");
  }
}

/**
 * Strip script-executing tags and attributes before inserting HTML that
 * originates from the site owner's own Apps Script / Google Docs pipeline.
 */
function sanitizeHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;

  template.content.querySelectorAll("script, style, iframe, object, embed, link, meta, form").forEach((el) => el.remove());

  template.content.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      const isEventHandler = name.startsWith("on");
      const isScriptUrl = (name === "href" || name === "src") && value.startsWith("javascript:");
      if (isEventHandler || isScriptUrl) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return template.innerHTML;
}

function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value || "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function showError(message) {
  headerEl.hidden = true;
  stateEl.hidden = false;
  stateEl.textContent = message;
  stateEl.classList.add("is-error");
}

init();
