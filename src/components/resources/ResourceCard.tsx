import type { IResource } from "@/types";
import { MapPin, Package, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/common/Button";
import { getCategoryBadge } from "@/utils/formatters";

interface ResourceCardProps {
  resource: IResource;
  onEdit: (r: IResource) => void;
  onDelete: (id: string) => void;
}

export default function ResourceCard({
  resource,
  onEdit,
  onDelete,
}: ResourceCardProps) {
  const availPct =
    resource.totalQuantity > 0
      ? Math.round((resource.available / resource.totalQuantity) * 100)
      : 0;

  const isAvailable = resource.available > 0;
  const catBadge = getCategoryBadge(resource.category);

  return (
    <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-[#0F766E]/40 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image Container */}
      <div className="h-44 bg-[#F4F3EF] relative overflow-hidden">
        {resource.images && resource.images[0] ? (
          <img
            src={resource.images[0]}
            alt={resource.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#55536B]">
            <Package size={36} className="opacity-60" />
            <span className="text-[10px] text-[#55536B] mt-1">
              No Preview Photo
            </span>
          </div>
        )}

        {/* Category Tag */}
        <span
          className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catBadge.bg} ${catBadge.text} ${catBadge.border} shadow-xs`}
        >
          {resource.category}
        </span>

        {/* Stock Status Badge */}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
            isAvailable
              ? "bg-[#E3F2EF] text-[#0B5F58] border border-[#0F766E]/20"
              : "bg-[#FFEDD5] text-[#9A3412] border border-orange-200"
          }`}
        >
          {isAvailable ? `${resource.available} IN STOCK` : "BOOKED OUT"}
        </span>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/resources/${resource._id}`}>
          <h3 className="font-bold text-[#1B1A2E] text-sm mb-1 leading-snug line-clamp-1 group-hover:text-[#0F766E] transition-colors">
            {resource.name}
          </h3>
        </Link>
        <p className="text-xs text-[#55536B] mb-3 flex-1 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Location & Metadata */}
        <div className="space-y-1 mb-3 pb-3 border-b border-[#E4E2DA]/60 text-xs">
          <div className="flex items-center gap-1.5 text-[#55536B]">
            <MapPin size={12} className="text-[#0F766E] shrink-0" />
            <span className="truncate">{resource.location}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#55536B]">Inventory:</span>
            <span className="font-bold text-[#1B1A2E]">
              {resource.available} / {resource.totalQuantity} Units
            </span>
          </div>
        </div>

        {/* Availability Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-[#55536B]">Availability</span>
            <span
              className={`font-bold ${
                availPct > 50
                  ? "text-[#0F766E]"
                  : availPct > 15
                  ? "text-orange-700"
                  : "text-red-600"
              }`}
            >
              {availPct}%
            </span>
          </div>
          <div className="w-full bg-[#F4F3EF] h-1.5 rounded-full overflow-hidden border border-[#E4E2DA]/60">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                availPct > 50
                  ? "bg-[#0F766E]"
                  : availPct > 15
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${availPct}%` }}
            />
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          <Link href={`/resources/${resource._id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Eye size={12} />}
              className="w-full text-xs"
            >
              View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(resource)}
            leftIcon={<Edit size={12} className="text-[#55536B]" />}
            className="hover:bg-[#F4F3EF] text-[#55536B]"
            title="Edit Resource"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(resource._id!)}
            leftIcon={<Trash2 size={12} className="text-red-500" />}
            className="hover:bg-red-50"
            title="Delete Resource"
          />
        </div>
      </div>
    </div>
  );
}
