"use client";

import { useState } from "react";

export type TaskPayload = {
  title: string;
  description?: string;
  assignee_id?: number;
  status?: "Todo" | "Doing" | "Done";
};

export default function TaskFormModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (payload: TaskPayload) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await onSubmit({
      title,
      description,
      assignee_id: assigneeId ? Number(assigneeId) : undefined,
      status: "Todo",
    });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <form className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl space-y-4" onSubmit={submit}>
        <h3 className="text-xl font-semibold">Create Task</h3>
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
        <input
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Assignee User ID (optional)"
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200">
            Cancel
          </button>
          <button disabled={submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
            {submitting ? "Saving..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
