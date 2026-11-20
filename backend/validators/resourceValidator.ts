import { z } from "zod";

export const CreateResourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
  category: z.enum([
    "Cameras",
    "Laptops",
    "Projectors",
    "Laboratory Equipment",
    "Meeting Rooms",
    "Sports Equipment",
    "Audio Equipment",
    "Other",
  ]),
  images: z.array(z.string()).optional().default([]),
  location: z.string().min(1, "Location is required"),
  totalQuantity: z.number().int().positive("Quantity must be positive"),
  available: z.number().int().min(0).optional(),
  instructions: z.string().optional(),
  maintenanceNotes: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const UpdateResourceSchema = CreateResourceSchema.partial();

export type CreateResourceInput = z.infer<typeof CreateResourceSchema>;
export type UpdateResourceInput = z.infer<typeof UpdateResourceSchema>;
