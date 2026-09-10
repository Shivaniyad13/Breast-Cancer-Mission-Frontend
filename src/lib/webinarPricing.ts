/**
 * Webinar Pricing & Duration Utilities for Platform Policy Enforcement (Phase 1)
 */

/**
 * Calculates total duration in minutes between startTime and endTime.
 */
export function calculateWebinarDurationMinutes(
  startTime: Date | string,
  endTime: Date | string
): number {
  if (!startTime || !endTime) return 0;

  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (isNaN(start) || isNaN(end) || end <= start) {
    return 0;
  }

  return Math.round((end - start) / (1000 * 60));
}

/**
 * Centralized Platform Minimum Pricing Policy for Phase 1:
 * - Up to 60 minutes: Minimum Price = ₹49
 * - More than 60 min & up to 120 min: Minimum Price = ₹99
 * - More than 120 min & up to 180 min: Minimum Price = ₹149
 * - More than 180 minutes: Minimum Price = ₹199
 */
export function calculateMinimumAllowedPrice(durationMinutes: number): number {
  if (durationMinutes <= 0) return 0;
  if (durationMinutes <= 60) return 49;
  if (durationMinutes <= 120) return 99;
  if (durationMinutes <= 180) return 149;
  return 199;
}

/**
 * Formats duration in minutes into a human-readable string.
 * Examples:
 * - 45 -> "45 Minutes"
 * - 60 -> "1 Hour"
 * - 90 -> "1 Hour 30 Minutes"
 * - 120 -> "2 Hours"
 */
export function formatDurationHumanReadable(durationMinutes: number): string {
  if (durationMinutes <= 0) return "Invalid Duration";

  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;

  if (hours === 0) {
    return `${mins} Minutes`;
  }

  const hourStr = hours === 1 ? "1 Hour" : `${hours} Hours`;

  if (mins === 0) {
    return hourStr;
  }

  return `${hourStr} ${mins} Minutes`;
}
