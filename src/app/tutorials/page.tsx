import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { BookOpen, ArrowLeft, ArrowRight, Layers, HelpCircle } from "lucide-react";

export const revalidate = 0; // Fetch fresh data on request

interface PageProps {
  searchParams: Promise<{ subject?: string }>;
}

export default async function TutorialsPage({ searchParams }: PageProps) {
  const { subject } = await searchParams;

  if (subject) {
    // 1. Chapter Selection State
    const roadmap = await prisma.roadmap.findUnique({
      where: { slug: subject },
      include: {
        tutorials: {
          where: { published: true },
        },
      },
    });

    if (!roadmap) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-white">Subject Not Found</h2>
          <Link href="/tutorials" className="mt-4 inline-flex items-center gap-2 text-blue-400 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Subjects
          </Link>
        </div>
      );
    }

    // Natural sort helper (e.g. Chapter 1, Chapter 2, Chapter 10)
    const sortedTutorials = [...roadmap.tutorials].sort((a, b) => {
      const matchA = a.title.match(/Chapter (\d+):/i);
      const matchB = b.title.match(/Chapter (\d+):/i);
      if (matchA && matchB) {
        return parseInt(matchA[1]) - parseInt(matchB[1]);
      }
      return a.title.localeCompare(b.title);
    });

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link
            href="/tutorials"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Subjects
          </Link>
        </div>

        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Subject Course
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-4 sm:text-4xl">
            {roadmap.title}
          </h1>
          <p className="mt-3 text-slate-400 leading-relaxed">
            {roadmap.description}
          </p>
        </div>

        {sortedTutorials.length === 0 ? (
          <div className="text-center p-12 border border-slate-900 rounded-2xl bg-slate-950/40">
            <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No chapters released for this subject yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedTutorials.map((tutorial, index) => {
              // Extract chapter number for badge
              const chapterMatch = tutorial.title.match(/Chapter (\d+):/i);
              const chapterNum = chapterMatch ? `Chapter ${chapterMatch[1]}` : `Part ${index + 1}`;
              const cleanTitle = tutorial.title.replace(/Chapter \d+:\s*/i, "");

              return (
                <div
                  key={tutorial.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/30 p-6 hover:border-slate-800/80 hover:bg-slate-900/60 transition-all duration-300 shadow-lg"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/10">
                        {chapterNum}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                      {cleanTitle}
                    </h2>
                    <p className="mt-2 text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {tutorial.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-900/50 flex items-center justify-end">
                    <Link
                      href={`/tutorials/${tutorial.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors"
                    >
                      Read Content
                      <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 2. Subject Selection State (Default View)
  const subjects = await prisma.roadmap.findMany({
    where: { published: true },
    include: {
      _count: {
        select: { tutorials: { where: { published: true } } },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Course Subjects
        </h1>
        <p className="mt-4 text-slate-400 text-lg">
          Select a subject card below to browse all available chapter-wise tutorials.
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center p-12 border border-slate-900 rounded-2xl bg-slate-950/40">
          <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No subjects currently available. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/tutorials?subject=${subject.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/30 p-8 hover:border-slate-800/80 hover:bg-slate-900/60 hover:scale-[1.01] transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                    <Layers className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {subject._count.tutorials} Chapters
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-100 group-hover:text-white transition-colors">
                  {subject.title}
                </h2>
                <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                  {subject.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-900/50 flex items-center justify-between text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                <span>Browse Chapters</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
