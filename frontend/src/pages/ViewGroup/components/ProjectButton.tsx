import React, { Fragment } from "react";
import { Button } from "@mui/material";
import { useNavigateToProject } from "hooks";

interface Props {
  project_id: string;
}

export const ProjectButton: React.FC<Props> = ({ project_id }) => {
  const navigateToProject = useNavigateToProject(project_id);

  return (
    <Button
      variant="contained"
      sx={{
        marginTop: 2,
        marginBottom: 2,
        borderRadius: 5,
      }}
      onClick={() => navigateToProject()}
    >
      Go to Project
    </Button>
  );
};
