import { Prisma } from "@prisma/client";
import { HOURS, locationBySlug, serviceBySlug, type LocationSlug, type VehicleType } from "@/lib/site";
import { databaseEnabled, prisma } from "@/lib/prisma";
import { addDemoBooking, getDemoBooking, updateDemoBooking } from "@/lib/demo-store";
import { formatSlot, makeReference } from "@/lib/utils";
import { cacheDel } from "@/lib/redis";

export class SlotTakenError extends Error {
  constructor() {
    super("That time was just reserved. Please choose another slot.");
    this.name = "SlotTakenError";
  }
}

export type CreateBookingInput = {
  serviceSlug: string;
  vehicleType: VehicleType;
  locationSlug: LocationSlug;
  date: string;
  time: string;
  addOns: string[];
  customerName: string;
  email: string;
  phone: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  notes?: string;
};

export type BookingView = {
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleType: string;
  serviceSlug: string;
  serviceName: string;
  locationSlug: string;
  locationName: string;
  locationAddress: string;
  date: string;
  time: string;
  timeLabel: string;
  notes: string;
  addOns: string[];
  status: string;
  paymentStatus: string;
  depositAmount: number;
  createdAt: string;
};

function cacheKey(locationSlug: string, date: string) {
  return `mcas:availability:${locationSlug}:${date}`;
}

async function ensureLocation(slug: LocationSlug) {
  const location = locationBySlug(slug);
  return prisma.location.upsert({
    where: { slug: location.slug },
    update: {
      name: location.name,
      addressLine1: location.address,
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      phone: location.phone,
      email: "motorcityautospa@live.com",
      mapsQuery: location.mapsQuery,
      latitude: location.latitude,
      longitude: location.longitude,
      hours: HOURS as unknown as Prisma.InputJsonValue
    },
    create: {
      slug: location.slug,
      name: location.name,
      addressLine1: location.address,
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      phone: location.phone,
      email: "motorcityautospa@live.com",
      mapsQuery: location.mapsQuery,
      latitude: location.latitude,
      longitude: location.longitude,
      hours: HOURS as unknown as Prisma.InputJsonValue
    }
  });
}

async function ensureService(slug: string) {
  const service = serviceBySlug(slug);
  const data = {
    name: service.name,
    category: service.category,
    summary: service.summary,
    fromPrice: service.fromPrice,
    durationMin: service.slug === "window-tint" || service.slug === "interior-steam" ? 300 : 2880,
    depositCents: 10000,
    active: true
  };
  return prisma.service.upsert({
    where: { slug: service.slug },
    update: data,
    create: { slug: service.slug, ...data }
  });
}

export async function createBookingRecord(input: CreateBookingInput) {
  const reference = makeReference();

  if (!databaseEnabled) {
    addDemoBooking({
      reference,
      customerName: input.customerName,
      email: input.email,
      phone: input.phone,
      vehicleYear: input.vehicleYear,
      vehicleMake: input.vehicleMake,
      vehicleModel: input.vehicleModel,
      vehicleType: input.vehicleType,
      locationSlug: input.locationSlug,
      serviceSlug: input.serviceSlug,
      date: input.date,
      time: input.time,
      notes: input.notes ?? "",
      addOns: input.addOns,
      status: "PENDING",
      paymentStatus: "UNPAID",
      depositAmount: 10000,
      createdAt: new Date().toISOString()
    });
    return { reference, demo: true };
  }

  const [location, service] = await Promise.all([
    ensureLocation(input.locationSlug),
    ensureService(input.serviceSlug)
  ]);

  try {
    await prisma.booking.create({
      data: {
        reference,
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        vehicleYear: input.vehicleYear,
        vehicleMake: input.vehicleMake,
        vehicleModel: input.vehicleModel,
        vehicleType: input.vehicleType,
        locationId: location.id,
        serviceId: service.id,
        scheduledDate: new Date(`${input.date}T00:00:00.000Z`),
        timeSlot: input.time,
        addOns: input.addOns,
        notes: input.notes,
        status: "PENDING",
        paymentStatus: "UNPAID",
        depositAmount: 10000
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new SlotTakenError();
    }
    throw error;
  }

  await cacheDel(cacheKey(input.locationSlug, input.date));
  return { reference, demo: false };
}

export async function attachPaymentIntent(reference: string, paymentIntentId: string) {
  if (!databaseEnabled) {
    updateDemoBooking(reference, { stripePaymentIntentId: paymentIntentId });
    return;
  }
  await prisma.booking.update({
    where: { reference },
    data: { stripePaymentIntentId: paymentIntentId }
  });
}

export async function cancelBookingRecord(reference: string) {
  if (!databaseEnabled) {
    const updated = updateDemoBooking(reference, { status: "CANCELLED" });
    if (updated) await cacheDel(cacheKey(updated.locationSlug, updated.date));
    return;
  }
  const existing = await prisma.booking.findUnique({
    where: { reference },
    include: { location: { select: { slug: true } } }
  });
  if (!existing) return;
  await prisma.booking.update({ where: { reference }, data: { status: "CANCELLED" } });
  await cacheDel(
    cacheKey(existing.location.slug, existing.scheduledDate.toISOString().slice(0, 10))
  );
}

export async function attachCheckoutSession(reference: string, checkoutId: string) {  if (!databaseEnabled) {
    updateDemoBooking(reference, { stripeCheckoutId: checkoutId });
    return;
  }
  await prisma.booking.update({
    where: { reference },
    data: { stripeCheckoutId: checkoutId }
  });
}

export async function confirmBooking(
  reference: string,
  options: { paymentStatus?: "DEPOSIT_PAID" | "PAID_IN_FULL"; checkoutId?: string; paymentIntentId?: string } = {}
) {
  const paymentStatus = options.paymentStatus ?? "DEPOSIT_PAID";

  if (!databaseEnabled) {
    const updated = updateDemoBooking(reference, {
      status: "CONFIRMED",
      paymentStatus: "DEPOSIT_PAID",
      ...(options.checkoutId ? { stripeCheckoutId: options.checkoutId } : {}),
      ...(options.paymentIntentId ? { stripePaymentIntentId: options.paymentIntentId } : {})
    });
    if (updated) await cacheDel(cacheKey(updated.locationSlug, updated.date));
    return updated;
  }

  const existing = await prisma.booking.findUnique({
    where: { reference },
    include: { location: { select: { slug: true } } }
  });
  if (!existing) return null;

  const updated = await prisma.booking.update({
    where: { reference },
    data: {
      status: "CONFIRMED",
      paymentStatus,
      ...(options.checkoutId ? { stripeCheckoutId: options.checkoutId } : {}),
      ...(options.paymentIntentId ? { stripePaymentIntentId: options.paymentIntentId } : {})
    }
  });

  await cacheDel(
    cacheKey(existing.location.slug, existing.scheduledDate.toISOString().slice(0, 10))
  );
  return updated;
}

export async function getBookingView(reference: string): Promise<BookingView | null> {  if (!databaseEnabled) {
    const booking = getDemoBooking(reference);
    if (!booking) return null;
    const location = locationBySlug(booking.locationSlug);
    const service = serviceBySlug(booking.serviceSlug);
    return {
      reference: booking.reference,
      customerName: booking.customerName,
      email: booking.email,
      phone: booking.phone,
      vehicleYear: booking.vehicleYear,
      vehicleMake: booking.vehicleMake,
      vehicleModel: booking.vehicleModel,
      vehicleType: booking.vehicleType,
      serviceSlug: booking.serviceSlug,
      serviceName: service.name,
      locationSlug: booking.locationSlug,
      locationName: location.shortName,
      locationAddress: `${location.address}, ${location.city}, ${location.state} ${location.postalCode}`,
      date: booking.date,
      time: booking.time,
      timeLabel: formatSlot(booking.time),
      notes: booking.notes,
      addOns: booking.addOns,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      depositAmount: booking.depositAmount,
      createdAt: booking.createdAt
    };
  }

  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { service: true, location: true }
  });
  if (!booking) return null;

  return {
    reference: booking.reference,
    customerName: booking.customerName,
    email: booking.email,
    phone: booking.phone,
    vehicleYear: booking.vehicleYear,
    vehicleMake: booking.vehicleMake,
    vehicleModel: booking.vehicleModel,
    vehicleType: booking.vehicleType,
    serviceSlug: booking.service.slug,
    serviceName: booking.service.name,
    locationSlug: booking.location.slug,
    locationName: booking.location.name,
    locationAddress: `${booking.location.addressLine1}, ${booking.location.city}, ${booking.location.state} ${booking.location.postalCode}`,
    date: booking.scheduledDate.toISOString().slice(0, 10),
    time: booking.timeSlot,
    timeLabel: formatSlot(booking.timeSlot),
    notes: booking.notes ?? "",
    addOns: booking.addOns,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    depositAmount: booking.depositAmount,
    createdAt: booking.createdAt.toISOString()
  };
}
