import React, { Fragment } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { Project, ProjectInfoResponse } from "api";

export const EditButton: React.FC<ProjectInfoResponse> = (
  project: ProjectInfoResponse
) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const handleClick = () => {
    navigate({
      pathname: "bio",
      search: createSearchParams({
        project_id: project.project.join_code,
      }).toString(),
    });
  };

  return project.bio_created ? (
    <Button
      variant="contained"
      sx={{
        borderRadius: 5,
        margin: 4,
        marginTop: 0,
        backgroundColor: "white",
        color: theme.palette.primary.main,
      }}
      onClick={handleClick}
    >
      Edit Bio
    </Button>
  ) : (
    <Paper sx={{ paddingY: 2, paddingX: 4 }}>
      <Box display="flex" flexDirection={"column"}>
        <Typography variant="h5">Bio</Typography>
        <Typography variant="subtitle1">
          You need to create a bio before you can start matching
        </Typography>
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
          Create Bio
        </Button>
      </Box>
    </Paper>
  );
};
