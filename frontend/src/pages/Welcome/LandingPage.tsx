import {
  Box,
  Button,
  createTheme,
  Grid,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { Fragment } from "react";
import image from "../../assets/landingpage.png";
import logo from "../../assets/logo/Grouper-croped.png";
import { useUserContext } from "contexts";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

export const LandingPage: React.FC = () => {
  const theme = createTheme();
  const navigate = useNavigate();
  theme.typography.h1 = {
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "2.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "4.5rem",
    },
  };
  theme.typography.h3 = {
    fontSize: "1.5rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2.0rem",
    },
  };
  return (
    <ThemeProvider theme={theme}>
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <img src={logo} height="40vh" style={{ marginRight: "auto" }}></img>
        <Button size="large" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button size="large" onClick={() => navigate("/register")}>
          Register
        </Button>
      </Toolbar>
      <Grid container alignContent="center" justifyContent={"center"}>
        <Grid item display={"flex"} justifyContent="center" xl={5} xs={12}>
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            justifyContent={"center"}
          >
            <Typography
              align="center"
              variant="h1"
              sx={{
                mt: 2,
              }}
            >
              Making groups,
              <br /> easier
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="primary"
              id="action-button"
              onClick={() => navigate("/register")}
            >
              <Typography align="center" variant="h3">
                Get Started
              </Typography>
            </Button>
            <Button
              size="large"
              color="primary"
              style={{ fontSize: "1.4em" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Box>
        </Grid>
        <Grid item xl={6} xs={12}>
          <img src={image} className="image-content"></img>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
