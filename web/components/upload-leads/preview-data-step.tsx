"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Check,
} from "lucide-react";
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

interface PreviewDataStepProps {
  rawData: string;
  hasHeaders: boolean;
  parsedLeads: Lead[];
  setParsedLeads: (leads: Lead[]) => void;
  columnMapping: Record<string, string>;
  setColumnMapping: (mapping: Record<string, string>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

const FIELD_OPTIONS = [
  { value: "fullName", label: "Full Name" },
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "phoneNumber", label: "Phone Number" },
  { value: "joinDate", label: "Join Date" },
  { value: "yearOfBirth", label: "Year of Birth" },
  { value: "dateOfBirth", label: "Date of Birth" },
  { value: "age", label: "Age" },
  { value: "birthday", label: "Birthday" },
  { value: "leadType", label: "Lead Type" },
  { value: "gender", label: "Gender" },
  { value: "email", label: "Email" },
  { value: "goals", label: "Goals" },
  { value: "", label: "Skip this column" },
];

export function PreviewDataStep({
  rawData,
  hasHeaders,
  parsedLeads,
  setParsedLeads,
  columnMapping,
  setColumnMapping,
  onNext,
  onPrevious,
  canProceed,
}: PreviewDataStepProps) {
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

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
      columnHeaders = headerRow.map(
        (header, i) => header.trim() || `Column ${i + 1}`
      );
    } else {
      // All rows are data, generate generic headers
      dataRows = rows;
      const numColumns = dataRows[0]?.length || 0;
      columnHeaders = Array.from(
        { length: numColumns },
        (_, i) => `Column ${i + 1}`
      );
    }

    setHeaders(columnHeaders);
    setParsedData(dataRows);

    // Auto-map columns based on data content analysis
    const autoMapping = autoMapColumns(dataRows);
    setColumnMapping(autoMapping);
  }, [rawData, hasHeaders, setColumnMapping]);

  useEffect(() => {
    // Generate leads based on column mapping
    if (parsedData.length === 0 || Object.keys(columnMapping).length === 0) {
      setParsedLeads([]);
      return;
    }

    // First, check which columns have any non-empty values across all rows
    const columnsWithData = new Set<string>();
    Object.entries(columnMapping).forEach(([columnIndex, fieldName]) => {
      if (fieldName) {
        const hasData = parsedData.some((row) => {
          const value = row[parseInt(columnIndex)] || "";
          return value.trim().length > 0;
        });
        if (hasData) {
          columnsWithData.add(fieldName);
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
        goals: "",
        leadType: "",
      };

      // First pass: collect raw values (only for columns with data)
      const rawValues: Record<string, string> = {};
      Object.entries(columnMapping).forEach(([columnIndex, fieldName]) => {
        if (fieldName && columnsWithData.has(fieldName)) {
          const value = row[parseInt(columnIndex)] || "";
          rawValues[fieldName] = value.trim();
        }
      });

      // Second pass: process and assign values
      Object.entries(rawValues).forEach(([fieldName, value]) => {
        switch (fieldName) {
          case "fullName":
            const { firstName, lastName } = splitFullName(value);
            lead.firstName = firstName;
            lead.lastName = lastName;
            break;
          case "phoneNumber":
            lead.phoneNumber = formatAustralianMobile(value);
            break;
          case "yearOfBirth":
            lead.yearOfBirth = value;
            // Also calculate age from year of birth
            lead.age = yearOfBirthToAge(value);
            break;
          case "joinDate":
            lead.joinDate = parseAustralianDate(value);
            break;
          case "dateOfBirth":
            lead.dateOfBirth = parseAustralianDate(value);
            break;
          case "leadSource":
            lead.leadType = value; // Store lead source in leadType field
            break;
          default:
            // Direct mapping for standard fields
            if (fieldName in lead) {
              (lead as Record<string, string>)[fieldName] = value;
            }
            break;
        }
      });

      return lead;
    });

    setParsedLeads(leads);
  }, [parsedData, columnMapping, setParsedLeads]);

  const handleColumnMappingChange = (
    columnIndex: string,
    fieldName: string
  ) => {
    setColumnMapping({
      ...columnMapping,
      [columnIndex]: fieldName,
    });
  };

  const getMappedFields = () => {
    return Object.values(columnMapping).filter((field) => field !== "");
  };

  const getUsedFields = () => {
    return Object.values(columnMapping).filter((field) => field !== "");
  };

  const getDisplayHeaders = () => {
    return headers.map((originalHeader, index) => {
      const mappedField = columnMapping[index.toString()];
      if (mappedField) {
        const fieldOption = FIELD_OPTIONS.find(
          (option) => option.value === mappedField
        );
        return fieldOption ? fieldOption.label : originalHeader;
      }
      return originalHeader;
    });
  };

  const isColumnMapped = (columnIndex: number): boolean => {
    const mappedField = columnMapping[columnIndex.toString()];
    if (!mappedField || mappedField === "") {
      return false;
    }

    // Check if the mapped field exists in our field options
    const fieldExists = FIELD_OPTIONS.some(
      (option) => option.value === mappedField
    );
    return fieldExists;
  };

  return (
    <div className="space-y-6">
      {/* Data Preview */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Data Preview:</Label>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {getDisplayHeaders().map((header, index) => (
                    <th key={index} className="px-3 py-2 text-left font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-3 py-2 border-r last:border-r-0 ${
                          isColumnMapped(cellIndex) ? "bg-surface-success" : ""
                        }`}
                      >
                        {cell || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedData.length > 5 && (
              <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/50 text-center">
                ... and {parsedData.length - 5} more rows
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Column Mapping */}
      <div className="space-y-4">
        <Label className="text-sm font-normal text-muted-foreground">
          For each column, select information it contains:
        </Label>
        <div className="grid gap-4 md:grid-cols-2">
          {headers.map((header, index) => (
            <div key={index} className="space-y-2">
              <Label className="flex gap-2">
                <span className="font-normal">{header}</span>{" "}
                {parsedData[0] && parsedData[0][index] && (
                  <span className="font-normal text-muted-foreground">
                    (e.g., &ldquo;{parsedData[0][index]}&rdquo;)
                  </span>
                )}
                {isColumnMapped(index) && <Check className="text-[#0DA500]" />}
              </Label>
              <Select
                value={columnMapping[index.toString()] || ""}
                onValueChange={(value) =>
                  handleColumnMappingChange(index.toString(), value)
                }
              >
                <SelectTrigger
                  className={isColumnMapped(index) ? "bg-surface-success" : ""}
                >
                  <div className="truncate">
                    {(() => {
                      const mappedValue = columnMapping[index.toString()];
                      if (!mappedValue) {
                        return "Select field...";
                      }

                      const fieldOption = FIELD_OPTIONS.find(
                        (option) => option.value === mappedValue
                      );

                      return fieldOption
                        ? fieldOption.label
                        : "Select field...";
                    })()}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map((option) => {
                    const isUsed =
                      getUsedFields().includes(option.value) &&
                      columnMapping[index.toString()] !== option.value;
                    return (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className={isUsed ? "opacity-50" : ""}
                      >
                        {option.label}
                        {isUsed && " (already used)"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      {/* Mapping Status */}
      <div className="bg-surface-action-hover-2 rounded-lg p-4">
        <div className="flex items-start gap-3">
          {getMappedFields().length > 0 ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="text-sm font-medium">
              {getMappedFields().length > 0
                ? `${getMappedFields().length} columns mapped, ${
                    parsedLeads.length
                  } leads will be created`
                : "Map at least one column to continue"}
            </p>
            {/* {getMappedFields().length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Auto-detected and mapped: {getMappedFields().join(", ")}
              </p>
            )} */}
            <p className="text-xs text-muted-foreground mt-1">
              💡 Phone numbers will be automatically formatted for Australian
              mobile (adding &apos;0&apos; if needed)
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
