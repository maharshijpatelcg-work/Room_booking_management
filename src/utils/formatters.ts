export function formatBookingStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    Pending:   "bg-[#FFEDD5] text-[#9A3412] border border-orange-200",
    Approved:  "bg-[#E3F2EF] text-[#0B5F58] border border-[#0F766E]/20",
    Completed: "bg-gray-100 text-[#55536B] border border-gray-200",
    Rejected:  "bg-red-50 text-red-700 border border-red-200",
    Cancelled: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return map[status] || "bg-gray-100 text-gray-500 border border-gray-200";
}

export function getStatusDot(status: string): string {
  const map: Record<string, string> = {
    Pending:   "bg-orange-400",
    Approved:  "bg-[#0F766E]",
    Completed: "bg-[#55536B]",
    Rejected:  "bg-red-500",
    Cancelled: "bg-gray-400",
  };
  return map[status] || "bg-gray-400";
}

export function getCategoryBadge(category: string): {
  bg: string;
  text: string;
  border: string;
} {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    Laptops:                { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-100" },
    Cameras:                { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" },
    Projectors:             { bg: "bg-[#E3F2EF]", text: "text-[#0B5F58]", border: "border-[#0F766E]/20" },
    "Laboratory Equipment": { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-100" },
    "Meeting Rooms":        { bg: "bg-slate-100", text: "text-slate-700",  border: "border-slate-200" },
    "Sports Equipment":     { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100" },
    "Audio Equipment":      { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-100" },
    Other:                  { bg: "bg-gray-100",  text: "text-gray-600",   border: "border-gray-200" },
  };
  return (
    map[category] || { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" }
  );
}

export function getConditionColor(condition: string): string {
  const map: Record<string, string> = {
    Excellent:           "bg-[#E3F2EF] text-[#0B5F58] border border-[#0F766E]/20",
    Good:                "bg-blue-50 text-blue-700 border border-blue-100",
    Damaged:             "bg-red-50 text-red-700 border border-red-200",
    "Needs Maintenance": "bg-[#FFEDD5] text-[#9A3412] border border-orange-200",
  };
  return map[condition] || "bg-gray-100 text-gray-500 border border-gray-200";
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
