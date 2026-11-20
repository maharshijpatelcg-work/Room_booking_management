import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  variant?: "default" | "teal" | "warn" | "muted" | "indigo" | "charcoal" | "sage" | "lavender" | "sand" | "alert";
  trend?: { value: number; label: string };
  subtitle?: string;
  accentNote?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  variant = "teal",
  trend,
  subtitle,
  accentNote,
}: StatsCardProps) {
  // Map variant to soft colors
  const isTeal = variant === "teal" || variant === "sage" || variant === "indigo";
  const isWarn = variant === "warn" || variant === "sand" || variant === "alert";

  const iconBg = isWarn ? "bg-[#FFEDD5] text-[#9A3412]" : isTeal ? "bg-[#E3F2EF] text-[#0F766E]" : "bg-[#F4F3EF] text-[#55536B]";
  const valueColor = isWarn ? "text-[#9A3412]" : isTeal ? "text-[#1B1A2E]" : "text-[#1B1A2E]";

  return (
    <div className="bg-white rounded-2xl border border-[#E4E2DA] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#0F766E]/40 transition-all duration-200">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-[#55536B]">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <p className={`text-3xl font-bold tracking-tight ${valueColor}`}>
          {value}
        </p>
      </div>

      {(subtitle || accentNote || trend) && (
        <div className="mt-3 pt-2.5 border-t border-[#E4E2DA]/50 flex items-center justify-between text-[11px] text-[#55536B]">
          {subtitle && <span>{subtitle}</span>}
          {accentNote && (
            <span className="font-semibold text-[#0F766E]">{accentNote}</span>
          )}
          {trend && (
            <span
              className={`flex items-center gap-1 font-semibold ${
                trend.value >= 0 ? "text-[#0F766E]" : "text-red-600"
              }`}
            >
              {trend.value >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`} {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
