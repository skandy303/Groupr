export interface UserEntity {
  name: string;
  email: string;
  user_type: UserType;
  uuid: string;
}

export interface Project {
  project_name: string;
  min_group_size: number;
  max_group_size: number;
  join_code: string;
  end_date: string;
  description: string;
  professor: {
    name: string;
    user_type: UserType;
    uuid: string;
  };
}
export type UserType = "student" | "professor";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  user_type: UserType;
}

export interface LoginResponse {
  user: UserEntity;
}

export interface RegisterResponse extends LoginResponse {}

export interface CreateProjectRequest {
  project_name: string;
  min_group_size: number;
  max_group_size: number;
  end_date: string;
  description: string;
}

export interface CreateProjectResponse {
  join_code: string;
}

export interface GetMeResponse extends LoginResponse {}
export interface JoinProjectResponse {
  project_name: string;
  min_group_size: number;
  max_group_size: number;
  join_code: string;
  end_date: string;
  description: string;
  professor: {
    name: string;
    user_type: UserType;
  };
}
export interface GetProjectsResponse extends Array<Project> {}

export interface ProjectInfoResponse {
  bio_created: boolean;
  project: Project;
  has_group: boolean;
}

export enum UserPronouns {
  they = "they/them",
  he = "he/him",
  she = "she/her",
  other = "other",
}

export enum UserYear {
  first = "1",
  second = "2",
  third = "3",
  fourth = "4",
  other = "4+",
}

export interface CreateProfileRequest {
  bio: string;
  skills: string[];
  year: UserYear;
  pronouns: UserPronouns;
  contact_details: string | undefined;
}

export interface CreateProfileResponse extends CreateProfileRequest {}

export interface Candidate {
  student: {
    uuid: string;
    name: string;
  };
  profile: Profile;
}

export interface Group {
  uuid: string;
  group_name: string;
}

export interface GetCandidateResponse {
  no_candidates: boolean;
  group: Group;
  candidates: Candidate[];
}

interface Profile extends CreateProfileResponse {}

export interface GetCandidateRequest {
  project_id: string;
}

export interface InteractionRequest {
  uuid: string;
  liked: boolean;
  project_id: string;
}

export interface InteractionResponse {
  matched: boolean;
}

export interface Student {
  name: string;
  email: string;
  group_name: string;
  uuid: string;
}

export interface StudentList {
  students: Student[];
}

export interface ProfProjectInfoResponse {
  students: Student[];
  project: Project;
}

export interface GroupInfo {
  group: Group;
  members: Candidate[];
}

export interface LeaveGroupRequest {
  uuid: string;
}

export interface LeaveGroup {
  request: LeaveGroupRequest;
  project_id: string;
}
