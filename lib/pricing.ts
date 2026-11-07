import {
  ADD_ONS,
  DEPOSIT_CENTS,
  PRICE_MATRIX,
  SERVICES,
  serviceBySlug,
  type VehicleType
} from "@/lib/site";

export type QuoteLine = {
  id: string;
  label: string;
  note?: string;
  amount: number;
};

export type Quote = {
  serviceSlug: string;
  serviceName: string;
  vehicleType: VehicleType;
  base: number;
  addOns: QuoteLine[];
  addOnsTotal: number;
  total: number;
  depositCents: number;
  duration: string;
};

export function buildQuote(
  serviceSlug: string,
  vehicleType: VehicleType,
  addOnIds: string[] = []
): Quote {
  const service = serviceBySlug(serviceSlug);
  const matrix = PRICE_MATRIX[service.slug];
  const base = matrix?.[vehicleType] ?? service.fromPrice;
  const addOns = addOnIds
    .map((id) => ADD_ONS.find((addOn) => addOn.id === id))
    .filter((addOn): addOn is (typeof ADD_ONS)[number] => Boolean(addOn))
    .map((addOn) => ({
      id: addOn.id,
      label: addOn.label,
      note: addOn.note,
      amount: addOn.price
    }));
  const addOnsTotal = addOns.reduce((sum, addOn) => sum + addOn.amount, 0);

  return {
    serviceSlug: service.slug,
    serviceName: service.name,
    vehicleType,
    base,
    addOns,
    addOnsTotal,
    total: base + addOnsTotal,
    depositCents: DEPOSIT_CENTS,
    duration: service.duration
  };
}

export function quoteRange(total: number) {
  const low = Math.round(total / 50) * 50;
  const high = Math.round((total * 1.15) / 50) * 50;
  return { low, high };
}

export const ESTIMATOR_NOTE =
  "Estimates reflect standard-condition vehicles at the Royal Oak studios. Severe defects, paint depth limitations, full-body film or oversized vehicles may adjust the final build sheet after inspection.";

export const ALL_SERVICE_OPTIONS = SERVICES.map((service) => ({
  value: service.slug,
  label: service.shortName,
  note: service.category
}));
