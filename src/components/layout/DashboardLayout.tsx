"use client";

import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * DashboardLayout passthrough wrapper to maintain backward compatibility.
 * Persistent layout navigation shell is mounted at the root level in src/app/layout.tsx.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <>{children}</>;
}
