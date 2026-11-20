// Rails API base, set via VITE_API_BASE (see .env.development)
export const API_BASE: string = import.meta.env.VITE_API_BASE ?? "";

// Rails API endpoint, set via VITE_LEAD_ENDPOINT (see .env.development).
// Empty = demo mode: the form is validated and a thank-you toast is shown, nothing is sent.
export const LEAD_ENDPOINT: string = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

export function photo(id: string, width: number): string {
  return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + width + "&q=80";
}

export async function submitLead(form: HTMLFormElement): Promise<void> {
  if (!LEAD_ENDPOINT) return;
  const response = await fetch(LEAD_ENDPOINT, {
    method: "POST",
    body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>),
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error("Lead submit failed: " + response.status);
}

// Local date as YYYY-MM-DD, used as the earliest selectable event date
export function todayIso(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
