// Shows the "Download PDF" button only if the résumé PDF actually exists,
// so an unconfigured placeholder path never renders a broken link.
import { CONFIG } from "./config.js";

(async function () {
  const link = document.getElementById("resume-download");
  if (!link) return;

  try {
    const response = await fetch(CONFIG.resumePdfPath, { method: "HEAD" });
    if (response.ok) {
      link.href = CONFIG.resumePdfPath;
      link.hidden = false;
    }
  } catch {
    // No PDF available yet — leave the button hidden.
  }
})();
