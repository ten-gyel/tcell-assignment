"use client";

export default function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div
      className={`fixed bottom-4 right-4 rounded-lg px-4 py-3 text-white shadow-lg ${
        type === "success" ? "bg-emerald-600" : "bg-rose-600"
      }`}
    >
      {message}
    </div>
  );
}
