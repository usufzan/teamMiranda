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
  if (feedbackFrame) {
    feedbackFrame.src = GOOGLE_FORM_EMBED_URL;
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
      const group = button.closest("[data-tab-group]");
      if (!group) return;
      const name = button.dataset.tab;
      group.querySelectorAll("[data-tab]").forEach((item) => item.setAttribute("aria-selected", "false"));
      group.querySelectorAll("[data-tab-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.tabPanel !== name;
      });
      button.setAttribute("aria-selected", "true");
    });
  });
});
