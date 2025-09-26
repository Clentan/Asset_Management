import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/system";
import OtpProvider from "./context/OTPContext.tsx";
import Authprovider from "./context/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AssetProvider from "./context/assetContext.tsx";
import { ToastProvider } from "@heroui/react";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Authprovider>
        <BrowserRouter>
          <OtpProvider>
            <AssetProvider>
            <HeroUIProvider>
              <ToastProvider />
              <App />
            </HeroUIProvider>
            </AssetProvider>
          </OtpProvider>
        </BrowserRouter>
      </Authprovider>
    </QueryClientProvider>
  </React.StrictMode>
);
