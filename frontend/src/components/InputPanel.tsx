"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Link2, Video, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerationResult } from "./GenerationResult";

const FORMATS = [
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "linkedin", name: "LinkedIn", icon: "💼" },
  { id: "twitter", name: "Twitter/X", icon: "🐦" },
  { id: "instagram", name: "Instagram", icon: "📸" },
  { id: "newsletter", name: "Newsletter", icon: "📧" },
  { id: "youtube", name: "YouTube", icon: "🎬" },
  { id: "email", name: "Email", icon: "✉️" },
  { id: "reddit", name: "Reddit", icon: "🤖" },
];

interface PrefillData {
  content: string;
  sourceType: string;
  tone: string;
  formats: string[];
}

interface InputPanelProps {
  prefill?: PrefillData | null;
  onPrefillUsed?: () => void;
  onGenerationSuccess?: () => void;
}

export function InputPanel({ prefill, onPrefillUsed, onGenerationSuccess }: InputPanelProps) {
  const [content, setContent] = useState("");
  const [sourceType, setSourceType] = useState("text_paste");
  const [tone, setTone] = useState("casual");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);

  useEffect(() => {
    if (prefill) {
      setContent(prefill.content);
      setSourceType(prefill.sourceType);
      setTone(prefill.tone);
      setSelectedFormats(prefill.formats);
      onPrefillUsed?.();
    }
  }, [prefill, onPrefillUsed]);

  const toggleFormat = (id: string) => {
    setSelectedFormats((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedFormats.length === FORMATS.length) {
      setSelectedFormats([]);
    } else {
      setSelectedFormats(FORMATS.map((f) => f.id));
    }
  };

  const handleGenerate = async () => {
    if (!content.trim() || selectedFormats.length === 0) return;
    setIsLoading(true);
    setResults(null);
    try {
      const response = await api.repurpose(content, sourceType, tone, selectedFormats);
      setResults(response.results);
      setTimeMs(response.time_ms);
      toast.success(`Generated ${Object.keys(response.results).length} formats in ${(response.time_ms / 1000).toFixed(1)}s`);
      onGenerationSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Area */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80 p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Tabs
              value={sourceType === "text_paste" ? "paste" : sourceType === "youtube_url" ? "youtube" : "blog"}
              onValueChange={(val) => {
                if (val === "paste") setSourceType("text_paste");
                else if (val === "youtube") setSourceType("youtube_url");
                else setSourceType("blog_link");
              }}
            >
              <TabsList className="mb-4 bg-slate-100 dark:bg-zinc-800/50 p-1 rounded-xl">
                <TabsTrigger value="paste" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
                  Paste Text
                </TabsTrigger>
                <TabsTrigger value="youtube" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
                  YouTube URL
                </TabsTrigger>
                <TabsTrigger value="blog" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
                  Blog Link
                </TabsTrigger>
              </TabsList>

              <TabsContent value="paste">
                <Textarea
                  placeholder="Paste your blog post, article, or transcript here..."
                  value={sourceType === "text_paste" ? content : ""}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setSourceType("text_paste");
                  }}
                  className="min-h-[320px] font-mono text-sm resize-y rounded-xl border-slate-200 dark:border-zinc-850 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 transition-all duration-200 text-slate-800 dark:text-zinc-200"
                />
                {content && (
                  <p className="mt-2 text-xs text-slate-400 dark:text-zinc-500">
                    {content.length} characters
                  </p>
                )}
              </TabsContent>

              <TabsContent value="youtube">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400 p-3 bg-slate-50 dark:bg-zinc-950/60 rounded-lg">
                    <Video className="h-4 w-4 text-red-500" />
                    Paste a YouTube video URL to extract its transcript
                  </div>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={sourceType === "youtube_url" ? content : ""}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setSourceType("youtube_url");
                    }}
                    className="h-12 rounded-xl border-slate-200 dark:border-zinc-850 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 text-slate-800 dark:text-zinc-200"
                  />
                </div>
              </TabsContent>

              <TabsContent value="blog">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400 p-3 bg-slate-50 dark:bg-zinc-950/60 rounded-lg">
                    <Link2 className="h-4 w-4 text-blue-500" />
                    Paste a blog post URL to extract its content
                  </div>
                  <Input
                    placeholder="https://blog.example.com/my-article"
                    value={sourceType === "blog_link" ? content : ""}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setSourceType("blog_link");
                    }}
                    className="h-12 rounded-xl border-slate-200 dark:border-zinc-850 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 text-slate-800 dark:text-zinc-200"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Options Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80 p-6 shadow-sm space-y-6">
            {/* Tone */}
            <div>
              <Label className="text-sm font-bold text-slate-900 dark:text-zinc-100">Choose Tone</Label>
              <Select value={tone} onValueChange={(val) => { if (val) setTone(val); }}>
                <SelectTrigger className="mt-2 h-11 rounded-xl border-slate-200 dark:border-zinc-800/80 text-slate-700 dark:text-zinc-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-900 dark:border-zinc-850">
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Formats */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-bold text-slate-900 dark:text-zinc-100">Select Formats</Label>
                <button
                  onClick={selectAll}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors"
                >
                  {selectedFormats.length === FORMATS.length ? "Deselect all" : "Select all"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {FORMATS.map((fmt, i) => (
                  <motion.button
                    key={fmt.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => toggleFormat(fmt.id)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center relative ${
                      selectedFormats.includes(fmt.id)
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-sm shadow-indigo-100/10 text-indigo-900 dark:text-indigo-300"
                        : "border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:border-indigo-200 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-400"
                    }`}
                  >
                    <div className="text-xl">{fmt.icon}</div>
                    <div className="text-xs font-semibold mt-1">{fmt.name}</div>
                    {selectedFormats.includes(fmt.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-500 dark:bg-indigo-600 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-[8px] font-bold">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!content.trim() || selectedFormats.length === 0 || isLoading}
              className="w-full h-13 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:shadow-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-white"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Content
                </span>
              )}
            </Button>

            {selectedFormats.length === 0 && (
              <p className="text-xs text-slate-400 dark:text-zinc-500 text-center">
                Select at least one format to continue
              </p>
            )}
            {selectedFormats.length > 0 && (
              <p className="text-xs text-indigo-500 dark:text-indigo-400 text-center font-semibold">
                {selectedFormats.length} format{selectedFormats.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Loading Skeletons */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {selectedFormats.map((fmt, i) => (
              <motion.div
                key={fmt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="h-56 rounded-3xl border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 overflow-hidden relative"
              >
                <div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded-lg w-28 mb-6 animate-pulse" />
                <div className="space-y-3.5">
                  <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-full animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-5/6 animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-4/6 animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-3/6 animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-5/6 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {results && <GenerationResult results={results} timeMs={timeMs} />}
    </div>
  );
}
