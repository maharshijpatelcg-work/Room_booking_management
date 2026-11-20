"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Calendar,
  BookOpen,
  RotateCcw,
  History,
  X,
  Boxes,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resources", label: "Resource Inventory", icon: Package },
  { href: "/bookings", label: "Booking Requests", icon: BookOpen },
  { href: "/bookings/calendar", label: "Schedule Calendar", icon: Calendar },
  { href: "/returns", label: "Returns Management", icon: RotateCcw },
  { href: "/history", label: "Usage Audit Trail", icon: History },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-deepIndigo z-40 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mutedIndigo border border-dustyLavender/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Boxes size={22} className="text-softSage" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-base tracking-tight">
                  EquipBook
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-mutedTeal/30 text-softSage border border-mutedTeal/40">
                  PRO
                </span>
              </div>
              <p className="text-dustyLavender text-xs font-normal">
                Campus Resource Suite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-dustyLavender hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <p className="text-dustyLavender/70 text-[11px] font-semibold uppercase tracking-wider px-3 mb-2">
            Main Management
          </p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-mutedIndigo text-white shadow-sm border border-dustyLavender/20"
                    : "text-dustyLavender hover:bg-white/5 hover:text-white"
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-softSage rounded-r-full" />
                )}
                <Icon
                  size={18}
                  className={`transition-colors ${
                    isActive
                      ? "text-softSage"
                      : "text-dustyLavender group-hover:text-softSage"
                  }`}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Institution Badge & Footer */}
        <div className="p-4 mx-3 mb-4 rounded-xl bg-charcoal/60 border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-mutedTeal/20 border border-mutedTeal/30 flex items-center justify-center text-softSage flex-shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white truncate">
              Institutional License
            </p>
            <p className="text-[11px] text-dustyLavender truncate">
              Spring 2026 Academic Term
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-white/10 text-center">
          <p className="text-[11px] text-dustyLavender/80">
            EquipBook v2.4 • System Active
          </p>
        </div>
      </aside>
    </>
  );
}
