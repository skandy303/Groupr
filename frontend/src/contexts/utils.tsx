import { useContext } from "react";
import { IUserContext, UserContext } from "contexts";

// Narrow the type because once context is initialized, type is always IUserContext
// Saves us from having to repeat this
export const useUserContext = (): IUserContext =>
  useContext(UserContext) as IUserContext;
