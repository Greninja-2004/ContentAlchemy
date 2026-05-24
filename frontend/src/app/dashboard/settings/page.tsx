"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, CreditCard, Sparkles, Loader2, Pencil, Star } from "lucide-react";
import { CreativePricing } from "@/components/ui/creative-pricing";

export default function SettingsPage() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<"pro" | "max" | "billing" | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Capture Stripe session redirects and show rich color notifications
    const searchParams = new URLSearchParams(window.location.search);
    const hasSession = searchParams.has("session_id");
    const isMockSuccess = searchParams.get("mock_success") === "true";
    const isMockCancel = searchParams.get("mock_cancel") === "true";
    const planParam = searchParams.get("plan");

    if (hasSession || isMockSuccess || isMockCancel) {
      if (hasSession || isMockSuccess) {
        const planName = planParam?.toLowerCase() === "pro" ? "Pro" : "Max";
        toast.success(`Subscription upgraded to ${planName} Plan successfully.`);
      } else if (isMockCancel) {
        toast.info("Subscription canceled (returned to Free plan).");
      }

      api.getMe().then((updatedUser) => {
        setUser(updatedUser);
        // Clean URL params
        router.replace("/dashboard/settings");
      });
      return;
    }

    if (!isAuthenticated) {
      api.getMe().then(setUser).catch(() => router.push("/login"));
    }
  }, [isAuthenticated, router, setUser]);

  const handleLogout = () => {
    api.clearToken();
    logout();
    router.push("/");
  };

  const handleUpgrade = async (plan: "pro" | "max") => {
    setLoadingPlan(plan);
    try {
      const response = await api.createCheckoutSession(plan);
      if (response.url) {
        window.location.href = response.url;
      } else {
        toast.error("Failed to generate checkout session.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred starting checkout.";
      toast.error(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageBilling = async () => {
    setLoadingPlan("billing");
    try {
      const response = await api.createPortalSession();
      if (response.url) {
        window.location.href = response.url;
      } else {
        toast.error("Failed to load customer billing portal.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred loading portal.";
      toast.error(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  const rawTier = (user?.subscription_tier || "free").toLowerCase();
  const currentTier = rawTier === "premium" ? "max" : rawTier;
  
  const formattedEndDate = user?.subscription_end
    ? new Date(user.subscription_end).toLocaleDateString(undefined, {
        dateStyle: "long",
      })
    : null;

  const pricingTiers = [
    {
      name: "Free",
      icon: <Pencil className="w-6 h-6" />,
      price: 0,
      description: "Basic features for simple creators.",
      color: "amber",
      buttonText: currentTier === "free" ? "Current Plan" : "Included",
      disabled: true,
      features: [
        "2 content generations per day",
        "8 platform outputs simultaneously",
        "Instant copy to clipboard",
      ],
    },
    {
      name: "Pro",
      icon: <Star className="w-6 h-6" />,
      price: 9,
      description: "For active content creators needing more.",
      color: "blue",
      popular: currentTier !== "max",
      buttonText: loadingPlan === "pro" ? "Upgrading..." : currentTier === "pro" ? "Current Plan" : currentTier === "max" ? "Included" : "Upgrade to Pro",
      disabled: currentTier !== "free" || loadingPlan !== null,
      loading: loadingPlan === "pro",
      onClick: () => handleUpgrade("pro"),
      features: [
        "15 content generations per day",
        "4 platform outputs simultaneously",
        "Core YouTube transcript parsing",
        "Comparison split view",
      ],
    },
    {
      name: "Max",
      icon: <Sparkles className="w-6 h-6" />,
      price: 19,
      description: "Supercharge your pipeline with unlimited runs.",
      color: "purple",
      popular: currentTier === "max",
      buttonText: loadingPlan === "max" ? "Upgrading..." : currentTier === "max" ? "Current Plan" : "Upgrade to Max",
      disabled: currentTier === "max" || loadingPlan !== null,
      loading: loadingPlan === "max",
      onClick: () => handleUpgrade("max"),
      features: [
        "Unlimited content generations",
        "8 platform outputs simultaneously",
        "High-priority generation rendering",
        "Full YouTube & URL transcript parsing",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
            Manage your personal profile and subscription preferences.
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800/80 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              Profile details
            </h2>
            <Separator className="my-4 bg-slate-100 dark:bg-zinc-800" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Full name
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 mt-1">
                  {user?.name || "—"}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Email address
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 mt-1">
                  {user?.email || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800/80 p-6 shadow-sm overflow-hidden relative">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
              Subscription
            </h2>
            <Separator className="my-4 bg-slate-100 dark:bg-zinc-800" />

            {/* Current Active Plan Overview */}
            <div className="mb-8">
              {currentTier === "max" || currentTier === "premium" ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/40 rounded-xl gap-4">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-350">
                      Max Plan Active
                    </span>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                      You have active unlimited generation access. Thank you for subscribing!
                    </p>
                    {formattedEndDate && (
                      <p className="text-xs text-slate-450 dark:text-zinc-500 mt-1">
                        Renews on {formattedEndDate}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleManageBilling}
                    disabled={loadingPlan !== null}
                    className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 self-start sm:self-center font-medium cursor-pointer"
                  >
                    {loadingPlan === "billing" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Billing Settings
                  </Button>
                </div>
              ) : currentTier === "pro" ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-950/40 rounded-xl gap-4">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-350">
                      Pro Plan Active
                    </span>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                      You have active Pro tier access (15 content generations per day).
                    </p>
                    {formattedEndDate && (
                      <p className="text-xs text-slate-450 dark:text-zinc-500 mt-1">
                        Renews on {formattedEndDate}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <Button
                      onClick={handleManageBilling}
                      disabled={loadingPlan !== null}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 font-medium cursor-pointer"
                    >
                      {loadingPlan === "billing" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      Billing Settings
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 rounded-xl">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-300">
                    Free Plan
                  </span>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                    Limited to 2 content generations per day. Upgrade to remove limits and unlock premium models!
                  </p>
                </div>
              )}
            </div>

            {/* Custom Neo-Brutalist pricing component */}
            <div className="py-6 border-t border-slate-100 dark:border-zinc-800">
              <CreativePricing
                tag="Formula Plans"
                title="Change Subscription Tier"
                description="Select an active formula below to adjust your workspace capability."
                tiers={pricingTiers}
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50/20 dark:bg-rose-950/5 rounded-2xl border border-rose-100 dark:border-rose-950/20 p-6">
            <h2 className="text-lg font-bold text-rose-700 dark:text-rose-400">
              Account actions
            </h2>
            <Separator className="my-4 bg-rose-100/60 dark:bg-rose-950/20" />
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">
              Logout of your session on this browser.
            </p>
            <Button
              variant="outline"
              className="border-rose-200 dark:border-rose-950/50 text-rose-700 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              onClick={handleLogout}
            >
              Sign out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
