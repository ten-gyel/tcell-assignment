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
            <h3 className="text-lg font-semibold">Role Permissions</h3>
            <ul className="mt-2 list-disc list-inside text-slate-600 space-y-1">
              <li>Admin: full task operations, can manage users, full audit visibility.</li>
              <li>Manager: create/assign/update tasks, can view users, own audit actions only.</li>
              <li>Member: can update only assigned tasks and can view own audit actions.</li>
              <li>Viewer: read-only tasks with no user or audit access.</li>
            </ul>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
