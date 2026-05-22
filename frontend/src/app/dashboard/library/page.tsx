"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import { api, GenerationItem } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LibraryPage() {
  const [items, setItems] = useState<GenerationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, setUser } = useAuthStore();
  const router = useRouter();

  const loadLibrary = async () => {
    try {
      const data = await api.getLibrary();
      setItems(data.items);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!isAuthenticated) {
      api.getMe().then(setUser).catch(() => router.push("/login"));
    }
    const timer = setTimeout(() => {
      loadLibrary();
    }, 0);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router, setUser]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteGeneration(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => prev - 1);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const getFormatsGenerated = (item: GenerationItem) => {
    const formats: string[] = [];
    if (item.tiktok_script) formats.push("TikTok");
    if (item.linkedin_post) formats.push("LinkedIn");
    if (item.twitter_thread) formats.push("Twitter");
    if (item.instagram_caption) formats.push("Instagram");
    if (item.newsletter_draft) formats.push("Newsletter");
    if (item.youtube_description) formats.push("YouTube");
    if (item.email_subject) formats.push("Email");
    if (item.reddit_post) formats.push("Reddit");
    return formats;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Your Generations</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {total} total generation{total !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-40 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 text-slate-350 dark:text-zinc-650 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-zinc-400">No generations yet.</p>
            <Button
              variant="outline"
              className="mt-4 border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900"
              onClick={() => router.push("/dashboard")}
            >
              Create your first
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800/80 p-5 hover:border-indigo-200 dark:hover:border-indigo-850 hover:shadow-sm transition-all"
              >
                <p className="text-sm text-slate-700 dark:text-zinc-300 line-clamp-3 mb-3 font-medium">
                  {item.original_content}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {getFormatsGenerated(item).map((fmt) => (
                    <Badge key={fmt} variant="secondary" className="text-xs bg-slate-100 dark:bg-zinc-800 text-slate-750 dark:text-zinc-350 border-slate-200/50 dark:border-zinc-700/60">
                      {fmt}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {new Date(item.created_at).toLocaleDateString()}
                    {item.generation_time_ms && (
                      <span className="ml-1">({(item.generation_time_ms / 1000).toFixed(1)}s)</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 w-8 p-0"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
