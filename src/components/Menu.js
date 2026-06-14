import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MuiMenu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const LINKS = [
  { to: "/debaters", label: "Debaters" },
  { to: "/master-tab", label: "Master Tab" },
  { to: "/graphs", label: "Graphs" },
  { to: "/institutions", label: "Institutions" },
  { to: "/judge", label: "Judges" },
  { to: "/judge-tab", label: "Judge Tab" },
  { to: "/judge-sentiments", label: "Scoring Sentiments" },
  { to: "/import", label: "Import XML" },
];

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  marginRight: "10px",
  fontWeight: "bolder",
  backgroundImage:
    "linear-gradient(45deg, transparent 40%, #ffffff11, transparent 60%)",
  backgroundSize: "300%",
  backgroundPosition: "0% 0%",
  transition: "background-position 1s",
  ...(active && {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderBottom: "2px solid currentColor",
    borderRadius: 0,
  }),
  "&:hover": {
    backgroundPosition: "100% 100%",
  },
}));

const Menu = () => {
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar position="static" sx={{ height: "10vh" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, alignItems: "center", display: "flex", height: "10vh" }}>
          <img src="/main-logo-dark.svg" alt="DC Logo" style={{ height: "100%" }} />
        </Box>

        {/* Desktop: inline buttons */}
        <Box sx={{ flexGrow: 0, display: { xs: "none", md: "block" } }}>
          {LINKS.map((link) => (
            <NavButton
              key={link.to}
              component={Link}
              to={link.to}
              active={pathname === link.to}
            >
              {link.label}
            </NavButton>
          ))}
        </Box>

        {/* Mobile: hamburger menu */}
        <Box sx={{ flexGrow: 0, display: { xs: "block", md: "none" } }}>
          <IconButton
            color="inherit"
            aria-label="open navigation"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ fontSize: "1.5rem", lineHeight: 1 }}
          >
            ☰
          </IconButton>
          <MuiMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {LINKS.map((link) => (
              <MenuItem
                key={link.to}
                component={Link}
                to={link.to}
                selected={pathname === link.to}
                onClick={() => setAnchorEl(null)}
              >
                {link.label}
              </MenuItem>
            ))}
          </MuiMenu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
