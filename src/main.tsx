import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { RoleProvider } from "@/hooks/useRole";
import { LawyerProvider } from "@/lawyer/LawyerProvider";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RoleProvider>
          <LawyerProvider>
            <App />
          </LawyerProvider>
        </RoleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
