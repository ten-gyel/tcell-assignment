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
    api
      .get<User[]>("/api/users")
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute roles={["Admin"]}>
      <Layout title="Users">
        {loading ? <div>Loading users...</div> : <UserTable users={users} />}
      </Layout>
    </ProtectedRoute>
  );
}
