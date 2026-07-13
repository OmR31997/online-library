import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";

export const revalidate = 0; // Fetch fresh data on request

export default async function QuizzesPage() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Interactive Quizzes
        </h1>
        <p className="mt-4 text-slate-400 text-lg">
          Validate your knowledge with custom interactive questionnaires.
        </p>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center p-12 border border-slate-900 rounded-2xl bg-slate-950/40">
          <Trophy className="h-10 w-10 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No active quizzes found. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/30 p-6 hover:border-slate-800/80 hover:bg-slate-900/60 transition-all duration-300 shadow-lg"
            >
              <div>
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
                  <Trophy className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors line-clamp-2">
                  {quiz.title}
                </h2>
                <p className="mt-3 text-slate-400 text-xs leading-relaxed line-clamp-3">
                  {quiz.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900/50 flex items-center justify-end">
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors"
                >
                  Start Quiz
                  <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
