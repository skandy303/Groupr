import { Button, TextField, Box } from "@mui/material";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { joinProject } from "api";

export const JoinProject: React.FC = () => {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleJoin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    joinProjectMutation.mutate(joinCode);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setJoinCode(e.target.value);
  };

  const joinProjectMutation = useMutation(joinProject, {
    onError: () => {
      setError("Project does not exist");
      setJoinCode("");
    },
    onSuccess: () => {
      navigate(0);
    },
  });

  return (
    <form onSubmit={handleJoin}>
      <Box
        display="flex"
        flexDirection={"column"}
        maxWidth={600}
        alignItems="center"
        justifyContent={"center"}
        margin="auto"
        marginBottom={10}
        padding={3}
        borderRadius={1}
        bgcolor={"FFFFFF"}
      >
        <Box display="flex">
          <TextField
            name="Invite Code"
            margin="dense"
            helperText={error}
            error={error.length > 0 ? true : false}
            type={"text"}
            placeholder="Enter the invite code"
            variant="outlined"
            value={joinCode}
            onChange={handleChange}
            sx={{
              input: { bgcolor: "white" },
              marginX: 2,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: 2,
              borderRadius: 5,
              marginBottom: 5,
              width: 100,
            }}
          >
            Join
          </Button>
        </Box>
      </Box>
    </form>
  );
};
