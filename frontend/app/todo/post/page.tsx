"use client";

import React, { useState } from "react";
import Link from "next/link";

type Task = {
  id: number;
  title: string;
  description: string;
};

export default function PostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
  const TITLE_MAX = 100;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${apiBase}/create-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Failed to add task");
      const newTask: Task = await res.json();
      setMessage({ type: "success", text: `Task created: ${newTask.title} (ID: ${newTask.id})` });
      setTitle("");
      setDescription("");
      // auto-hide success message after a short delay
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error creating task",
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-orange-200 to-red-200 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-700 via-rose-700 to-red-700 bg-clip-text text-transparent">Create a Task</h1>
            <p className="mt-2 text-lg text-pink-600">Add a new todo item.</p>
          </div>
          <Link href="/" className="text-base font-medium text-pink-700 hover:underline">← Home</Link>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 space-y-5 rounded-3xl bg-white/90 backdrop-blur p-8 shadow-lg">
          <div>
            <label className="block text-lg font-bold mb-2 text-pink-800">Title</label>
            <div className="relative">
            
+              
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border-2 border-pink-300 bg-white px-4 py-3 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="mt-2 text-base text-pink-600 font-medium">{title.length}/{TITLE_MAX} characters</div>
          </div>
          <div>
            <label className="block text-lg font-bold mb-2 text-pink-800">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border-2 border-pink-300 bg-white px-4 py-3 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter task description"
              rows={5}
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading || title.length > TITLE_MAX}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 px-7 py-3 text-base font-bold text-white shadow-lg disabled:opacity-60 hover:shadow-xl"
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                'Create Task'
              )}
            </button>
            <button type="button" onClick={() => { setTitle(''); setDescription(''); }} className="text-base text-pink-700 hover:underline font-medium">Reset</button>
          </div>
        </form>

        {message && (
          <div
            className={`rounded-md p-3 text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Floating toast for success (slide in) */}
        {message && message.type === 'success' && (
          <div className="fixed right-6 top-6 z-50 transform transition-all duration-300">
            <div className="rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-3 shadow-lg flex items-center gap-3">
              <div className="text-2xl">✅</div>
              <div className="text-sm">{message.text}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
