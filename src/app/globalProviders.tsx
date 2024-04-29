'use client';

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from "~/web/services/queryClient";
import { AuthenticationContextProvider } from "~/web/contexts/AuthenticationContext";
import { type SimpleUser } from "../server/models/User";

export default function GlobalProviders({
  children,
  user
}: {
  children: React.ReactNode;
  user: SimpleUser | null;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationContextProvider user={user}>
        {children}
      </AuthenticationContextProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
