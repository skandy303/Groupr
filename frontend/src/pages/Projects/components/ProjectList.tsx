import { List, ListItemButton, Typography } from "@mui/material";
import { ProjectCard } from "./ProjectCard";
import { getProjects, Project } from "api";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/system";
import { useNavigate, createSearchParams } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";

const listStyles = {
  width: "100%",
  bgcolor: "background.paper",
  position: "relative",
  overflow: "auto",
};

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const pathname =
    userContext?.userState.user?.user_type == "student"
      ? "/viewProject"
      : "/studentList";
  const getProjectsMutation = useMutation(getProjects, {
    onSuccess: (data) => {
      setProjects(data);
    },
  });

  useEffect(() => {
    getProjectsMutation.mutate();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent={"center"}
      sx={{ width: "100%" }}
    >
      {projects.length !== 0 ? (
        <Typography variant="h5" p={2}>
          Here are all your projects
        </Typography>
      ) : (
        <Typography variant="h5" p={2}>
          You have no projects
        </Typography>
      )}
      <List className="list" sx={listStyles}>
        {projects.map((project) => (
          <ListItemButton
            key={`${project.join_code}`}
            onClick={() => {
              navigate({
                pathname: pathname,
                search: createSearchParams({
                  project_id: project.join_code,
                }).toString(),
              });
            }}
          >
            <ProjectCard {...project} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};
