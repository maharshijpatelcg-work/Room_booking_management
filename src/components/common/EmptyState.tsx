import { PackageOpen } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E4E2DA]">
      <div className="w-14 h-14 bg-[#F4F3EF] border border-[#E4E2DA] rounded-2xl flex items-center justify-center mb-4 text-[#55536B]">
        {icon ?? <PackageOpen size={24} />}
      </div>
      <h3 className="text-sm font-semibold text-[#1B1A2E] mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-[#55536B] max-w-sm mb-5 leading-relaxed px-4">
          {description}
        </p>
      )}
      {action && (
        <Button size="sm" variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
