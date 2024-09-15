import React, { Fragment, useContext } from "react";
import { Button } from "@mui/material";
import { useNavigateToProject } from "hooks";
import { useMutation } from "@tanstack/react-query";
import { leaveGroup } from "api";
import { useUserContext } from "../../../contexts";

export interface Props {
  project_id: string;
}

export const LeaveButton: React.FC<Props> = ({ project_id }) => {
  const navigateToProject = useNavigateToProject(project_id);
  const { userState } = useUserContext();
  const { user } = userState;

  const leaveGroupMutation = useMutation(leaveGroup, {
    onError: () => {},
    onSuccess: () => {
      navigateToProject();
    },
  });

  const handleClick = () => {
    const request = { uuid: user?.uuid! };
    leaveGroupMutation.mutate({ request, project_id });
  };
  return (
    <Button
      variant="contained"
      sx={{
        marginTop: 2,
        marginBottom: 2,
        borderRadius: 5,
        marginLeft: 2,
      }}
      onClick={() => handleClick()}
    >
      Leave Group
    </Button>
  );
};
