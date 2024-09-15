import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export const CreateProjectButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      sx={{
        marginTop: 2,
        borderRadius: 5,
        marginBottom: 5,
      }}
      onClick={() => {
        navigate("/createProject");
      }}
    >
      Create New Project
    </Button>
  );
};
