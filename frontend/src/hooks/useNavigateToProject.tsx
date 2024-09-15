import { useNavigate, createSearchParams } from "react-router-dom";

export function useNavigateToProject(project_id: string): () => void {
  const navigate = useNavigate();
  const navigateToProject = (): void => {
    navigate({
      pathname: "/viewProject",
      search: createSearchParams({
        project_id,
      }).toString(),
    });
  };
  return navigateToProject;
}
