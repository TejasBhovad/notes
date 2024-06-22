import { Inter } from "next/font/google";
import SidebarWrapper from "@/components/SidebarWrapper";
import "./globals.css";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";
import AuthProvider from "@/providers/AuthProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Erga labs | Notes",
  description: "Notes App by Erga Labs",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <ReactQueryClientProvider>
        <html lang="en">
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
          <body className={inter.className}>
            <SidebarWrapper> {children}</SidebarWrapper>
          </body>
        </html>
      </ReactQueryClientProvider>
    </AuthProvider>
  );
}
