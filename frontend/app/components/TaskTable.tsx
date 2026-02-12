"use client";

type Task = {
  id: number;
  title: string;
  description?: string;
  status: "Todo" | "Doing" | "Done";
  assignee_id?: number;
};

type Role = "Admin" | "Manager" | "Member" | "Viewer";

const badgeMap: Record<Task["status"], string> = {
  Todo: "bg-slate-200 text-slate-800",
  Doing: "bg-amber-100 text-amber-800",
  Done: "bg-emerald-100 text-emerald-800",
};

export default function TaskTable({
  tasks,
  role,
  currentUserId,
  onStatusChange,
  onDelete,
}: {
  tasks: Task[];
  role?: Role;
  currentUserId?: number;
  onStatusChange: (taskId: number, status: Task["status"]) => void;
  onDelete: (taskId: number) => void;
}) {
  const canUpdateTask = (task: Task) => {
    if (role === "Admin" || role === "Manager") {
      return true;
    }

    if (role === "Member") {
      return task.assignee_id === currentUserId;
    }

    return false;
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Description</th>
            <th className="p-3">Status</th>
            <th className="p-3">Assignee</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t">
              <td className="p-3 font-medium">{task.title}</td>
              <td className="p-3">{task.description || "-"}</td>
              <td className="p-3">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${badgeMap[task.status]}`}>
                  {task.status}
                </span>
              </td>
              <td className="p-3">{task.assignee_id ?? "Unassigned"}</td>
              <td className="p-3 flex gap-2">
                {canUpdateTask(task) ? (
                  <select
                    className="border rounded px-2 py-1"
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as Task["status"])}
                  >
                    <option value="Todo">Todo</option>
                    <option value="Doing">Doing</option>
                    <option value="Done">Done</option>
                  </select>
                ) : (
                  <span className="text-xs text-slate-400">No update permission</span>
                )}
                {role === "Admin" && (
                  <button
                    className="rounded bg-rose-600 px-2 py-1 text-white"
                    onClick={() => onDelete(task.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {!tasks.length && (
            <tr>
              <td className="p-4 text-center text-slate-500" colSpan={5}>
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
