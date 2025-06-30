import { createContext, useState } from "react";

type SidebarContextType = {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
  animateMenu: boolean;
  setAnimateMenu: (animate: boolean) => void;
  toggleSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextType>(
  {} as SidebarContextType
);

export const SidebarContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [animateMenu, setAnimateMenu] = useState(false);

  const toggleSidebar = () => {
    setAnimateMenu(true);
    setTimeout(() => {
      setIsNavOpen(!isNavOpen);
      setAnimateMenu(false);
    }, 150);
  };
  const value = {
    isNavOpen,
    setIsNavOpen,
    animateMenu,
    setAnimateMenu,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
