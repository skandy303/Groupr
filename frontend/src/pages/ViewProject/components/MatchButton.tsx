import React, { Fragment } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Project } from "api";

export const MatchButton: React.FC<Project> = (project: Project) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      pathname: "matching",
      search: createSearchParams({
        project_id: project.join_code,
      }).toString(),
    });
  };

  return (
    <Paper sx={{ paddingY: 2, paddingX: 4 }}>
      <Box display="flex" flexDirection={"column"}>
        <Typography variant="h5">Match</Typography>
        <Typography>Look for a groupmate</Typography>
        <Button
          variant="contained"
          sx={{
            alignSelf: "end",
            marginTop: 2,
            borderRadius: 5,
            marginBottom: 2,
          }}
          onClick={handleClick}
        >
          Try Matching
        </Button>
      </Box>
    </Paper>
  );
};
