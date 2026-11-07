"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setMessage("");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company })
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setState("success");
      setMessage(data.message ?? "You're on the list.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Unable to reach the studio. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md" noValidate>
      <label htmlFor="newsletter-email" className="eyebrow mb-3 block">
        The Maintenance File — quarterly, no noise
      </label>
      <div className="flex items-stretch border border-line bg-carbon/60 focus-within:border-gold/60">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder="your@email.com"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-porcelain placeholder:text-ash-dim focus:outline-none"
        />
        <input
          type="text"
          name="company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={state === "loading" || state === "success"}
          className="group flex w-12 items-center justify-center border-l border-line text-gold transition-colors hover:bg-gold hover:text-carbon disabled:opacity-60"
          aria-label="Subscribe to the maintenance file"
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          ) : state === "success" ? (
            <Check className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          )}
        </button>
      </div>
      <div className="mt-2 min-h-[18px]" aria-live="polite">
        {message && (
          <p
            className={`font-mono text-[9px] uppercase tracking-[0.18em] ${
              state === "error" ? "text-[#d98a7d]" : "text-gold"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
