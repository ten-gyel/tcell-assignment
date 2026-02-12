"use client";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import AuditLogTable from "../components/AuditLogTable";
import api from "../lib/axios";

type AuditLog = {
  id: number;
  user_id: number;
  action: string;
  entity: string;
  timestamp: string;
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token"); // get stored token
      const response = await api.get<AuditLog[]>("/api/audit", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(response.data);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      // setToast({ message: "Failed to load audit logs", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  fetchLogs();
}, []);


  return (
    <ProtectedRoute roles={["Admin"]}>
      <Layout title="Audit Logs">
        {loading ? <div>Loading audit logs...</div> : <AuditLogTable logs={logs} />}
      </Layout>
    </ProtectedRoute>
  );
}
