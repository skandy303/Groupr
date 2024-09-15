import React from "react";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "components";
import {
  CreateProjectPage,
  Login,
  Register,
  ProjectsPage,
  CreateBio,
  MatchingPage,
  ViewProject,
  StudentsListPage,
  LandingPage,
} from "pages";
import { useUserContext } from "contexts";
import { CircularProgress, Box } from "@mui/material";
import { ViewGroup } from "pages/ViewGroup/ViewGroup";

const App = (): JSX.Element => {
  const { isAuthReady } = useUserContext();

  // Don't render any routes until we know auth state
  if (!isAuthReady) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/createProject"
        element={
          <PrivateRoute role="professor">
            <CreateProjectPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <ProjectsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/viewProject/matching"
        element={
          <PrivateRoute role="student">
            <MatchingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/studentList"
        element={
          <PrivateRoute role="professor">
            <StudentsListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/viewProject"
        element={
          <PrivateRoute role="student">
            <ViewProject />
          </PrivateRoute>
        }
      />
      <Route
        path="/viewProject/bio"
        element={
          <PrivateRoute role="student">
            <CreateBio />
          </PrivateRoute>
        }
      />
      <Route
        path="/viewProject/viewGroup"
        element={
          <PrivateRoute role="student">
            <ViewGroup />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
