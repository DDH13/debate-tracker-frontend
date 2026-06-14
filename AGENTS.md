# AGENTS.md

Guidance for AI coding agents working in this repo. Human-oriented docs live in
`README.md`; this file is the operational contract for agents.

## Project

Admin dashboard for debate-tournament statistics: read-only stats tables plus
admin "merge/replace" screens for de-duplicating debaters, judges, and institutions.

## Stack
- Create React App (`react-scripts`), React 18
- MUI v6 (`@mui/material`) — forced **dark** theme (`src/theme.js`)
- `@mui/x-data-grid` for tables, `@mui/x-charts` for the Graphs page
- `react-router-dom` v6

## Setup & commands
- `npm install` — install dependencies (not committed)
- `npm start` — dev server on http://localhost:3000
- `npm run build` — production build
- `CI=true npm run build` — strict build; **lint warnings fail the build**, so
  run this before declaring work done (catches unused imports, etc.)
- `npm test` — CRA/Jest test runner

## Backend / API
- All API access goes through `src/services/api.js`. **Never hardcode URLs in
  components** — add an endpoint function to `api.js` instead.
- Host is configured via `REACT_APP_API_BASE_URL` (see `.env.example`); falls
  back to `http://localhost:8080/api/v1`. No `.env` is committed.
- `apiFetch()` in `api.js` sets JSON headers and throws descriptive errors on
  non-2xx — reuse it rather than calling `fetch` directly.

## Architecture
- `src/components/common/StatTable.js` — shared shell for read-only stats tables
  (loading / error+retry / DataGrid + GridToolbar). Used by `MasterTab`,
  `JudgeTab`, `JudgeSentiments`; each page supplies a `fetchRows` transform and
  column defs only.
- `src/components/common/MergeableEntityGrid.js` — shared shell for the
  checkbox-select + confirm-dialog + snackbar merge screens. Used by `Debaters`,
  `Judges`, `Institutions`. `mode="merge"` requires exactly 2 (old→new);
  `mode="submit"` requires ≥1 (first selection = survivor).
- `src/components/ImportTournament.js` — `/import` page; uploads a Tabbycat XML via
  `validateTournamentXml` (multipart `POST /tournament/validate`) and renders the
  `ValidationReportDTO`. Dry-run only (no persistence). Note: `apiFetch` skips its
  default JSON content-type when the body is `FormData` — required for multipart uploads.
- `src/utils/styledDataGrid.js` — themed DataGrid (zebra rows, header styling).
- `src/theme.js` — single dark palette; red is the brand accent, body text light.
- Routes live in `src/App.js`; nav links in `src/components/Menu.js` (`LINKS`).
  `/` redirects to `/master-tab`.

## Conventions
- New read-only table page → wrap `StatTable`. New merge/replace page → wrap
  `MergeableEntityGrid`. Don't reintroduce per-component fetch/loading/error
  boilerplate.
- Guard numeric formatters (`valueFormatter`) against `null`/`undefined` — see
  `fixed2` in `JudgeTab.js`.
- Prefer MUI components over raw HTML elements so the dark theme applies.
- No new dependencies without need: `@mui/icons-material` is **not** installed.

## Before finishing
1. `CI=true npm run build` passes.
2. No hardcoded `localhost`/API URLs in `src` outside the `api.js` fallback.
3. No stray `console.log` or unused imports.
