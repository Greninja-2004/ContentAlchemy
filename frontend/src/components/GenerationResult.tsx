"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Clock, Download, LayoutGrid, Columns, FileText } from "lucide-react";
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
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/20 dark:border-zinc-800/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSplitView(false)}
                className={`text-xs px-3 py-1.5 h-8 rounded-lg transition-all duration-200 ${
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
                className={`text-xs px-3 py-1.5 h-8 rounded-lg transition-all duration-200 ${
                  isSplitView
                    ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <Columns className="h-3.5 w-3.5 mr-1" />
                Compare View
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={downloadAll}
            className="text-xs h-9 hover:bg-indigo-50 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 rounded-xl"
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
}

function ResultCard({
  format,
  text,
  meta,
  index,
  copiedKey,
  onCopy,
  onTextChange,
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
      className="group bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 p-6 card-hover relative overflow-hidden flex flex-col justify-between min-h-[380px] transition-colors"
    >
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
              className="h-8 px-3 text-xs rounded-xl hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-all duration-200"
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

      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 pt-4 mt-2 border-t border-slate-100 dark:border-zinc-800/60">
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
    </motion.div>
  );
}
