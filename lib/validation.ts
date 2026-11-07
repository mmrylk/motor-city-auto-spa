import { z } from "zod";

export const VEHICLE_TYPE_VALUES = ["sedan", "suv", "truck", "exotic"] as const;

export const customerSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(24)
    .regex(/^[0-9+()\-.\s]+$/, "Enter a valid phone number"),
  vehicleYear: z.coerce
    .number()
    .int()
    .min(1900, "Enter a valid model year")
    .max(new Date().getFullYear() + 1, "Enter a valid model year"),
  vehicleMake: z.string().trim().min(1, "Enter the make").max(60),
  vehicleModel: z.string().trim().min(1, "Enter the model").max(80),
  notes: z.string().trim().max(1200).optional().default("")
});

export const bookingCoreSchema = z.object({
  serviceSlug: z.string().trim().min(1),
  vehicleType: z.enum(VEHICLE_TYPE_VALUES),
  locationSlug: z.enum(["eleven-mile", "delemere"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Select a time"),
  addOns: z.array(z.string()).max(8).optional().default([])
});

export const bookingRequestSchema = bookingCoreSchema.merge(customerSchema);

export const checkoutRequestSchema = bookingRequestSchema.extend({
  mode: z.enum(["payment-intent", "checkout-session"]).optional().default("payment-intent")
});

export const depositReservationSchema = z.object({
  serviceSlug: z.string().trim().min(1),
  locationSlug: z.enum(["eleven-mile", "delemere"]),
  email: z.string().trim().email(),
  customerName: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(24).optional()
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.enum(["eleven-mile", "delemere"]).default("eleven-mile")
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export function firstZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid request";
}
