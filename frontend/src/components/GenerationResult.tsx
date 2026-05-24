"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Clock,
  Download,
  LayoutGrid,
  Columns,
  FileText,
  ThumbsUp,
  MessageSquare,
  Repeat,
  Heart,
  Bookmark,
  Globe,
  User,
  Send,
  ArrowUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const FORMAT_META: Record<string, { icon: string; label: string; color: string }> = {
  tiktok: { icon: "🎵", label: "TikTok Script", color: "from-pink-500 to-rose-500" },
  linkedin: { icon: "💼", label: "LinkedIn Post", color: "from-blue-600 to-blue-700" },
  twitter: { icon: "🐦", label: "Twitter Thread", color: "from-sky-400 to-sky-500" },
  instagram: { icon: "📸", label: "Instagram Caption", color: "from-purple-500 to-pink-500" },
  newsletter: { icon: "📧", label: "Newsletter", color: "from-emerald-500 to-teal-500" },
  youtube: { icon: "🎬", label: "YouTube Description", color: "from-red-500 to-red-600" },
  email: { icon: "✉️", label: "Email Campaign", color: "from-amber-500 to-orange-500" },
  reddit: { icon: "🤖", label: "Reddit Post", color: "from-orange-500 to-red-500" },
};

interface Props {
  results: Record<string, string>;
  timeMs: number | null;
}

export function GenerationResult({ results: initialResults, timeMs }: Props) {
  const [results, setResults] = useState<Record<string, string>>(initialResults);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSplitView, setIsSplitView] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const formatsList = Object.keys(results);
  const [leftFormat, setLeftFormat] = useState(formatsList[0] || "");
  const [rightFormat, setRightFormat] = useState(formatsList[1] || formatsList[0] || "");

  useEffect(() => {
    const clearTimer = setTimeout(() => {
      setResults(initialResults);
      const keys = Object.keys(initialResults);
      if (keys.length > 0) {
        setLeftFormat(keys[0]);
        setRightFormat(keys[1] || keys[0]);
      }
    }, 0);
    return () => clearTimeout(clearTimer);
  }, [initialResults]);

  const handleTextChange = (format: string, newText: string) => {
    setResults((prev) => ({
      ...prev,
      [format]: newText,
    }));
  };

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadAll = () => {
    const text = Object.entries(results)
      .map(([fmt, content]) => {
        const meta = FORMAT_META[fmt];
        return `=== ${meta?.label || fmt} ===\n\n${content}\n`;
      })
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content-alchemy-export.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded all content!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-zinc-800/50 pb-4">
        <div className="flex items-center gap-3">
          {timeMs && (
            <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              Generated in {(timeMs / 1000).toFixed(1)}s
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {formatsList.length > 0 && (
            <>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/20 dark:border-zinc-800/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSplitView(false)}
                  className={`text-xs px-3 py-1.5 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
                    !isSplitView
                      ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5 mr-1" />
                  Grid View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSplitView(true)}
                  className={`text-xs px-3 py-1.5 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
                    isSplitView
                      ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <Columns className="h-3.5 w-3.5 mr-1" />
                  Compare View
                </Button>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/20 dark:border-zinc-800/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreviewMode(false)}
                  className={`text-xs px-3 py-1.5 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
                    !isPreviewMode
                      ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                  }`}
                >
                  Editor
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreviewMode(true)}
                  className={`text-xs px-3 py-1.5 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
                    isPreviewMode
                      ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                  }`}
                >
                  Mockup
                </Button>
              </div>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={downloadAll}
            className="text-xs h-9 hover:bg-indigo-50 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 rounded-xl cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download All
          </Button>
        </div>
      </div>

      {!isSplitView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(results).map(([format, text], i) => {
            const meta = FORMAT_META[format] || { icon: "📝", label: format, color: "from-slate-500 to-slate-600" };
            return (
              <ResultCard
                key={format}
                format={format}
                text={text}
                meta={meta}
                index={i}
                copiedKey={copiedKey}
                onCopy={copyToClipboard}
                onTextChange={handleTextChange}
                isPreviewMode={isPreviewMode}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/50 dark:border-zinc-800/50">
              <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest pl-2">Panel A:</span>
              <select
                value={leftFormat}
                onChange={(e) => setLeftFormat(e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold outline-none text-slate-800 dark:text-zinc-200 border-none cursor-pointer"
              >
                {formatsList.map((f) => (
                  <option key={f} value={f} className="dark:bg-zinc-900">
                    {FORMAT_META[f]?.icon} {FORMAT_META[f]?.label}
                  </option>
                ))}
              </select>
            </div>
            {leftFormat && results[leftFormat] !== undefined && (
              <ResultCard
                format={leftFormat}
                text={results[leftFormat]}
                meta={FORMAT_META[leftFormat] || { icon: "📝", label: leftFormat, color: "from-slate-500 to-slate-600" }}
                index={0}
                copiedKey={copiedKey}
                onCopy={copyToClipboard}
                onTextChange={handleTextChange}
                isPreviewMode={isPreviewMode}
              />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/50 dark:border-zinc-800/50">
              <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest pl-2">Panel B:</span>
              <select
                value={rightFormat}
                onChange={(e) => setRightFormat(e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold outline-none text-slate-800 dark:text-zinc-200 border-none cursor-pointer"
              >
                {formatsList.map((f) => (
                  <option key={f} value={f} className="dark:bg-zinc-900">
                    {FORMAT_META[f]?.icon} {FORMAT_META[f]?.label}
                  </option>
                ))}
              </select>
            </div>
            {rightFormat && results[rightFormat] !== undefined && (
              <ResultCard
                format={rightFormat}
                text={results[rightFormat]}
                meta={FORMAT_META[rightFormat] || { icon: "📝", label: rightFormat, color: "from-slate-500 to-slate-600" }}
                index={1}
                copiedKey={copiedKey}
                onCopy={copyToClipboard}
                onTextChange={handleTextChange}
                isPreviewMode={isPreviewMode}
              />
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface CardProps {
  format: string;
  text: string;
  meta: { icon: string; label: string; color: string };
  index: number;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
  onTextChange: (format: string, text: string) => void;
  isPreviewMode: boolean;
}

function ResultCard({
  format,
  text,
  meta,
  index,
  copiedKey,
  onCopy,
  onTextChange,
  isPreviewMode,
}: CardProps) {
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 220));

  const [streamText, setStreamText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    let idx = 0;
    let timer: NodeJS.Timeout;

    const stream = () => {
      if (idx < text.length) {
        setStreamText(text.slice(0, idx + 1));
        idx += 6;
        timer = setTimeout(stream, 10);
      } else {
        setStreamText(text);
        setIsStreaming(false);
      }
    };

    const initTimer = setTimeout(() => {
      setStreamText("");
      setIsStreaming(true);
      stream();
    }, 0);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(timer);
    };
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className={`relative flex flex-col justify-between min-h-[380px] transition-all duration-350 ${
        isPreviewMode 
          ? "bg-transparent shadow-none border-none" 
          : "group bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 p-6 card-hover overflow-hidden"
      }`}
    >
      {isPreviewMode ? (
        <SocialMockup format={format} text={text} meta={meta} />
      ) : (
        <>
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${meta.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />

          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                <span className="text-lg">{meta.icon}</span>
                {meta.label}
              </h3>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-3 text-xs rounded-xl hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
                  onClick={() => onCopy(text, format)}
                >
                  {copiedKey === format ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <Check className="h-3.5 w-3.5" /> Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <textarea
              value={isStreaming ? streamText : text}
              onChange={(e) => onTextChange(format, e.target.value)}
              className={`w-full min-h-[220px] bg-transparent text-sm leading-relaxed text-slate-700 dark:text-zinc-300 font-sans outline-none resize-none pr-1 scrollbar-thin border border-transparent focus:border-slate-100 dark:focus:border-zinc-800/40 p-2 rounded-xl transition-all ${
                isStreaming ? "typewriter-cursor select-none pointer-events-none" : ""
              }`}
              placeholder="Content goes here..."
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-400 pt-4 mt-2 border-t border-slate-100 dark:border-zinc-800/60">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {wordCount} words
              </span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
            <div className="flex items-center gap-1 font-medium text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/50 px-2 py-0.5 rounded-md">
              {readTime} min read
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

interface MockupProps {
  format: string;
  text: string;
  meta: { icon: string; label: string; color: string };
}

function SocialMockup({ format, text, meta }: MockupProps) {
  const cleanFormat = format.replace("_post", "").replace("_thread", "").replace("_script", "").replace("_draft", "").replace("_caption", "").replace("_description", "").replace("_subject", "");
  
  switch (cleanFormat) {
    case "linkedin":
      return (
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between flex-1 shadow-sm text-left text-slate-850 dark:text-zinc-200 overflow-hidden font-sans">
          <div className="p-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                CA
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1 leading-none">
                  ContentAlchemy Creator
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 leading-none">
                  Developer Advocacy • 1h • <Globe className="inline-block h-2.5 w-2.5 ml-0.5" />
                </p>
              </div>
            </div>
            <div className="text-[12.5px] leading-relaxed whitespace-pre-wrap pr-1 max-h-[220px] overflow-y-auto scrollbar-thin text-slate-700 dark:text-zinc-300">
              {text}
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-zinc-900 px-2 py-2 flex items-center justify-between text-slate-500 dark:text-zinc-400 bg-slate-50/50 dark:bg-zinc-900/30">
            <button className="flex-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 text-[10px] font-bold cursor-pointer">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Like</span>
            </button>
            <button className="flex-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 text-[10px] font-bold cursor-pointer">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Comment</span>
            </button>
            <button className="flex-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 text-[10px] font-bold cursor-pointer">
              <Repeat className="h-3.5 w-3.5" />
              <span>Repost</span>
            </button>
            <button className="flex-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 text-[10px] font-bold cursor-pointer">
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      );
    case "twitter":
      return (
        <div className="bg-[#000000] border border-zinc-800 rounded-2xl flex flex-col justify-between flex-1 shadow-sm text-left text-zinc-100 overflow-hidden font-sans">
          <div className="p-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                CA
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold text-zinc-200">
                    ContentAlchemy
                  </h4>
                  <span className="w-3.5 h-3.5 bg-[#1d9bf0] text-white rounded-full flex items-center justify-center text-[7px] font-bold">
                    ✓
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  @alchemy_codes • 1h
                </p>
              </div>
            </div>
            <div className="text-[12.5px] leading-relaxed whitespace-pre-wrap text-zinc-200 pr-1 max-h-[220px] overflow-y-auto scrollbar-thin">
              {text}
            </div>
          </div>
          <div className="border-t border-zinc-900 px-4 py-2 flex items-center justify-between text-zinc-500 bg-zinc-950/40">
            <button className="hover:text-sky-400 flex items-center gap-1 text-[10px] cursor-pointer">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>24</span>
            </button>
            <button className="hover:text-emerald-500 flex items-center gap-1 text-[10px] cursor-pointer">
              <Repeat className="h-3.5 w-3.5" />
              <span>8</span>
            </button>
            <button className="hover:text-pink-500 flex items-center gap-1 text-[10px] cursor-pointer">
              <Heart className="h-3.5 w-3.5" />
              <span>96</span>
            </button>
            <button className="hover:text-sky-400 flex items-center gap-1 text-[10px] cursor-pointer">
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      );
    case "tiktok":
      return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col justify-between flex-1 shadow-sm text-left text-zinc-100 overflow-hidden font-sans relative">
          <div className="absolute top-0 right-0 p-3 flex flex-col gap-3 z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-rose-500 font-bold text-xs">
              ❤️
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-indigo-400 font-bold text-xs">
              💬
            </div>
          </div>
          <div className="p-4 flex-1">
            <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block font-heading">
              🎬 Video Script Outline
            </span>
            <div className="text-[12px] leading-relaxed whitespace-pre-wrap pr-1 max-h-[220px] overflow-y-auto scrollbar-thin text-zinc-300 font-mono">
              {text}
            </div>
          </div>
          <div className="p-3 bg-zinc-900/60 border-t border-zinc-900 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-[10px] text-white">🎵</div>
            <span className="text-[10px] text-zinc-400 truncate">Original Sound - ContentAlchemy</span>
          </div>
        </div>
      );
    case "instagram":
      return (
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between flex-1 shadow-sm text-left text-slate-800 dark:text-zinc-200 overflow-hidden font-sans">
          <div className="p-3 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-900">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5">
              <div className="w-full h-full rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center text-[10px] font-bold">CA</div>
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-200">alchemy_creations</span>
          </div>
          <div className="w-full h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center">
              <span className="text-white text-xs font-heading font-extrabold tracking-widest bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md">CAPTION PREVIEW</span>
            </div>
          </div>
          <div className="p-4 flex-1">
            <div className="flex gap-3 mb-2.5">
              <Heart className="h-4 w-4 hover:scale-110 cursor-pointer" />
              <MessageSquare className="h-4 w-4 hover:scale-110 cursor-pointer" />
              <Send className="h-4 w-4 hover:scale-110 cursor-pointer" />
            </div>
            <div className="text-[11.5px] leading-relaxed whitespace-pre-wrap pr-1 max-h-[90px] overflow-y-auto scrollbar-thin text-slate-750 dark:text-zinc-355">
              <span className="font-bold mr-1 text-slate-900 dark:text-zinc-100">alchemy_creations</span>
              {text}
            </div>
          </div>
        </div>
      );
    case "newsletter":
      return (
        <div className="bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between flex-1 shadow-inner text-left text-slate-800 dark:text-zinc-200 overflow-hidden font-sans">
          <div className="p-4 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-900">
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block font-heading">
              ✉️ Newsletter Issue
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 leading-tight">
              Subject: Broadcast Preview
            </h4>
            <p className="text-[10px] text-slate-400 mt-1">From: ContentAlchemy Dispatch &lt;newsletter@alchemy.dev&gt;</p>
          </div>
          <div className="p-5 flex-1 bg-white dark:bg-zinc-950/20 text-[12px] leading-relaxed whitespace-pre-wrap text-slate-750 dark:text-zinc-300 pr-1 max-h-[190px] overflow-y-auto scrollbar-thin font-serif">
            {text}
          </div>
        </div>
      );
    case "youtube":
      return (
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between flex-1 shadow-sm text-left text-slate-800 dark:text-zinc-200 overflow-hidden font-sans">
          <div className="w-full h-20 bg-red-600/10 border-b border-slate-100 dark:border-zinc-900 flex items-center justify-center relative">
            <div className="text-center">
              <span className="text-red-650 dark:text-red-500 font-extrabold text-xs block">📺 Description Editor</span>
            </div>
          </div>
          <div className="p-4 flex-1">
            <div className="bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-450 dark:text-zinc-400 uppercase tracking-widest block mb-1">Video Info Panel</span>
              <div className="text-[12px] leading-relaxed whitespace-pre-wrap text-slate-750 dark:text-zinc-300 pr-1 max-h-[130px] overflow-y-auto scrollbar-thin">
                {text}
              </div>
            </div>
          </div>
        </div>
      );
    case "reddit":
      return (
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between flex-1 shadow-sm text-left text-slate-800 dark:text-zinc-200 overflow-hidden font-sans">
          <div className="p-4 flex-1 flex gap-3">
            <div className="flex flex-col items-center gap-1.5 text-slate-400">
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded cursor-pointer" title="Upvote"><ArrowUp className="h-4 w-4" /></button>
              <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">128</span>
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded cursor-pointer" title="Downvote"><ArrowUp className="h-4 w-4 transform rotate-180" /></button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-bold text-orange-600">r/developerrelations</span>
                <span className="text-[9px] text-slate-400">• Posted by u/advocate 2h ago</span>
              </div>
              <div className="text-[12.5px] leading-relaxed whitespace-pre-wrap text-slate-750 dark:text-zinc-300 pr-1 max-h-[170px] overflow-y-auto scrollbar-thin">
                {text}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-zinc-900 px-4 py-2 flex items-center justify-between text-slate-400 bg-slate-50/50 dark:bg-zinc-900/30">
            <span className="text-[10px] font-bold flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> 16 Comments</span>
          </div>
        </div>
      );
    default:
      return (
        <div className="bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between flex-1 shadow-sm text-left p-4">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
            {meta.icon} {meta.label} Preview
          </span>
          <div className="text-[12px] leading-relaxed whitespace-pre-wrap text-slate-750 dark:text-zinc-300 pr-1 max-h-[220px] overflow-y-auto scrollbar-thin">
            {text}
          </div>
        </div>
      );
  }
}
