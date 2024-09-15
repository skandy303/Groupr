import React, { Fragment } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Project } from "api";

export const GroupButton: React.FC<Project> = (project: Project) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      pathname: "viewGroup",
      search: createSearchParams({
        project_id: project.join_code,
      }).toString(),
    });
  };

  return (
    <Paper sx={{ paddingY: 2, paddingX: 4 }}>
      <Box display="flex" flexDirection={"column"}>
        <Typography variant="h5">Group</Typography>
        <Typography>View the members of your group</Typography>
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
          View Group
        </Button>
      </Box>
    </Paper>
  );
};
