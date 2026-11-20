"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Settings, Info, ChevronDown } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/dashboard" },
  { label: "Inventory",  href: "/resources" },
  { label: "Bookings",   href: "/bookings" },
  { label: "Calendar",   href: "/bookings/calendar" },
  { label: "Returns",    href: "/returns" },
  { label: "Audit Trail",href: "/history" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
    if (href === "/bookings") return pathname === "/bookings" || pathname === "/bookings/new";
    if (href === "/bookings/calendar") return pathname === "/bookings/calendar";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E4E2DA]" style={{ boxShadow: "0 1px 0 #E4E2DA" }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-2 sm:gap-6">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0 mr-2">
            <div className="w-8 h-8 rounded-lg bg-[#1B1A2E] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm leading-none">E</span>
            </div>
            <span className="font-semibold text-[#1B1A2E] text-sm hidden sm:block tracking-tight">
              EquipBook
            </span>
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                  isActive(item.href)
                    ? "bg-[#E3F2EF] text-[#0B5F58] font-semibold"
                    : "text-[#55536B] hover:bg-[#F4F3EF] hover:text-[#1B1A2E]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Profile section */}
          <div className="ml-auto flex items-center gap-2" ref={profileRef}>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:bg-[#F4F3EF] rounded-xl px-2 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#0F766E] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white text-xs font-bold tracking-tight">YK</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-[#1B1A2E] leading-tight">Yashvi Kanani</p>
                  <p className="text-[10px] text-[#55536B]">Resource Admin</p>
                </div>
                <ChevronDown
                  size={13}
                  className={`text-[#55536B] hidden sm:block transition-transform duration-150 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E4E2DA] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-[#E4E2DA] mb-1">
                    <p className="text-xs font-semibold text-[#1B1A2E]">Yashvi Kanani</p>
                    <p className="text-[11px] text-[#55536B]">yashvi@college.edu</p>
                  </div>
                  <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#1B1A2E] hover:bg-[#F4F3EF] transition-colors">
                    <User size={13} className="text-[#55536B]" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#1B1A2E] hover:bg-[#F4F3EF] transition-colors">
                    <Info size={13} className="text-[#55536B]" />
                    Account Information
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#1B1A2E] hover:bg-[#F4F3EF] transition-colors">
                    <Settings size={13} className="text-[#55536B]" />
                    Settings
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-[#55536B] hover:bg-[#F4F3EF] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E4E2DA] bg-white px-4 pb-4 pt-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium my-0.5 transition-all ${
                isActive(item.href)
                  ? "bg-[#E3F2EF] text-[#0B5F58] font-semibold"
                  : "text-[#55536B] hover:bg-[#F4F3EF] hover:text-[#1B1A2E]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

