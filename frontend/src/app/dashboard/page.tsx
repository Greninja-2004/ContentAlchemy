"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { api, GenerationItem } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { InputPanel } from "@/components/InputPanel";
import { CustomCursor } from "@/components/CustomCursor";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { toast } from "sonner";
import { 
  Sparkles, 
  Hourglass, 
  Database, 
  Cpu, 
  ArrowRight, 
  Clock, 
  Trash2, 
  Eye, 
  Zap, 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  ChevronRight, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, useScroll } from "framer-motion";

const TEMPLATES = [
  {
    title: "Engineering Blog to Thread",
    description: "Convert a deep-dive technical post into an X thread.",
    icon: "🐦",
    sourceType: "blog_link",
    tone: "educational",
    formats: ["twitter_thread", "linkedin_post"],
    placeholderContent: "https://blog.alchemy.dev/why-git-is-just-a-dag-of-objects",
  },
  {
    title: "YouTube Tutorial to LinkedIn Post",
    description: "Extract the core highlights from a technical walkthrough.",
    icon: "💼",
    sourceType: "youtube_url",
    tone: "professional",
    formats: ["linkedin_post", "newsletter_draft"],
    placeholderContent: "https://www.youtube.com/watch?v=F3G95a12T9s",
  },
  {
    title: "PR Best Practices Outline",
    description: "Translate code design principles into developer-advocacy posts.",
    icon: "📝",
    sourceType: "text_paste",
    tone: "casual",
    formats: ["linkedin_post", "twitter_thread"],
    placeholderContent: "Treat code reviews like editorial reviews. Clear descriptions, inline comments, and self-documenting code save more hours than AI coding assistants. Make readability your team's primary KPI.",
  },
];

const FORMAT_META: Record<string, { icon: string; label: string; color: string }> = {
  tiktok_script: { icon: "🎵", label: "TikTok Script", color: "from-pink-500 to-rose-500" },
  linkedin_post: { icon: "💼", label: "LinkedIn Post", color: "from-blue-600 to-blue-700" },
  twitter_thread: { icon: "🐦", label: "Twitter Thread", color: "from-sky-400 to-sky-500" },
  instagram_caption: { icon: "📸", label: "Instagram Caption", color: "from-purple-500 to-pink-500" },
  newsletter_draft: { icon: "📧", label: "Newsletter", color: "from-emerald-500 to-teal-500" },
  youtube_description: { icon: "🎬", label: "YouTube Description", color: "from-red-500 to-red-600" },
  email_subject: { icon: "✉️", label: "Email Campaign", color: "from-amber-500 to-orange-500" },
  reddit_post: { icon: "🤖", label: "Reddit Post", color: "from-orange-500 to-red-500" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90, damping: 14 } }
};

export default function DashboardPage() {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const router = useRouter();
  const { scrollYProgress } = useScroll();

  const [usage, setUsage] = useState<{
    daily_count: number;
    daily_limit: number;
    total_count: number;
    tier: string;
  } | null>(null);

  const [recentItems, setRecentItems] = useState<GenerationItem[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [selectedRecent, setSelectedRecent] = useState<GenerationItem | null>(null);
  const [prefill, setPrefill] = useState<{
    content: string;
    sourceType: string;
    tone: string;
    formats: string[];
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [modalCopiedKey, setModalCopiedKey] = useState<string | null>(null);

  const loadUsage = async () => {
    try {
      const u = await api.getUsage();
      setUsage(u);
    } catch (err) {
      console.error("Failed to load usage statistics", err);
    }
  };

  const loadRecent = async () => {
    try {
      const data = await api.getLibrary(4, 0); // Load latest 4
      setRecentItems(data.items);
    } catch (err) {
      console.error("Failed to load recent generations", err);
    } finally {
      setRecentLoading(false);
    }
  };

  const refreshAllTelemetry = useCallback(() => {
    loadUsage();
    loadRecent();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!isAuthenticated) {
      api.getMe().then((updatedUser) => {
        setUser(updatedUser);
        loadUsage();
        loadRecent();
      }).catch(() => {
        api.clearToken();
        router.push("/login");
      });
    } else {
      const timer = setTimeout(() => {
        refreshAllTelemetry();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router, setUser, refreshAllTelemetry]);

  const handleDeleteRecent = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteGeneration(id);
      toast.success("Generation removed");
      refreshAllTelemetry();
      if (selectedRecent?.id === id) {
        setSelectedRecent(null);
      }
    } catch {
      toast.error("Failed to remove generation");
    }
  };

  const copyText = async (text: string, key: string, isModal = false) => {
    await navigator.clipboard.writeText(text);
    if (isModal) {
      setModalCopiedKey(key);
      toast.success("Copied!");
      setTimeout(() => setModalCopiedKey(null), 2000);
    } else {
      setCopiedKey(key);
      toast.success("Copied!");
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const downloadSingleOutput = (label: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${label.toLowerCase().replace(/\s+/g, "-")}-export.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${label} output!`);
  };

  const formatSavedTime = (totalCount: number) => {
    const totalMins = totalCount * 15;
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hrs === 0) return `${mins} mins`;
    if (mins === 0) return `${hrs} hrs`;
    return `${hrs}h ${mins}m`;
  };

  const getOutputsList = (item: GenerationItem) => {
    const list: { format: string; text: string; icon: string; label: string; color: string }[] = [];
    const fields = [
      "tiktok_script",
      "linkedin_post",
      "twitter_thread",
      "instagram_caption",
      "newsletter_draft",
      "youtube_description",
      "email_subject",
      "reddit_post"
    ] as const;

    fields.forEach((field) => {
      const val = item[field];
      if (val) {
        const meta = FORMAT_META[field] || { icon: "📝", label: field, color: "from-slate-500 to-slate-650" };
        list.push({
          format: field,
          text: val,
          icon: meta.icon,
          label: meta.label,
          color: meta.color
        });
      }
    });
    return list;
  };

  const getFormatsSummaryIcons = (item: GenerationItem) => {
    const icons: string[] = [];
    if (item.tiktok_script) icons.push("🎵");
    if (item.linkedin_post) icons.push("💼");
    if (item.twitter_thread) icons.push("🐦");
    if (item.instagram_caption) icons.push("📸");
    if (item.newsletter_draft) icons.push("📧");
    if (item.youtube_description) icons.push("🎬");
    if (item.email_subject) icons.push("✉️");
    if (item.reddit_post) icons.push("🤖");
    return icons;
  };

  const handleApplyTemplate = (tpl: typeof TEMPLATES[number]) => {
    setPrefill({
      content: tpl.placeholderContent,
      sourceType: tpl.sourceType,
      tone: tpl.tone,
      formats: tpl.formats,
    });
    toast.info(`Loaded "${tpl.title}" recipe!`);
  };

  // Radial progress calculations
  const limit = usage?.daily_limit ?? 2;
  const count = usage?.daily_count ?? 0;
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 100 : Math.min(100, (count / limit) * 100);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950/50 text-slate-900 dark:text-zinc-50 relative transition-colors duration-200 overflow-x-hidden pb-12">
      <CustomCursor />
      <AnimatedBackground />

      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      
      {/* Dynamic scrolling top progress bar */}
      <motion.div className="scroll-progress-bar" style={{ scaleX: scrollYProgress }} />

      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col gap-4 bg-white/40 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-zinc-800/40 p-5 sm:p-8 rounded-3xl backdrop-blur-xl shadow-sm">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/40 animate-pulse">
                <Sparkles className="h-3 w-3" />
                ContentAlchemy Engine v2.0
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
                Welcome back, {user?.name || "Creator"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl">
                Convert articles, pastes, or videos into high-engagement format variations instantly.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/settings")}
                className="border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-sm"
              >
                Account Settings
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/dashboard/library")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-sm text-sm cursor-pointer"
              >
                View Library
              </Button>
            </div>
          </div>

          {/* Metrics Telemetry Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            
            {/* Usage Quota Meter */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800/60 p-5 rounded-2xl backdrop-blur-md shadow-sm flex items-center justify-between card-hover"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest block font-heading">Daily Quota</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-slate-800 dark:text-zinc-150">
                    {isUnlimited ? "Unlimited" : `${count} / ${limit}`}
                  </span>
                  <Badge className="text-[9px] uppercase tracking-wide bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/20">
                    {usage?.tier || "Free"}
                  </Badge>
                </div>
                {!isUnlimited && count >= limit ? (
                  <button 
                    onClick={() => router.push("/dashboard/settings")}
                    className="text-[10px] text-rose-500 hover:text-rose-600 font-bold block transition-colors cursor-pointer"
                  >
                    Limit Reached! Upgrade plan.
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push("/dashboard/settings")}
                    className="text-[10px] text-indigo-500 dark:text-indigo-400 hover:underline block font-semibold transition-colors cursor-pointer"
                  >
                    Manage usage limits
                  </button>
                )}
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-slate-100 dark:text-zinc-850"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="32"
                    cy="32"
                  />
                  <circle
                    className="text-indigo-600 dark:text-indigo-550 transition-all duration-700 ease-out"
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="32"
                    cy="32"
                  />
                </svg>
                <div className="absolute text-xs font-extrabold text-slate-700 dark:text-zinc-350">
                  {isUnlimited ? "∞" : `${Math.round(percentage)}%`}
                </div>
              </div>
            </motion.div>

            {/* Total Time Saved */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800/60 p-5 rounded-2xl backdrop-blur-md shadow-sm flex items-center justify-between card-hover"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest block font-heading">Saved Effort</span>
                <span className="text-lg font-bold text-slate-800 dark:text-zinc-150 block">
                  {usage ? formatSavedTime(usage.total_count) : "0 mins"}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-550 block">
                  Est. 15m saved per render
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Hourglass className="h-5 w-5" />
              </div>
            </motion.div>

            {/* Total Creations */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800/60 p-5 rounded-2xl backdrop-blur-md shadow-sm flex items-center justify-between card-hover"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest block font-heading">Total Creations</span>
                <span className="text-lg font-bold text-slate-800 dark:text-zinc-150 block">
                  {usage?.total_count ?? 0} items
                </span>
                <button
                  onClick={() => router.push("/dashboard/library")}
                  className="text-[10px] text-slate-400 dark:text-zinc-550 hover:text-indigo-500 dark:hover:text-indigo-400 hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
                >
                  Explore library index <ChevronRight className="h-2.5 w-2.5" />
                </button>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Database className="h-5 w-5" />
              </div>
            </motion.div>

            {/* Engine Status */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800/60 p-5 rounded-2xl backdrop-blur-md shadow-sm flex items-center justify-between card-hover"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest block font-heading">Alchemy Engine</span>
                <span className="text-lg font-bold text-slate-800 dark:text-zinc-150 flex items-center gap-1.5">
                  Gemini API Flash
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-550 block">
                  Latency: Healthy (Flash LLM)
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
            </motion.div>

          </motion.div>

          {/* Main workspace layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
            
            {/* Content Generator Column */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-450 dark:text-zinc-550 uppercase tracking-widest">Workspace</span>
                  <span className="h-px bg-slate-200 dark:bg-zinc-800 w-16" />
                </div>
              </div>
              <InputPanel 
                prefill={prefill} 
                onPrefillUsed={() => setPrefill(null)} 
                onGenerationSuccess={refreshAllTelemetry} 
              />
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Quick Preset Recipes */}
              <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800/60 p-5 rounded-2xl backdrop-blur-md shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2 mb-1.5">
                  <Zap className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                  Quick Recipe Presets
                </h2>
                <p className="text-[11px] text-slate-400 dark:text-zinc-550 mb-4">
                  Select a preset template recipe to prefill options and input format guidelines immediately.
                </p>
                <div className="space-y-2.5">
                  {TEMPLATES.map((tpl, i) => (
                    <motion.div
                      key={tpl.title}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleApplyTemplate(tpl)}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-950/20 hover:border-indigo-300 dark:hover:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-850/40 cursor-pointer transition-all group flex items-start justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{tpl.icon}</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {tpl.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-tight">
                          {tpl.description}
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-350 dark:text-zinc-650 group-hover:translate-x-0.5 transition-transform" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Generations Feed */}
              <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800/60 p-5 rounded-2xl backdrop-blur-md shadow-sm flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    Recent Creations
                  </h2>
                  <button
                    onClick={() => router.push("/dashboard/library")}
                    className="text-[10px] text-indigo-500 dark:text-indigo-400 hover:underline font-bold"
                  >
                    View All
                  </button>
                </div>

                {recentLoading ? (
                  <div className="flex-1 flex flex-col gap-3 justify-center py-6">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-14 rounded-xl bg-slate-100 dark:bg-zinc-800/40 animate-pulse" />
                    ))}
                  </div>
                ) : recentItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <Database className="h-8 w-8 text-slate-300 dark:text-zinc-700 mb-2" />
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                      No generations yet. Try creating content above!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 flex-1">
                    {recentItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setSelectedRecent(item)}
                        className="p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 hover:border-indigo-200 dark:hover:border-indigo-900/60 hover:shadow-xs cursor-pointer transition-all group relative flex flex-col justify-between"
                      >
                        <p className="text-[11px] text-slate-650 dark:text-zinc-350 line-clamp-2 font-medium mb-2.5 pr-6 leading-relaxed">
                          {item.original_content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1 items-center">
                            {getFormatsSummaryIcons(item).slice(0, 4).map((ico, idx) => (
                              <span key={idx} className="text-xs bg-slate-50 dark:bg-zinc-900 px-1 py-0.5 rounded border border-slate-200/20 dark:border-zinc-800/40">
                                {ico}
                              </span>
                            ))}
                            {getFormatsSummaryIcons(item).length > 4 && (
                              <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold ml-0.5">
                                +{getFormatsSummaryIcons(item).length - 4} more
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-800 dark:hover:text-zinc-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRecent(item);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
                              onClick={(e) => handleDeleteRecent(item.id, e)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* High-Fidelity Preview Dialog Modal */}
      <Dialog 
        open={!!selectedRecent} 
        onOpenChange={(open) => { if (!open) setSelectedRecent(null); }}
      >
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl shadow-2xl p-6 sm:p-8">
          {selectedRecent && (
            <div className="space-y-6">
              
              <DialogHeader className="border-b border-slate-200/50 dark:border-zinc-900/60 pb-4">
                <div className="flex items-center justify-between pr-6">
                  <div className="space-y-1">
                    <DialogTitle className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                      Generated Outputs
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-400 dark:text-zinc-500">
                      Created on {new Date(selectedRecent.created_at).toLocaleString()} 
                      {selectedRecent.generation_time_ms && ` (took ${(selectedRecent.generation_time_ms / 1000).toFixed(1)}s)`}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Multi-Pane Layout inside Modal */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
                
                {/* Left Source Info (2/5 cols) */}
                <div className="lg:col-span-2 space-y-4 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200/40 dark:border-zinc-800/30 p-4 rounded-xl h-fit">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Source Input Type</span>
                    <Badge className="ml-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/20 text-[10px] font-semibold py-0">
                      {selectedRecent.content_source.replace("_", " ")}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Tone Profile</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-350 capitalize bg-slate-100 dark:bg-zinc-850 px-2 py-0.5 rounded">
                      ✨ {selectedRecent.tone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Original Manuscript</span>
                    <p className="text-xs text-slate-650 dark:text-zinc-400 leading-relaxed max-h-48 overflow-y-auto pr-1 font-sans bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900/80 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedRecent.original_content}
                    </p>
                  </div>
                </div>

                {/* Right Formats Outputs (3/5 cols) */}
                <div className="lg:col-span-3 space-y-5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Channel Output Formats</span>
                  
                  <div className="space-y-4">
                    {getOutputsList(selectedRecent).map((out) => (
                      <div 
                        key={out.format} 
                        className="rounded-xl border border-slate-200/60 dark:border-zinc-900/80 bg-white dark:bg-zinc-900/40 overflow-hidden flex flex-col justify-between"
                      >
                        {/* Output header banner */}
                        <div className="bg-slate-50 dark:bg-zinc-900/60 px-4 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-zinc-900">
                          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                            <span className="text-base">{out.icon}</span>
                            {out.label}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2.5 text-[10px] rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
                              onClick={() => copyText(out.text, out.format, true)}
                            >
                              {modalCopiedKey === out.format ? (
                                <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                                  <Check className="h-3 w-3" /> Copied!
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5 text-slate-500 dark:text-zinc-450">
                                  <Copy className="h-3 w-3" /> Copy
                                </span>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-slate-800 dark:hover:text-zinc-350"
                              onClick={() => downloadSingleOutput(out.label, out.text)}
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Output contents */}
                        <textarea
                          readOnly
                          value={out.text}
                          className="w-full min-h-[140px] bg-transparent text-xs leading-relaxed text-slate-700 dark:text-zinc-300 font-sans outline-none resize-none p-3.5 pr-2 focus:ring-0 border-none"
                        />
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
