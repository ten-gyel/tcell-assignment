"use client";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Layout title="Dashboard">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold">Welcome</h3>
            <p className="mt-2 text-slate-600">{user?.email}</p>
            <p className="mt-1 text-slate-500">Role: {user?.role}</p>
          </div>
          <div className="rounded-2xl bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold">Quick Tips</h3>
            <ul className="mt-2 list-disc list-inside text-slate-600 space-y-1">
              <li>Managers and Admins can create tasks.</li>
              <li>Members can update status for assigned tasks.</li>
              <li>Only Admin can delete tasks and view audit/users.</li>
            </ul>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
