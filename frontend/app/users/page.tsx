"use client";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import UserTable from "../components/UserTable";
import api from "../lib/axios";

type User = { id: number; email: string; role: string };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // get stored token
      const response = await api.get<User[]>("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      // setToast({ message: "Failed to load users", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);

  return (
    <ProtectedRoute roles={["Admin"]}>
      <Layout title="Users">
        {loading ? <div>Loading users...</div> : <UserTable users={users} />}
      </Layout>
    </ProtectedRoute>
  );
}
