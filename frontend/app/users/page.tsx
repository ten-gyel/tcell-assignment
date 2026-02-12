"use client";

import { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import UserTable from "../components/UserTable";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";

type Role = "Admin" | "Manager" | "Member" | "Viewer";
type User = { id: number; email: string; role: Role };

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get<User[]>("/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setToast({ message: "Failed to load users", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: number, role: Role) => {
    setSavingUserId(userId);
    try {
      await api.put(`/api/users/${userId}/role`, { role });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      setToast({ message: "User role updated", type: "success" });
    } catch (err) {
      console.error("Failed to update role:", err);
      setToast({ message: "Role update failed", type: "error" });
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <ProtectedRoute roles={["Admin"]}>
      <Layout title="Users">
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <UserTable
            users={users}
            currentUserId={currentUser?.id}
            onRoleChange={handleRoleChange}
            savingUserId={savingUserId}
          />
        )}
        {toast && <Toast message={toast.message} type={toast.type} />}
      </Layout>
    </ProtectedRoute>
  );
}
