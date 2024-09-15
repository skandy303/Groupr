import React, { Fragment } from "react";
import { useUserContext } from "contexts";
import { UserType } from "api";
import { Navigate } from "react-router-dom";
import { NavBar } from "pages/NavBar/NavBar";

interface Props extends React.PropsWithChildren {
  role?: UserType;
}

export const PrivateRoute: React.FC<Props> = ({ role, children }) => {
  const { userState } = useUserContext();
  const { loggedIn, user } = userState;

  const isAuthorized = (): boolean => {
    if (user === undefined) return false;
    return role !== undefined ? loggedIn && role === user.user_type : loggedIn;
  };

  // Redirect to login on unauthorized access for now
  return isAuthorized() ? (
    <Fragment>
      <NavBar />
      {children}
    </Fragment>
  ) : (
    <Navigate to="/login" />
  );
};
