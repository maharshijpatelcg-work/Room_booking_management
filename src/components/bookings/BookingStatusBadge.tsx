import { getStatusColor } from "@/utils/formatters";

interface BookingStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export default function BookingStatusBadge({
  status,
  size = "md",
}: BookingStatusBadgeProps) {
  const cls = getStatusColor(status);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
        size === "sm" ? "text-[10px]" : "text-xs"
      } ${cls}`}
    >
      {status}
    </span>
  );
}
