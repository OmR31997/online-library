import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Trophy, Sparkles, Terminal, Layers } from "lucide-react";

export default function Home() {
  const tracks = [
    {
      title: "Interactive Roadmaps",
      description: "Step-by-step visual pathways to master complex engineering domains including Frontend, Backend, and DevOps.",
      icon: Compass,
      color: "from-blue-500 to-indigo-500",
      link: "/roadmap",
      tag: "Popular",
    },
    {
      title: "Step-by-Step Tutorials",
      description: "Structured guides covering everything from framework fundamentals (Next.js, Prisma) to advanced architecture concepts.",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      link: "/tutorials",
      tag: "Updated",
    },
    {
      title: "Interactive Quizzes",
      description: "Validate your knowledge at key junctions. Track scores and gain comprehensive badges for completing modules.",
      icon: Trophy,
      color: "from-amber-500 to-orange-500",
      link: "/quiz",
      tag: "Interactive",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-400 mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span>Introducing online-library Roadmap Platform v1.0</span>
        </div>
        
        <h1 className="max-w-4xl mx-auto text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
          Master Modern Tech with{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Interactive Learning
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed">
          Accelerate your developer career. Explore step-by-step roadmaps, deep-dive into rich tutorials, and validate your knowledge with real-time coding quizzes.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/roadmap"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Roadmaps
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/register"
            className="flex h-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/80 px-8 text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Tracks/Categories Section */}
      <section className="w-full bg-slate-950/40 py-24 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Choose Your Learning Track
            </h2>
            <p className="mt-4 text-slate-400">
              No matter where you are on your software engineering journey, we provide the resources you need to level up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tracks.map((track, i) => {
              const Icon = track.icon;
              return (
                <div
                  key={i}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/40 p-8 hover:border-slate-800/80 hover:bg-slate-900/70 transition-all duration-300 shadow-lg"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${track.color} shadow-lg shadow-blue-500/5`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300">
                        {track.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
                      {track.title}
                    </h3>
                    <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                      {track.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-900/50">
                    <Link
                      href={track.link}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors"
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Callout Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <Terminal className="h-10 w-10 text-indigo-400 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Built on Enterprise Architecture
          </h2>
          <p className="mt-4 text-slate-400">
            Our learning platform leverages a fully modular, production-ready backend following SOLID design patterns, repository architectures, and real-time caching.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs font-mono font-semibold text-slate-500">
            <span className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800">Next.js App Router</span>
            <span className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800">TypeScript</span>
            <span className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800">PostgreSQL (Prisma)</span>
            <span className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800">Redis Cache</span>
            <span className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800">JWT Token Security</span>
          </div>
        </div>
      </section>
    </div>
  );
}
