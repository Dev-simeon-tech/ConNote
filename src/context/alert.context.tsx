import { createContext, type ReactNode, useCallback, useEffect, useState } from "react";

export type AlertType = "success" | "error" | "warning" | "info";

type AlertState = {
  message: string;
  type: AlertType;
  isOpen: boolean;
};

type AlertInput = Omit<AlertState, "isOpen">;

type AlertContextType = {
  alert: AlertState;
  setAlert: (alert: AlertInput) => void;
  clearAlert: () => void;
};

const defaultAlert: AlertState = {
  message: "",
  type: "info",
  isOpen: false,
};

export const AlertContext = createContext<AlertContextType | undefined>(
  undefined,
);

export const AlertContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [alert, setAlertState] = useState<AlertState>(defaultAlert);

  const setAlert = useCallback((nextAlert: AlertInput) => {
    setAlertState({ ...nextAlert, isOpen: true });
  }, []);

  const clearAlert = useCallback(() => {
    setAlertState(defaultAlert);
  }, []);

  useEffect(() => {
    if (!alert.isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      setAlertState(defaultAlert);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [alert.isOpen]);

  return (
    <AlertContext.Provider value={{ alert, setAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
