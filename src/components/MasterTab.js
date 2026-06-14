import React from "react";
import StatTable from "./common/StatTable";
import { getMasterTab } from "../services/api";

// --- Score statistics helpers ---

const removeOutliers = (scores) => {
  // Handle edge cases: empty or small arrays
  if (scores.length < 4) return scores;

  // Sort the scores array (non-destructive)
  const sortedScores = scores.slice().sort((a, b) => a - b);

  // Calculate Q1 and Q3
  const q1 = sortedScores[Math.floor(sortedScores.length / 4)];
  const q3 = sortedScores[Math.ceil(sortedScores.length * (3 / 4)) - 1];

  // Calculate interquartile range (IQR)
  const iqr = q3 - q1;

  // Filter scores within the IQR bounds
  return sortedScores.filter(
    (score) => score >= q1 - 1.5 * iqr && score <= q3 + 1.5 * iqr
  );
};

const calcAverage = (scores) => {
  if (scores.length === 0) return "NaN";
  return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
};

const calcStandardDeviation = (scores) => {
  if (scores.length === 0) return "NaN";
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.sqrt(
    scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / scores.length
  ).toFixed(2);
};

const fetchRows = async () => {
  const data = await getMasterTab();
  return data
    .map((debater, index) => {
      const scores = debater.tournamentRoundScores
        ? debater.tournamentRoundScores.flatMap((tournament) =>
            tournament.roundScores.map((round) => round.score)
          )
        : [];

      const roundsDebated = debater.tournamentRoundScores
        ? debater.tournamentRoundScores.reduce(
            (sum, tournament) => sum + tournament.numberOfRounds,
            0
          )
        : 0;

      return {
        ...debater,
        id: debater.id || index + 1,
        scores,
        avgScore: scores.length > 0 ? calcAverage(scores) : 0,
        avgScoreWOOutliers:
          scores.length > 0 ? calcAverage(removeOutliers(scores)) : 0,
        roundsDebated,
        stdDev: scores.length > 0 ? calcStandardDeviation(scores) : 0,
      };
    })
    .filter((debater) => debater.roundsDebated > 0);
};

const columns = [
  { field: "firstName", headerName: "First Name", width: 150, sortable: true },
  { field: "lastName", headerName: "Last Name", width: 150, sortable: true },
  { field: "scores", headerName: "Scores", flex: 1, sortable: false },
  {
    field: "avgScore",
    headerName: "Average Score",
    width: 100,
    type: "number",
    sortable: true,
  },
  {
    field: "avgScoreWOOutliers",
    headerName: "Avg Score WO Outliers",
    width: 100,
    type: "number",
    sortable: true,
  },
  {
    field: "roundsDebated",
    headerName: "Prelims Debated",
    width: 100,
    type: "number",
    sortable: true,
  },
  {
    field: "stdDev",
    headerName: "Standard Deviation",
    width: 100,
    type: "number",
    sortable: true,
  },
];

const MasterTab = () => (
  <StatTable
    fetchRows={fetchRows}
    columns={columns}
    loadingLabel="Loading Rankings..."
    gridProps={{ disableRowSelectionOnClick: true }}
  />
);

export default MasterTab;
