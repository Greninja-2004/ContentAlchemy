"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export default function TermsOfService() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-650 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-heading mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-slate-500 dark:text-zinc-450 text-sm mb-12">Last Updated: July 11, 2026</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 font-sans leading-relaxed text-slate-700 dark:text-zinc-300">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">1. Agreement to Terms</h2>
              <p>
                By accessing our website at contentjourney.netlify.app, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on ContentAlchemy's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>modify or copy the materials;</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>attempt to decompile or reverse engineer any software contained on ContentAlchemy's website;</li>
                <li>remove any copyright or other proprietary notations from the materials; or</li>
                <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
              <p>
                This license shall automatically terminate if you violate any of these restrictions and may be terminated by ContentAlchemy at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">3. Disclaimer</h2>
              <p>
                The materials on ContentAlchemy's website are provided on an 'as is' basis. ContentAlchemy makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p>
                Further, ContentAlchemy does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">4. Limitations of Liability</h2>
              <p>
                In no event shall ContentAlchemy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ContentAlchemy's website, even if ContentAlchemy or a ContentAlchemy authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on ContentAlchemy's website could include technical, typographical, or photographic errors. ContentAlchemy does not warrant that any of the materials on its website are accurate, complete or current. ContentAlchemy may make changes to the materials contained on its website at any time without notice. However ContentAlchemy does not commit to update the materials.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">6. Links</h2>
              <p>
                ContentAlchemy has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ContentAlchemy of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">7. Modifications</h2>
              <p>
                ContentAlchemy may revise these Terms of Service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the local laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-slate-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm transition-colors mt-auto">
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
