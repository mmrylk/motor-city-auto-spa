import { databaseEnabled, prisma } from "@/lib/prisma";
import { makeReference } from "@/lib/utils";

export type CreateDepositInput = {
  serviceSlug: string;
  locationSlug: string;
  customerName: string;
  email: string;
  phone: string;
};

export type DemoDeposit = CreateDepositInput & {
  reference: string;
  amountCents: number;
  status: "PENDING" | "PAID";
  stripeSessionId?: string;
  createdAt: string;
};

const globalForDeposits = globalThis as unknown as {
  __mcasDemoDeposits?: Map<string, DemoDeposit>;
};

const demoDeposits =
  globalForDeposits.__mcasDemoDeposits ?? new Map<string, DemoDeposit>();

if (process.env.NODE_ENV !== "production") {
  globalForDeposits.__mcasDemoDeposits = demoDeposits;
}

export async function createServiceDeposit(input: CreateDepositInput) {
  const reference = makeReference();

  if (!databaseEnabled) {
    demoDeposits.set(reference, {
      ...input,
      reference,
      amountCents: 10000,
      status: "PENDING",
      createdAt: new Date().toISOString()
    });
    return { reference, demo: true };
  }

  await prisma.serviceDeposit.create({
    data: {
      reference,
      serviceSlug: input.serviceSlug,
      locationSlug: input.locationSlug,
      customerName: input.customerName,
      email: input.email,
      phone: input.phone,
      amountCents: 10000,
      status: "PENDING"
    }
  });

  return { reference, demo: false };
}

export async function attachDepositSession(reference: string, sessionId: string) {
  if (!databaseEnabled) {
    const deposit = demoDeposits.get(reference);
    if (deposit) demoDeposits.set(reference, { ...deposit, stripeSessionId: sessionId });
    return;
  }
  await prisma.serviceDeposit.update({
    where: { reference },
    data: { stripeSessionId: sessionId }
  });
}

export async function confirmServiceDeposit(reference: string, sessionId?: string) {
  if (!databaseEnabled) {
    const deposit = demoDeposits.get(reference);
    if (!deposit) return null;
    const updated: DemoDeposit = {
      ...deposit,
      status: "PAID",
      ...(sessionId ? { stripeSessionId: sessionId } : {})
    };
    demoDeposits.set(reference, updated);
    return updated;
  }

  return prisma.serviceDeposit.update({
    where: { reference },
    data: {
      status: "PAID",
      ...(sessionId ? { stripeSessionId: sessionId } : {})
    }
  });
}

export function getDemoDeposit(reference: string) {
  return demoDeposits.get(reference) ?? null;
}

export async function getServiceDeposit(reference: string) {
  if (!databaseEnabled) return getDemoDeposit(reference);
  return prisma.serviceDeposit.findUnique({ where: { reference } });
}
