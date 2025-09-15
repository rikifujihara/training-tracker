/**
 * Form validation and utility functions
 */

/**
 * Validates required fields and returns missing field names
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): string[] {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    const value = data[field];
    if (value === undefined || value === null || value === "") {
      missingFields.push(field);
    }
  }

  return missingFields;
}

/**
 * Creates a validation error message for missing required fields
 */
export function createRequiredFieldsErrorMessage(missingFields: string[]): string {
  if (missingFields.length === 0) return "";

  const fieldList = missingFields.join(", ");
  return `Missing required fields: ${fieldList}`;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (basic validation)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, "");
  // US phone numbers should have 10 digits
  return digitsOnly.length === 10 || digitsOnly.length === 11;
}

/**
 * Formats phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }

  if (digitsOnly.length === 11 && digitsOnly[0] === "1") {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }

  return phone; // Return original if not standard format
}

/**
 * Trims and normalizes text input
 */
export function normalizeTextInput(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

/**
 * Checks if two objects have the same values for specified fields
 */
export function hasFieldChanges<T extends Record<string, unknown>>(
  original: T,
  current: T,
  fields: (keyof T)[]
): boolean {
  return fields.some(field => original[field] !== current[field]);
}