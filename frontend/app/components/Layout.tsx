"use client";

import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

export default function Layout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="md:flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <header className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <div className="text-sm text-slate-600">
            {user?.email} <span className="font-semibold">({user?.role})</span>
          </div>
        </header>
        <section>{children}</section>
      </main>
    </div>
  );
}
