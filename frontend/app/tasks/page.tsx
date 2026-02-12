"use client";

import { useEffect, useState } from "react";
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

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

 const fetchTasks = async () => {
  try {
    const token = localStorage.getItem("token"); // get stored token
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
};


  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (payload: TaskPayload) => {
    try {
      const token = localStorage.getItem("token"); // get stored token
      console.log("this is my token",token);
      await api.post("/api/tasks", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowModal(false);
      setToast({ message: "Task created", type: "success" });
      fetchTasks(); // refresh task list
    } catch (err) {
      console.error("Task creation failed:", err);
      setToast({ message: "Task creation failed", type: "error" });
    }
  };


const updateStatus = async (taskId: number, status: Task["status"]) => {
  try {
    const token = localStorage.getItem("token"); // get token from localStorage
    await api.put(`/api/tasks/${taskId}`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setToast({ message: "Task updated", type: "success" });
    fetchTasks(); // refresh tasks
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

  const canCreate = user?.role === "Admin" || user?.role === "Manager";

  return (
    <ProtectedRoute>
      <Layout title="Tasks">
        <div className="mb-4 flex justify-end">
          {canCreate && (
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
              onClick={() => setShowModal(true)}
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
            currentUserId={user?.id}
            onStatusChange={updateStatus}
            onDelete={deleteTask}
          />
        )}

        {showModal && <TaskFormModal onClose={() => setShowModal(false)} onSubmit={createTask} />}
        {toast && <Toast message={toast.message} type={toast.type} />}
      </Layout>
    </ProtectedRoute>
  );
}
