const globalForSubscribers = globalThis as unknown as {
  __mcasSubscribers?: Set<string>;
};

export const demoSubscribers = globalForSubscribers.__mcasSubscribers ?? new Set<string>();

if (process.env.NODE_ENV !== "production") {
  globalForSubscribers.__mcasSubscribers = demoSubscribers;
}

export function addDemoSubscriber(email: string) {
  demoSubscribers.add(email.toLowerCase());
}
