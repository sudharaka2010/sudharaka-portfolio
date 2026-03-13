import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AdminDock from "@/components/AdminDock";
import { hasAdminSession } from "@/lib/admin-auth";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Sudharaka Lakshan | Backend Portfolio",
  description: "Backend-focused SE undergraduate portfolio (Java, Spring Boot, PostgreSQL, Docker).",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await hasAdminSession();

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        {children}
        <AdminDock initialIsAdmin={isAdmin} />
      </body>
    </html>
  );
}
