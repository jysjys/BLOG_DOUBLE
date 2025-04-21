import type { Metadata } from "next";
import "../globals.css";

// 使用系统默认字体，避免网络连接问题

export const metadata: Metadata = {
  title: "Authentication - Pet Management System",
  description: "Login to the Pet Management System",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}