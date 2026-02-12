import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Task Management Dashboard",
  description: "Next.js dashboard for FastAPI task management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
