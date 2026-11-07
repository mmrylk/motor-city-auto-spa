"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center justify-center gap-2 border border-line px-4 py-3 font-mono text-[8px] uppercase tracking-[0.18em] text-ash transition-colors hover:border-gold/50 hover:text-gold"
    >
      <Printer className="h-3.5 w-3.5" strokeWidth={1.4} />
      Print confirmation
    </button>
  );
}
