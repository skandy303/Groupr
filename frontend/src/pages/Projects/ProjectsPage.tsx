import { ProjectList } from "./components/ProjectList";
import { Box } from "@mui/material";
import React from "react";
import logo from "../../assets/logo/Grouper-croped.png";
import { CreateProjectButton } from "./components/CreateProjectButton";
import { JoinProject } from "./components/JoinProject";
import { useUserContext } from "contexts";

export const ProjectsPage: React.FC = () => {
  const userContext = useUserContext();
  return (
    <Box
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent={"center"}
      margin="auto"
      paddingX={5}
    >
      <ProjectList />
      {userContext?.userState.user?.user_type === "professor" ? (
        <Box display="flex" flexDirection={"column"}>
          <CreateProjectButton />
        </Box>
      ) : (
        <Box display="flex" flexDirection={"column"}>
          <JoinProject />
        </Box>
      )}
    </Box>
  );
};
