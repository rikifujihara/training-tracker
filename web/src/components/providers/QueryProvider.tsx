"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time of 5 minutes - data is considered fresh for 5 min
            staleTime: 1000 * 60 * 5,
            // Cache time of 10 minutes - data stays in cache for 10 min after component unmounts
            gcTime: 1000 * 60 * 10,
            // Retry failed requests 1 time
            retry: 1,
            // Don't refetch on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === "production",
          },
          mutations: {
            // Retry failed mutations 1 time
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
