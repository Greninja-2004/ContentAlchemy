"use client";

import React, { Suspense } from "react";
import { SignUpPage } from "@/components/ui/sign-up-flow-1";

export default function Signup() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Workspace...</div>}>
      <SignUpPage />
    </Suspense>
  );
}
