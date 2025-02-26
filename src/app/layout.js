"use client"; // Add this directive at the top
import { createStore, Provider } from "jotai";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/globals.css";

const myStore = createStore();

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <html lang="en">
      <body>
        <Provider store={myStore}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}