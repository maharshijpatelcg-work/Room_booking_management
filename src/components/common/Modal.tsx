"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#1B1A2E]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_8px_32px_rgba(0,0,0,0.12)] w-full ${sizes[size]} max-h-[90vh] flex flex-col z-10`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E2DA] flex-shrink-0">
          <h2 className="text-base font-semibold text-[#1B1A2E]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#55536B] hover:text-[#1B1A2E] hover:bg-[#F4F3EF] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
