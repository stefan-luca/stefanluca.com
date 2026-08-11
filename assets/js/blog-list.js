// Renders the blog index from a Google Sheet of post metadata.
import { CONFIG } from "./config.js";
import { fetchSheetRows, isTruthyCell } from "./gsheets.js";

const listEl = document.getElementById("post-list");
const stateEl = document.getElementById("list-state");

async function init() {
  let rows;
  try {
    ({ rows } = await fetchSheetRows(CONFIG.blogSheetId, CONFIG.blogSheetName));
  } catch (err) {
    console.error(err);
    setState("Unable to load posts right now. Please check back later.", true);
    return;
  }

  const posts = rows
    .filter((r) => isTruthyCell(r.published) && r.slug && r.title)
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      date: r.date || "",
      description: r.description || r.summary || "",
      tags: String(r.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (posts.length === 0) {
    setState("No posts published yet — check back soon.", false);
    return;
  }

  stateEl.hidden = true;
  render(posts);
}

function render(posts) {
  listEl.innerHTML = "";
  for (const post of posts) {
    const li = document.createElement("li");
    li.className = "post-item";

    const a = document.createElement("a");
    a.className = "post-title";
    a.href = `/blog/post.html?slug=${encodeURIComponent(post.slug)}`;
    a.textContent = post.title;
    li.appendChild(a);

    const meta = document.createElement("p");
    meta.className = "post-meta";
    meta.textContent = formatDate(post.date);
    li.appendChild(meta);

    if (post.description) {
      const desc = document.createElement("p");
      desc.textContent = post.description;
      li.appendChild(desc);
    }

    if (post.tags.length) {
      const tagWrap = document.createElement("div");
      tagWrap.className = "tag-list";
      for (const t of post.tags) {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = t;
        tagWrap.appendChild(span);
      }
      li.appendChild(tagWrap);
    }

    listEl.appendChild(li);
  }
}

function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value || "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function setState(message, isError) {
  stateEl.hidden = false;
  stateEl.textContent = message;
  stateEl.classList.toggle("is-error", isError);
}

init();
