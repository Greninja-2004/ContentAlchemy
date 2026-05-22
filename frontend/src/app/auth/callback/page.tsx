"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      const messages: Record<string, string> = {
        google_token_failed: "Google authentication failed. Please try again.",
        google_userinfo_failed: "Could not fetch your Google profile.",
        google_missing_info: "Google did not return your email. Please try again.",
      };
      setErrorMsg(messages[error] || "Authentication failed.");
      setStatus("error");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (!token) {
      setErrorMsg("No authentication token received.");
      setStatus("error");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    api.setToken(token);
    api.getMe()
      .then((user) => {
        setUser(user);
        router.push("/dashboard");
      })
      .catch(() => {
        setErrorMsg("Failed to load your account. Please try again.");
        setStatus("error");
        setTimeout(() => router.push("/login"), 3000);
      });
  }, [searchParams, router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/20" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center space-y-5"
      >
        {status === "loading" ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-300/40"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50">
                Signing you in...
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                Setting up your ContentAlchemy account
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {[0, 0.15, 0.3].map((delay, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay }}
                  className="w-2 h-2 rounded-full bg-indigo-500"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto">
              <span className="text-3xl">⚠️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50">
                Authentication Error
              </h2>
              <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
                Redirecting you back to login...
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackInner />
    </Suspense>
  );
}
