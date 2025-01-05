import React, { useEffect, useState } from "react";
import { Button, Paper } from "@mui/material";
import StyledDataGrid from "../utils/styledDataGrid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { GridToolbar } from "@mui/x-data-grid";
import { saveAs } from "file-saver";

function exportToCSV(rows, columns, filename = "judge_sentiments.csv") {
  const csvRows = [];

  // Extract column headers
  const headers = columns.map((col) => col.headerName);
  csvRows.push(headers.join(","));

  // Extract data rows
  rows.forEach((row) => {
    const values = columns.map((col) => row[col.field] ?? "");
    csvRows.push(values.join(","));
  });

  // Create a Blob and trigger the download
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}
const JudgeSentiments = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `http://localhost:8080/api/v1/statistics/sentiment?allowed-deviation=0.5`;

  const fetchJudges = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const processedJudges = data
        .map((entity) => {
          const totalSpeeches = entity.speechesJudged;

          return {
            id: entity.judgeId, // Use judgeId as row ID for unique identification
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

      setJudges(processedJudges);
    } catch (err) {
      console.error("Error fetching judges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJudges();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "86vh",
          gap: "20px",
        }}
      >
        <CircularProgress />
        <div>Loading Judges...</div>
      </Box>
    );

  return (
    <Paper
      sx={{
        maxWidth: "98vw",
        marginInline: "auto",
        marginBlock: "2vh",
        display: "flex",
        flexDirection: "column",
        maxHeight: "86vh",
      }}
    >
      <StyledDataGrid
        rows={judges}
        columns={[
          {
            field: "firstName",
            headerName: "First Name",
            width: 150,
            sortable: true,
          },
          {
            field: "lastName",
            headerName: "Last Name",
            flex: 1,
            sortable: true,
          },
          {
            field: "speechesJudged",
            headerName: "Speeches Considered",
            width: 150,
            sortable: true,
            type: "number",
          },
          {
            field: "leniency",
            headerName: "Average",
            width: 150,
            sortable: true,
            type: "number",
          },
          {
            field: "leniencyPercentage",
            headerName: "Frequency (%)",
            width: 150,
            sortable: true,
            type: "number",
          },
          {
            field: "harshness",
            headerName: "Average",
            width: 150,
            sortable: true,
            type: "number",
          },
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
        ]}
        columnGroupingModel={[
          {
            groupId: "Leniency",
            children: [{ field: "leniency" }, { field: "leniencyPercentage" }],
            headerAlign: "center",
          },
          {
            groupId: "Harshness",
            children: [
              { field: "harshness" },
              { field: "harshnessPercentage" },
            ],
            headerAlign: "center",
          },
        ]}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Paper>
  );
};

export default JudgeSentiments;
