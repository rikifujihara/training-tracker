/**
 * Utility functions for processing lead data during import
 */

/**
 * Splits a full name into first and last name
 */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const parts = trimmed.split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }
  
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  
  // First part is firstName, everything else is lastName
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  
  return { firstName, lastName };
}

/**
 * Formats Australian mobile number for tel/sms URIs
 * Adds '0' prefix if missing, ensures correct format
 */
export function formatAustralianMobile(phoneNumber: string): string {
  // Remove all non-digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Handle different input formats
  if (digits.length === 9 && digits.startsWith('4')) {
    // Missing leading 0 (e.g., "412345678" -> "0412345678")
    return '0' + digits;
  }
  
  if (digits.length === 10 && digits.startsWith('04')) {
    // Already has leading 0 (e.g., "0412345678")
    return digits;
  }
  
  if (digits.length === 12 && digits.startsWith('614')) {
    // International format (e.g., "61412345678" -> "0412345678")
    return '0' + digits.slice(2);
  }
  
  if (digits.length === 13 && digits.startsWith('+614')) {
    // International format with + (e.g., "+61412345678" -> "0412345678")
    return '0' + digits.slice(3);
  }
  
  // Return as-is if we can't determine the format
  return phoneNumber;
}

/**
 * Converts year of birth to current age
 */
export function yearOfBirthToAge(yearOfBirth: string): string {
  const year = parseInt(yearOfBirth.trim());
  if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
    return '';
  }
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  return age.toString();
}

/**
 * Parses Australian date format (DD/MM/YYYY) and converts to ISO format
 */
export function parseAustralianDate(dateString: string): string {
  const trimmed = dateString.trim();
  const dateParts = trimmed.split('/');
  
  if (dateParts.length !== 3) {
    return '';
  }
  
  const [day, month, year] = dateParts;
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  
  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
    return '';
  }
  
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
    return '';
  }
  
  // Create ISO date string (YYYY-MM-DD)
  const isoDate = `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
  
  return isoDate;
}

/**
 * Auto-detects column types based on sample data
 * Returns confidence scores for different field types
 */
export function detectColumnType(values: string[]): Record<string, number> {
  const nonEmptyValues = values.filter(v => v && v.trim().length > 0);
  if (nonEmptyValues.length === 0) return {};
  
  const scores: Record<string, number> = {};
  
  // Check for full names (contains spaces, multiple words)
  const namePattern = /^[A-Za-z]+\s+[A-Za-z]+/;
  const nameMatches = nonEmptyValues.filter(v => namePattern.test(v.trim())).length;
  if (nameMatches > 0) {
    scores.fullName = nameMatches / nonEmptyValues.length;
  }
  
  // Check for Australian mobile numbers
  const mobilePattern = /^(\+?61)?0?4\d{8}$/;
  const mobileMatches = nonEmptyValues.filter(v => mobilePattern.test(v.replace(/\s/g, ''))).length;
  if (mobileMatches > 0) {
    scores.phoneNumber = mobileMatches / nonEmptyValues.length;
  }
  
  // Check for years (1900-2030)
  const yearPattern = /^(19|20)\d{2}$/;
  const yearMatches = nonEmptyValues.filter(v => yearPattern.test(v.trim())).length;
  if (yearMatches > 0) {
    scores.yearOfBirth = yearMatches / nonEmptyValues.length;
  }
  
  // Check for Australian dates (DD/MM/YYYY)
  const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  const dateMatches = nonEmptyValues.filter(v => datePattern.test(v.trim())).length;
  if (dateMatches > 0) {
    scores.dateJoined = dateMatches / nonEmptyValues.length;
  }
  
  // Check for lead source/category (common terms)
  const sourceTerms = ['pack', 'joiner', 'referral', 'trial', 'membership', 'new', 'pt'];
  const sourceMatches = nonEmptyValues.filter(v => 
    sourceTerms.some(term => v.toLowerCase().includes(term))
  ).length;
  if (sourceMatches > 0) {
    scores.leadSource = sourceMatches / nonEmptyValues.length;
  }
  
  return scores;
}

/**
 * Auto-maps columns based on data analysis
 */
export function autoMapColumns(data: string[][]): Record<string, string> {
  if (data.length === 0) return {};
  
  const mapping: Record<string, string> = {};
  const usedFields = new Set<string>();
  const numColumns = data[0]?.length || 0;
  
  // First pass: collect all scores for all columns
  const columnScores: Array<{ colIndex: number; field: string; score: number }> = [];
  
  for (let colIndex = 0; colIndex < numColumns; colIndex++) {
    const columnValues = data.map(row => row[colIndex] || '').slice(0, 10); // Sample first 10 rows
    const scores = detectColumnType(columnValues);
    
    Object.entries(scores).forEach(([field, score]) => {
      if (score > 0.5) { // At least 50% confidence
        columnScores.push({ colIndex, field, score });
      }
    });
  }
  
  // Second pass: assign fields to columns, prioritizing highest scores and avoiding duplicates
  columnScores
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .forEach(({ colIndex, field }) => {
      // Only assign if the field hasn't been used and the column hasn't been mapped yet
      if (!usedFields.has(field) && !mapping[colIndex.toString()]) {
        mapping[colIndex.toString()] = field;
        usedFields.add(field);
      }
    });
  
  return mapping;
}