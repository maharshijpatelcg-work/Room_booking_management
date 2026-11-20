import { z } from "zod";

export const CreateBookingSchema = z
  .object({
    resource: z.string().min(1, "Resource ID is required"),
    requesterName: z.string().min(1, "Name is required"),
    requesterEmail: z.string().email("Valid email is required"),
    purpose: z.string().min(1, "Purpose is required"),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    endTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    quantity: z.number().int().positive("Quantity must be positive"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    }
  );

export const UpdateBookingStatusSchema = z.object({
  status: z.enum([
    "Pending",
    "Approved",
    "Rejected",
    "Cancelled",
    "Completed",
  ]),
  managerNotes: z.string().optional(),
  issuedQuantity: z.number().int().min(0).optional(),
  expectedReturnDate: z.string().or(z.date()).optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingStatusInput = z.infer<
  typeof UpdateBookingStatusSchema
>;
