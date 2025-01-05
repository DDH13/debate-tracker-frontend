import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import StyledDataGrid from "../utils/styledDataGrid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { GridToolbar } from "@mui/x-data-grid";

// JudgeTab Component
const JudgeSpeaks = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `http://localhost:8080/api/v1/judge/stats/all`;

  const fetchJudges = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const processedJudges = data
        .map((entity) => {
          const judge = entity.judge;

          return {
            id: judge.id, // Use judge ID as row ID for unique identification
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
            tournamentsJudged: entity.tournamentsJudged.join(", "), // Join tournaments as a single string
          };
        })
        .filter((judge) => judge.totalRoundsJudged > 0); // Filter out judges who haven't judged any rounds

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
            width: 150,
            sortable: true,
          },
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
            valueFormatter: (value) => value.toFixed(2),
          },
          {
            field: "averageSecond",
            headerName: "Average Second",
            width: 100,
            sortable: true,
            type: "number",
            valueFormatter: (value) => value.toFixed(2),
          },
          {
            field: "averageThird",
            headerName: "Average Third",
            width: 100,
            sortable: true,
            type: "number",
            valueFormatter: (value) => value.toFixed(2),
          },
          // {
          //   field: "averageReply",
          //   headerName: "Average Reply",
          //   width: 150,
          //   sortable: true,
          //   type: "number",
          // },
          {
            field: "averageSubstantive",
            headerName: "Average Substantive",
            width: 100,
            sortable: true,
            type: "number",
            valueFormatter: (value) => value.toFixed(2),
          },
          {
            field: "stDeviation",
            headerName: "Standard Deviation",
            width: 100,
            sortable: true,
            type: "number",
            valueFormatter: (value) =>
              typeof value === "number" ? value.toFixed(2) : value,
          },
          {
            field: "tournamentsJudged",
            headerName: "Tournaments Judged",
            flex: 1,
            sortable: false,
          },
        ]}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Paper>
  );
};

export default JudgeSpeaks;
