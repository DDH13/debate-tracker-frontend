import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { GridToolbar } from "@mui/x-data-grid";
import StyledDataGrid from "../utils/styledDataGrid";
import { validateTournamentXml } from "../services/api";

const SEVERITY_COLOR = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Human-friendly order/labels for the summary map (best-effort; extras still render).
const SUMMARY_LABELS = {
  teams: "Teams",
  debaters: "Debaters",
  judges: "Judges",
  institutions: "Institutions",
  motions: "Motions",
  rounds: "Rounds",
  debates: "Debates",
};

const findingColumns = [
  {
    field: "severity",
    headerName: "Severity",
    width: 120,
    sortable: true,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={SEVERITY_COLOR[params.value] || "default"}
        size="small"
      />
    ),
  },
  { field: "code", headerName: "Code", width: 200, sortable: true },
  { field: "location", headerName: "Location", width: 240, sortable: true },
  { field: "message", headerName: "Message", flex: 1, minWidth: 260, sortable: false },
  {
    field: "matches",
    headerName: "Matched speakers",
    flex: 1,
    minWidth: 240,
    sortable: false,
    // Surfaced on DEBATER_EXISTS / DEBATER_AMBIGUOUS findings: the existing DB
    // debaters this name matched, with teams + institution to disambiguate them.
    renderCell: (params) => {
      const matches = params.value || [];
      if (matches.length === 0) return "—";
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px", paddingBlock: "6px" }}>
          {matches.map((m) => (
            <Box key={m.debaterId}>
              <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                #{m.debaterId} {m.name}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                {m.institution || "No institution"}
                {m.teams && m.teams.length > 0 ? ` · ${m.teams.join(", ")}` : ""}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    },
  },
];

const ImportTournament = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const handleFile = (selected) => {
    setFile(selected);
    setReport(null);
    setError(null);
  };

  const handleValidate = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await validateTournamentXml(file);
      setReport(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const findingRows = (report?.findings || []).map((f, index) => ({
    id: index,
    ...f,
  }));

  const summaryEntries = report?.summary ? Object.entries(report.summary) : [];

  return (
    <div>
      <Paper
        sx={{
          maxWidth: "98vw",
          marginInline: "auto",
          marginBlock: "3vh",
          padding: "2vh",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) handleFile(dropped);
        }}
      >
        <Typography variant="h6" component="h2">
          Validate Tournament XML
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a Tabbycat XML export to check whether it can be imported. This is a
          dry run — nothing is saved.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <Button variant="outlined" component="label">
            Choose XML file
            <input
              type="file"
              accept=".xml,text/xml,application/xml"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
          </Button>
          <Typography variant="body2" color="text.secondary">
            {file ? file.name : "or drag a file here"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleValidate}
            disabled={!file || loading}
          >
            Validate
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", marginBlock: "4vh" }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ display: "flex", justifyContent: "center", marginBlock: "2vh" }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleValidate}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      )}

      {!loading && report && (
        <Paper
          sx={{
            maxWidth: "98vw",
            marginInline: "auto",
            marginBlock: "2vh",
            padding: "2vh",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Alert severity={report.valid ? "success" : "error"}>
            <AlertTitle>
              {report.valid
                ? "Valid — ready to import"
                : `Not valid — ${report.errorCount} error${
                    report.errorCount === 1 ? "" : "s"
                  } must be fixed`}
            </AlertTitle>
            <Box sx={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
              <Chip label={`${report.errorCount} errors`} color="error" size="small" />
              <Chip
                label={`${report.warningCount} warnings`}
                color="warning"
                size="small"
              />
              <Chip label={`${report.infoCount} info`} color="info" size="small" />
            </Box>
          </Alert>

          {summaryEntries.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Parsed contents
              </Typography>
              <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {summaryEntries.map(([key, value]) => (
                  <Chip
                    key={key}
                    variant="outlined"
                    label={`${SUMMARY_LABELS[key] || key}: ${value}`}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ height: "55vh", width: "100%" }}>
            <StyledDataGrid
              rows={findingRows}
              columns={findingColumns}
              disableRowSelectionOnClick
              getRowHeight={() => "auto"}
              slots={{ toolbar: GridToolbar }}
              sx={{
                "& .MuiDataGrid-cell": {
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  alignItems: "flex-start",
                  paddingBlock: "6px",
                },
              }}
            />
          </Box>
        </Paper>
      )}
    </div>
  );
};

export default ImportTournament;
