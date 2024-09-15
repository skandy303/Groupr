import { CreateProjectRequest } from "api";
export interface StateProps {
  projectRequest: CreateProjectRequest;
  setProjectRequest: React.Dispatch<React.SetStateAction<CreateProjectRequest>>;
}
