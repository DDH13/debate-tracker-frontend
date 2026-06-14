// Single source of truth for backend access.
// Configure the backend host via REACT_APP_API_BASE_URL (see .env.example);
// falls back to the local dev backend when unset.
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1";

/**
 * Thin fetch wrapper: prepends BASE_URL, sets JSON headers, throws a
 * descriptive Error on non-2xx responses, and returns parsed JSON.
 */
export const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let body = "";
    try {
      body = await response.text();
    } catch {
      // ignore — body is best-effort context for the error message
    }
    throw new Error(
      `HTTP ${response.status}${body ? `: ${body}` : ""}`
    );
  }

  return response.json();
};

// --- Debaters ---
export const getMasterTab = () => apiFetch("/debater/speaks/all");
export const getDebaters = () => apiFetch("/debater");
export const getDebatersWithStats = () =>
  apiFetch("/debater/teams-speaks-rounds");
export const getDebaterScores = (debaterId) =>
  apiFetch(`/debater/speaks/${debaterId}`);
export const mergeDebaters = (oldDebaterId, newDebaterId) =>
  apiFetch("/debater/replace", {
    method: "POST",
    body: JSON.stringify({ oldDebaterId, newDebaterId }),
  });

// --- Judges ---
export const getJudges = () => apiFetch("/judge/prelims-breaks-tournaments");
export const getJudgeStats = () => apiFetch("/judge/stats/all");
export const mergeJudges = (oldJudgeId, newJudgeId) =>
  apiFetch("/judge/replace", {
    method: "POST",
    body: JSON.stringify({ oldJudgeId, newJudgeId }),
  });

// --- Institutions ---
export const getInstitutions = () => apiFetch("/institution/teams-list");
export const mergeInstitutions = (institutionIds) =>
  apiFetch("/institution/replace", {
    method: "POST",
    body: JSON.stringify({ institutionIds }),
  });

// --- Statistics ---
export const getJudgeSentiments = (allowedDeviation = 0.5) =>
  apiFetch(`/statistics/sentiment?allowed-deviation=${allowedDeviation}`);
