"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Table, CheckCircle, AlertTriangle } from "lucide-react";
import { PasteDataStep } from "./paste-data-step";
import { PreviewDataStep } from "./preview-data-step";
import { ConfirmationStep } from "./confirmation-step";
import { cn } from "@/lib/utils";

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

type WizardStep = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: "Paste Your Data",
    description: "Copy and paste the table from your email",
    icon: <Upload className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Review & Map",
    description: "Preview data and map columns to fields",
    icon: <Table className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Confirm",
    description: "Review and confirm your leads",
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

export function UploadLeadsWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [rawData, setRawData] = useState("");
  const [parsedLeads, setParsedLeads] = useState<Lead[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(
    {}
  );
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    imported?: number;
    error?: string;
  } | null>(null);

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedFromStep1 = rawData.trim().length > 0;
  const canProceedFromStep2 =
    parsedLeads.length > 0 && Object.keys(columnMapping).length > 0;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PasteDataStep
            rawData={rawData}
            setRawData={setRawData}
            onNext={handleNext}
            canProceed={canProceedFromStep1}
          />
        );
      case 2:
        return (
          <PreviewDataStep
            rawData={rawData}
            parsedLeads={parsedLeads}
            setParsedLeads={setParsedLeads}
            columnMapping={columnMapping}
            setColumnMapping={setColumnMapping}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canProceed={canProceedFromStep2}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            leads={parsedLeads}
            onPrevious={handlePrevious}
            onConfirm={(result) => {
              setUploadResult(result);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  currentStep > step.id
                    ? "bg-surface-action border-surface-action text-white"
                    : currentStep === step.id
                    ? "border-surface-action text-surface-action bg-surface-action-hover-2"
                    : "border-muted text-muted-foreground bg-background"
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-16 h-0.5 mx-2 transition-colors",
                    currentStep > step.id ? "bg-surface-action" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Title */}
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {WIZARD_STEPS[currentStep - 1]?.title}
        </h2>
        <p className="text-muted-foreground mt-1">
          {WIZARD_STEPS[currentStep - 1]?.description}
        </p>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {uploadResult ? (
            <div className="text-center space-y-4">
              {uploadResult.success ? (
                <>
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800">Success!</h3>
                  <p className="text-muted-foreground">
                    {uploadResult.imported} leads have been successfully imported to your database.
                  </p>
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setRawData("");
                      setParsedLeads([]);
                      setColumnMapping({});
                      setUploadResult(null);
                    }}
                    className="bg-surface-action hover:bg-surface-action-hover text-white px-6 py-2 rounded-md"
                  >
                    Import More Leads
                  </button>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-red-800">Upload Failed</h3>
                  <p className="text-muted-foreground">
                    {uploadResult.error}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setUploadResult(null)}
                      className="bg-surface-action hover:bg-surface-action-hover text-white px-6 py-2 rounded-md"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setRawData("");
                        setParsedLeads([]);
                        setColumnMapping({});
                        setUploadResult(null);
                      }}
                      className="border border-muted-foreground text-muted-foreground hover:bg-muted px-6 py-2 rounded-md"
                    >
                      Start Over
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            renderStepContent()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
