import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { Compass, ArrowRight, Layers } from "lucide-react";

export const revalidate = 0; // Fetch fresh data on request

export default async function RoadmapsPage() {
  const roadmaps = await prisma.roadmap.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Developer Roadmaps
        </h1>
        <p className="mt-4 text-slate-400 text-lg">
          Follow these structured pathway guides to master different software development domains.
        </p>
      </div>

      {roadmaps.length === 0 ? (
        <div className="text-center p-12 border border-slate-900 rounded-2xl bg-slate-950/40">
          <Compass className="h-10 w-10 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No active roadmaps found. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/30 p-8 hover:border-slate-800/80 hover:bg-slate-900/60 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <Layers className="h-6 w-6 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Track Path
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-100 group-hover:text-white transition-colors">
                  {roadmap.title}
                </h2>
                <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                  {roadmap.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-900/50 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Includes {(roadmap.nodes as any[])?.length || 0} milestones
                </span>
                <Link
                  href={`/roadmap/${roadmap.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors"
                >
                  View Path
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
