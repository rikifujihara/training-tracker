/**
 * Date utility functions for consistent date handling across the application
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
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodayFormatted(): string {
  return formatDateForInput(new Date());
}

/**
 * Gets tomorrow's date in YYYY-MM-DD format
 */
export function getTomorrowFormatted(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateForInput(tomorrow);
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
 * Checks if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return formatDateForInput(date) === formatDateForInput(today);
}

/**
 * Checks if a date is in the past (UTC-based comparison)
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const compareDateUTC = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  return compareDateUTC < todayUTC;
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
 * Checks if a date is tomorrow
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateForInput(date) === formatDateForInput(tomorrow);
}

/**
 * Checks if a date is tomorrow
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateForInput(date) === formatDateForInput(yesterday);
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
