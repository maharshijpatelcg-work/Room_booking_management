"use client";

import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ResourceForm from "@/components/resources/ResourceForm";
import { resourcesAPI } from "@/lib/api";
import type { IResource } from "@/types";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

export default function NewResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Partial<IResource>) => {
    setLoading(true);
    try {
      const res = await resourcesAPI.create(data);
      setLoading(false);
      if (res.success) {
        toast.success(res.message || "Resource created successfully");
        router.push("/resources");
        return true;
      } else {
        toast.error(res.error || "Failed to create resource");
        return false;
      }
    } catch {
      setLoading(false);
      toast.error("Network error while creating resource");
      return false;
    }
  };

  return (
    <DashboardLayout title="New Resource">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/resources"
            className="p-2 text-mutedTeal hover:text-charcoal hover:bg-white rounded-lg border border-gray-200 transition-colors shadow-xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
              <PlusCircle size={20} className="text-mutedIndigo" />
              Register New Resource Asset
            </h2>
            <p className="text-xs text-mutedTeal mt-0.5">
              Add new equipment, laboratory devices, meeting rooms, or audio/video assets to the catalog.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/90 p-6 shadow-xs">
          <ResourceForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/resources")}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
