import { createContext, useState } from "react";

type DropdownContextType = {
  isDropdown1Open: boolean;
  isDropdown2Open: boolean;
  setIsDropdown1Open: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDropdown2Open: React.Dispatch<React.SetStateAction<boolean>>;
};
export const DropdownContext = createContext({} as DropdownContextType);

export const DropdownContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // State to manage the open/close state of the dropdowns
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);

  const value = {
    isDropdown1Open,
    isDropdown2Open,
    setIsDropdown1Open,
    setIsDropdown2Open,
  };
  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
};
