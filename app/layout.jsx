import { Inter } from "next/font/google";
import Link from "next/link";
import SidebarWrapper from "@/components/SidebarWrapper";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import PostHogPageView from "./PostHogPageView";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";
import AuthProvider from "@/providers/AuthProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
const inter = Inter({ subsets: ["latin"] });
import { CSPostHogProvider } from "@/providers/PosthogProvider";
export const metadata = {
  title: "Notes App",
  description: "Collection of notes and references",
};

export default function RootLayout({ children }) {
  const Footer = () => {
    return (
      <footer className="sm:pl-52 z-60 absolute bottom-0 w-full font-semibold text-center text-text text-xs bg-util py-2 flex justify-center gap-1">
        <span className="text-textMuted">
          Not affiliated to dypatil university.
        </span>
        <span className="flex gap-1">
          Made with ❤️ by
          <Link href="https://github.com/TejasBhovad/notes">
            <span className="hover:underline">Tejas</span>
          </Link>
        </span>
      </footer>
    );
  };
  return (
    <AuthProvider>
      <ReactQueryClientProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/safari-pinned-tab.svg"
              color="#F992FF"
            />
            <meta name="msapplication-TileColor" content="#F992FF" />
            <meta name="theme-color" content="#333333" />
          </head>

          <CSPostHogProvider>
            <body className={inter.className}>
              <Suspense fallback={null}>
                <PostHogPageView />
              </Suspense>
              <NextSSRPlugin
                /**
                 * The `extractRouterConfig` will extract **only** the route configs
                 * from the router to prevent additional information from being
                 * leaked to the client. The data passed to the client is the same
                 * as if you were to fetch `/api/uploadthing` directly.
                 */
                routerConfig={extractRouterConfig(ourFileRouter)}
              />{" "}
              <ThemeProvider>
                <SidebarWrapper>{children}</SidebarWrapper>
              </ThemeProvider>
              <Toaster />
              <Footer />
            </body>
          </CSPostHogProvider>
        </html>
      </ReactQueryClientProvider>
    </AuthProvider>
  );
}
