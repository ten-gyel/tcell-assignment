"use client";

type AuditLog = {
  id: number;
  user_id: number;
  action: string;
  entity: string;
  timestamp: string;
};

export default function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">User</th>
            <th className="p-3">Action</th>
            <th className="p-3">Entity</th>
            <th className="p-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="p-3">{log.id}</td>
              <td className="p-3">{log.user_id}</td>
              <td className="p-3">{log.action}</td>
              <td className="p-3">{log.entity}</td>
              <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
