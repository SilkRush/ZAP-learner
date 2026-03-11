# ZAP Master Guide

ZAP Master Guide is an offline-first, framework-free learning platform built with vanilla JavaScript, HTML, CSS, and JSON. It ships a large, modular content library and runs entirely from static files.

## Overview
- Offline-first and browser-only (no backend).
- Modular architecture with ES modules and JSON content.
- Fault-tolerant UI that keeps working even if a module fails.
- Scalable content structure (lessons, quizzes, guides, glossary, labs, references, cheat sheets, learning paths).

## Run Locally
The app is static and can run from any static server:

```powershell
# From the project root
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

You can also open `index.html` directly, but some browsers restrict `fetch()` access on the `file://` protocol. A local server is recommended for full functionality.

## Deployment Options
This is a static site and works on any static host:
- GitHub Pages
- Netlify
- Vercel
- Any static file server

## Content Structure
All content is JSON under `data/`:

- `data/lessons/*.json`
- `data/quizzes/*.json`
- `data/guides/*.json`
- `data/glossary/*.json`
- `data/labs/*.json`
- `data/references/references.json`
- `data/cheatsheets/cheatsheets.json`
- `data/content-index.json`
- `data/learning-paths.json`

The `data/content-index.json` file provides metadata and a search index so the app can lazy-load individual files as needed.

## How to Add Content
1. Add a new JSON file under the appropriate folder (for example `data/lessons/new-lesson.json`).
2. Update `data/content-index.json` with the new item metadata.
3. Add any new learning path entries in `data/learning-paths.json` if needed.

Tip: You can use the generator script to rebuild the full dataset:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\generate-data.ps1
```

## File Structure
```
.
├── app
│   ├── app.js
│   ├── xp.js
│   ├── progress.js
│   ├── streak.js
│   ├── bookmarks.js
│   └── notes.js
├── core
│   ├── router.js
│   ├── loader.js
│   ├── storage.js
│   ├── search.js
│   ├── searchEngine.js
│   ├── contentIndex.js
│   ├── learningPaths.js
│   ├── quizEngine.js
│   ├── utils.js
│   └── errorBoundary.js
├── components
│   ├── homeView.js
│   ├── lessonView.js
│   ├── quizView.js
│   ├── guideView.js
│   ├── glossaryView.js
│   ├── labView.js
│   ├── bookmarkView.js
│   ├── searchView.js
│   ├── progressView.js
│   ├── pathView.js
│   ├── referencesView.js
│   ├── cheatsheetView.js
│   ├── notesView.js
│   ├── navbar.js
│   └── sidebar.js
├── data
│   ├── lessons
│   ├── quizzes
│   ├── guides
│   ├── glossary
│   ├── references
│   ├── labs
│   ├── cheatsheets
│   ├── content-index.json
│   └── learning-paths.json
├── assets
│   └── styles.css
├── index.html
└── service-worker.js
```

## Verification Checklist
- All routes render: `/`, `/lesson/:id`, `/quiz/:id`, `/guide/:id`, `/glossary/:id`, `/labs/:id`, `/bookmarks`, `/search`, `/progress`.
- Search works with keyword, tag, and category filters.
- Bookmarks, notes, streaks, XP, and progress persist in localStorage.
- Content lazy-loads by ID and safely handles missing data.
