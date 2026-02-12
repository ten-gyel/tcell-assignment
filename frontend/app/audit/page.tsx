"use client";

import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import AuditLogTable from "../components/AuditLogTable";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";

type AuditLog = {
  id: number;
  user_id: number;
  action: string;
  entity: string;
  timestamp: string;
};

export default function AuditPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get<AuditLog[]>("/api/audit", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(response.data);
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const visibleLogs = useMemo(() => {
    if (user?.role === "Admin") {
      return logs;
    }

    return logs.filter((log) => log.user_id === user?.id);
  }, [logs, user?.id, user?.role]);

  return (
    <ProtectedRoute roles={["Admin", "Manager", "Member"]}>
      <Layout title="Audit Logs">
        {loading ? <div>Loading audit logs...</div> : <AuditLogTable logs={visibleLogs} />}
      </Layout>
    </ProtectedRoute>
  );
}
