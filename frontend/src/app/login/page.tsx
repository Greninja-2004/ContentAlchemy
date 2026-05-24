"use client";

import React, { Suspense } from "react";
import { SignInPage } from "@/components/ui/sign-in-flow-1";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Auth...</div>}>
      <SignInPage />
    </Suspense>
  );
}
