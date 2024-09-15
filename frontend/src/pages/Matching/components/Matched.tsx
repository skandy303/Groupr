import React, { useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
import { styles } from "./styles";
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import { useNavigateToProject } from "hooks";

interface Props {
  name: string;
  project_id: string;
}

export const Matched: React.FC<Props> = ({ name, project_id }) => {
  const navigate = useNavigate();
  const navigateToProject = useNavigateToProject(project_id);

  useEffect(() => {
    const nav = setTimeout(() => {
      navigate({
        pathname: "/viewProject/viewGroup",
        search: createSearchParams({
          project_id: project_id,
        }).toString(),
      });
    }, 2000);
    return () => {
      clearTimeout(nav);
    };
  }, []);

  return (
    <Box sx={styles.topLevelBox}>
      <Typography variant="h5"> You matched with {name}🎉</Typography>
      <Typography variant="body1">Let's check out your new group...</Typography>
      <Button
        sx={styles.button}
        onClick={() => {
          navigateToProject();
        }}
      >
        <Typography variant="button">Take me back to my project</Typography>
      </Button>
    </Box>
  );
};
