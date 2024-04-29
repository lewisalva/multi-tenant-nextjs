import "~/web/styles/globals.css";

import { Inter } from "next/font/google";
import clsx from "clsx";
import GlobalProviders from "./globalProviders";
import { auth } from "./authentication";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Multi-Tenant NextJS App",
  description: "Multi-tenant app using NextJS and Drizzle",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();

  return (
    <html lang="en" className={clsx('h-full', 'bg-gray-50')}>
      <body className={clsx('h-full', 'font-sans', inter.variable)}>
        <GlobalProviders user={user}>{children}</GlobalProviders>
      </body>
    </html>
  );
}
