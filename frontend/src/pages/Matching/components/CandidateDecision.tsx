import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { styles } from "./styles";
import "pages/CreateBio/MarkdownStyle.css";
import { useNavigateToProject } from "hooks";

interface Props {
  name: string;
  fetchCandidate: () => void;
  makeDecision: (likedCandidate: boolean) => void;
  project_id: string;
}

export const CandidateDecision: React.FC<Props> = ({
  name,
  fetchCandidate,
  makeDecision,
  project_id,
}) => {
  const navigateToProject = useNavigateToProject(project_id);

  const handleDecision = (likedCandidate: boolean): void => {
    makeDecision(likedCandidate);
  };

  return (
    <Box sx={styles.topLevelBox}>
      <Typography variant="h6" p={2}>
        Would you like to form a group with {name}?
      </Typography>
      <Box display="flex" flexDirection="row">
        <Button
          variant="contained"
          sx={styles.button}
          onClick={() => {
            handleDecision(false);
          }}
        >
          Show me someone else...
        </Button>
        <Button
          variant="contained"
          sx={styles.button}
          onClick={() => {
            handleDecision(true);
          }}
        >
          Looks like a great match!
        </Button>
      </Box>
      <Button
        onClick={() => {
          navigateToProject();
        }}
        sx={{ padding: 4 }}
      >
        Take me back to my project
      </Button>
    </Box>
  );
};
