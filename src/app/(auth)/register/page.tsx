"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { UserPlus, User, Mail, Lock, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Failed to register.");
          return;
        }

        toast.success("Account created successfully!");
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
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Start charting your developer learning journey today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

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
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
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
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
