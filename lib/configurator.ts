export type PaintId = "obsidian" | "titanium" | "rosso" | "verde";
export type CoatingId = "factory" | "ceramic" | "rocklear";
export type PpfId = "none" | "track" | "full";
export type TintId = "50" | "35" | "20" | "5";

export type CarSpec = {
  paint: PaintId;
  coating: CoatingId;
  ppf: PpfId;
  tint: TintId;
};

export const DEFAULT_SPEC: CarSpec = {
  paint: "obsidian",
  coating: "rocklear",
  ppf: "track",
  tint: "20"
};

export const PAINTS: {
  id: PaintId;
  label: string;
  hex: string;
  swatch: string;
  metalness: number;
}[] = [
  {
    id: "obsidian",
    label: "Obsidian Black",
    hex: "#0b0c0d",
    swatch: "#15171a",
    metalness: 0.82
  },
  {
    id: "titanium",
    label: "Titanium Silver",
    hex: "#b9bdc2",
    swatch: "#b9bdc2",
    metalness: 0.92
  },
  {
    id: "rosso",
    label: "Rosso Corsa",
    hex: "#8e1018",
    swatch: "#8e1018",
    metalness: 0.62
  },
  {
    id: "verde",
    label: "Verde Oliva",
    hex: "#3b413a",
    swatch: "#3b413a",
    metalness: 0.76
  }
];

export const COATINGS: {
  id: CoatingId;
  label: string;
  note: string;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
}[] = [
  {
    id: "factory",
    label: "Factory clear",
    note: "Unprotected",
    roughness: 0.34,
    clearcoat: 0.28,
    clearcoatRoughness: 0.28
  },
  {
    id: "ceramic",
    label: "Opti-Coat Pro",
    note: "7-year SiO₂",
    roughness: 0.17,
    clearcoat: 1,
    clearcoatRoughness: 0.07
  },
  {
    id: "rocklear",
    label: "Icon Rocklear",
    note: "10-year composite",
    roughness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.025
  }
];

export const PPF_LEVELS: {
  id: PpfId;
  label: string;
  note: string;
  panels: string;
}[] = [
  { id: "none", label: "No film", note: "Coating only", panels: "0 panels" },
  { id: "track", label: "XPEL Track", note: "Impact zones", panels: "8 panels" },
  { id: "full", label: "XPEL Full", note: "Body-wide", panels: "Full body" }
];

export const TINTS: { id: TintId; label: string; vlt: string; opacity: number }[] = [
  { id: "50", label: "50%", vlt: "50% VLT", opacity: 0.34 },
  { id: "35", label: "35%", vlt: "35% VLT", opacity: 0.52 },
  { id: "20", label: "20%", vlt: "20% VLT", opacity: 0.72 },
  { id: "5", label: "5%", vlt: "5% VLT", opacity: 0.9 }
];

export const SPEC_PRESETS: { label: string; note: string; spec: CarSpec }[] = [
  {
    label: "Winter daily",
    note: "Rocklear + track film",
    spec: { paint: "obsidian", coating: "rocklear", ppf: "track", tint: "35" }
  },
  {
    label: "Concours",
    note: "Rocklear + full film",
    spec: { paint: "rosso", coating: "rocklear", ppf: "full", tint: "50" }
  },
  {
    label: "Stealth",
    note: "Ceramic + 5% tint",
    spec: { paint: "verde", coating: "ceramic", ppf: "none", tint: "5" }
  }
];
