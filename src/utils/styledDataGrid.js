import { DataGrid } from "@mui/x-data-grid";
import { styled, lighten, darken } from "@mui/material/styles";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: theme.palette.primary.dark,
    wordBreak: "break-word", // Ensures the header text wraps
    lineHeight: "1.5", // Adjusts the height of the header row
    minHeight: "60px", // Sets a minimum height for the header row to accommodate wrapped text
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    color: theme.palette.text.secondary,
    whiteSpace: "normal",
    overflow: "visible",
    textOverflow: "unset",
    wordWrap: "break-word",
  },
  "& .MuiDataGrid-row": {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.secondary.main,

      "&:hover": {
        backgroundColor: lighten(theme.palette.secondary.main, 0.1),
      },
    },
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.secondary.dark,

      "&:hover": {
        backgroundColor: lighten(theme.palette.secondary.dark, 0.1),
      },
    },
  },
  // row and selected
  "& .MuiDataGrid-row.Mui-selected": {
    // backgroundColor: theme.palette.primary.light,
  },
  "& .MuiDataGrid-cell": {
    color: theme.palette.text.secondary,
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default StyledDataGrid;
