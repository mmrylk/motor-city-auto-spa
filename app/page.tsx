import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/ui/marquee";
import { StandardSection } from "@/components/home/standard-section";
import { MetricsSection } from "@/components/home/metrics-section";
import { Configurator } from "@/components/3d/configurator";
import { BeforeAfterSection } from "@/components/home/before-after";
import { Estimator } from "@/components/home/estimator";
import { ServicesPreview } from "@/components/home/services-preview";
import { ProcessSection } from "@/components/home/process-section";
import { TestimonialsSection } from "@/components/home/testimonials";
import { LocationsPreview } from "@/components/home/locations-preview";

export const metadata: Metadata = {
  title: "Ceramic Coating, XPEL PPF & Paint Correction — Royal Oak, MI",
  description:
    "Motor City Auto Spa is Royal Oak's paint protection laboratory: Icon Rocklear composite coating, XPEL paint protection film, Opti-Coat Pro ceramic, dry ice underbody blasting and concours-level paint correction. Two studios. One standard.",
  alternates: { canonical: "/" }
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <StandardSection />
      <MetricsSection />
      <Configurator />
      <BeforeAfterSection />
      <Estimator />
      <ServicesPreview />
      <ProcessSection />
      <TestimonialsSection />
      <LocationsPreview />
    </>
  );
}
