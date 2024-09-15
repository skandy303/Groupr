import {
  Box,
  createTheme,
  Grid,
  Paper,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import { ProjectInfoResponse, getProjectInfo, StudentList } from "api";
import { formatInTimeZone } from "date-fns-tz";
import React, { useState, Fragment, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { MatchButton } from "./MatchButton";
import { EditButton } from "./EditButton";
import { GroupButton } from "./GroupButton";
import seedrandom from "seedrandom";
import { PROJECT_COLORS } from "../../../constants";

export const ProjectInfo: React.FC = () => {
  const navigate = useNavigate();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [projectId, setProjectId] = useState("");
  const projectIdRef = useRef(projectId);
  const [searchParams, setSearchParams] = useSearchParams();
  const date = new Date();
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [project, setProject] = useState<ProjectInfoResponse>({
    bio_created: false,
    project: {
      project_name: "",
      min_group_size: -1,
      max_group_size: -1,
      join_code: "",
      end_date: "",
      description: "",
      professor: {
        name: "",
        user_type: "professor",
        uuid: "",
      },
    },
    has_group: false,
  });

  const [color, setColor] = useState("#ffffff");

  const theme = createTheme({
    palette: {
      primary: {
        main: color,
        contrastText: "white",
      },
    },
  });

  const getProjectInfoMutation = useMutation(getProjectInfo, {
    onError: () => {
      navigate("/projects");
    },
    onSuccess: (data) => {
      setProject(data as ProjectInfoResponse);
      setEndDate(new Date(data.project.end_date));
    },
  });

  /*
   if query param cannot be parsed after 500ms, go back to projects page
  */
  useEffect(() => {
    setProjectId(searchParams.get("project_id")!);
    projectIdRef.current = searchParams.get("project_id")!;
    const nav = setTimeout(() => {
      if (projectIdRef.current === "") {
        navigate("/projects");
      }
    }, 500);
    return () => {
      clearTimeout(nav);
    };
  }, []);

  useEffect(() => {
    if (projectId !== "") {
      getProjectInfoMutation.mutate(projectId);
      const rng = seedrandom(projectId);
      const randomColor =
        PROJECT_COLORS[Math.round(rng() * (PROJECT_COLORS.length - 1))];
      setColor(randomColor);
    }
  }, [projectId]);

  /*
    Before the api return us the correct information, this part would render with empty values and then showing errors.
    Fix is to render nothing, until api returns.
  */
  return project.project.end_date ? (
    <ThemeProvider theme={theme}>
      <Grid
        container
        width={"90%"}
        justifyContent="space-between"
        sx={{ backgroundColor: theme.palette.primary.main }}
        paddingBottom={10}
      >
        <Grid item>
          <Box component="span">
            <Typography variant="h4" p={4} align="left" color="white">
              {project.project.project_name}
            </Typography>
            <Typography variant="h6" px={4} align="left" color="white">
              {project.project.professor.name}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          display={"flex"}
          sx={{
            alignItems: { xs: "flex-start", md: "flex-end" },
            flexDirection: "column",
          }}
        >
          <Typography variant="subtitle1" p={4} align="center" color="white">
            Due:{" "}
            {formatInTimeZone(
              project.project.end_date,
              timeZone,
              "yyy-MM-dd HH:mm:ss"
            )}
          </Typography>
          {!project.bio_created || date >= endDate ? null : (
            <EditButton {...project} />
          )}
        </Grid>
      </Grid>

      <Grid container marginTop={5} paddingX={{ xs: 2, md: 10 }}>
        <Grid item lg={4} xs={12} padding={4}>
          <Paper sx={{ padding: 4 }}>
            <Typography variant="h5" sx={{ marginTop: 1 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              {project.project.description}
            </Typography>
          </Paper>
        </Grid>
        <Grid item lg={8} xs={12} padding={4}>
          <Grid container flexDirection={"column"} spacing={4}>
            {project.has_group && (
              <Grid item>
                <GroupButton {...project.project} />
              </Grid>
            )}
            {!project.bio_created ? (
              <Grid item>
                <EditButton {...project} />
              </Grid>
            ) : (
              <Grid item>
                {date < endDate ? (
                  <Fragment>
                    <MatchButton {...project.project} />
                  </Fragment>
                ) : (
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{ marginTop: 1 }}
                  >
                    Matching has ended.
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  ) : (
    <></>
  );
};
