"use client";

import { useEffect, useState } from "react";

export type TaskPayload = {
  title: string;
  description?: string;
  assignee_id?: number;
  status?: "Todo" | "Doing" | "Done";
};

type UserOption = {
  id: number;
  email: string;
};

type TaskFormInitialValues = {
  title: string;
  description?: string;
  assignee_id?: number;
  status: "Todo" | "Doing" | "Done";
};

export default function TaskFormModal({
  onClose,
  onSubmit,
  users,
  mode = "create",
  initialValues,
}: {
  onClose: () => void;
  onSubmit: (payload: TaskPayload) => Promise<void>;
  users: UserOption[];
  mode?: "create" | "edit";
  initialValues?: TaskFormInitialValues;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState<"Todo" | "Doing" | "Done">("Todo");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initialValues) {
      return;
    }
    setTitle(initialValues.title);
    setDescription(initialValues.description || "");
    setAssigneeId(initialValues.assignee_id ? String(initialValues.assignee_id) : "");
    setStatus(initialValues.status);
  }, [initialValues]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await onSubmit({
      title,
      description,
      assignee_id: assigneeId ? Number(assigneeId) : undefined,
      status,
    });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <form className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl space-y-4" onSubmit={submit}>
        <h3 className="text-xl font-semibold">{mode === "edit" ? "Edit Task" : "Create Task"}</h3>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Description"
        />
        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "Todo" | "Doing" | "Done")}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="Todo">Todo</option>
          <option value="Doing">Doing</option>
          <option value="Done">Done</option>
        </select>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200">
            Cancel
          </button>
          <button disabled={submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
            {submitting ? "Saving..." : mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
