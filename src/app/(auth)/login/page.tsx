"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Shield, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Failed to log in.");
          return;
        }

        toast.success("Welcome back! Logging in...");
        router.push("/");
        router.refresh();
      } catch (err) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
      <div className="w-full max-w-md border border-slate-900 bg-slate-950/40 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign In</h1>
          <p className="mt-2 text-sm text-slate-400">
            Access your roadmaps and track your progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 font-bold text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
