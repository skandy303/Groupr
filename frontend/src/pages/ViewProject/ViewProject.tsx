import { Box } from "@mui/material";
import React, { Fragment } from "react";
import logo from "../../assets/logo/Grouper-croped.png";
import { useUserContext } from "contexts";
import { ProjectInfo } from "./components/ProjectInfo";

export const ViewProject: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent={"center"}
    >
      <ProjectInfo />
    </Box>
  );
};
