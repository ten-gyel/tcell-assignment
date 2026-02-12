"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body = new URLSearchParams();
      body.append("username", email);
      body.append("password", password);
      const response = await api.post("/api/auth/login", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      await login(response.data.access_token);
      router.push("/dashboard");
    } catch {
      setError("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4" onSubmit={onSubmit}>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-slate-600">Sign in to your dashboard</p>
        <input
          required
          type="email"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="password"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-500" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      {error && <Toast message={error} type="error" />}
    </div>
  );
}
