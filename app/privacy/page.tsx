import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/layout/legal-layout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Motor City Auto Spa collects, uses and protects the personal information you share when booking, paying a deposit or contacting either Royal Oak studio.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — Motor City Auto Spa",
    description:
      "What we collect, why we collect it, and the choices you have. Motor City Auto Spa, Royal Oak, Michigan.",
    url: "/privacy"
  },
  robots: { index: true, follow: true }
};

const SECTIONS: LegalSection[] = [
  {
    id: "scope",
    title: "Scope of this policy",
    paragraphs: [
      "This policy explains how Motor City Auto Spa LLC (\"Motor City Auto Spa,\" \"we,\" \"us\" or \"our\") handles personal information collected through motorcityautospa.com, our booking system, our payment processor and our two Royal Oak studios.",
      "It applies to website visitors, prospective clients, booked clients and newsletter subscribers. It does not apply to third-party websites we link to, including Google Maps, Instagram, Facebook or Stripe, each of which publishes its own privacy terms."
    ]
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: [
      "We collect only what is needed to inspect, quote, schedule and complete work on a vehicle, and to keep accurate service records. Most of it you provide directly."
    ],
    list: [
      "Contact details — name, email address, mobile number and preferred contact method.",
      "Vehicle details — year, make, model, colour, VIN where required, mileage and condition notes or photographs supplied before or during inspection.",
      "Booking details — selected studio, service, appointment date and time, arrival method and any access instructions.",
      "Payment details — deposit amount, transaction identifier, card brand and last four digits, and billing postal code. Full card numbers are handled by Stripe and are never stored on our servers.",
      "Communications — emails, text messages, phone notes and web form submissions, retained so we can honour requests and warranty terms.",
      "Technical data — IP address, browser type, device type, referring page and pages viewed, collected in aggregate to keep the site secure and functional."
    ]
  },
  {
    id: "how-we-use-information",
    title: "How we use your information",
    paragraphs: [
      "We use personal information to respond to enquiries, prepare written build sheets, reserve installation bays, process deposits and final invoices, register manufacturer warranties, and provide aftercare and annual inspection reminders.",
      "We also use it to operate and secure the website, detect fraudulent or abusive booking activity, comply with tax and consumer-protection obligations, and — only where you have opted in — send occasional studio updates. You can withdraw marketing consent at any time without affecting your booking."
    ]
  },
  {
    id: "payments",
    title: "Payments and Stripe",
    paragraphs: [
      "Card payments are processed by Stripe, Inc. When you pay a deposit or invoice, your payment credentials are submitted directly to Stripe over an encrypted connection. Motor City Auto Spa receives a confirmation, a transaction identifier and limited card metadata, not your full card number or security code.",
      "Stripe may process payment data in the United States and other countries where it operates. Its handling of that data is governed by the Stripe Privacy Policy and Stripe Services Agreement. We retain transaction records as required for accounting, chargeback response and warranty administration."
    ]
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    paragraphs: [
      "The site uses a small number of essential cookies and local storage entries to keep navigation, booking progress and security protections working. We do not use advertising cookies or sell audience data.",
      "If we add privacy-respecting analytics in the future, it will be configured to avoid collecting full IP addresses or cross-site identifiers. You can block or delete cookies in your browser settings; essential booking functions may not work correctly if you do."
    ]
  },
  {
    id: "sharing",
    title: "When we share information",
    paragraphs: [
      "We do not sell personal information. We share it only with service providers who help us operate the business, and only to the extent needed for their task."
    ],
    list: [
      "Stripe — payment processing, fraud screening and deposit reconciliation.",
      "Hosting and database providers — encrypted storage of booking and service records.",
      "Email and messaging providers — transactional confirmations, reminders and, where consented, studio updates.",
      "Manufacturers and warranty administrators — registration of Icon Rocklear, XPEL or Opti-Coat coverage using the minimum vehicle and owner details required.",
      "Professional advisers, insurers and authorities — where necessary to establish or defend a legal claim, respond to a lawful request, or meet a regulatory obligation."
    ]
  },
  {
    id: "retention",
    title: "How long we keep information",
    paragraphs: [
      "Booking and service records are retained for the life of the relevant warranty plus a reasonable period afterwards, so we can verify coverage, honour inspections and resolve disputes. Payment and tax records are retained for the period required by applicable law.",
      "Marketing contact details are kept until you unsubscribe or ask us to delete them. Website security logs are kept for a short operational window and then discarded or aggregated. When information is no longer needed, we delete it or irreversibly anonymise it."
    ]
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We use encrypted connections, access controls, least-privilege accounts and reputable infrastructure providers. Payment card data never enters our own systems. Physical documents such as build sheets and inspection photographs are stored in locked areas or access-controlled digital folders.",
      "No system is completely secure. If we become aware of a breach affecting your personal information, we will investigate promptly and notify affected individuals and regulators where the law requires it."
    ]
  },
  {
    id: "your-rights",
    title: "Your choices and rights",
    paragraphs: [
      "You may ask us to confirm what personal information we hold about you, correct inaccurate details, delete information we no longer need, or stop sending marketing messages. Michigan residents may also have rights under applicable state privacy law, and we will honour verified requests as required.",
      "To make a request, contact us using the details below. We may need to verify your identity and will respond within the timeframe required by law. Some records, such as completed invoices and warranty registrations, must be retained even after a deletion request."
    ]
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "Our services are intended for vehicle owners and authorised drivers. The website is not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child has provided information, contact us and we will remove it."
    ]
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy as our services, providers or legal obligations change. The revised version will be posted on this page with a new effective date. Material changes affecting how we use existing information will be communicated to active clients where practical."
    ]
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [
      `Questions about this policy or a privacy request can be sent to ${SITE.email} or raised by phone at ${SITE.phone}. Written correspondence may be addressed to Motor City Auto Spa LLC, 901 W 11 Mile Rd, Royal Oak, MI 48067.`,
      "Please include enough detail for us to identify the booking or vehicle concerned. We will acknowledge privacy requests promptly and keep you informed of progress."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Privacy"
      title={
        <>
          Your data,
          <br />
          <span className="text-outline">handled with care.</span>
        </>
      }
      intro="We collect the minimum information required to protect your vehicle and run the studio. This policy explains what that means in practice — what we hold, why we hold it, who sees it and how you can change it."
      updated="November 6, 2026"
      sections={SECTIONS}
    />
  );
}
