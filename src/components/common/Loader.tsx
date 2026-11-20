import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

const iconSizes = { sm: 18, md: 28, lg: 40 };

export default function Loader({ size = "md", text, fullPage }: LoaderProps) {
  const inner = (
    <div className="flex flex-col items-center gap-3 text-[#55536B]">
      <Loader2
        size={iconSizes[size]}
        className="animate-spin text-[#0F766E]"
      />
      {text && (
        <p className="text-xs font-medium text-[#55536B]">{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        {inner}
      </div>
    );
  }
  return inner;
}
