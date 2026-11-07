import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata: Metadata = {
  title: "Book a Build — $100 Deposit",
  description:
    "Reserve a coating, film, correction or dry ice build at Motor City Auto Spa. Choose your service, studio and drop-off slot, then hold the bay with a $100 deposit credited to the final invoice.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book a Build — Motor City Auto Spa",
    description:
      "Live availability at both Royal Oak studios. $100 deposit credited in full against the final invoice.",
    url: "/book",
    images: ["/media/night.webp"]
  }
};

function BookingFallback() {
  return (
    <section className="section border-t border-line bg-carbon">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="border border-line bg-slate-deep/70 p-7">
              <div className="h-3 w-32 animate-pulse bg-line" />
              <div className="mt-5 h-8 w-2/3 animate-pulse bg-line" />
              <div className="mt-8 grid gap-2 sm:grid-cols-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse border border-line bg-carbon/50" />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="h-[420px] animate-pulse border border-line bg-slate-deep/70" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BookPage() {
  return (
    <>
      <PageHero
        index="04 / 04"
        eyebrow="Reservation"
        title={
          <>
            Reserve
            <br />
            <span className="text-outline">the bay.</span>
          </>
        }
        description={
          <>
            <p>
              Choose the discipline, the studio and a drop-off slot. A $100 deposit holds the bay
              and is credited in full against the final invoice.
            </p>
            <p className="mt-4">
              If you are unsure what the paint needs, book a paint-correction inspection and we will
              issue a written recommendation before any work begins.
            </p>
          </>
        }
        image="/media/night.webp"
        imageAlt="Performance car under studio lighting at night"
        breadcrumb="Booking"
        meta={[
          { label: "Deposit", value: "$100 credited" },
          { label: "Response", value: "1 business day" },
          { label: "Studios", value: "Royal Oak ×2" }
        ]}
      />

      <Suspense fallback={<BookingFallback />}>
        <BookingWizard />
      </Suspense>
    </>
  );
}
