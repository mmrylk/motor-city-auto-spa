import { HOURS, locationBySlug, type LocationSlug } from "@/lib/site";
import { formatSlot, isPastSlot, parseISODate } from "@/lib/utils";
import { databaseEnabled, prisma } from "@/lib/prisma";
import { demoSlotTaken } from "@/lib/demo-store";
import { cacheGet, cacheSet } from "@/lib/redis";

const WEEKDAY_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const SATURDAY_SLOTS = ["08:30", "09:30", "10:30", "11:30", "12:30", "13:30"];

export type AvailabilitySlot = {
  value: string;
  label: string;
  available: boolean;
};

export type AvailabilityResult = {
  date: string;
  location: LocationSlug;
  closed: boolean;
  slots: AvailabilitySlot[];
  source: "database" | "demo";
};

export function slotsForDate(dateISO: string) {
  const date = parseISODate(dateISO);
  const day = date.getDay();
  if (day === 0) return [];
  if (day === 6) return SATURDAY_SLOTS;
  return WEEKDAY_SLOTS;
}

export function isClosedDate(dateISO: string) {
  return parseISODate(dateISO).getDay() === 0;
}

export function hoursForDay(dayIndex: number) {
  return HOURS[(dayIndex + 6) % 7];
}

async function bookedSlotsFromDatabase(dateISO: string, locationSlug: LocationSlug) {
  const location = await prisma.location.findUnique({
    where: { slug: locationSlug },
    select: { id: true }
  });
  if (!location) return new Set<string>();

  const scheduledDate = new Date(`${dateISO}T00:00:00.000Z`);
  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: {
        locationId: location.id,
        scheduledDate,
        OR: [
          { status: "CONFIRMED" },
          { status: "PENDING", createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) } }
        ]
      },
      select: { timeSlot: true }
    }),
    prisma.timeSlotBlock.findMany({
      where: { locationId: location.id, date: scheduledDate },
      select: { timeSlot: true }
    })
  ]);

  return new Set<string>([...bookings, ...blocks].map((row) => row.timeSlot));
}

export async function getAvailability(
  dateISO: string,
  locationSlug: LocationSlug
): Promise<AvailabilityResult> {
  const slots = slotsForDate(dateISO);
  if (slots.length === 0) {
    return { date: dateISO, location: locationSlug, closed: true, slots: [], source: "demo" };
  }

  const cacheKey = `mcas:availability:${locationSlug}:${dateISO}`;
  let booked: string[] | null = await cacheGet<string[]>(cacheKey);
  let source: "database" | "demo" = databaseEnabled ? "database" : "demo";

  if (!booked) {
    if (databaseEnabled) {
      try {
        booked = [...(await bookedSlotsFromDatabase(dateISO, locationSlug))];
      } catch (error) {
        console.error("[availability] database lookup failed", error);
        booked = slots.filter((slot) => demoSlotTaken(locationSlug, dateISO, slot));
        source = "demo";
      }
    } else {
      booked = slots.filter((slot) => demoSlotTaken(locationSlug, dateISO, slot));
    }
    await cacheSet(cacheKey, booked, 20);
  }

  const bookedSet = new Set(booked);
  return {
    date: dateISO,
    location: locationSlug,
    closed: false,
    source,
    slots: slots.map((slot) => ({
      value: slot,
      label: formatSlot(slot),
      available: !bookedSet.has(slot) && !isPastSlot(dateISO, slot)
    }))
  };
}

export async function isSlotAvailable(dateISO: string, locationSlug: LocationSlug, time: string) {
  const result = await getAvailability(dateISO, locationSlug);
  return result.slots.some((slot) => slot.value === time && slot.available);
}

export function nextBookableDays(count = 60, from = new Date()) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(from);
    date.setDate(from.getDate() + index);
    date.setHours(12, 0, 0, 0);
    return date;
  });
}

export function studioHoursSummary(locationSlug: LocationSlug) {
  const location = locationBySlug(locationSlug);
  return { location, hours: HOURS };
}
