import { UserContext } from "@/context/user.context";
import { useContext } from "react";

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};

export default useUser;
