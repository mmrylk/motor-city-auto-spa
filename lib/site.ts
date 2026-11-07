export const SITE = {
  name: "Motor City Auto Spa",
  legalName: "Motor City Auto Spa LLC",
  tagline: "Uncompromising automotive perfection",
  description:
    "Royal Oak's paint protection laboratory. Icon Rocklear composite coating, XPEL paint protection film, Opti-Coat Pro ceramic, dry ice underbody blasting and concours-level paint correction.",
  url: "https://motorcityautospa.com",
  phone: "(248) 288-6772",
  phoneHref: "tel:+12482886772",
  email: "motorcityautospa@live.com",
  emailHref: "mailto:motorcityautospa@live.com",
  established: "2011",
  social: {
    instagram: "https://www.instagram.com/motorcityautospa/",
    facebook: "https://www.facebook.com/motorcityautospa"
  }
} as const;

export const HOURS = [
  { day: "Monday", open: "08:00", close: "17:00", label: "8:00 AM — 5:00 PM" },
  { day: "Tuesday", open: "08:00", close: "17:00", label: "8:00 AM — 5:00 PM" },
  { day: "Wednesday", open: "08:00", close: "17:00", label: "8:00 AM — 5:00 PM" },
  { day: "Thursday", open: "08:00", close: "17:00", label: "8:00 AM — 5:00 PM" },
  { day: "Friday", open: "08:00", close: "17:00", label: "8:00 AM — 5:00 PM" },
  { day: "Saturday", open: "08:30", close: "15:00", label: "8:30 AM — 3:00 PM" },
  { day: "Sunday", open: null, close: null, label: "Closed" }
] as const;

export type LocationSlug = "eleven-mile" | "delemere";

export type StudioLocation = {
  slug: LocationSlug;
  index: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  phoneHref: string;
  mapsQuery: string;
  directionsUrl: string;
  latitude: number;
  longitude: number;
  character: string;
  capabilities: string[];
};

export const LOCATIONS: StudioLocation[] = [
  {
    slug: "eleven-mile",
    index: "01",
    name: "Motor City Auto Spa — 11 Mile",
    shortName: "11 Mile Studio",
    address: "901 W 11 Mile Rd",
    city: "Royal Oak",
    state: "MI",
    postalCode: "48067",
    phone: "(248) 288-6772",
    phoneHref: "tel:+12482886772",
    mapsQuery: "901 W 11 Mile Rd, Royal Oak, MI 48067",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=901+W+11+Mile+Rd,+Royal+Oak,+MI+48067",
    latitude: 42.4897,
    longitude: -83.1546,
    character:
      "Our flagship coating and film laboratory. Two enclosed install bays, a dedicated paint-correction room and a client delivery suite.",
    capabilities: ["Icon Rocklear", "XPEL PPF", "Opti-Coat Pro", "Paint Correction", "Window Tint"]
  },
  {
    slug: "delemere",
    index: "02",
    name: "Motor City Auto Spa — Delemere",
    shortName: "Delemere Studio",
    address: "4325 Delemere Blvd",
    city: "Royal Oak",
    state: "MI",
    postalCode: "48073",
    phone: "(248) 288-6772",
    phoneHref: "tel:+12482886772",
    mapsQuery: "4325 Delemere Blvd, Royal Oak, MI 48073",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=4325+Delemere+Blvd,+Royal+Oak,+MI+48073",
    latitude: 42.5128,
    longitude: -83.1601,
    character:
      "Our heavy-service and underbody facility. Lift-equipped dry ice bay, wet-sanding studio and long-duration coating storage for multi-day builds.",
    capabilities: ["Dry Ice Blasting", "Underbody Restoration", "Wet Sanding", "Correction", "Storage"]
  }
];

export const locationBySlug = (slug: string) =>
  LOCATIONS.find((location) => location.slug === slug) ?? LOCATIONS[0];

export type ServiceSlug =
  | "icon-rocklear"
  | "xpel-ppf"
  | "opti-coat"
  | "dry-ice"
  | "paint-correction"
  | "window-tint"
  | "interior-steam";

export type Service = {
  slug: ServiceSlug;
  index: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  summary: string;
  description: string[];
  fromPrice: number;
  duration: string;
  warranty: string;
  specs: { label: string; value: string }[];
  includes: string[];
  featured?: boolean;
};

export const SERVICES: Service[] = [
  {
    slug: "icon-rocklear",
    index: "01",
    name: "Icon Rocklear Composite Coating",
    shortName: "Icon Rocklear",
    category: "Composite Coating",
    tagline: "The last coating your paint will ever need.",
    summary:
      "A 75× stronger composite shell that bonds to clear coat at a molecular level. Ten years of gloss, chemical resistance and self-cleaning hydrophobics.",
    description: [
      "Icon Rocklear is not a wax, a sealant, or a conventional ceramic. It is a composite coating engineered to cross-link with the factory clear coat and form a sacrificial shell measured in mils, not microns. The result is a surface that resists wash marring, bird etch, tar, industrial fallout and the particular brutality of a Michigan winter.",
      "Every Rocklear installation begins with a multi-stage decontamination and a machine correction to remove 95% or more of surface defects. We coat panel by panel in a filtered, temperature-controlled bay, then cure the vehicle under IR for a minimum of twelve hours. Nothing leaves the building until the coating has fully cross-linked.",
      "Rocklear is backed by a ten-year manufacturer warranty and an annual inspection program at either Royal Oak studio. It is the highest level of paint protection we install — and the only one we would put on our own cars."
    ],
    fromPrice: 2495,
    duration: "3–4 days",
    warranty: "10-year warranty",
    specs: [
      { label: "Hardness", value: "9H+ composite" },
      { label: "Abrasion resistance", value: "75× ceramic" },
      { label: "Contact angle", value: "112°" },
      { label: "Cure time", value: "24 hours IR" }
    ],
    includes: [
      "Multi-stage decontamination wash",
      "Machine paint correction to 95%+ defect removal",
      "Panel-by-panel Rocklear application",
      "Wheels-off coating and caliper detail",
      "Glass and trim coating",
      "12-hour infrared cure",
      "10-year warranty registration"
    ],
    featured: true
  },
  {
    slug: "xpel-ppf",
    index: "02",
    name: "XPEL Paint Protection Film",
    shortName: "XPEL PPF",
    category: "Paint Protection Film",
    tagline: "Impact protection you can see through.",
    summary:
      "Factory-trained XPEL installers plot, stretch and seal self-healing urethane film over the panels that take the hit. Invisible armor for high-value paint.",
    description: [
      "Paint protection film is the only product that stops rock chips, road rash and bumper scuffs before they reach paint. XPEL's 8.5-mil self-healing urethane is plotted on a computer cutter, hand-fitted to every panel edge, then wrapped and sealed so there is no visible seam line.",
      "We are a factory-trained XPEL installation facility. Our installers work in a positive-pressure clean room, use slip-and-tack techniques rather than bulk cutting on the vehicle, and finish every edge with a wrapped or trimmed margin that will not lift under pressure washing.",
      "Choose a track package for the front bumper, hood, fenders and mirrors, or a full-body wrap for complete coverage. Every installation includes a post-cure inspection and a ten-year XPEL warranty."
    ],
    fromPrice: 1895,
    duration: "2–4 days",
    warranty: "10-year XPEL warranty",
    specs: [
      { label: "Film thickness", value: "8.5 mil" },
      { label: "Self-healing", value: "Heat activated" },
      { label: "UV block", value: "99.9%" },
      { label: "Finish", value: "Gloss or stealth" }
    ],
    includes: [
      "Computer-plotted XPEL patterns",
      "Panel edge wrapping",
      "Positive-pressure clean room install",
      "Self-healing top coat",
      "10-year manufacturer warranty",
      "Post-install inspection"
    ],
    featured: true
  },
  {
    slug: "opti-coat",
    index: "03",
    name: "Opti-Coat Pro Ceramic Coating",
    shortName: "Opti-Coat Pro",
    category: "Ceramic Coating",
    tagline: "A permanent clear coat, with a seven-year guarantee.",
    summary:
      "The original professional-grade ceramic. A hard, hydrophobic SiO₂ layer that becomes the new top coat — not a temporary topper.",
    description: [
      "Opti-Coat Pro is a two-part SiO₂ ceramic that cures into a permanent film over your clear coat. It will not wash away, break down under detergents, or need an annual reapplication. Once cured, it is the surface.",
      "The installation is only as good as the correction beneath it. Every Opti-Coat Pro package includes a full decontamination, clay treatment, and at least one machine correction stage to remove swirls and restore clarity before the coating is applied. We coat paint, glass, wheels and trim in a single continuous process.",
      "For owners who want genuine long-term protection without the investment of Rocklear, Opti-Coat Pro is the benchmark. Seven-year warranty, annual inspections included."
    ],
    fromPrice: 1295,
    duration: "2 days",
    warranty: "7-year warranty",
    specs: [
      { label: "Chemistry", value: "SiO₂ ceramic" },
      { label: "Thickness", value: "2–3 microns" },
      { label: "Contact angle", value: "105°" },
      { label: "Warranty", value: "7 years" }
    ],
    includes: [
      "Decontamination and clay treatment",
      "Single-stage machine correction",
      "Opti-Coat Pro paint application",
      "Wheel face coating",
      "Glass hydrophobic coating",
      "Annual inspection"
    ]
  },
  {
    slug: "dry-ice",
    index: "04",
    name: "Dry Ice Undercarriage Blasting",
    shortName: "Dry Ice Blasting",
    category: "Underbody Restoration",
    tagline: "Thirty years of Michigan road, removed without a drop of water.",
    summary:
      "Dry ice sublimates on contact, lifting salt, scale and undercoating without abrasion. The cleanest way to reset a chassis and stop corrosion.",
    description: [
      "Road salt is the silent killer of a Michigan vehicle. It works into seams, brake lines, subframes and control arms long before it shows on a rocker panel. Dry ice blasting removes it without water, media residue or abrasive damage to factory coatings.",
      "Our Delemere studio is lift-equipped for full undercarriage access. We blast the chassis, wheel wells, suspension and subframes with food-grade dry ice, then inspect every seam and cavity. The surface is dried, neutralized and sealed with a corrosion-inhibiting protectant.",
      "The service is ideal for winter-driven daily drivers, classic cars in storage, and pre-sale inspections. It is also the correct first step before any underbody coating or suspension work."
    ],
    fromPrice: 495,
    duration: "1 day",
    warranty: "12-month corrosion inspection",
    specs: [
      { label: "Media", value: "Food-grade CO₂" },
      { label: "Water used", value: "Zero" },
      { label: "Abrasion", value: "None" },
      { label: "Coverage", value: "Full chassis" }
    ],
    includes: [
      "Lift inspection and photo documentation",
      "Dry ice blasting of chassis and wells",
      "Salt and scale removal",
      "Cavity inspection",
      "Corrosion-inhibitor application",
      "Before/after image set"
    ]
  },
  {
    slug: "paint-correction",
    index: "05",
    name: "Paint Correction & Multi-Stage Wet Sanding",
    shortName: "Paint Correction",
    category: "Paint Correction",
    tagline: "Measured in microns. Judged in sunlight.",
    summary:
      "Swirls, holograms, orange peel and rotary trails removed by hand and machine — with paint depth measured at every stage.",
    description: [
      "Correction is a discipline, not a buffer pass. We measure paint thickness on every panel, identify the defect type under controlled inspection lighting, and choose the least aggressive combination that will achieve the result. Clear coat is a finite resource; we treat it that way.",
      "Our correction menu ranges from a single-stage enhancement for a well-kept daily to a multi-stage wet-sand and rotary refinement for concours-level finishes. Every stage is followed by an IPA wipe-down and a sun-gun inspection before we move on.",
      "The result is not simply 'shiny.' It is a surface with depth, straight reflections and no buffer trails — the foundation every coating and film installation depends on."
    ],
    fromPrice: 795,
    duration: "1–3 days",
    warranty: "Documented paint depth",
    specs: [
      { label: "Stages", value: "1–3 stage" },
      { label: "Defect removal", value: "Up to 100%" },
      { label: "Paint depth", value: "Measured per panel" },
      { label: "Inspection", value: "Sun gun + LED" }
    ],
    includes: [
      "Paint depth mapping",
      "Decontamination wash",
      "Machine compounding and polishing",
      "Optional wet sanding",
      "IPA panel wipe",
      "Sun-gun final inspection"
    ]
  },
  {
    slug: "window-tint",
    index: "06",
    name: "High-Heat Rejection Window Tinting",
    shortName: "Window Tint",
    category: "Window Film",
    tagline: "Cooler cabin. Darker silhouette. Zero compromise.",
    summary:
      "Multi-layer ceramic film engineered for Michigan summers. Up to 98% infrared rejection with full Michigan legal compliance.",
    description: [
      "Automotive tint is not one product. Dyed film fades. Metallized film interferes with cell and GPS signals. We install multi-layer ceramic film with a near-infrared rejection rate of up to 98%, blocking heat without the haze or signal loss.",
      "Every installation is computer-cut for the specific vehicle, heat-shrunk to the glass curvature, and installed with edge sealing for a factory finish. We carry 5%, 20%, 35% and 50% VLT options and will advise on Michigan legal limits for each window.",
      "Ceramic film also blocks 99.9% of UV, protecting leather, carbon trim and screens. It is the single most effective comfort upgrade for a black-interior car."
    ],
    fromPrice: 349,
    duration: "4–6 hours",
    warranty: "Lifetime film warranty",
    specs: [
      { label: "IR rejection", value: "Up to 98%" },
      { label: "UV block", value: "99.9%" },
      { label: "Shades", value: "5 / 20 / 35 / 50%" },
      { label: "Signal safe", value: "Ceramic" }
    ],
    includes: [
      "Computer-cut patterns",
      "Heat-shrink forming",
      "Ceramic multi-layer film",
      "Edge sealing",
      "Michigan legal consultation",
      "Lifetime film warranty"
    ]
  },
  {
    slug: "interior-steam",
    index: "07",
    name: "Full Interior Steam Restoration",
    shortName: "Interior Steam",
    category: "Interior",
    tagline: "A cabin reset, without soaking a single stitch.",
    summary:
      "Dry steam extraction for leather, Alcantara, carpets and vents. Sanitizes deep without leaving moisture behind.",
    description: [
      "A high-end interior should smell and feel like the day it left the factory. Our full interior restoration uses dry steam and pH-balanced chemistry to lift embedded soil from leather, Alcantara, carpets, headliners and vents without saturating the materials.",
      "Leather is cleaned, conditioned and protected. Carpets are steam-extracted and dried under airflow. Every crevice, seat rail and vent is detailed by hand. We finish with an ozone treatment to neutralize odor at the source.",
      "It is the correct service before storage, after winter, or before a sale — and it pairs naturally with any coating or film package."
    ],
    fromPrice: 395,
    duration: "4–6 hours",
    warranty: "Workmanship guarantee",
    specs: [
      { label: "Method", value: "Dry steam" },
      { label: "Leather", value: "pH-balanced" },
      { label: "Odor", value: "Ozone treated" },
      { label: "Dry time", value: "Under 2 hours" }
    ],
    includes: [
      "Full vacuum and blow-out",
      "Dry steam extraction",
      "Leather clean and condition",
      "Carpet and headliner detail",
      "Vent and crevice detailing",
      "Ozone odor treatment"
    ]
  }
];

export const serviceBySlug = (slug: string) =>
  SERVICES.find((service) => service.slug === slug) ?? SERVICES[0];

export type VehicleType = "sedan" | "suv" | "truck" | "exotic";

export const VEHICLE_TYPES: { value: VehicleType; label: string; note: string }[] = [
  { value: "sedan", label: "Sedan", note: "Coupe, sedan, wagon" },
  { value: "suv", label: "Mid-Size SUV", note: "Crossovers, 2-row SUVs" },
  { value: "truck", label: "Truck / XL SUV", note: "Full-size, 3-row, lifted" },
  { value: "exotic", label: "Exotic / Sports", note: "Low-clearance, carbon, film-critical" }
];

export const ADD_ONS = [
  { id: "wheel-faces", label: "Wheels-off coating", price: 450, note: "Faces, barrels and calipers" },
  { id: "engine-bay", label: "Engine bay detail", price: 250, note: "Steam clean and dress" },
  { id: "glass-coat", label: "Glass hydrophobic coat", price: 195, note: "Windshield + front sides" },
  { id: "tint-upgrade", label: "Ceramic tint upgrade", price: 349, note: "Full side + rear glass" }
] as const;

export const ESTIMATOR_SERVICES: ServiceSlug[] = [
  "paint-correction",
  "icon-rocklear",
  "xpel-ppf",
  "dry-ice",
  "interior-steam"
];

export const PRICE_MATRIX: Record<string, Record<VehicleType, number>> = {
  "paint-correction": { sedan: 595, suv: 695, truck: 795, exotic: 995 },
  "icon-rocklear": { sedan: 2495, suv: 2895, truck: 3295, exotic: 3995 },
  "xpel-ppf": { sedan: 1895, suv: 2195, truck: 2595, exotic: 3295 },
  "dry-ice": { sedan: 495, suv: 545, truck: 595, exotic: 695 },
  "interior-steam": { sedan: 395, suv: 445, truck: 495, exotic: 595 },
  "opti-coat": { sedan: 1295, suv: 1495, truck: 1695, exotic: 1995 },
  "window-tint": { sedan: 349, suv: 399, truck: 449, exotic: 549 }
};

export const DEPOSIT_CENTS = 10000;
export const DEPOSIT_DOLLARS = 100;

export const STATS = [
  { value: 100000, suffix: "+", label: "Vehicles protected", note: "Since 2011" },
  { value: 2, suffix: "", label: "Royal Oak studios", note: "11 Mile & Delemere" },
  { value: 75, suffix: "×", label: "Stronger than ceramic", note: "Icon Rocklear composite" },
  { value: 10, suffix: "yr", label: "Coating warranty", note: "Registered & transferable" }
];

export const PROCESS = [
  {
    index: "01",
    title: "Inspect",
    copy: "Paint depth mapped, defects documented under controlled light, and a written build plan issued before a single machine touches the car."
  },
  {
    index: "02",
    title: "Correct",
    copy: "Decontamination, clay, and the least aggressive correction that achieves the target. Every panel wiped and inspected between stages."
  },
  {
    index: "03",
    title: "Protect",
    copy: "Coating, film or both — installed in a filtered bay by a single technician who owns the result from first panel to final edge."
  },
  {
    index: "04",
    title: "Cure",
    copy: "Infrared cure, final inspection under sun gun, and a delivery walkthrough with the maintenance protocol your finish requires."
  }
];

export const TESTIMONIALS = [
  {
    quote:
      "I have had six cars coated in Metro Detroit. This is the only shop that measured paint depth before quoting the work and the only one that showed me the panels under a sun gun at delivery.",
    name: "Marcus R.",
    vehicle: "2023 Porsche 911 Turbo S",
    service: "Icon Rocklear + XPEL"
  },
  {
    quote:
      "They removed four years of automatic-car-wash swirls from a black Escalade and it now looks wet from every angle. The follow-up inspection six months later was just as thorough as the original handover.",
    name: "Danielle K.",
    vehicle: "2021 Cadillac Escalade",
    service: "Paint Correction + Opti-Coat"
  },
  {
    quote:
      "The dry ice work on my F-150 was genuinely transformative. They sent before-and-after photos of the frame, then sealed every cavity. No upsell, no shortcuts, no water in the truck.",
    name: "Anthony V.",
    vehicle: "2019 Ford F-150 Raptor",
    service: "Dry Ice Undercarriage"
  }
];

export const FAQS = [
  {
    q: "How long does a full coating or film installation take?",
    a: "Icon Rocklear is a three-to-four day build: decontamination and correction, coating application, then a twelve-hour infrared cure and final inspection. XPEL film is two to four days depending on coverage. We never release a vehicle early to meet a deadline."
  },
  {
    q: "Is the $100 deposit applied to the final price?",
    a: "Yes. The deposit holds your bay and is credited in full against the final invoice. It is transferable once with 48 hours' notice and refundable up to 72 hours before your appointment."
  },
  {
    q: "Do you work on daily drivers, or only exotics?",
    a: "Both. Roughly half of our work is daily-driven SUVs and trucks. Michigan road salt does not discriminate, and a correctly protected daily driver is often the more dramatic before-and-after."
  },
  {
    q: "What is the difference between ceramic coating and paint protection film?",
    a: "Ceramic is a chemical layer that adds gloss, hydrophobics and chemical resistance. Film is a physical urethane layer that absorbs impacts and self-heals. They solve different problems, and on a high-value car the correct answer is usually both: film on impact zones, coating everywhere else."
  },
  {
    q: "Can you match XPEL film to a matte or satin finish?",
    a: "Yes. We install XPEL Stealth for matte and satin paint, and XPEL Fusion for gloss. Both carry the same ten-year warranty and are plotted per panel."
  }
];
