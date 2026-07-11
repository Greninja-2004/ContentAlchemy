"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-655 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-heading mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-500 dark:text-zinc-450 text-sm mb-12">Last Updated: July 11, 2026</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 font-sans leading-relaxed text-slate-700 dark:text-zinc-300">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">1. Introduction</h2>
              <p>
                At ContentAlchemy, accessible from contentjourney.netlify.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ContentAlchemy and how we use it.
              </p>
              <p>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">2. Google DoubleClick DART Cookie & Third-Party Advertising</h2>
              <p>
                Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to contentjourney.netlify.app and other sites on the internet.
              </p>
              <p>
                However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline"
                >
                  https://policies.google.com/technologies/ads
                </a>
              </p>
              <p>
                You may also opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline"
                >
                  aboutads.info
                </a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">3. Information We Collect</h2>
              <p>
                The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
              </p>
              <p>
                If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">4. How We Use Your Information</h2>
              <p>We use the information we collect in various ways, including to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, operate, and maintain our website and platform</li>
                <li>Improve, personalize, and expand our website and platform</li>
                <li>Understand and analyze how you use our website and platform</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                <li>Send you emails</li>
                <li>Find and prevent fraud</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">5. Log Files</h2>
              <p>
                ContentAlchemy follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-heading">6. GDPR Data Protection Rights</h2>
              <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>The right to access</strong> – You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
                <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
                <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
              </ul>
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
