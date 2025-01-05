import React from "react";
import { Link } from "react-router-dom";

import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button/Button";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

const NavButton = styled(Button)(() => ({
  marginRight: "10px",
  fontWeight: "bolder",
  backgroundImage:
    "linear-gradient(45deg, transparent 40%, #ffffff11, transparent 60%)",
  backgroundSize: "300%",
  backgroundPosition: "0% 0%",
  transition: "background-position 1s",
  "&:hover": {
    backgroundPosition: "100% 100%",
  },
}));

const Menu = () => {
  return (
    <AppBar position="static" sx={{ height: "10vh" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, alignItems: "center", display: "flex", "height": "10vh" }}>
          <img
            src="/main-logo-dark.svg"
            alt="DC Logo"
            style={{ height: "100%" }}
          />
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          {/*TODO  Move some of these to admin view*/}
          {/*<NavButton component={Link} to="/debaters">*/}
          {/*  Debaters*/}
          {/*</NavButton>*/}
          <NavButton component={Link} to="/master-tab">
            Master Tab
          </NavButton>
          <NavButton component={Link} to="/graphs">
            Graphs
          </NavButton>
          {/*<NavButton component={Link} to="/institutions">*/}
          {/*  Institutions*/}
          {/*</NavButton>*/}
          <NavButton component={Link} to="/judge-tab">
            Judge Tab
          </NavButton>
          <NavButton component={Link} to="/judge-sentiments">
            Scoring Sentiments
          </NavButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
