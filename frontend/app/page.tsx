import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-pink-500 to-yellow-400">
      <div className="mx-auto w-full max-w-4xl p-8">
        <div className="rounded-2xl bg-white/80 dark:bg-black/60 backdrop-blur-md p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div>
              <h1 className="text-6xl font-extrabold text-indigo-900 dark:text-white">Todo Demo</h1>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/todo/get" className="inline-block rounded-full bg-indigo-600 px-5 py-2 text-xl font-medium text-white shadow hover:opacity-95">View Tasks</Link>
                <Link href="/todo/post" className="inline-block rounded-full bg-pink-600 px-5 py-2 text-xl font-medium text-white shadow hover:opacity-95">Create Task</Link>
              </div>
            </div>

            <div className="hidden md:block w-56 text-center">
              <div className="inline-flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-300 to-pink-400 shadow-lg">
                <span className="text-4xl">📝</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
