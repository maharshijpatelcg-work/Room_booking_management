"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceTable from "@/components/resources/ResourceTable";
import ResourceFilters from "@/components/resources/ResourceFilters";
import ResourceForm from "@/components/resources/ResourceForm";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { InventorySkeleton } from "@/components/common/Skeletons";
import { useResources } from "@/hooks/useResources";
import type { IResource } from "@/types";
import { Plus, Download, Package } from "lucide-react";
import { exportToCSV } from "@/lib/api";

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [available, setAvailable] = useState("all");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IResource | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  const filters = useMemo(() => {
    const f: Record<string, string> = {};
    if (debouncedSearch) f.search = debouncedSearch;
    if (category !== "All") f.category = category;
    if (available !== "all") f.available = available;
    return f;
  }, [debouncedSearch, category, available]);

  const { resources, loading, createResource, updateResource, deleteResource } =
    useResources(filters);

  const handleSubmit = async (data: Partial<IResource>) => {
    setSaving(true);
    let ok: boolean;
    if (editing) {
      ok = await updateResource(editing._id!, data);
    } else {
      ok = await createResource(data);
    }
    setSaving(false);
    if (ok) {
      setShowForm(false);
      setEditing(null);
    }
    return ok;
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await deleteResource(id);
    setDeleting(null);
  };

  const handleEdit = (r: IResource) => {
    setEditing(r);
    setShowForm(true);
  };

  const handleExport = () => {
    const rows = resources.map((r) => ({
      Name: r.name,
      Category: r.category,
      Location: r.location,
      "Total Quantity": r.totalQuantity,
      Available: r.available,
      Description: r.description,
    }));
    exportToCSV(rows as unknown as Record<string, unknown>[], "resources_inventory.csv");
  };

  return (
    <DashboardLayout title="Inventory">
      <div className="space-y-6 max-w-[1200px] mx-auto">
        {/* Header matching reference style */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1B1A2E] tracking-tight">
              Resource Inventory
            </h1>
            <p className="text-sm text-[#55536B] mt-1">
              {resources.length} campus equipment assets catalogued across faculties.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={13} className="text-[#55536B]" />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
            >
              Add New Asset
            </Button>
          </div>
        </div>

        {/* Filters and View Controls */}
        <ResourceFilters
          search={search}
          category={category}
          available={available}
          view={view}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onAvailableChange={setAvailable}
          onViewChange={setView}
          onReset={() => {
            setSearch("");
            setCategory("All");
            setAvailable("all");
          }}
        />

        {/* Content Area */}
        {loading && resources.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E4E2DA] h-[340px] animate-pulse p-4 flex flex-col justify-between">
                <div className="h-40 bg-[#E8E6DF] rounded-xl" />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-[#E8E6DF] rounded-full" />
                  <div className="h-4 w-44 bg-[#E8E6DF] rounded" />
                </div>
                <div className="h-2 w-full bg-[#E8E6DF] rounded-full" />
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <EmptyState
            title="No Resources Found"
            description="No institutional resources match the active criteria. Adjust your filters or add a new asset."
            icon={<Package size={28} className="text-[#0F766E]" />}
            action={{
              label: "Add Resource",
              onClick: () => setShowForm(true),
            }}
          />
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {resources.map((r) => (
              <ResourceCard
                key={r._id}
                resource={r}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <ResourceTable
              resources={resources}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deleting={deleting}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Resource Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
        title={editing ? "Edit Resource Specifications" : "Register New Resource Asset"}
        size="lg"
      >
        <ResourceForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          loading={saving}
        />
      </Modal>
    </DashboardLayout>
  );
}
