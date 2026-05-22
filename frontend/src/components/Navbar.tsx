"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, Settings, Library, Sparkles, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        setMounted(true);
      }
    }, 0);
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    api.clearToken();
    logout();
    router.push("/");
  };

  return (
    <nav className="h-16 border-b border-slate-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ContentAlchemy
          </span>
        </Link>

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/library"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
            >
              Library
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
            >
              Settings
            </Link>
          </div>
        )}

        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 transition-colors"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </Button>
          )}

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors duration-200 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                  {user?.name || user?.email}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-xl text-slate-600 dark:text-zinc-400"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </Button>
          )}
          <button
            className="p-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-4 py-4 space-y-1 overflow-hidden"
          >
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/library"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <Library className="h-4 w-4" />
                  Library
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-900 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
