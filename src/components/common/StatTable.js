import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { GridToolbar } from "@mui/x-data-grid";
import StyledDataGrid from "../../utils/styledDataGrid";

/**
 * Shared read-only stats table: handles fetch lifecycle (loading / error /
 * empty) and renders a StyledDataGrid with the standard GridToolbar.
 *
 * @param {() => Promise<any[]>} fetchRows - returns the already-transformed rows
 * @param {object[]} columns - DataGrid column defs
 * @param {object[]} [columnGroupingModel] - optional DataGrid column groups
 * @param {string} [loadingLabel]
 * @param {object} [gridProps] - extra props forwarded to the grid
 */
const StatTable = ({
  fetchRows,
  columns,
  columnGroupingModel,
  loadingLabel = "Loading...",
  gridProps = {},
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRows();
      setRows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchRows]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
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
        <div>{loadingLabel}</div>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginBlock: "4vh" }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={load}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

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
        rows={rows}
        columns={columns}
        columnGroupingModel={columnGroupingModel}
        slots={{ toolbar: GridToolbar }}
        {...gridProps}
      />
    </Paper>
  );
};

export default StatTable;
