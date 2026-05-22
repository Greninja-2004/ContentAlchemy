"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomCursor } from "@/components/CustomCursor";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <CustomCursor />
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/20 transition-colors duration-300" />
      <div className="fixed inset-0 grid-pattern" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm px-4 relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-zinc-50">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-7 rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5"
        >
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-zinc-350">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1.5 h-11 rounded-xl border-slate-200 dark:border-zinc-800 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-all bg-transparent"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-zinc-350">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              className="mt-1.5 h-11 rounded-xl border-slate-200 dark:border-zinc-800 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-all bg-transparent"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 font-semibold shadow-md shadow-indigo-200 dark:shadow-none hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
