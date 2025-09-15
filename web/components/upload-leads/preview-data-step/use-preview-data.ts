import { useEffect, useState } from "react";
import {
  autoMapColumns,
  splitFullName,
  formatAustralianMobile,
  yearOfBirthToAge,
  parseAustralianDate,
} from "@/lib/utils/lead-data-processing";

type Lead = {
  firstName: string;
  lastName: string;
  age: string;
  birthday: string;
  joinDate: string;
  yearOfBirth: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  leadType: string;
  goals: string;
};

export function usePreviewData(
  rawData: string,
  hasHeaders: boolean,
  columnMapping: Record<string, string>,
  setColumnMapping: (mapping: Record<string, string>) => void,
  setParsedLeads: (leads: Lead[]) => void
) {
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  // Parse raw data into structured format
  useEffect(() => {
    // Parse the raw data into rows and columns
    const lines = rawData
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    if (lines.length === 0) return;

    const rows = lines.map((line) => line.split("\t"));

    // Handle headers based on hasHeaders flag
    let dataRows: string[][];
    let columnHeaders: string[];

    if (hasHeaders && rows.length > 0) {
      // First row is headers, rest are data
      const headerRow = rows[0];
      dataRows = rows.slice(1);
      columnHeaders = headerRow;
    } else {
      // No headers, generate generic ones
      const numColumns = rows[0]?.length || 0;
      columnHeaders = Array.from({ length: numColumns }, (_, i) => `Column ${i + 1}`);
      dataRows = rows;
    }

    setParsedData(dataRows);
    setHeaders(columnHeaders);

    // Auto-map columns only if we don't have any current mapping
    if (Object.keys(columnMapping).length === 0) {
      const autoMapping = autoMapColumns(dataRows);
      setColumnMapping(autoMapping);
    }
  }, [rawData, hasHeaders, columnMapping, setColumnMapping]);

  // Process data and update parsed leads when mapping changes
  useEffect(() => {
    if (parsedData.length === 0) return;

    // Determine which columns have actual data
    const columnsWithData = new Set<string>();

    Object.entries(columnMapping).forEach(([columnIndex, fieldName]) => {
      if (fieldName) {
        const hasData = parsedData.some((row) => {
          const value = row[parseInt(columnIndex)] || "";
          return value.trim() !== "";
        });
        if (hasData) {
          columnsWithData.add(columnIndex);
        }
      }
    });

    const leads: Lead[] = parsedData.map((row) => {
      const lead: Lead = {
        firstName: "",
        lastName: "",
        age: "",
        birthday: "",
        joinDate: "",
        yearOfBirth: "",
        dateOfBirth: "",
        gender: "",
        phoneNumber: "",
        email: "",
        leadType: "",
        goals: "",
      };

      // Collect raw values first
      const rawValues: Record<string, string> = {};

      Object.entries(columnMapping).forEach(([columnIndex, fieldName]) => {
        if (fieldName && columnsWithData.has(columnIndex)) {
          const value = row[parseInt(columnIndex)] || "";

          if (fieldName === "fullName") {
            // Special handling for full name - split into first and last
            const { firstName, lastName } = splitFullName(value);
            rawValues.firstName = firstName;
            rawValues.lastName = lastName;
          } else {
            rawValues[fieldName] = value;
          }
        }
      });

      // Process and clean the values
      Object.entries(rawValues).forEach(([field, value]) => {
        let processedValue = value.trim();

        switch (field) {
          case "phoneNumber":
            processedValue = formatAustralianMobile(processedValue);
            break;
          case "yearOfBirth":
            // Convert year of birth to age if we don't have age
            if (processedValue && !rawValues.age) {
              rawValues.age = yearOfBirthToAge(processedValue);
            }
            break;
          case "dateOfBirth":
            // Parse various date formats
            processedValue = parseAustralianDate(processedValue);
            break;
          case "joinDate":
            processedValue = parseAustralianDate(processedValue);
            break;
        }

        (lead as Record<string, string>)[field] = processedValue;
      });

      return lead;
    });

    setParsedLeads(leads);
  }, [parsedData, columnMapping, setParsedLeads]);

  return {
    parsedData,
    headers,
  };
}