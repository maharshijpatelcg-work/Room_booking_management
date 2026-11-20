"use client";

import { Search, Filter, X, LayoutGrid, TableProperties } from "lucide-react";
import Button from "@/components/common/Button";

const CATEGORIES = [
  "All",
  "Laptops",
  "Cameras",
  "Projectors",
  "Laboratory Equipment",
  "Meeting Rooms",
  "Sports Equipment",
  "Audio Equipment",
  "Other",
];

interface ResourceFiltersProps {
  search: string;
  category: string;
  available: string;
  view: "grid" | "table";
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onAvailableChange: (v: string) => void;
  onViewChange: (v: "grid" | "table") => void;
  onReset: () => void;
}

export default function ResourceFilters({
  search,
  category,
  available,
  view,
  onSearchChange,
  onCategoryChange,
  onAvailableChange,
  onViewChange,
  onReset,
}: ResourceFiltersProps) {
  const hasFilters = search || category !== "All" || available !== "all";

  return (
    <div className="bg-white rounded-2xl border border-[#E4E2DA] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-wrap gap-3 items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55536B]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by asset name, specs, location..."
          className="w-full pl-10 pr-4 py-2 text-xs text-[#1B1A2E] placeholder:text-[#55536B] bg-[#F4F3EF]/60 border border-[#E4E2DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Category selector */}
        <div className="flex items-center gap-1.5 bg-[#F4F3EF]/60 border border-[#E4E2DA] rounded-full px-3 py-1">
          <Filter size={13} className="text-[#55536B]" />
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-xs font-medium text-[#1B1A2E] bg-transparent py-1 focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Availability selector */}
        <select
          value={available}
          onChange={(e) => onAvailableChange(e.target.value)}
          className="text-xs font-medium text-[#1B1A2E] bg-[#F4F3EF]/60 border border-[#E4E2DA] rounded-full px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 cursor-pointer"
        >
          <option value="all">All Availability</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>

        {/* Reset Active Filters */}
        {hasFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            leftIcon={<X size={12} className="text-[#55536B]" />}
            className="text-xs text-[#55536B] hover:text-[#1B1A2E]"
          >
            Reset
          </Button>
        )}

        {/* View toggle */}
        <div className="flex items-center bg-[#F4F3EF] p-1 border border-[#E4E2DA] rounded-full">
          <button
            onClick={() => onViewChange("grid")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              view === "grid"
                ? "bg-[#E3F2EF] text-[#0B5F58] font-semibold shadow-xs"
                : "text-[#55536B] hover:text-[#1B1A2E]"
            }`}
            title="Grid View"
          >
            <LayoutGrid size={13} />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => onViewChange("table")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              view === "table"
                ? "bg-[#E3F2EF] text-[#0B5F58] font-semibold shadow-xs"
                : "text-[#55536B] hover:text-[#1B1A2E]"
            }`}
            title="Table View"
          >
            <TableProperties size={13} />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>
    </div>
  );
}
