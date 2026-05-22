"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Copy,
  Library,
  ArrowRight,
  CheckCircle2,
  MousePointer2,
  Check,
  Cpu,
  RefreshCw,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const presets = [
  {
    tab: "Tech Tutorial",
    title: "How Git Works Under the Hood",
    input: "Explain that Git is just a simple object database containing Blobs (file contents), Trees (folders), and Commits (pointing to trees). Stop memorizing Git commands and understand the graph structure to master version control forever.",
    linkedin: "Ever wondered how Git actually works under the hood? The core concept is straightforward: Git is primarily a simple object database.\n\nFirst, Blobs store the compressed content of files.\nSecond, Trees organize these files into directories using hash references.\nThird, Commits point to specific Trees that represent snapshots of the project.\n\nRather than memorizing command line utilities, understanding this underlying graph structure will make version control intuitive.\n\n#SoftwareEngineering #Git #VersionControl",
    twitter: "1/ Git is not a complex mystery. It is a simple directed acyclic graph database.\n\n2/ Every tracked file is stored as a Blob, containing only content, indexed by a hash key.\n\n3/ A Tree behaves like a directory. It lists names, permissions, and hashes of blobs or other sub-trees.\n\n4/ A Commit links to a root Tree snapshot and records parent hashes to form history branches.\n\n5/ Understanding this structure makes version control intuitive."
  },
  {
    tab: "Startup Pitch",
    title: "Introducing ContentAlchemy",
    input: "ContentAlchemy is a content publishing workflow tool that converts text manuscripts, blog entries, or video scripts into social media formats. It allows authors to manage their content distribution in one centralized interface, saving hours of manual formatting.",
    linkedin: "Content publishers often spend hours manually reformatting articles for different platforms.\n\nWith ContentAlchemy, you upload a text source once, and the application generates correctly sized, formatted, and toned posts for LinkedIn, Twitter, and email campaigns in seconds.\n\nThis workflow optimization saves up to 10 hours a week for independent writers.\n\n#ContentStrategy #Productivity #Publishing",
    twitter: "1/ Publishers waste hours reformatting articles for different channels.\n\nHere is how we automate this with ContentAlchemy:\n\n2/ Paste your article, import a blog URL, or upload a transcript.\n\n3/ The application automatically adjusts the tone, formatting, and hooks for each target platform.\n\n4/ Download all generated formats at once to simplify your publishing pipeline."
  },
  {
    tab: "Fitness Habit",
    title: "Three Daily Habits for High Energy",
    input: "Stop buying expensive supplements. Double your energy by drinking 500ml water first thing in the morning, getting 10 minutes of direct sunlight during a midday walk, and doing progressive overload weights 3 times a week.",
    linkedin: "Improving daily energy levels does not require expensive supplements. Focus on three foundational habits instead:\n\n1. Hydration: Drink 500ml of water immediately upon waking.\n2. Light Exposure: Get 10 minutes of direct sunlight during a midday walk.\n3. Strength Training: Perform progressive overload weight training three times a week.\n\nConsistency with basic habits yields better long-term results than complex routines.\n\n#Health #Habits #Productivity",
    twitter: "1/ Foundational habits are more effective than expensive supplements. Here are 3 habits to increase daily energy:\n\n2/ Habit 1: Drink 500ml of water immediately after waking to rehydrate.\n\n3/ Habit 2: Get 10 minutes of direct sunlight during a walk around noon.\n\n4/ Habit 3: Lift weights three times a week, focusing on gradual, progressive overload."
  }
];

const formats = [
  { name: "TikTok", icon: "🎵", delay: 0 },
  { name: "LinkedIn", icon: "💼", delay: 0.05 },
  { name: "Twitter/X", icon: "🐦", delay: 0.1 },
  { name: "Instagram", icon: "📸", delay: 0.15 },
  { name: "Newsletter", icon: "📧", delay: 0.2 },
  { name: "YouTube", icon: "🎬", delay: 0.25 },
  { name: "Email", icon: "✉️", delay: 0.3 },
  { name: "Reddit", icon: "🤖", delay: 0.35 },
];

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Demo Playground states
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [demoGenerating, setDemoGenerating] = useState(false);
  const [demoResults, setDemoResults] = useState<{ linkedin: string; twitter: string } | null>(null);
  const [displayedLinkedin, setDisplayedLinkedin] = useState("");
  const [displayedTwitter, setDisplayedTwitter] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSimulateRepurpose = () => {
    setDemoGenerating(true);
    setDemoResults(null);
    setTimeout(() => {
      setDemoGenerating(false);
      setDemoResults(presets[selectedPreset]);
    }, 1200);
  };

  useEffect(() => {
    if (!demoResults) {
      const clearTimer = setTimeout(() => {
        setDisplayedLinkedin("");
        setDisplayedTwitter("");
      }, 0);
      return () => clearTimeout(clearTimer);
    }

    let lIndex = 0;
    let tIndex = 0;
    let lTimer: NodeJS.Timeout;
    let tTimer: NodeJS.Timeout;

    const typeLinkedin = () => {
      if (lIndex < demoResults.linkedin.length) {
        setDisplayedLinkedin(demoResults.linkedin.slice(0, lIndex + 1));
        lIndex += 3;
        lTimer = setTimeout(typeLinkedin, 15);
      }
    };

    const typeTwitter = () => {
      if (tIndex < demoResults.twitter.length) {
        setDisplayedTwitter(demoResults.twitter.slice(0, tIndex + 1));
        tIndex += 3;
        tTimer = setTimeout(typeTwitter, 15);
      }
    };

    const initTimerL = setTimeout(typeLinkedin, 0);
    const initTimerT = setTimeout(typeTwitter, 0);

    return () => {
      clearTimeout(initTimerL);
      clearTimeout(initTimerT);
      clearTimeout(lTimer);
      clearTimeout(tTimer);
    };
  }, [demoResults]);

  const copyDemoText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <CustomCursor />
      <AnimatedBackground />

      {/* Top Scroll Progress Bar */}
      <motion.div className="scroll-progress-bar" style={{ scaleX: scrollYProgress }} />

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-[95vh] flex items-center justify-center pt-8 overflow-hidden"
        >
          {/* Floating gradient orbs */}
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="max-w-5xl mx-auto px-4 sm:px-8 text-center relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-sm text-indigo-700 dark:text-indigo-400 font-medium mb-8"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              Next-Generation Content Rebranding
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              Content. Once.{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent glow-text">
                Everywhere.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              Transform your blogs, transcripts, and ideas into 10+ social formats instantly. Crafted for maximum organic engagement, powered by Claude.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center px-4 sm:px-0"
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 h-12 text-base shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Start Repurposing Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#playground" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold px-8 h-12 text-base hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Try Interactive Demo
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-400 dark:text-zinc-500 px-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 border-2 border-white dark:border-zinc-950"
                  />
                ))}
              </div>
              <span className="ml-2 font-medium">Loved by 150+ modern content creators</span>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2 text-slate-400 dark:text-zinc-500"
              >
                <MousePointer2 className="h-4 w-4" />
                <span className="text-xs">Scroll to explore</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Format Strip */}
        <section className="relative border-y border-slate-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md py-8 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {formats.map((fmt) => (
                <motion.div
                  key={fmt.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: fmt.delay }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
                >
                  <span className="text-lg">{fmt.icon}</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{fmt.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Try-It-Out Demo Section */}
        <section id="playground" className="py-24 relative bg-slate-100/30 dark:bg-zinc-950/30 border-b border-slate-200/40 dark:border-zinc-850">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Try the AI Playground
              </h2>
              <p className="mt-4 text-slate-500 dark:text-zinc-400">
                Experience instant, high-fidelity format transformation without an account.
              </p>
            </div>

            <div className="gradient-border max-w-4xl mx-auto shadow-2xl dark:shadow-indigo-950/10">
              <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl flex flex-col gap-6">
                {/* Preset Pickers */}
                <div className="flex flex-wrap gap-2.5 border-b border-slate-100 dark:border-zinc-800 pb-5">
                  {presets.map((preset, index) => (
                    <button
                      key={preset.title}
                      onClick={() => {
                        setSelectedPreset(index);
                        setDemoResults(null);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedPreset === index
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {preset.tab}
                    </button>
                  ))}
                </div>

                {/* Left: Input Text, Right: Results */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-indigo-500" />
                      Content Input Preview
                    </span>
                    <div className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-5 font-mono text-sm leading-relaxed min-h-[160px] text-slate-700 dark:text-zinc-300">
                      {presets[selectedPreset].input}
                    </div>
                    <Button
                      onClick={handleSimulateRepurpose}
                      disabled={demoGenerating}
                      className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
                    >
                      {demoGenerating ? (
                        <>
                          <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                          Repurposing Content...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4.5 w-4.5" />
                          Transform Content
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Share2 className="h-3.5 w-3.5 text-indigo-500" />
                      Generated Outputs (Side-by-Side)
                    </span>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* LinkedIn Simulated Output */}
                      <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                              💼 LinkedIn Post
                            </span>
                            {demoResults && (
                              <button
                                onClick={() => copyDemoText(presets[selectedPreset].linkedin, "linkedin")}
                                className="text-slate-400 hover:text-indigo-500 transition-colors"
                              >
                                {copiedKey === "linkedin" ? (
                                  <Check className="h-4.5 w-4.5 text-emerald-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>

                          <div className="text-[12.5px] leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-zinc-300 pr-1 max-h-[160px] overflow-y-auto scrollbar-none typewriter-cursor">
                            {demoGenerating ? (
                              <div className="space-y-2 mt-2">
                                <div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded w-full animate-pulse" />
                                <div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded w-5/6 animate-pulse" />
                                <div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded w-4/6 animate-pulse" />
                              </div>
                            ) : (
                              displayedLinkedin
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Twitter Simulated Output */}
                      <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-sky-400" />
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                              🐦 Twitter/X Thread
                            </span>
                            {demoResults && (
                              <button
                                onClick={() => copyDemoText(presets[selectedPreset].twitter, "twitter")}
                                className="text-slate-400 hover:text-indigo-500 transition-colors"
                              >
                                {copiedKey === "twitter" ? (
                                  <Check className="h-4.5 w-4.5 text-emerald-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>

                          <div className="text-[12.5px] leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-zinc-300 pr-1 max-h-[160px] overflow-y-auto scrollbar-none typewriter-cursor">
                            {demoGenerating ? (
                              <div className="space-y-2 mt-2">
                                <div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded w-full animate-pulse" />
                                <div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded w-4/6 animate-pulse" />
                                <div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded w-5/6 animate-pulse" />
                              </div>
                            ) : (
                              displayedTwitter
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section className="py-24 sm:py-32 relative grid-pattern">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Key Features
              </h2>
              <p className="mt-4 text-lg text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
                A workflow optimization system designed to manage all publication formats in one place.
              </p>
            </motion.div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Large Bento Column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 md:col-span-2 card-hover flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 mb-6 text-white">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-indigo-500 transition-colors">
                    Multi-Platform Formatting
                  </h3>
                  <p className="mt-3 text-slate-500 dark:text-zinc-400 leading-relaxed text-sm">
                    Feed the model articles, essays, YouTube URLs, or simple audio transcripts. Our tailored engine structure outputs custom-fitted tone scripts for TikTok, Twitter, LinkedIn, Instagram, and direct newsletters in a single operation.
                  </p>
                </div>
                <div className="mt-8 flex gap-3 overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 border border-slate-200/50 dark:border-zinc-700">Video transcripts</div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 border border-slate-200/50 dark:border-zinc-700">Substack posts</div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 border border-slate-200/50 dark:border-zinc-700">Draft notes</div>
                </div>
              </motion.div>

              {/* Feature 2: Tall Bento Column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 mb-6 text-white">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-indigo-500 transition-colors">
                    Side-by-Side Comparison
                  </h3>
                  <p className="mt-3 text-slate-500 dark:text-zinc-400 leading-relaxed text-sm">
                    Review generated draft content formats side-by-side using our next-generation split panel comparison viewport. Coordinate brand voices visually.
                  </p>
                </div>
                <div className="mt-8 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">Grid Layout</span>
                  <div className="h-4.5 w-8 rounded-full bg-indigo-600 p-0.5 flex items-center justify-end">
                    <div className="h-3.5 w-3.5 rounded-full bg-white" />
                  </div>
                  <span className="font-semibold text-indigo-500">Split View</span>
                </div>
              </motion.div>

              {/* Feature 3: Small Bento Column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 text-white">
                    <Copy className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-indigo-500 transition-colors">
                    Instant Clipboard Integration
                  </h3>
                  <p className="mt-3 text-slate-500 dark:text-zinc-400 leading-relaxed text-sm">
                    Instantly copy separate elements or bundle everything into a clean package text document in one swift, simple click.
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Copied successfully!
                  </span>
                </div>
              </motion.div>

              {/* Feature 4: Large Bento Column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 md:col-span-2 card-hover flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 mb-6 text-white">
                    <Library className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-indigo-500 transition-colors">
                    Generation History & Archival
                  </h3>
                  <p className="mt-3 text-slate-500 dark:text-zinc-400 leading-relaxed text-sm">
                    Never lose track of successful campaigns. All generation runs are automatically versioned, dated, analyzed, and stored in a secure cloud library for swift retrieval.
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2 opacity-60">
                  <div className="h-2 rounded bg-slate-200 dark:bg-zinc-800 w-full" />
                  <div className="h-2 rounded bg-slate-200 dark:bg-zinc-800 w-5/6" />
                  <div className="h-2 rounded bg-slate-200 dark:bg-zinc-800 w-4/6" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl font-bold tracking-tight">Simple Pricing</h2>
              <p className="mt-3 text-slate-500 dark:text-zinc-400">Start free. Upgrade when you need more power.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {[
                { name: "Free", price: "$0", features: ["3 generations/day", "All 8 formats", "Copy to clipboard"], cta: "Get Started", highlight: false },
                { name: "Pro", price: "$5", period: "/mo", features: ["Unlimited generations", "Priority processing", "Save to library", "Compare view"], cta: "Start Pro", highlight: true },
                { name: "Team", price: "$30", period: "/mo", features: ["Up to 5 members", "Shared library", "API access", "Priority support"], cta: "Contact Us", highlight: false },
              ].map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-7 rounded-3xl border flex flex-col justify-between card-hover ${
                    plan.highlight
                      ? "border-indigo-500 bg-white dark:bg-zinc-900 shadow-xl shadow-indigo-100 dark:shadow-none scale-[1.03]"
                      : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  }`}
                >
                  <div>
                    {plan.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-full shadow-md">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="mt-3">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-slate-500 dark:text-zinc-400 text-sm">{plan.period}</span>}
                    </p>
                    <ul className="mt-6 space-y-3.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-zinc-400">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href="/signup" className="block mt-8">
                    <Button
                      className={`w-full h-11 font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                        plan.highlight
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                          : "border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                      }`}
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto px-4 text-center relative z-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Ready to save 10 hours every week?
            </h2>
            <p className="mt-4 text-lg text-indigo-100">
              Join growth-driven creators repurposing smarter, not harder.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="mt-8 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-10 h-13 text-base shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-slate-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm transition-colors">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
            <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              ContentAlchemy
            </p>
            <p className="mt-2 text-sm text-slate-400 dark:text-zinc-500 font-medium">
              Built with Next.js, FastAPI, and Claude AI.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
