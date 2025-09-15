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
 * Combines date and time strings into a Date object
 */
export function combineDateAndTime(dateString: string, timeString: string): Date {
  return new Date(`${dateString}T${timeString}`);
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return formatDateForInput(date) === formatDateForInput(today);
}

/**
 * Checks if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}