"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
} from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Navbar({
  onMenuClick,
  title = "Resource Overview",
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-charcoal text-white px-5 py-3.5 flex items-center justify-between shadow-md border-b border-black/10 sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-dustyLavender hover:text-white transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-semibold text-base tracking-tight text-white flex items-center gap-2">
              <span>{title}</span>
            </h1>
            <p className="text-[11px] text-softSage/90 hidden md:block">
              Central College Equipment & Resource Management
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dustyLavender"
            />
            <input
              type="text"
              placeholder="Search platform..."
              className="bg-black/20 text-white placeholder-dustyLavender/80 pl-8 pr-3 py-1.5 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-softSage focus:ring-1 focus:ring-softSage w-44 transition-all"
            />
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-lg text-dustyLavender hover:text-white hover:bg-white/10 transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-warmSand rounded-full ring-2 ring-charcoal" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden text-charcoal z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 bg-deepIndigo text-white flex items-center justify-between">
                  <span className="font-semibold text-xs tracking-wide">
                    System Notifications
                  </span>
                  <span className="text-[10px] bg-mutedTeal px-2 py-0.5 rounded-full text-white">
                    3 New
                  </span>
                </div>
                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  <div className="p-3 hover:bg-offWhite transition-colors flex items-start gap-2.5">
                    <Clock size={16} className="text-mutedIndigo mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-charcoal">
                        Pending Booking Request
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Yashvi Kanani requested Sony Alpha A7 IV.
                      </p>
                      <span className="text-[10px] text-mutedTeal">
                        10 minutes ago
                      </span>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-offWhite transition-colors flex items-start gap-2.5">
                    <CheckCircle2
                      size={16}
                      className="text-softSage mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-charcoal">
                        Inventory Synchronized
                      </p>
                      <p className="text-[11px] text-gray-500">
                        20 resources currently online in MongoDB Atlas.
                      </p>
                      <span className="text-[10px] text-mutedTeal">
                        Today at 12:15 PM
                      </span>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-offWhite transition-colors flex items-start gap-2.5">
                    <AlertTriangle
                      size={16}
                      className="text-amber-500 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-charcoal">
                        Maintenance Check Due
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Microscope calibration cycle due this Friday.
                      </p>
                      <span className="text-[10px] text-mutedTeal">
                        Yesterday
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                  <Link
                    href="/bookings"
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] font-semibold text-mutedIndigo hover:underline"
                  >
                    View All Booking Requests →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-white/15" />

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-mutedIndigo border border-dustyLavender/40 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                YK
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-white leading-tight">
                  Yashvi Kanani
                </p>
                <p className="text-[10px] text-softSage">Resource Admin</p>
              </div>
              <ChevronDown
                size={14}
                className="text-dustyLavender hidden sm:block"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden text-charcoal z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 bg-deepIndigo text-white">
                  <p className="text-sm font-bold">Yashvi Kanani</p>
                  <p className="text-xs text-dustyLavender">
                    yashvi@college.edu
                  </p>
                  <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-mutedTeal/40 text-softSage border border-softSage/30">
                    Administrator
                  </span>
                </div>

                <div className="p-2 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setSettingsModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-charcoal hover:bg-offWhite hover:text-deepIndigo transition-colors"
                  >
                    <User size={15} className="text-mutedTeal" />
                    <span>Profile & Credentials</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setSettingsModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-charcoal hover:bg-offWhite hover:text-deepIndigo transition-colors"
                  >
                    <Building2 size={15} className="text-mutedTeal" />
                    <span>Account Information</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setSettingsModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-charcoal hover:bg-offWhite hover:text-deepIndigo transition-colors"
                  >
                    <Settings size={15} className="text-mutedTeal" />
                    <span>System Settings</span>
                  </button>
                </div>

                <div className="p-2 border-t border-gray-100 bg-gray-50/60">
                  <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Shield size={12} className="text-softSage" />
                      Role: Admin
                    </span>
                    <span className="text-emerald-700 font-medium">Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Account / Settings Dialog */}
      {settingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden text-charcoal animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-deepIndigo text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Account & Institutional Information</h3>
                <p className="text-[11px] text-dustyLavender">Equipment & Resource Booking Management System</p>
              </div>
              <button
                onClick={() => setSettingsModal(false)}
                className="text-dustyLavender hover:text-white p-1 rounded-md"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-offWhite border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-mutedIndigo flex items-center justify-center text-white font-bold text-sm">
                  YK
                </div>
                <div>
                  <p className="font-bold text-sm text-deepIndigo">Yashvi Kanani</p>
                  <p className="text-gray-500">yashvi@college.edu</p>
                  <span className="text-[10px] text-mutedTeal font-semibold">Campus Resource Administrator</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex justify-between py-1 text-gray-600">
                  <span className="font-medium">Institution:</span>
                  <span>College of Engineering & Technology</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span className="font-medium">Database:</span>
                  <span className="font-mono text-[11px] text-mutedTeal">MongoDB Atlas (Live)</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span className="font-medium">Framework:</span>
                  <span>Next.js 15 (App Router)</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span className="font-medium">Theme:</span>
                  <span className="font-semibold text-deepIndigo">Deep Indigo / Charcoal Palette</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSettingsModal(false)}
                  className="w-full py-2 bg-mutedIndigo hover:bg-deepIndigo text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
