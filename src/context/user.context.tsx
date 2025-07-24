import { createContext, type ReactNode, useState, useEffect } from "react";

import type { User } from "firebase/auth";
import {
  authStateChangedlistener,
  storeUser,
} from "../utils/firebase/firebase.utils";

export type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = authStateChangedlistener((user) => {
      if (user) {
        storeUser(user);
      }
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    setUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
