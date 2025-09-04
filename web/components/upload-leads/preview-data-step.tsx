"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

type Lead = {
  firstName: string;
  lastName: string;
  age: string;
  birthday: string;
  gender: string;
  phoneNumber: string;
  email: string;
  goals: string;
};

interface PreviewDataStepProps {
  rawData: string;
  parsedLeads: Lead[];
  setParsedLeads: (leads: Lead[]) => void;
  columnMapping: Record<string, string>;
  setColumnMapping: (mapping: Record<string, string>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

const FIELD_OPTIONS = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "age", label: "Age" },
  { value: "birthday", label: "Birthday" },
  { value: "gender", label: "Gender" },
  { value: "phoneNumber", label: "Phone Number" },
  { value: "email", label: "Email" },
  { value: "goals", label: "Goals" },
  { value: "", label: "Skip this column" },
];

export function PreviewDataStep({
  rawData,
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
    const lines = rawData.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) return;

    const rows = lines.map(line => line.split('\t'));
    const headerRow = rows[0] || [];
    const dataRows = rows.slice(1);

    setHeaders(headerRow);
    setParsedData(dataRows);

    // Auto-map columns based on header names
    const autoMapping: Record<string, string> = {};
    headerRow.forEach((header, index) => {
      const lowerHeader = header.toLowerCase().trim();
      if (lowerHeader.includes('first') && lowerHeader.includes('name')) {
        autoMapping[index.toString()] = 'firstName';
      } else if (lowerHeader.includes('last') && lowerHeader.includes('name')) {
        autoMapping[index.toString()] = 'lastName';
      } else if (lowerHeader.includes('age')) {
        autoMapping[index.toString()] = 'age';
      } else if (lowerHeader.includes('birthday') || lowerHeader.includes('birth')) {
        autoMapping[index.toString()] = 'birthday';
      } else if (lowerHeader.includes('gender') || lowerHeader.includes('sex')) {
        autoMapping[index.toString()] = 'gender';
      } else if (lowerHeader.includes('phone')) {
        autoMapping[index.toString()] = 'phoneNumber';
      } else if (lowerHeader.includes('email')) {
        autoMapping[index.toString()] = 'email';
      } else if (lowerHeader.includes('goal')) {
        autoMapping[index.toString()] = 'goals';
      }
    });

    setColumnMapping(autoMapping);
  }, [rawData, setColumnMapping]);

  useEffect(() => {
    // Generate leads based on column mapping
    if (parsedData.length === 0 || Object.keys(columnMapping).length === 0) {
      setParsedLeads([]);
      return;
    }

    const leads: Lead[] = parsedData.map(row => {
      const lead: Lead = {
        firstName: '',
        lastName: '',
        age: '',
        birthday: '',
        gender: '',
        phoneNumber: '',
        email: '',
        goals: '',
      };

      Object.entries(columnMapping).forEach(([columnIndex, fieldName]) => {
        if (fieldName && fieldName in lead) {
          const value = row[parseInt(columnIndex)] || '';
          (lead as any)[fieldName] = value.trim();
        }
      });

      return lead;
    });

    setParsedLeads(leads);
  }, [parsedData, columnMapping, setParsedLeads]);

  const handleColumnMappingChange = (columnIndex: string, fieldName: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [columnIndex]: fieldName,
    }));
  };

  const getMappedFields = () => {
    return Object.values(columnMapping).filter(field => field !== '');
  };

  const getUsedFields = () => {
    return Object.values(columnMapping).filter(field => field !== '');
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
                  {headers.map((header, index) => (
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
                      <td key={cellIndex} className="px-3 py-2 border-r last:border-r-0">
                        {cell || '-'}
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
        <Label className="text-sm font-medium">Map Your Columns:</Label>
        <div className="grid gap-4 md:grid-cols-2">
          {headers.map((header, index) => (
            <div key={index} className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Column: "{header}"
              </Label>
              <Select
                value={columnMapping[index.toString()] || ""}
                onValueChange={(value) => handleColumnMappingChange(index.toString(), value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field..." />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map((option) => {
                    const isUsed = getUsedFields().includes(option.value) && 
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
                ? `${getMappedFields().length} columns mapped, ${parsedLeads.length} leads will be created`
                : "Map at least one column to continue"
              }
            </p>
            {getMappedFields().length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Mapped fields: {getMappedFields().join(', ')}
              </p>
            )}
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