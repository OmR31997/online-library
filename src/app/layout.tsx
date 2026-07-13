import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Library | Interactive Learning & Roadmaps",
  description: "Accelerate your learning path with structured roadmaps, interactive quizzes, and step-by-step tutorials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-200">
        {/* Decorative Grid and Ambient Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
        <div className="absolute top-0 left-1/4 right-1/4 h-[250px] bg-blue-500/10 blur-[100px] -z-10" />
        
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                  OL
                </div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  online-library
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                <Link href="/roadmap" className="hover:text-slate-100 transition-colors">
                  Roadmaps
                </Link>
                <Link href="/tutorials" className="hover:text-slate-100 transition-colors">
                  Tutorials
                </Link>
                <Link href="/quiz" className="hover:text-slate-100 transition-colors">
                  Quizzes
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 px-4 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex flex-col flex-1 relative">{children}</div>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} online-library. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-slate-200 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-slate-200 transition-colors">
                Terms of Service
              </Link>
              <Link href="/docs/api" className="hover:text-slate-200 transition-colors">
                API Docs
              </Link>
            </div>
          </div>
        </footer>

        {/* Toast Notification Provider */}
        <Toaster position="top-right" theme="dark" toastOptions={{ style: { background: "#0b0f19", borderColor: "#1e293b", color: "#f1f5f9" } }} />
      </body>
    </html>
  );
}
