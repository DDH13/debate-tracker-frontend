import { createTheme } from "@mui/material/styles";
import { grey, red } from "@mui/material/colors";

const RED_DARK = "#440000";
const BLACK800 = "#1d1d1d";
const BLACK900 = "#111111";

// Single forced dark theme matching the brand (dark logo + red/black).
// Red is reserved for primary/brand accents; body text stays light for contrast.
export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: red[900],
      dark: RED_DARK,
    },
    secondary: {
      main: grey[900],
      dark: BLACK800,
      light: grey[100],
    },
    background: {
      paper: BLACK900,
      default: grey[900],
    },
    text: {
      primary: grey[100],
      secondary: grey[300],
    },
  },
});
