import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { styles } from "./styles";
import { useNavigateToProject } from "hooks";

interface Props {
  project_id: string;
}
export const NoCandidates: React.FC<Props> = ({ project_id }) => {
  const navigateToProject = useNavigateToProject(project_id);

  return (
    <Box sx={styles.topLevelBox}>
      <Typography variant="h6">
        Uh-oh We couldn't find anyone else to match you with 😭
      </Typography>
      <Typography variant="body1">
        You might have to sit tight until more students join the project.
      </Typography>
      <Button
        sx={{
          borderRadius: 5,
          marginBottom: 5,
        }}
        onClick={() => {
          navigateToProject();
        }}
      >
        <Typography variant="button">Take me back to my project</Typography>
      </Button>
    </Box>
  );
};
