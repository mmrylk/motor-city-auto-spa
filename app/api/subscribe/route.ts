import { NextResponse } from "next/server";
import { z } from "zod";
import { databaseEnabled, prisma } from "@/lib/prisma";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { addDemoSubscriber } from "@/lib/subscribers";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email().max(160),
  company: z.string().max(0).optional().or(z.literal(""))
});

export async function POST(request: Request) {
  const limited = rateLimit(`subscribe:${clientKey(request)}`, 5, 60_000);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  if (databaseEnabled) {
    try {
      await prisma.subscriber.upsert({
        where: { email },
        update: {},
        create: { email, source: "footer" }
      });
    } catch (error) {
      console.error("[subscribe] failed", error);
      return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 500 });
    }
  } else {
    addDemoSubscriber(email);
  }

  return NextResponse.json({
    ok: true,
    message: "You're on the list. Watch your inbox for the maintenance file."
  });
}
