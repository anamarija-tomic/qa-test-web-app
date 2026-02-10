// utils/dateParsers.js

/**
 * Parses strings like:
 * "2/8/2026, 11:19:13 PM"
 * into a Date (local time).
 *
 * If the UI format changes, update this function (single point of change).
 */
export function parseLastLoginToDate(text) {
  const trimmed = String(text).trim();

  // Example: 2/8/2026, 11:19:13 PM
  const m = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i,
  );

  if (!m) {
    throw new Error(`Unexpected "Last login" format: "${trimmed}"`);
  }

  const month = Number(m[1]);
  const day = Number(m[2]);
  const year = Number(m[3]);
  let hour = Number(m[4]);
  const minute = Number(m[5]);
  const second = Number(m[6]);
  const ampm = m[7].toUpperCase();

  // Convert to 24h
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return new Date(year, month - 1, day, hour, minute, second, 0);
}
