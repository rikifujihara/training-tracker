"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePreviewData } from "./use-preview-data";
import { ColumnMapping } from "./column-mapping";
import { DataPreviewTable } from "./data-preview-table";
import { ValidationSummary } from "./validation-summary";

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
  const { parsedData, headers } = usePreviewData(
    rawData,
    hasHeaders,
    columnMapping,
    setColumnMapping,
    setParsedLeads
  );

  if (parsedData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No data to preview. Please go back and paste your data.
          </p>
        </div>

        <div className="flex justify-between">
          <Button onClick={onPrevious} variant="outline" className="flex items-center space-x-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          <Button disabled>
            <span>Next</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Column Mapping Section */}
      <ColumnMapping
        headers={headers}
        columnMapping={columnMapping}
        onMappingChange={setColumnMapping}
      />

      {/* Data Preview Section */}
      <DataPreviewTable
        headers={headers}
        parsedData={parsedData}
        columnMapping={columnMapping}
      />

      {/* Validation Summary Section */}
      <ValidationSummary
        parsedLeads={parsedLeads}
        canProceed={canProceed}
      />

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button onClick={onPrevious} variant="outline" className="flex items-center space-x-2">
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}