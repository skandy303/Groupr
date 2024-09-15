import React, { useEffect, createContext, useState } from "react";
import { UserEntity, getMe } from "api";
import { useMutation } from "@tanstack/react-query";
import { useOnMount } from "hooks";

interface Props extends React.PropsWithChildren {}

interface UserState {
  loggedIn: boolean;
  user: UserEntity | undefined;
}

export interface IUserContext {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  isAuthReady: boolean;
}

export const UserContext = createContext<IUserContext | null>(null);

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>({
    loggedIn: false,
    user: undefined,
  });
  const [isAuthReady, setIsAuthReady] = useState(false);

  const { isError, data, mutate } = useMutation(getMe);

  useOnMount(() => {
    mutate();
  });

  useEffect(() => {
    if (data?.user !== undefined) {
      setUserState({ loggedIn: true, user: data.user });
      setIsAuthReady(true);
    }
    if (isError) {
      setIsAuthReady(true);
    }
  }, [data, isError]);

  return (
    <UserContext.Provider
      value={{
        userState,
        setUserState,
        isAuthReady,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
