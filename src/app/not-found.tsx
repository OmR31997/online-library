import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10" />
      
      <main className="text-center max-w-md w-full border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <h1 className="text-8xl font-black tracking-wider bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent animate-pulse">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-200">
          Path Not Found
        </h2>
        <p className="mt-4 text-base text-slate-400 leading-relaxed">
          The educational resource, roadmap, or tutorial node you are seeking has either been moved, deleted, or was never charted.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Return Home
          </Link>
          <Link
            href="/roadmap"
            className="flex h-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/30 px-6 font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
          >
            Explore Roadmaps
          </Link>
        </div>
      </main>
    </div>
  );
}
