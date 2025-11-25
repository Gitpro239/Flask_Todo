"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Task = {
  id: number;
  title: string;
  description: string;
  is_completed?: boolean;
};

export default function GetPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  function toggleLocalComplete(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, is_completed: !t.is_completed } : t)));
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/list-tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching tasks");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTask(id: number) {
    try {
      const res = await fetch(`${apiBase}/delete-task/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      // Remove from local UI
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  // UI state: search and filters (client-side)
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filter === "open" && t.is_completed) return false;
      if (filter === "done" && !t.is_completed) return false;
      if (!q) return true;
      return (t.title + " " + t.description).toLowerCase().includes(q);
    });
  }, [tasks, query, filter]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">Your Tasks</h1>
          </div>
          <Link href="/" className="text-base font-medium text-indigo-700 hover:underline">← Home</Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchTasks}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95"
            >
              Refresh
            </button>
            {error && <div className="text-sm text-red-600">Error: {error}</div>}
          </div>

          <div className="flex items-center gap-3 ml-auto w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                <circle cx="11" cy="11" r="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-full border border-indigo-100 text-gray-900 bg-white/80 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white/60 text-indigo-700'}`}>All</button>
              <button onClick={() => setFilter("open")} className={`px-3 py-1 rounded-full text-sm ${filter === 'open' ? 'bg-yellow-400 text-white' : 'bg-white/60 text-indigo-700'}`}>Open</button>
              <button onClick={() => setFilter("done")} className={`px-3 py-1 rounded-full text-sm ${filter === 'done' ? 'bg-green-500 text-white' : 'bg-white/60 text-indigo-700'}`}>Done</button>
            </div>
          </div>
        </div>

        <section>
          {!error && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-indigo-900">Tasks ({filtered.length}) <span className="text-xl text-indigo-600">/ {tasks.length} total</span></h2>

              {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="rounded-lg bg-white/90 p-4 shadow animate-pulse">
                      <div className="h-4 w-3/4 rounded bg-indigo-100 mb-2" />
                      <div className="h-3 w-full rounded bg-indigo-100" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-indigo-300 bg-white/80 p-12 text-center">
                  <div className="text-6xl">✨</div>
                  <p className="mt-4 text-xl text-indigo-600 font-medium">No tasks found — try changing filters or creating a new task.</p>
                </div>
              ) : (
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((t) => (
                    <li
                      key={t.id}
                      className={`rounded-2xl bg-gradient-to-br from-white to-indigo-50 p-6 shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-150 relative overflow-hidden ${
                        t.is_completed ? 'opacity-85 ring-2 ring-green-300' : 'ring-1 ring-indigo-100'
                      }`}
                      
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400" />
                      <div className="flex items-start justify-between gap-4 ml-2">
                        <div className="flex-1">
                          <div className={`font-bold text-xl text-indigo-900 ${t.is_completed ? 'line-through text-zinc-500' : ''}`}>{t.title}</div>
                          <div className={`mt-2 text-base ${t.is_completed ? 'text-zinc-400' : 'text-indigo-700'}`}>{t.description}</div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 px-4 py-2 text-sm font-bold text-indigo-900">#{t.id}</span>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => toggleLocalComplete(t.id)}
                              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${t.is_completed ? 'bg-gradient-to-r from-green-300 to-emerald-300 text-green-900 shadow-md' : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200'}`}
                              aria-pressed={t.is_completed}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                              </svg>
                              <span>{t.is_completed ? 'Completed' : 'Mark'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="mt-3 flex items-center gap-2">                      
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-4 py-2 text-sm font-medium hover:from-red-200 hover:to-red-300 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" 
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Delete
                      </button>
                    </div>
                    </div>

                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
