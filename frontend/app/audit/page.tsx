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
    api
      .get<AuditLog[]>("/api/audit")
      .then((res) => setLogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute roles={["Admin"]}>
      <Layout title="Audit Logs">
        {loading ? <div>Loading audit logs...</div> : <AuditLogTable logs={logs} />}
      </Layout>
    </ProtectedRoute>
  );
}
