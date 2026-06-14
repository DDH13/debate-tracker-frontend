import React from "react";
import StatTable from "./common/StatTable";
import { getJudgeSentiments } from "../services/api";

const fetchRows = async () => {
  const data = await getJudgeSentiments(0.5);
  return data
    .map((entity) => {
      const totalSpeeches = entity.speechesJudged;
      return {
        id: entity.judgeId,
        firstName: entity.firstName,
        lastName: entity.lastName,
        speechesJudged: totalSpeeches,
        leniencyCount: entity.leniencyCount,
        harshnessCount: entity.harshnessCount,
        neutralCount: entity.neutralCount,
        leniency:
          totalSpeeches > 0
            ? (entity.leniency / entity.leniencyCount).toFixed(2)
            : NaN,
        harshness:
          totalSpeeches > 0
            ? (entity.harshness / entity.harshnessCount).toFixed(2)
            : NaN,
        overallSentiment: entity.overallSentiment,
        overallDeviation:
          totalSpeeches > 0
            ? (
                (entity.leniency - entity.harshness) /
                (entity.leniencyCount + entity.harshnessCount)
              ).toFixed(2)
            : NaN,
        leniencyPercentage:
          totalSpeeches > 0
            ? ((entity.leniencyCount / totalSpeeches) * 100).toFixed(2)
            : NaN,
        harshnessPercentage:
          totalSpeeches > 0
            ? ((entity.harshnessCount / totalSpeeches) * 100).toFixed(2)
            : NaN,
        neutralPercentage:
          totalSpeeches > 0
            ? ((entity.neutralCount / totalSpeeches) * 100).toFixed(2)
            : NaN,
      };
    })
    .filter((judge) => judge.speechesJudged > 0);
};

const columns = [
  { field: "firstName", headerName: "First Name", width: 150, sortable: true },
  { field: "lastName", headerName: "Last Name", flex: 1, sortable: true },
  {
    field: "speechesJudged",
    headerName: "Speeches Considered",
    width: 150,
    sortable: true,
    type: "number",
  },
  { field: "leniency", headerName: "Average", width: 150, sortable: true, type: "number" },
  {
    field: "leniencyPercentage",
    headerName: "Frequency (%)",
    width: 150,
    sortable: true,
    type: "number",
  },
  { field: "harshness", headerName: "Average", width: 150, sortable: true, type: "number" },
  {
    field: "harshnessPercentage",
    headerName: "Frequency (%)",
    width: 150,
    sortable: true,
    type: "number",
  },
  {
    field: "neutralPercentage",
    headerName: " Neutral Frequency (%)",
    width: 140,
    sortable: true,
    type: "number",
  },
  {
    field: "overallSentiment",
    headerName: "Overall Sentiment",
    width: 140,
    sortable: true,
    type: "number",
  },
  {
    field: "overallDeviation",
    headerName: "Overall Deviation",
    width: 140,
    sortable: true,
    type: "number",
  },
];

const columnGroupingModel = [
  {
    groupId: "Leniency",
    children: [{ field: "leniency" }, { field: "leniencyPercentage" }],
    headerAlign: "center",
  },
  {
    groupId: "Harshness",
    children: [{ field: "harshness" }, { field: "harshnessPercentage" }],
    headerAlign: "center",
  },
];

const JudgeSentiments = () => (
  <StatTable
    fetchRows={fetchRows}
    columns={columns}
    columnGroupingModel={columnGroupingModel}
    loadingLabel="Loading Judges..."
  />
);

export default JudgeSentiments;
