'use client';

import "~/web/styles/globals.css";

import { Inter } from "next/font/google";
import clsx from "clsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from "../web/services/queryClient";
import { AuthenticationContextProvider } from "../web/contexts/AuthenticationContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// export const metadata = {
//   title: "Multi-Tenant NextJS App",
//   description: "Multi-tenant app using NextJS and Drizzle",
//   icons: [{ rel: "icon", url: "/favicon.ico" }],
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={clsx('h-full', 'bg-gray-50')}>
      <body className={clsx('h-full', 'font-sans', inter.variable)}>
        <QueryClientProvider client={queryClient}>
          <AuthenticationContextProvider>
            {children}
          </AuthenticationContextProvider>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
