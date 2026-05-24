"use client";
 
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ThumbsUp,
  MessageSquare,
  Repeat,
  Heart,
  Bookmark,
  Globe,
  User,
  Pencil,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { WebGLBackground } from "@/components/WebGLBackground";
import { CreativePricing } from "@/components/ui/creative-pricing";
import { TextEffect } from "@/components/ui/text-effect";

const presets = [
  {
    tab: "Tech Tutorial",
    title: "Why Git is just a Content-Addressable DAG",
    input: "Stop memorizing random Git flags. Under the hood, Git is just a simple directed acyclic graph (DAG) of objects. It has Blobs for file content, Trees for directory structures, and Commits pointing to those Trees. Once you understand the graph structure, merge conflicts and rebases make perfect sense.",
    linkedin: "Under the hood, Git is not a black box of magic commands—it's just a simple directed acyclic graph (DAG) of objects.\n\nHere is how Git stores your codebase:\n\n1. 📂 Blobs: Store raw file content, indexed by SHA-1 hash. No filenames or metadata.\n2. 🌳 Trees: Point to blobs or other trees, storing names and permissions (like directories).\n3. ⚙️ Commits: Reference a root Tree, parent commit hashes, and commit metadata.\n\nWhen you commit, Git is just creating new tree objects and updating references. Stop memorizing commands and learn the DAG to master version control forever.\n\n#SoftwareEngineering #Git #DevOps #Productivity",
    twitter: "1/ Git is not a black box of magic commands. Under the hood, it's a simple Directed Acyclic Graph (DAG) database.\n\n2/ Every file content is stored in a Blob, indexed by its SHA-1 hash.\n\n3/ Directories are Trees, referencing names and hashes of other trees or blobs.\n\n4/ Commits are nodes pointing to a root Tree, tracking history through parent commits.\n\n5/ Learn the graph structure, and merge conflicts become easy to resolve."
  },
  {
    tab: "Product Engineering",
    title: "Treat Pull Requests like Editorial Reviews",
    input: "The best engineering teams treat code reviews like editorial reviews. High-quality PR descriptions, clear inline comments, and self-documenting code save more engineering hours than any AI coding assistant. Make readability your team's primary KPI.",
    linkedin: "Treat your pull requests like editorial submissions, not code dumps.\n\nThe highest-performing engineering teams know that code is read 10x more than it's written. Self-documenting code, inline context, and rich PR descriptions save more engineering hours than any automated assistant.\n\nBefore opening a PR, ask yourself: could a junior engineer understand the 'why' behind this change in 60 seconds?\n\n#SoftwareDesign #DeveloperVelocity #EngineeringLeadership",
    twitter: "1/ The best engineering teams treat Pull Requests like editorial reviews.\n\n2/ Code is read 10x more than it is written. Make readability your team's primary KPI.\n\n3/ Write clear PR descriptions explaining the 'why' behind the implementation, not just the 'what'.\n\n4/ Add inline comments for non-obvious code decisions to save future debug time."
  },
  {
    tab: "SaaS Design",
    title: "The Fallacy of the 'Minimum Viable Product'",
    input: "An MVP shouldn't be buggy or half-baked. It should be a 'Minimum Viable Experience'—narrow in scope, but exceptionally polished in execution. If your early users aren't delighted by the core loop, adding more features will only accelerate your churn.",
    linkedin: "An MVP shouldn't be a buggy, half-baked product. Focus on building a Minimum Viable Experience (MVE) instead.\n\nReduce your scope to the absolute minimum, but execute that core loop with exceptional polish. If users aren't delighted by the primary flow, adding more features won't save you from high churn. Double down on friction-free onboarding first.\n\n#SaaS #ProductDesign #GrowthStyle",
    twitter: "1/ The MVP is often misunderstood. A 'minimum viable product' shouldn't mean a buggy, half-baked experience.\n\n2/ Instead, build a 'Minimum Viable Experience' (MVE).\n\n3/ Keep the scope tiny, but polish the execution. If users don't love the core loop, more features won't fix it.\n\n4/ Polish the first 5 minutes of your user journey above all else."
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
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const pricingTiers = [
    {
      name: "Free",
      icon: <Pencil className="w-6 h-6" />,
      price: 0,
      description: "Start free. Explore format variations.",
      color: "amber",
      buttonText: "Get Started",
      onClick: () => router.push("/signup"),
      features: [
        "3 generations/day",
        "All 8 formats",
        "Copy to clipboard",
      ],
    },
    {
      name: "Pro",
      icon: <Star className="w-6 h-6" />,
      price: 5,
      description: "For active content creators",
      color: "blue",
      popular: true,
      buttonText: "Start Pro",
      onClick: () => router.push("/signup"),
      features: [
        "Unlimited generations",
        "Priority processing",
        "Save to library",
        "Compare view",
      ],
    },
    {
      name: "Team",
      icon: <Sparkles className="w-6 h-6" />,
      price: 30,
      description: "For agencies and high-volume teams",
      color: "purple",
      buttonText: "Contact Us",
      onClick: () => router.push("/signup"),
      features: [
        "Up to 5 members",
        "Shared library",
        "API access",
        "Priority support",
      ],
    },
  ];

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Demo Playground states
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [demoGenerating, setDemoGenerating] = useState(false);
  const [demoResults, setDemoResults] = useState<{ linkedin: string; twitter: string } | null>(null);
  const [displayedLinkedin, setDisplayedLinkedin] = useState("");
  const [displayedTwitter, setDisplayedTwitter] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentPreset = presets.find((_, i) => i === selectedPreset) || presets[0];

  const handleSimulateRepurpose = () => {
    setDemoGenerating(true);
    setDemoResults(null);
    setTimeout(() => {
      setDemoGenerating(false);
      setDemoResults(currentPreset);
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
      <WebGLBackground />

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
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] font-heading flex flex-wrap justify-center items-center gap-x-[0.2em]">
              <TextEffect per="word" preset="slide" delay={0.1} as="span" className="inline-block text-slate-900 dark:text-zinc-50">
                Your content engine on
              </TextEffect>
              <motion.span
                initial={{ opacity: 0, filter: "blur(12px)", y: 15 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring", damping: 15 }}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent glow-text inline-block"
              >
                autopilot.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              ContentAlchemy transforms raw articles, YouTube videos, and transcripts into ready-to-publish threads, scripts, and newsletters. Refined for human readers, optimized for platform algorithms.
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
                  Build your campaign
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#playground" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold px-8 h-12 text-base hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Try the sandbox
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-450 dark:text-zinc-500 px-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 border-2 border-white dark:border-zinc-950"
                  />
                ))}
              </div>
              <span className="ml-2 font-medium">Engineered for solo creators, developer advocates, and marketing teams.</span>
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
        <section id="playground" className="py-24 relative bg-slate-100/30 dark:bg-zinc-950/30 border-b border-slate-200/40 dark:border-zinc-800">
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
                      {currentPreset.input}
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
                      Social Feed Previews
                    </span>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* LinkedIn Mockup */}
                      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between min-h-[260px] shadow-sm relative overflow-hidden text-left">
                        <div className="p-4 flex-1">
                          {/* LinkedIn Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm font-heading">
                                CA
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1 leading-none">
                                  ContentAlchemy Demo
                                </h4>
                                <p className="text-[10px] text-slate-450 dark:text-zinc-500 mt-1 leading-none">
                                  Developer Relations Engine • 2h • <Globe className="inline-block h-2.5 w-2.5 ml-0.5 text-slate-400" />
                                </p>
                              </div>
                            </div>
                            
                            {demoResults && (
                              <button
                                onClick={() => copyDemoText(currentPreset.linkedin, "linkedin")}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                                title="Copy Post"
                              >
                                {copiedKey === "linkedin" ? (
                                  <Check className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* LinkedIn Body Content */}
                          <div className="text-[12.5px] leading-relaxed whitespace-pre-wrap text-slate-750 dark:text-zinc-300 pr-1 max-h-[170px] overflow-y-auto scrollbar-thin">
                            {demoGenerating ? (
                              <div className="space-y-2 mt-2">
                                <div className="h-3.5 bg-slate-100 dark:bg-zinc-800 rounded w-full animate-pulse" />
                                <div className="h-3.5 bg-slate-100 dark:bg-zinc-800 rounded w-11/12 animate-pulse" />
                                <div className="h-3.5 bg-slate-100 dark:bg-zinc-800 rounded w-4/5 animate-pulse" />
                              </div>
                            ) : displayedLinkedin ? (
                              displayedLinkedin
                            ) : (
                              <p className="text-slate-400 italic text-center py-12">Press &apos;Transform Content&apos; to see results</p>
                            )}
                          </div>
                        </div>

                        {/* LinkedIn Footer Actions */}
                        <div className="border-t border-slate-100 dark:border-zinc-900 px-2 py-2 flex items-center justify-between text-slate-500 dark:text-zinc-400 bg-slate-55/30 dark:bg-zinc-900/30">
                          <button className="flex-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 text-[10px] font-bold transition-colors cursor-pointer">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>Like</span>
                          </button>
                          <button className="flex-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 text-[10px] font-bold transition-colors cursor-pointer">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Comment</span>
                          </button>
                          <button className="flex-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 text-[10px] font-bold transition-colors cursor-pointer">
                            <Repeat className="h-3.5 w-3.5" />
                            <span>Repost</span>
                          </button>
                          <button className="flex-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 text-[10px] font-bold transition-colors cursor-pointer">
                            <Share2 className="h-3.5 w-3.5" />
                            <span>Send</span>
                          </button>
                        </div>
                      </div>

                      {/* Twitter/X Mockup */}
                      <div className="bg-[#000000] border border-zinc-800 rounded-2xl flex flex-col justify-between min-h-[260px] shadow-sm relative overflow-hidden text-left text-zinc-100">
                        <div className="p-4 flex-1">
                          {/* Twitter Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-sm font-heading">
                                CA
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <h4 className="text-xs font-bold text-zinc-200">
                                    ContentAlchemy
                                  </h4>
                                  <span className="w-3.5 h-3.5 bg-[#1d9bf0] text-white rounded-full flex items-center justify-center text-[7px] font-bold" title="Verified Creator">
                                    ✓
                                  </span>
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-0.5">
                                  @alchemy_codes • 2h
                                </p>
                              </div>
                            </div>

                            {demoResults && (
                              <button
                                onClick={() => copyDemoText(currentPreset.twitter, "twitter")}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-sky-400 hover:bg-zinc-900 transition-colors cursor-pointer"
                                title="Copy Thread"
                              >
                                {copiedKey === "twitter" ? (
                                  <Check className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Twitter Body Content */}
                          <div className="text-[12.5px] leading-relaxed whitespace-pre-wrap text-zinc-200 pr-1 max-h-[170px] overflow-y-auto scrollbar-thin font-sans">
                            {demoGenerating ? (
                              <div className="space-y-2 mt-2">
                                <div className="h-3.5 bg-zinc-800 rounded w-full animate-pulse" />
                                <div className="h-3.5 bg-zinc-800 rounded w-5/6 animate-pulse" />
                                <div className="h-3.5 bg-zinc-800 rounded w-11/12 animate-pulse" />
                              </div>
                            ) : displayedTwitter ? (
                              displayedTwitter
                            ) : (
                              <p className="text-zinc-500 italic text-center py-12">Press &apos;Transform Content&apos; to see results</p>
                            )}
                          </div>
                        </div>

                        {/* Twitter Thread indicator */}
                        {displayedTwitter && !demoGenerating && (
                          <div className="px-4 pb-1.5 flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-zinc-900 flex items-center justify-center text-[9px] text-zinc-500 font-bold border border-zinc-800">
                              +
                            </div>
                            <span className="text-[9px] text-zinc-500 font-medium">Show this thread</span>
                          </div>
                        )}

                        {/* Twitter Footer Actions */}
                        <div className="border-t border-zinc-900 px-4 py-2 flex items-center justify-between text-zinc-500 bg-zinc-950/40">
                          <button className="hover:text-sky-450 flex items-center gap-1 text-[10px] transition-colors cursor-pointer">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>12</span>
                          </button>
                          <button className="hover:text-emerald-500 flex items-center gap-1 text-[10px] transition-colors cursor-pointer">
                            <Repeat className="h-3.5 w-3.5" />
                            <span>5</span>
                          </button>
                          <button className="hover:text-pink-500 flex items-center gap-1 text-[10px] transition-colors cursor-pointer">
                            <Heart className="h-3.5 w-3.5" />
                            <span>48</span>
                          </button>
                          <button className="hover:text-sky-450 flex items-center gap-1 text-[10px] transition-colors cursor-pointer">
                            <Bookmark className="h-3.5 w-3.5" />
                          </button>
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
        <section className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-zinc-950/20 border-y border-slate-200/40 dark:border-zinc-900/60">
          <CreativePricing 
            tag="Simple Pricing" 
            title="Choose Your Alchemy Formula" 
            description="Start free. Upgrade when you need more power." 
            tiers={pricingTiers} 
          />
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-heading">
              Ready to scale your content distribution?
            </h2>
            <p className="mt-4 text-lg text-indigo-100">
              Join modern creators and marketing teams automating their multi-channel pipeline.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="mt-8 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-10 h-13 text-base shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
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
            <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent font-heading">
              ContentAlchemy
            </p>
            <p className="mt-2 text-sm text-slate-400 dark:text-zinc-500 font-medium">
              The editorial workspace for multi-channel creators.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
