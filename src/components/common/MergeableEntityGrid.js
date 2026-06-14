import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import StyledDataGrid from "../../utils/styledDataGrid";

// Highlight colours for selected rows (kept legible with black text).
const PRIMARY_BG = "#c8e6c9"; // green  — the row data is kept / merged into
const SECONDARY_BG = "#ffcdd2"; // red   — the row data is removed / merged from

/**
 * Shared selectable grid for the merge/replace admin screens
 * (Debaters, Judges, Institutions).
 *
 * @param {() => Promise<any[]>} fetchRows
 * @param {object[]} columns
 * @param {(selectedIds: any[]) => Promise<void>} onSubmit - performs the API call
 * @param {"merge"|"submit"} mode - "merge": exactly 2 (old -> new); "submit": >= 1
 * @param {string} actionLabel - submit button text
 * @param {string} loadingLabel
 * @param {(selectedIds, rows) => string} confirmMessage - dialog body text
 * @param {string} successMessage
 */
const MergeableEntityGrid = ({
  fetchRows,
  columns,
  onSubmit,
  mode = "merge",
  actionLabel = "Merge Selected",
  loadingLabel = "Loading...",
  confirmMessage,
  successMessage = "Done.",
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState(null); // { severity, message }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRows();
      setRows(data);
      setSelected([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchRows]);

  useEffect(() => {
    load();
  }, [load]);

  const selectionValid =
    mode === "merge" ? selected.length === 2 : selected.length >= 1;

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setSubmitting(true);
    try {
      await onSubmit(selected);
      setSnackbar({ severity: "success", message: successMessage });
      await load();
    } catch (err) {
      setSnackbar({ severity: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const getRowClassName = (params) => {
    if (mode === "merge") {
      if (selected.length >= 1 && params.id === selected[0]) return "row-secondary";
      if (selected.length >= 2 && params.id === selected[1]) return "row-primary";
      return "";
    }
    // submit mode: first selection is the survivor (primary), rest are merged away
    if (selected.length >= 1 && params.id === selected[0]) return "row-primary";
    if (selected.includes(params.id)) return "row-secondary";
    return "";
  };

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
    <div>
      <style>{`
        .row-primary { background-color: ${PRIMARY_BG} !important; }
        .row-primary .MuiDataGrid-cell { color: black !important; }
        .row-secondary { background-color: ${SECONDARY_BG} !important; }
        .row-secondary .MuiDataGrid-cell { color: black !important; }
      `}</style>
      <Paper
        sx={{
          maxWidth: "94vw",
          marginInline: "auto",
          marginBlock: "4vh",
          display: "flex",
          flexDirection: "column",
          maxHeight: "75vh",
        }}
      >
        <StyledDataGrid
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selected}
          onRowSelectionModelChange={setSelected}
          getRowClassName={getRowClassName}
          rows={rows}
          columns={columns}
        />
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBlock: "2vh",
          marginInline: "auto",
          width: "25vw",
          position: "sticky",
          bottom: "5vh",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setConfirmOpen(true)}
          disabled={!selectionValid || submitting}
        >
          {actionLabel}
        </Button>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmMessage
              ? confirmMessage(selected, rows)
              : "This action cannot be undone. Continue?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={5000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {snackbar ? (
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar(null)}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </div>
  );
};

export default MergeableEntityGrid;
