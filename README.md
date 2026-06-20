# Job Search Copilot — Prototype

A static, GitHub Pages–hosted prototype for a candidate-side job-search copilot.
It demonstrates a controlled workflow — save a job, find the original
application page, evaluate evidence-backed fit, tailor a resume, and review
safe form suggestions — without ever auto-submitting on the user's behalf.

**Live site:** https://usufzan.github.io/teamMiranda/

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Single-page overview with interactive Job Hub and extension demos. |
| `pages/*.html` | Focused, single-goal prototype pages for moderated testing. |
| `assets/prototype.css` | Shared design system (tokens, layout, components). |
| `assets/prototype.js` | Theme toggle, tabs, feedback links, and prototype actions. |
| `tools/check-static.mjs` | Static consistency checker (links, nav, structure). |

## Develop locally

No build step. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Verify

```bash
npm run check
```

This validates that every page links to the shared CSS/JS, has exactly one
`<h1>`, carries the canonical sidebar navigation, has no inline styles or merge
markers, and that all internal links and fragment targets resolve.

## Deployment

The site is served by GitHub Pages from the `main` branch root. All asset and
page links are relative, so it works correctly under the
`/teamMiranda/` project subpath. `.nojekyll` disables Jekyll processing so files
are served exactly as committed.

## Privacy posture

Nothing is submitted automatically. The prototype collects, stores, and submits
no data; form suggestions are suggest-only and sensitive fields require explicit
review.
