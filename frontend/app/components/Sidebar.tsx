"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const baseLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const links = [
    ...baseLinks,
    ...(user?.role === "Admin" ? [{ href: "/users", label: "Users" }] : []),
    ...(user?.role === "Admin" || user?.role === "Manager" || user?.role === "Member"
      ? [{ href: "/audit", label: "Audit Logs" }]
      : []),
  ];

  return (
    <aside className="w-full md:w-64 bg-white shadow-lg md:min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6">TaskManager</h1>
      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        className="mt-8 w-full rounded-lg bg-slate-800 text-white py-2 hover:bg-slate-700"
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        Logout
      </button>
    </aside>
  );
}
