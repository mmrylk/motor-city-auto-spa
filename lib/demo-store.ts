import type { VehicleType } from "@/lib/site";

export type DemoBooking = {
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleType: VehicleType;
  locationSlug: string;
  serviceSlug: string;
  date: string;
  time: string;
  notes: string;
  addOns: string[];
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  paymentStatus: "UNPAID" | "DEPOSIT_PAID";
  depositAmount: number;
  stripePaymentIntentId?: string;
  stripeCheckoutId?: string;
  createdAt: string;
};

const globalForDemo = globalThis as unknown as {
  __mcasDemoBookings?: Map<string, DemoBooking>;
};

export const demoBookings =
  globalForDemo.__mcasDemoBookings ?? new Map<string, DemoBooking>();

if (process.env.NODE_ENV !== "production") {
  globalForDemo.__mcasDemoBookings = demoBookings;
}

export function demoSlotKey(locationSlug: string, date: string, time: string) {
  return `${locationSlug}:${date}:${time}`;
}

export function demoSlotTaken(locationSlug: string, date: string, time: string) {
  const booking = demoBookings.get(demoSlotKey(locationSlug, date, time));
  if (!booking) return false;
  if (booking.status === "CANCELLED") return false;
  // Unpaid holds expire after 30 minutes so abandoned checkouts release the bay.
  if (booking.status === "PENDING" && Date.now() - new Date(booking.createdAt).getTime() > 30 * 60 * 1000) {
    return false;
  }
  return true;
}

export function addDemoBooking(booking: DemoBooking) {
  demoBookings.set(demoSlotKey(booking.locationSlug, booking.date, booking.time), booking);
  return booking;
}

export function getDemoBooking(reference: string) {
  for (const booking of demoBookings.values()) {
    if (booking.reference === reference) return booking;
  }
  return null;
}

export function updateDemoBooking(reference: string, patch: Partial<DemoBooking>) {
  for (const [key, booking] of demoBookings.entries()) {
    if (booking.reference === reference) {
      demoBookings.set(key, { ...booking, ...patch });
      return { ...booking, ...patch };
    }
  }
  return null;
}
