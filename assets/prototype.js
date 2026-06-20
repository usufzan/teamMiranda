const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScSLDmgiZ90tXW7mBdsKs_xLah7JHRZ7nNrr1qkuN6ZHORCjQ/viewform?usp=header";
const GOOGLE_FORM_EMBED_URL = "https://docs.google.com/forms/d/e/1FAIpQLScSLDmgiZ90tXW7mBdsKs_xLah7JHRZ7nNrr1qkuN6ZHORCjQ/viewform?embedded=true";

const applyTheme = (theme, persist = true) => {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  document.querySelectorAll(".js-theme-toggle").forEach((toggle) => {
    const label = toggle.querySelector(".theme-toggle-label");
    const icon = toggle.querySelector(".material-symbols-outlined");
    const lightModeActive = nextTheme === "light";
    toggle.setAttribute("aria-pressed", String(lightModeActive));
    toggle.setAttribute("aria-label", lightModeActive ? "Switch to dark mode" : "Switch to light mode");
    if (label) label.textContent = lightModeActive ? "Dark Mode" : "Light Mode";
    if (icon) icon.textContent = lightModeActive ? "dark_mode" : "light_mode";
  });
  if (persist) {
    try {
      localStorage.setItem("jobGenieTheme", nextTheme);
    } catch (error) {
      // Theme still applies for the current session.
    }
  }
};

const getTheme = () => document.documentElement.dataset.theme === "light" ? "light" : "dark";

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getTheme(), false);

  document.querySelectorAll(".js-theme-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      applyTheme(getTheme() === "light" ? "dark" : "light");
    });
  });

  document.querySelectorAll(".js-feedback-link").forEach((link) => {
    link.href = GOOGLE_FORM_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const feedbackFrame = document.querySelector("#google-form-frame");
  if (feedbackFrame && GOOGLE_FORM_EMBED_URL) {
    feedbackFrame.src = GOOGLE_FORM_EMBED_URL;
    // A real embed URL is configured, so retire the "not connected yet" notice.
    const placeholder = document.querySelector("#form-placeholder");
    if (placeholder) placeholder.hidden = true;
  }

  const currentPage = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === currentPage) link.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.statusTarget || "#page-status");
      if (target) target.textContent = `${button.dataset.status}. Prototype only; no backend request was made.`;
    });
  });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.tab;

      // Pattern A: explicit [data-tab-group] with [data-tab-panel] children.
      const group = button.closest("[data-tab-group]");
      if (group) {
        group.querySelectorAll("[data-tab]").forEach((item) => item.setAttribute("aria-selected", "false"));
        group.querySelectorAll("[data-tab-panel]").forEach((panel) => {
          panel.hidden = panel.dataset.tabPanel !== name;
        });
        button.setAttribute("aria-selected", "true");
        return;
      }

      // Pattern B: role="tablist" with aria-controls pointing at .tab-pane sections.
      const tablist = button.closest("[role='tablist'], .tabs");
      if (!tablist) return;
      const panelId = button.getAttribute("aria-controls");
      const scope = button.closest(".demo-layout") || document;
      tablist.querySelectorAll("[data-tab]").forEach((item) => item.setAttribute("aria-selected", "false"));
      button.setAttribute("aria-selected", "true");
      scope.querySelectorAll(".tab-pane").forEach((panel) => {
        panel.classList.toggle("is-active", panel.id === panelId);
      });
    });
  });

  // Prototype action buttons report into the nearest section status line.
  document.querySelectorAll("[data-prototype-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const scope = button.closest(".section") || document;
      const target = scope.querySelector(".status-text") || document.querySelector("#page-status");
      if (target) target.textContent = `${button.dataset.prototypeAction}. Prototype only; no backend request was made.`;
    });
  });

  // Lightweight feedback acknowledgements for moderated sessions.
  const FEEDBACK_MESSAGES = {
    useful: "Thanks — marked as useful.",
    unclear: "Noted — something was unclear.",
    "not-useful": "Noted — not useful yet.",
  };
  document.querySelectorAll("[data-feedback]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector("#feedback-status");
      if (target) target.textContent = `${FEEDBACK_MESSAGES[button.dataset.feedback] || "Feedback noted."} Prototype only.`;
    });
  });

  // Copy-to-clipboard helpers with a brief inline confirmation.
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const label = button.querySelector(".material-symbols-outlined");
      const original = label ? label.textContent : null;
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        if (label) label.textContent = "check";
      } catch (error) {
        if (label) label.textContent = "error";
      }
      if (label && original) {
        setTimeout(() => { label.textContent = original; }, 1200);
      }
    });
  });
});
