"use client";

import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<string, string> = {
  primary:   "bg-[#0F766E] text-white hover:bg-[#0B5F58] shadow-sm border border-[#0F766E]",
  secondary: "bg-[#E3F2EF] text-[#0B5F58] hover:bg-[#D1EBE6] border border-[#0F766E]/20",
  outline:   "bg-white text-[#1B1A2E] border border-[#E4E2DA] hover:border-[#0F766E]/40 hover:bg-[#F4F3EF]",
  ghost:     "bg-transparent text-[#55536B] hover:bg-[#F4F3EF] hover:text-[#1B1A2E] border border-transparent",
  danger:    "bg-red-600 text-white hover:bg-red-700 border border-red-600",
};

const sizes: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-2.5 text-sm rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
