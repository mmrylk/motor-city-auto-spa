import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/layout/legal-layout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Booking, deposit, cancellation, vehicle authorisation and warranty terms for paint protection, coating, correction and detailing work at Motor City Auto Spa in Royal Oak, Michigan.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service — Motor City Auto Spa",
    description:
      "Deposits, scheduling, authorisation, warranty and liability terms for work performed at our Royal Oak studios.",
    url: "/terms"
  },
  robots: { index: true, follow: true }
};

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement and scope",
    paragraphs: [
      "These terms govern bookings, deposits, estimates and services provided by Motor City Auto Spa LLC at our 11 Mile and Delemere studios in Royal Oak, Michigan. By booking an appointment, paying a deposit or leaving a vehicle with us, you accept these terms on behalf of yourself and the vehicle owner.",
      "A booking confirms a bay and a service category. It does not fix a final price. The binding scope, price and completion date are set out in the written build sheet issued after inspection and signed or approved by you before work begins."
    ]
  },
  {
    id: "estimates",
    title: "Estimates and build sheets",
    paragraphs: [
      "Website prices, configurator outputs and phone estimates are starting points for vehicles in standard condition. They assume sound paint, no previous poor repairs, no heavy contamination and reasonable access to all panels.",
      "Inspection may reveal conditions that change the scope — failing clear coat, prior repaint, deep scratches, dents, aftermarket film, rust or concealed damage. We will document what we find, explain the options and issue a revised build sheet. We will not perform additional chargeable work without your approval.",
      "Paint depth readings, defect photographs and inspection notes are recorded for your file and may be shared with you on request."
    ]
  },
  {
    id: "deposits",
    title: "Deposits and payment",
    paragraphs: [
      "A $100 deposit reserves the installation bay and is credited in full against the final invoice. It is not an additional fee. The balance is due on collection unless a different schedule is agreed in writing.",
      "Deposits are refundable when cancelled at least 72 hours before the scheduled drop-off. Inside 72 hours, the deposit may be applied once to a rescheduled appointment at our discretion. A second reschedule inside the window, or a no-show, may forfeit the deposit.",
      "Deposits are transferable once to another vehicle or client with at least 48 hours' notice. Refunds are issued to the original payment method through Stripe and may take five to ten business days to appear.",
      "We accept major credit and debit cards. Final invoices may also be settled by agreed bank transfer. Work in progress may require staged payments for long-duration builds; any such schedule will be stated in the build sheet."
    ]
  },
  {
    id: "scheduling",
    title: "Scheduling, delays and collection",
    paragraphs: [
      "Drop-off and collection times are appointments, not guarantees of completion. Coating cure, film installation and correction are humidity- and temperature-sensitive. If a vehicle is not ready at the stated time, we will contact you before the collection window closes.",
      "Please arrive within 15 minutes of your drop-off time. Late arrivals may lose part of the scheduled bay time, and we may need to reschedule work that cannot be completed safely.",
      "Vehicles must be collected within two business days of the ready notification unless storage has been agreed in writing. Storage beyond that period may incur a daily charge, and we may exercise a lien for unpaid work as permitted by Michigan law."
    ]
  },
  {
    id: "authorisation",
    title: "Vehicle condition and authorisation",
    paragraphs: [
      "You confirm that you are the owner of the vehicle or are authorised by the owner to request work, and that the vehicle is insured and legally operable. Please remove valuables, personal items, toll transponders and removable accessories before drop-off. We are not responsible for items left in the vehicle.",
      "You authorise us to move the vehicle on and around our premises, perform road tests limited to what is necessary to verify the work, and use photographs or video of the vehicle for quality control, insurance and — where you have consented — portfolio or social media purposes. Licence plates and identifying details are obscured in public marketing unless you agree otherwise.",
      "We may decline work where the condition of the vehicle, previous repairs or safety concerns make the requested result unattainable or unsafe. If work stops for that reason, you remain responsible for the value of work already performed and materials consumed."
    ]
  },
  {
    id: "risk",
    title: "Pre-existing conditions and risk",
    paragraphs: [
      "Detailing and correction involve washing, chemicals, heat, machine polishing and removal of existing film or coatings. While we take extensive precautions, some risk is inherent in this work.",
      "We are not responsible for pre-existing defects that were not apparent at inspection, including but not limited to failing clear coat, lifting repaint, micro-blistering, stone chips, previous poor bodywork, aftermarket tint, brittle trim, aged badges or seals, and corrosion that has compromised a panel.",
      "Where paint thickness is insufficient to correct safely, we will stop and discuss options rather than risk burn-through. If a panel has been previously repainted without disclosure, correction may reveal latent defects; we will document the condition and are not liable for their pre-existing cause.",
      "Dry ice blasting removes loose undercoating, salt and scale. It does not repair rust, compromised metal or failed factory sealant, and it may expose conditions that were previously hidden. We will photograph and report anything found."
    ]
  },
  {
    id: "warranties",
    title: "Workmanship and manufacturer warranties",
    paragraphs: [
      "We warrant our workmanship for the period stated on your build sheet. Manufacturer coverage — including the Icon Rocklear ten-year warranty, XPEL ten-year film warranty and Opti-Coat Pro seven-year warranty — is provided by the manufacturer and subject to its registration, inspection and maintenance requirements.",
      "Warranty coverage requires that you follow the written aftercare protocol, including the recommended wash method, avoidance of automatic brush washes, and attendance at annual inspections where required. Damage from accidents, improper washing, abrasive chemicals, road debris, track use or third-party work is not covered.",
      "Warranty claims must be reported promptly with photographs and the original invoice. We will inspect the vehicle and, where coverage applies, repair or replace the affected area. Warranties are limited to the remedy described here and are not a guarantee that a coating or film will remain free of all marks."
    ]
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by Michigan law, our total liability arising from any booking or service is limited to the amount you paid for the specific service giving rise to the claim. We are not liable for indirect, incidental, special or consequential losses, including loss of use, diminished value, towing, rental costs or loss of profit.",
      "Nothing in these terms excludes liability that cannot lawfully be excluded, including liability for fraud, wilful misconduct or death or personal injury caused by negligence. Claims must be notified within 30 days of collection so the condition can be inspected.",
      "Vehicles are stored on our premises at the owner's risk. We maintain business insurance, but insurance does not replace the need to report any concern immediately."
    ]
  },
  {
    id: "website",
    title: "Website and online booking",
    paragraphs: [
      "The website, configurator and estimator are provided for information and planning. Outputs are illustrative, may not reflect your vehicle's actual condition and do not constitute a binding quote. Availability shown online is indicative until a deposit is received and the booking is confirmed.",
      "You agree not to misuse the site, attempt to access other clients' data, interfere with security features or submit false booking information. We may cancel bookings that appear fraudulent, abusive or made in error, and will refund any deposit taken.",
      "Third-party links, maps and payment interfaces are governed by their own terms. We are not responsible for the availability or content of third-party services."
    ]
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    paragraphs: [
      "These terms are governed by the laws of the State of Michigan, without regard to conflict-of-law rules. Any dispute that cannot be resolved informally will be brought in the state or federal courts located in Oakland County, Michigan, and each party consents to that jurisdiction.",
      "Before filing a claim, please contact us so we can inspect the vehicle and attempt to resolve the issue directly. Most concerns can be addressed faster at the studio than through formal proceedings."
    ]
  },
  {
    id: "changes",
    title: "Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. The version in effect when you book or approve a build sheet governs that engagement. Material changes will be posted on this page with a revised effective date.",
      "If any provision is found unenforceable, the remaining provisions continue in full force."
    ]
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      `Questions about these terms, a deposit or a warranty claim can be sent to ${SITE.email} or raised by phone at ${SITE.phone}. Our studios are located at 901 W 11 Mile Rd, Royal Oak, MI 48067 and 4325 Delemere Blvd, Royal Oak, MI 48073.`,
      "Please quote your booking reference and vehicle details so we can locate the correct file."
    ]
  }
];

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Terms"
      title={
        <>
          Clear terms.
          <br />
          <span className="text-outline">No surprises.</span>
        </>
      }
      intro="A deposit reserves a bay, not a final price. These terms set out how estimates, scheduling, authorisation, warranty coverage and liability work — in plain language, before any machine touches your paint."
      updated="November 6, 2026"
      sections={SECTIONS}
    />
  );
}
