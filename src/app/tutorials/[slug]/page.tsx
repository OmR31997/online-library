import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, Calendar } from "lucide-react";
import { formatDate } from "../../../lib/utils";

export const revalidate = 0; // Fetch fresh data on request

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Simple custom component parser to render basic markdown elements dynamically
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const elements: React.JSX.Element[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let listItems: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-6 my-4 space-y-2 text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = (key: number) => {
    if (tableRows.length > 0) {
      // Extract header row
      const headers = tableRows[0];
      const dataRows = tableRows.slice(2); // row 1 is separator |---|---|

      elements.push(
        <div key={`table-wrapper-${key}`} className="overflow-x-auto my-6 border border-slate-900 rounded-xl">
          <table className="min-w-full divide-y divide-slate-900 bg-slate-950/40 text-sm">
            <thead className="bg-slate-900/50">
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx} className="px-4 py-3 text-left font-semibold text-slate-200">
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-900/10">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 text-slate-400">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // Closing code block
        inCodeBlock = false;
        elements.push(
          <pre key={`code-${i}`} className="bg-slate-900 border border-slate-800 p-5 rounded-xl my-6 overflow-x-auto font-mono text-xs text-indigo-300 leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        codeLines = [];
      } else {
        // Opening code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Handle markdown tables
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      flushList(i);
      inTable = true;
      const cells = line
        .split("|")
        .slice(1, -1) // remove empty cells from start and end splits
        .map((cell) => cell.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable(i);
    }

    // Handle list items
    if (line.trim().startsWith("* ") || line.trim().startsWith("- ") || line.trim().startsWith("1. ")) {
      const cleanItem = line.replace(/^(\*\s|-\s|\d+\.\s)/, "");
      listItems.push(cleanItem);
      continue;
    } else {
      flushList(i);
    }

    // Handle headings
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-extrabold text-white mt-10 mb-4 border-b border-slate-900 pb-2 tracking-tight">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-slate-200 mt-8 mb-3 tracking-tight">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={i} className="text-base font-semibold text-slate-300 mt-6 mb-2">
          {line.replace("#### ", "")}
        </h4>
      );
    } else if (line.trim() === "---") {
      elements.push(<hr key={i} className="my-8 border-slate-900" />);
    } else if (line.trim()) {
      elements.push(
        <p key={i} className="text-slate-400 text-sm leading-relaxed my-4">
          {line}
        </p>
      );
    }
  }

  // Flush remaining buffers
  flushList(lines.length);
  flushTable(lines.length);

  return <div className="markdown-body">{elements}</div>;
}

export default async function TutorialDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const tutorial = await prisma.tutorial.findUnique({
    where: { slug },
    include: {
      roadmap: true,
    },
  });

  if (!tutorial) {
    notFound();
  }

  // Extract chapter numbers and titles
  const chapterMatch = tutorial.title.match(/Chapter (\d+):/i);
  const chapterNum = chapterMatch ? `Chapter ${chapterMatch[1]}` : "Tutorial Node";
  const cleanTitle = tutorial.title.replace(/Chapter \d+:\s*/i, "");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Navigation Headers */}
      <div className="mb-8">
        <Link
          href={tutorial.roadmap ? `/tutorials?subject=${tutorial.roadmap.slug}` : "/tutorials"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chapters
        </Link>
      </div>

      {/* Main Chapter Content Card */}
      <article className="border border-slate-900 bg-slate-950/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
        <header className="mb-10 pb-8 border-b border-slate-900">
          <div className="flex items-center gap-3 text-xs font-semibold text-blue-400 mb-4">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/10">
              {chapterNum}
            </span>
            {tutorial.roadmap && (
              <span className="text-slate-500">
                / {tutorial.roadmap.title}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {cleanTitle}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Updated {formatDate(tutorial.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Read length: ~10 mins</span>
            </div>
          </div>
        </header>

        {/* Render Formatted Markdown Details */}
        <MarkdownRenderer content={tutorial.content} />
      </article>
    </div>
  );
}
