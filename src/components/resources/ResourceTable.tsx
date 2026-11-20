"use client";

import { useState } from "react";
import type { IResource } from "@/types";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Link from "next/link";
import { Edit, Trash2, Eye, MapPin, Package } from "lucide-react";
import { getCategoryBadge } from "@/utils/formatters";

interface ResourceTableProps {
  resources: IResource[];
  onEdit: (r: IResource) => void;
  onDelete: (id: string) => void;
  deleting?: string | null;
}

export default function ResourceTable({
  resources,
  onEdit,
  onDelete,
  deleting,
}: ResourceTableProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#E4E2DA] bg-[#F4F3EF]/70 text-[#55536B] uppercase tracking-wider font-semibold text-[10px]">
              <th className="text-left px-4 py-3.5">Resource Asset</th>
              <th className="text-left px-4 py-3.5">Category</th>
              <th className="text-left px-4 py-3.5">Campus Location</th>
              <th className="text-center px-4 py-3.5">Total Qty</th>
              <th className="text-center px-4 py-3.5">Available</th>
              <th className="text-center px-4 py-3.5">Status</th>
              <th className="text-right px-4 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E2DA]/50 bg-white">
            {resources.map((r) => {
              const isAvailable = r.available > 0;
              const catBadge = getCategoryBadge(r.category);

              return (
                <tr key={r._id} className="hover:bg-[#F4F3EF]/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F4F3EF] border border-[#E4E2DA] overflow-hidden flex items-center justify-center shrink-0">
                        {r.images?.[0] ? (
                          <img
                            src={r.images[0]}
                            alt={r.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={16} className="text-[#55536B]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/resources/${r._id}`}>
                          <p className="font-bold text-[#1B1A2E] text-xs truncate max-w-[220px] hover:text-[#0F766E] transition-colors">
                            {r.name}
                          </p>
                        </Link>
                        <p className="text-[11px] text-[#55536B] truncate max-w-[220px]">
                          {r.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${catBadge.bg} ${catBadge.text} ${catBadge.border}`}
                    >
                      {r.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[#55536B]">
                    <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <MapPin size={12} className="text-[#0F766E] shrink-0" />
                      {r.location}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-[#1B1A2E]">
                    {r.totalQuantity}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`font-bold text-xs ${
                        isAvailable ? "text-[#0F766E]" : "text-red-600"
                      }`}
                    >
                      {r.available}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isAvailable
                          ? "bg-[#E3F2EF] text-[#0B5F58] border border-[#0F766E]/20"
                          : "bg-[#FFEDD5] text-[#9A3412] border border-orange-200"
                      }`}
                    >
                      {isAvailable ? "Available" : "Checked Out"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/resources/${r._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Eye size={13} className="text-[#55536B]" />}
                          title="View Details"
                        />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(r)}
                        leftIcon={<Edit size={13} className="text-[#55536B]" />}
                        title="Edit Resource"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmId(r._id!)}
                        loading={deleting === r._id}
                        leftIcon={<Trash2 size={13} className="text-red-500" />}
                        className="hover:bg-red-50"
                        title="Delete Resource"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) {
            onDelete(confirmId);
            setConfirmId(null);
          }
        }}
        title="Confirm Asset Deletion"
        message="Are you sure you want to permanently delete this resource from the catalog? This action cannot be undone if there are active bookings."
        confirmLabel="Delete Asset"
        variant="danger"
      />
    </>
  );
}
