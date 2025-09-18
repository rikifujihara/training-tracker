/**
 * Date utility functions for consistent date handling across the application
 *
 * These utilities are primarily for CLIENT-SIDE use. The server should receive
 * pre-calculated UTC date ranges from the client rather than doing timezone logic.
 */

/**
 * Formats a Date object for HTML date input (YYYY-MM-DD format)
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Formats a Date object for HTML time input (HH:MM format)
 */
export function formatTimeForInput(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

/**
 * Gets today's date in YYYY-MM-DD format (local timezone)
 */
export function getTodayFormatted(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets tomorrow's date in YYYY-MM-DD format (local timezone)
 */
export function getTomorrowFormatted(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Combines date and time strings into a Date object (UTC)
 */
export function combineDateAndTime(
  dateString: string,
  timeString: string
): Date {
  // Create UTC date to avoid timezone interpretation issues
  return new Date(`${dateString}T${timeString}:00.000Z`);
}

/**
 * Checks if a date is today (local timezone comparison)
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Checks if a date is in the past (local timezone comparison)
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return compareDate < todayStart;
}

/**
 * Formats a date in Australian format (DD/MM/YYYY)
 */
export function formatDateAustralian(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
}

/**
 * Checks if a date is tomorrow (local timezone comparison)
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

/**
 * Checks if a date is yesterday (local timezone comparison)
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

/**
 * Formats a date and time in Australian format with time
 */
export function formatDateTimeAustralian(
  date: Date | string,
  moreReadable: boolean = false
): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }


  // If moreReadable is true, check for today/tomorrow
  if (moreReadable) {
    const timeFormat = new Intl.DateTimeFormat("en-AU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(dateObj);

    if (isToday(dateObj)) {
      return `Today, ${timeFormat}`;
    }

    if (isTomorrow(dateObj)) {
      return `Tomorrow, ${timeFormat}`;
    }

    if (isYesterday(dateObj)) {
      return `Yesterday, ${timeFormat}`;
    }
  }

  // Default format
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);
}

/**
 * CLIENT-SIDE TIMEZONE HELPERS
 * These functions help calculate date boundaries in the user's local timezone
 * and convert them to UTC for server communication
 */

/**
 * Gets the start and end of today in the user's timezone, converted to UTC
 * Used for client-side "today" filter calculations
 */
export function getTodayBoundariesUTC(): { startUTC: Date; endUTC: Date } {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return {
    startUTC: todayStart,
    endUTC: todayEnd
  };
}

/**
 * Gets the start and end of a specific date in the user's timezone, converted to UTC
 * Used for client-side date range calculations
 */
export function getDateBoundariesUTC(date: Date): { startUTC: Date; endUTC: Date } {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return {
    startUTC: dayStart,
    endUTC: dayEnd
  };
}

/**
 * Gets date boundaries for "overdue" tasks (everything before today)
 * Returns null for startUTC (no lower bound) and today's start as endUTC
 */
export function getOverdueBoundariesUTC(): { startUTC: null; endUTC: Date } {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return {
    startUTC: null,
    endUTC: todayStart
  };
}

/**
 * Gets date boundaries for "upcoming" tasks (everything after today)
 * Returns tomorrow's start as startUTC and null for endUTC (no upper bound)
 */
export function getUpcomingBoundariesUTC(): { startUTC: Date; endUTC: null } {
  const tomorrowStart = new Date();
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);

  return {
    startUTC: tomorrowStart,
    endUTC: null
  };
}

// =============================================================================
// HTML INPUT UTILITIES
// =============================================================================

/**
 * Formats a Date object for HTML datetime-local input (YYYY-MM-DDTHH:MM format)
 * Uses local timezone representation
 */
export function formatDateTimeLocalInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// =============================================================================
// DATE WITH TIME UTILITIES
// =============================================================================

/**
 * Gets today's date with a specific time (local timezone)
 * @param hours - Hour (0-23), defaults to 10
 * @param minutes - Minutes (0-59), defaults to 0
 */
export function getTodayWithTime(hours: number = 10, minutes: number = 0): Date {
  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  return today;
}

/**
 * Gets tomorrow's date with a specific time (local timezone)
 * @param hours - Hour (0-23), defaults to 10
 * @param minutes - Minutes (0-59), defaults to 0
 */
export function getTomorrowWithTime(hours: number = 10, minutes: number = 0): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hours, minutes, 0, 0);
  return tomorrow;
}
