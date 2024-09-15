import React, { useState, Fragment } from "react";
import { CreateProjectForm } from "./components/CreateProjectForm";
import { InviteCode } from "./components/InviteCode";
import { CreateProjectRequest, createProject } from "api";
import { useMutation } from "@tanstack/react-query";
import { INITIAL_MIN, INITIAL_MAX } from "./components/GroupSlider";

export const CreateProjectPage: React.FC = () => {
  const emptyState = {
    project_name: "",
    min_group_size: INITIAL_MIN,
    max_group_size: INITIAL_MAX,
    end_date: "",
    description: "",
  };
  const [projectRequest, setProjectRequest] =
    useState<CreateProjectRequest>(emptyState);
  const { mutate, data, isLoading } = useMutation(createProject);

  // Linter wants explicit null check; second is for undefined
  if (data === null || data === undefined) {
    return (
      <Fragment>
        <CreateProjectForm
          {...{ projectRequest, setProjectRequest, mutate, isLoading }}
        ></CreateProjectForm>
      </Fragment>
    );
  }
  return <InviteCode {...data} />;
};
