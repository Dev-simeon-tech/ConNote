import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { UserContextProvider } from "./context/user.context";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";

registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Refresh?")) location.reload();
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
