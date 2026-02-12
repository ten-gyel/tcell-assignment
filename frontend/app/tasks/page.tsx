"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import TaskFormModal, { TaskPayload } from "../components/TaskFormModal";
import TaskTable from "../components/TaskTable";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";

type Task = {
  id: number;
  title: string;
  description?: string;
  status: "Todo" | "Doing" | "Done";
  assignee_id?: number;
};

type UserOption = {
  id: number;
  email: string;
  role: "Admin" | "Manager" | "Member" | "Viewer";
};

const getDisplayName = (email: string): string => email.split("@")[0] || email;

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [memberUsers, setMemberUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const memberOptions = useMemo(
    () => memberUsers.map((userOption) => ({ ...userOption, displayName: getDisplayName(userOption.email) })),
    [memberUsers],
  );

  const assigneeLabels = useMemo(
    () =>
      memberOptions.reduce<Record<number, string>>((acc, userOption) => {
        acc[userOption.id] = userOption.displayName;
        return acc;
      }, {}),
    [memberOptions],
  );

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get<Task[]>("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setToast({ message: "Failed to load tasks", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssignableUsers = useCallback(async () => {
    if (user?.role !== "Admin" && user?.role !== "Manager") {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.get<UserOption[]>("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMemberUsers(response.data.filter((u) => u.role === "Member"));
    } catch {
      setMemberUsers([]);
    }
  }, [user?.role]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchAssignableUsers();
  }, [fetchAssignableUsers]);

  const createTask = async (payload: TaskPayload) => {
    try {
      const token = localStorage.getItem("token");
      await api.post("/api/tasks", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowCreateModal(false);
      setToast({ message: "Task created", type: "success" });
      fetchTasks();
    } catch (err) {
      console.error("Task creation failed:", err);
      setToast({ message: "Task creation failed", type: "error" });
    }
  };

  const editTask = async (payload: TaskPayload) => {
    if (!editingTask) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.put(`/api/tasks/${editingTask.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditingTask(null);
      setToast({ message: "Task updated", type: "success" });
      fetchTasks();
    } catch (err) {
      console.error("Task update failed:", err);
      setToast({ message: "Task update failed", type: "error" });
    }
  };

  const updateStatus = async (taskId: number, status: Task["status"]) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/tasks/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setToast({ message: "Task updated", type: "success" });
      fetchTasks();
    } catch (err) {
      console.error("Status update failed:", err);
      setToast({ message: "Status update failed", type: "error" });
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!confirm("Delete this task?")) {
      return;
    }

    try {
      await api.delete(`/api/tasks/${taskId}`);
      setToast({ message: "Task deleted", type: "success" });
      fetchTasks();
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  const canCreateOrEdit = user?.role === "Admin" || user?.role === "Manager";

  return (
    <ProtectedRoute>
      <Layout title="Tasks">
        <div className="mb-4 flex justify-end">
          {canCreateOrEdit && (
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
              onClick={() => setShowCreateModal(true)}
            >
              Create Task
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-slate-600">Loading tasks...</div>
        ) : (
          <TaskTable
            tasks={tasks}
            role={user?.role}
            assigneeLabels={assigneeLabels}
            onStatusChange={updateStatus}
            onDelete={deleteTask}
            onEdit={(task) => setEditingTask(task)}
          />
        )}

        {showCreateModal && (
          <TaskFormModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={createTask}
            users={memberOptions}
            mode="create"
          />
        )}

        {editingTask && (
          <TaskFormModal
            onClose={() => setEditingTask(null)}
            onSubmit={editTask}
            users={memberOptions}
            mode="edit"
            initialValues={{
              title: editingTask.title,
              description: editingTask.description,
              assignee_id: editingTask.assignee_id,
              status: editingTask.status,
            }}
          />
        )}

        {toast && <Toast message={toast.message} type={toast.type} />}
      </Layout>
    </ProtectedRoute>
  );
}
