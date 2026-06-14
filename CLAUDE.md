# Debate Tracker Frontend

Admin dashboard for debate-tournament statistics. Read-only stats tables plus
admin "merge/replace" screens for de-duplicating debaters, judges, and institutions.

## Stack
- Create React App (`react-scripts`), React 18
- MUI v6 (`@mui/material`) — forced **dark** theme (see `src/theme.js`)
- `@mui/x-data-grid` for tables, `@mui/x-charts` for the Graphs page
- `react-router-dom` v6

## Scripts
- `npm start` — dev server on http://localhost:3000
- `npm run build` — production build
- `npm test` — CRA/Jest test runner

## Backend
All API access goes through `src/services/api.js`. Configure the host with
`REACT_APP_API_BASE_URL` (see `.env.example`); it falls back to
`http://localhost:8080/api/v1`. Do **not** hardcode URLs in components — add an
endpoint function to `api.js` instead. `apiFetch()` there handles JSON headers
and throws descriptive errors on non-2xx.

## Structure
- `src/components/common/StatTable.js` — shared shell for read-only stats tables
  (loading / error+retry / DataGrid + GridToolbar). Used by `MasterTab`,
  `JudgeTab`, `JudgeSentiments`. Each page supplies a `fetchRows` transform and
  column defs only.
- `src/components/common/MergeableEntityGrid.js` — shared shell for the
  checkbox-select + confirm-dialog + snackbar merge screens. Used by `Debaters`,
  `Judges`, `Institutions`. `mode="merge"` requires exactly 2 (old→new);
  `mode="submit"` requires ≥1 (first = survivor).
- `src/utils/styledDataGrid.js` — themed DataGrid (zebra rows, header styling).
- `src/theme.js` — single dark palette; red is the brand accent, body text light.

## Conventions
- Routes are listed in `src/App.js`; nav links in `src/components/Menu.js` (`LINKS`).
  `/` redirects to `/master-tab`.
- New table page → wrap `StatTable`. New merge page → wrap `MergeableEntityGrid`.
