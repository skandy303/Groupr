import { useTheme } from "@emotion/react";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { getGroup, GroupInfo, Project } from "api";
import { PROJECT_COLORS } from "../../constants";
import { useNavigateToProject } from "hooks";
import { CandidateSlider } from "pages/Matching";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import seedrandom from "seedrandom";
import { LeaveButton } from "./components/LeaveButton";
import { ProjectButton } from "./components/ProjectButton";

export const ViewGroup: React.FC = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState("");
  const projectIdRef = useRef(projectId);
  const [searchParams, setSearchParams] = useSearchParams();
  const [group, setGroup] = useState<GroupInfo>({
    group: {
      uuid: "",
      group_name: "",
    },
    members: [],
  });
  const [color, setColor] = useState("#000000");
  const theme = createTheme({
    palette: {
      primary: {
        main: color,
        contrastText: "white",
      },
    },
  });

  const getGroupMutation = useMutation(getGroup, {
    onError: () => {
      useNavigateToProject(projectId);
    },
    onSuccess: (data) => {
      setGroup(data as GroupInfo);
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
      getGroupMutation.mutate(projectId);
      const rng = seedrandom(projectId);
      setColor(PROJECT_COLORS[Math.round(rng() * (PROJECT_COLORS.length - 1))]);
    }
  }, [projectId]);

  return (
    <ThemeProvider theme={theme}>
      <>
        <CandidateSlider
          {...{ candidates: group.members, group_name: group.group.group_name }}
        />
      </>
      <Box textAlign="center">
        <ProjectButton {...{ project_id: projectId }} />
        {group?.members[0]?.profile?.contact_details == undefined ? (
          <LeaveButton {...{ project_id: projectId }} />
        ) : (
          <></>
        )}
      </Box>
    </ThemeProvider>
  );
};
