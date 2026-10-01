/** True if the string is an IANA timezone the browser understands. */
export function isValidTimeZone(tz: string): boolean {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Today's date (YYYY-MM-DD) as seen in the given timezone. */
export function todayInTimeZone(tz: string, now = new Date()): string {
  const safeTz = isValidTimeZone(tz) ? tz : "UTC";
  // en-CA formats dates as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: safeTz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Current time (HH:MM, 24h) as seen in the given timezone. */
export function nowTimeInTimeZone(tz: string, now = new Date()): string {
  const safeTz = isValidTimeZone(tz) ? tz : "UTC";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: safeTz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const h = parts.find((p) => p.type === "hour")?.value ?? "00";
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${h}:${m}`;
}

/** "2026-10-02" → "Friday, 2 October 2026 (2026-10-02)" */
export function formatDateLong(isoDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
  const d = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return isoDate;
  const pretty = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
  return `${pretty} (${isoDate})`;
}

/** "14:30" → "2:30 PM" */
export function formatTime12h(time: string): string {
  const match = /^(\d{2}):(\d{2})/.exec(time);
  if (!match) return time;
  const h = Number(match[1]);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${match[2]} ${suffix}`;
}

/** A short list used before the full browser list is available, and as a fallback. */
export const COMMON_TIMEZONES = [
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Riyadh",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Australia/Sydney",
  "UTC",
];

/** Full list of IANA timezones supported by this browser, falling back to a common list. */
export function allTimeZones(): string[] {
  try {
    const intl = Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] };
    const list = intl.supportedValuesOf?.("timeZone");
    if (list && list.length) {
      return Array.from(new Set([...list, "UTC"])).sort();
    }
  } catch {
    /* fall through */
  }
  return [...COMMON_TIMEZONES].sort();
}
