import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/availability";
import { availabilityQuerySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = availabilityQuerySchema.safeParse({
    date: searchParams.get("date"),
    location: searchParams.get("location") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a valid date and location." }, { status: 400 });
  }

  const availability = await getAvailability(parsed.data.date, parsed.data.location);
  return NextResponse.json(availability, {
    headers: { "Cache-Control": "no-store" }
  });
}
