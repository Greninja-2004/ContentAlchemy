"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, CreditCard, Sparkles, Loader2 } from "lucide-react";

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
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800/80 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              Subscription
            </h2>
            <Separator className="my-4 bg-slate-100 dark:bg-zinc-800" />

            {/* Current Tier Status Card */}
            <div className="space-y-6">
              {currentTier === "max" || currentTier === "premium" ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/40 rounded-xl gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-350">
                        Max Plan Active
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                      You have active unlimited generation access.
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
                    className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 self-start sm:self-center font-medium"
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
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-350">
                        Pro Plan Active
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                      You have active Pro tier access (15 content generations per day).
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
                    className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 self-start sm:self-center font-medium"
                  >
                    {loadingPlan === "billing" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Billing Settings
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 rounded-xl">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-850 text-slate-800 dark:text-zinc-300">
                      Free Plan
                    </span>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                      Limited to 2 content generations per day.
                    </p>
                  </div>
                </div>
              )}

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Pro Tier Upgrade Card */}
                <div className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col justify-between shadow-sm transition-all duration-300 ${
                  currentTier === "pro"
                    ? "border-indigo-500 bg-indigo-50/5 dark:bg-indigo-950/5"
                    : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Pro Plan</span>
                      {currentTier === "pro" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">Active</span>
                      )}
                    </div>
                    <div className="flex items-baseline mt-4">
                      <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">$9</span>
                      <span className="ml-1 text-sm font-semibold text-slate-500 dark:text-zinc-400">/month</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 min-h-[32px]">
                      Perfect for regular content creators needing expanded daily usage limits.
                    </p>

                    <Separator className="my-5 bg-slate-100 dark:bg-zinc-800/80" />

                    <div className="space-y-3.5 text-sm text-slate-600 dark:text-zinc-300">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 p-0.5 text-indigo-600 dark:text-indigo-400">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>15 content generations per day</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 p-0.5 text-indigo-600 dark:text-indigo-450">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>4 platform outputs simultaneously</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 p-0.5 text-indigo-600 dark:text-indigo-450">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>Core YouTube transcript parsing</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => handleUpgrade("pro")}
                      disabled={currentTier !== "free" || loadingPlan !== null}
                      className={`w-full font-semibold rounded-xl transition-all duration-200 ${
                        currentTier === "pro"
                          ? "bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-default"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400"
                      }`}
                    >
                      {loadingPlan === "pro" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : currentTier === "pro" ? (
                        "Current Plan"
                      ) : currentTier === "max" || currentTier === "premium" ? (
                        "Included in Max"
                      ) : (
                        "Upgrade to Pro"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Max Tier Upgrade Card */}
                <div className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col justify-between shadow-md transition-all duration-300 ${
                  currentTier === "max" || currentTier === "premium"
                    ? "border-indigo-500 bg-indigo-50/5 dark:bg-indigo-950/5"
                    : "border-indigo-100 dark:border-indigo-950/40 bg-gradient-to-br from-indigo-50/20 via-white to-transparent dark:from-indigo-950/10 dark:via-zinc-900/60 dark:to-transparent"
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm uppercase tracking-wide">Max Plan</span>
                      </div>
                      {(currentTier === "max" || currentTier === "premium") && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">Active</span>
                      )}
                    </div>
                    <div className="flex items-baseline mt-4">
                      <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">$19</span>
                      <span className="ml-1 text-sm font-semibold text-slate-500 dark:text-zinc-400">/month</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 min-h-[32px]">
                      Supercharge output with unlimited rendering and full platform priority.
                    </p>

                    <Separator className="my-5 bg-indigo-100/50 dark:bg-zinc-800" />

                    <div className="space-y-3.5 text-sm text-slate-650 dark:text-zinc-300">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 p-0.5 text-indigo-600 dark:text-indigo-400">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>Unlimited content generations</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 p-0.5 text-indigo-600 dark:text-indigo-450">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>8 platform outputs simultaneously</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 p-0.5 text-indigo-600 dark:text-indigo-450">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>High-priority generation rendering</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 p-0.5 text-indigo-600 dark:text-indigo-450">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>Full YouTube & URL transcript parsing</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => handleUpgrade("max")}
                      disabled={currentTier === "max" || currentTier === "premium" || loadingPlan !== null}
                      className={`w-full font-semibold rounded-xl transition-all duration-200 ${
                        currentTier === "max" || currentTier === "premium"
                          ? "bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-default"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-sm"
                      }`}
                    >
                      {loadingPlan === "max" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : currentTier === "max" || currentTier === "premium" ? (
                        "Current Plan"
                      ) : (
                        "Upgrade to Max"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
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
