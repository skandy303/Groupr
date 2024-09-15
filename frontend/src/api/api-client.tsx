import axios from "axios";

import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  GetMeResponse,
  JoinProjectResponse,
  GetProjectsResponse,
  CreateProfileRequest,
  ProjectInfoResponse,
  CreateProfileResponse,
  GetCandidateResponse,
  GetCandidateRequest,
  InteractionRequest,
  InteractionResponse,
  StudentList,
  GroupInfo,
  LeaveGroup,
  ProfProjectInfoResponse,
} from "./api-client-types";

import { API_ENDPOINT, HEADERS } from "./constants";

const client = axios.create({
  baseURL: API_ENDPOINT,
  headers: HEADERS,
  withCredentials: true,
});

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post("accounts/login/", request);
  return { user: { ...response.data } };
};

export const register = async (
  request: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await client.post("accounts/register/", request);
  // Disable prefer-const error
  // eslint-disable-next-line
  return { user: { ...response.data } } as RegisterResponse;
};

export const createProject = async (
  request: CreateProjectRequest
): Promise<CreateProjectResponse> => {
  const response = await client.post("projects/", request);
  return response.data as CreateProjectResponse;
};

export const getMe = async (): Promise<GetMeResponse> => {
  const response = await client.get("accounts/me/");
  return { user: { ...response.data } };
};

export const joinProject = async (
  join_code: string
): Promise<JoinProjectResponse> => {
  const response = await client.get("projects/" + join_code + "/");
  return response.data as JoinProjectResponse;
};

export const getProjects = async (): Promise<GetProjectsResponse> => {
  const response = await client.get("projects/");
  return response.data;
};

export const logout = async (): Promise<void> => {
  const response = await client.get("accounts/logout/");
};

export const getProfile = async (
  id: string | null
): Promise<CreateProfileResponse> => {
  const response = await client.get("projects/" + (id as string) + "/bio/");
  return response.data;
};
export const getProjectInfo = async (
  project_code: string
): Promise<ProjectInfoResponse | ProfProjectInfoResponse> => {
  const response = await client.get("projects/" + project_code + "/info/");
  return response.data;
};

export const createProfile = async (params: {
  request: CreateProfileRequest;
  id: string | null;
}): Promise<CreateProfileResponse> => {
  const response = await client.post(
    // eslint-disable-next-line
    `projects/${params.id}/bio/`,
    params.request
  );
  return response.data as CreateProfileRequest;
};

export const getCandidate = async (
  request: GetCandidateRequest
): Promise<GetCandidateResponse> => {
  const response = await client.get(`projects/${request.project_id}/candidate`);
  return response.data;
};

export const decideOnCandidate = async (
  request: InteractionRequest
): Promise<InteractionResponse> => {
  const { project_id, uuid, liked } = request;
  const request_body = { uuid, liked };
  const response = await client.post(
    `projects/${project_id}/interaction/`,
    request_body
  );
  return response.data;
};

export const getGroup = async (project_code: string): Promise<GroupInfo> => {
  const response = await client.get("projects/" + project_code + "/group/");
  return response.data;
};

// eslint-disable-next-line
export const leaveGroup = async (request: LeaveGroup) => {
  const response = await client.post(
    "projects/" + request.project_id + "/",
    request.request
  );
  return response.data;
};
