import { Box, Paper, Typography, Grid } from "@mui/material";
import { textAlign } from "@mui/system";
import { Project } from "api";
import { formatInTimeZone } from "date-fns-tz";
import React, { Fragment } from "react";
import { PROJECT_COLORS } from "../../../constants";
import seedrandom from "seedrandom";

export const ProjectCard: React.FC<Project> = (project: Project) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const rng = seedrandom(project.join_code);

  const randomColor =
    PROJECT_COLORS[Math.round(rng() * (PROJECT_COLORS.length - 1))];
  return (
    <Fragment>
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          padding: 2,
          boxShadow: 3,
          backgroundColor: randomColor,
        }}
      >
        <Grid container justifyContent={"space-between"}>
          <Grid item xs={12}>
            <Box>
              <Typography variant="h6" p={1} align="left" color="white">
                {project.project_name}
              </Typography>
              <Typography variant="subtitle1" px={1} align="left" color="white">
                {project.professor.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              p={1}
              sx={{ textAlign: { md: "right", sm: "left" } }}
              color="white"
            >
              Due: {formatInTimeZone(project.end_date, timeZone, "yyy-MM-dd")}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Fragment>
  );
};
