import React from "react";
import StatTable from "./common/StatTable";
import { getJudgeStats } from "../services/api";

// Safe numeric formatter: avoids throwing on null/undefined cell values.
const fixed2 = (value) =>
  typeof value === "number" && !Number.isNaN(value) ? value.toFixed(2) : "—";

const fetchRows = async () => {
  const data = await getJudgeStats();
  return data
    .map((entity) => {
      const judge = entity.judge;
      return {
        id: judge.id,
        firstName: judge.fname,
        lastName: judge.lname,
        totalRoundsJudged: entity.totalRoundsJudged,
        breaksJudged: entity.breaksJudged,
        prelimsJudged: entity.prelimsJudged,
        averageFirst: entity.averageFirst,
        averageSecond: entity.averageSecond,
        averageThird: entity.averageThird,
        averageReply: entity.averageReply,
        averageSubstantive: entity.averageSubstantive,
        stDeviation: entity.stDeviation,
        tournamentsJudged: entity.tournamentsJudged.join(", "),
      };
    })
    .filter((judge) => judge.totalRoundsJudged > 0);
};

const columns = [
  { field: "firstName", headerName: "First Name", width: 150, sortable: true },
  { field: "lastName", headerName: "Last Name", width: 150, sortable: true },
  {
    field: "totalRoundsJudged",
    headerName: "Total Rounds",
    width: 100,
    sortable: true,
    type: "number",
  },
  {
    field: "breaksJudged",
    headerName: "Breaks",
    width: 70,
    sortable: true,
    type: "number",
  },
  {
    field: "prelimsJudged",
    headerName: "Prelims",
    width: 70,
    sortable: true,
    type: "number",
  },
  {
    field: "averageFirst",
    headerName: "Average First",
    width: 100,
    sortable: true,
    type: "number",
    valueFormatter: fixed2,
  },
  {
    field: "averageSecond",
    headerName: "Average Second",
    width: 100,
    sortable: true,
    type: "number",
    valueFormatter: fixed2,
  },
  {
    field: "averageThird",
    headerName: "Average Third",
    width: 100,
    sortable: true,
    type: "number",
    valueFormatter: fixed2,
  },
  {
    field: "averageSubstantive",
    headerName: "Average Substantive",
    width: 100,
    sortable: true,
    type: "number",
    valueFormatter: fixed2,
  },
  {
    field: "stDeviation",
    headerName: "Standard Deviation",
    width: 100,
    sortable: true,
    type: "number",
    valueFormatter: fixed2,
  },
  {
    field: "tournamentsJudged",
    headerName: "Tournaments Judged",
    flex: 1,
    sortable: false,
  },
];

const JudgeTab = () => (
  <StatTable fetchRows={fetchRows} columns={columns} loadingLabel="Loading Judges..." />
);

export default JudgeTab;
