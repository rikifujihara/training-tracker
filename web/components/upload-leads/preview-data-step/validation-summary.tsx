import { AlertCircle, CheckCircle2, Check } from "lucide-react";

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

interface ValidationSummaryProps {
  parsedLeads: Lead[];
  canProceed: boolean;
}

export function ValidationSummary({
  parsedLeads,
  canProceed,
}: ValidationSummaryProps) {
  // Calculate validation statistics
  const totalLeads = parsedLeads.length;
  const validLeads = parsedLeads.filter(
    (lead) =>
      lead.firstName || lead.lastName || lead.email || lead.phoneNumber
  );
  const leadsWithNames = parsedLeads.filter(
    (lead) => lead.firstName || lead.lastName
  );
  const leadsWithContact = parsedLeads.filter(
    (lead) => lead.email || lead.phoneNumber
  );

  const validationItems = [
    {
      label: "Total rows to import",
      count: totalLeads,
      isGood: totalLeads > 0,
      isRequired: true,
    },
    {
      label: "Valid leads (with name or contact info)",
      count: validLeads.length,
      isGood: validLeads.length > 0,
      isRequired: true,
    },
    {
      label: "Leads with names",
      count: leadsWithNames.length,
      isGood: leadsWithNames.length > 0,
      isRequired: false,
    },
    {
      label: "Leads with contact information",
      count: leadsWithContact.length,
      isGood: leadsWithContact.length > 0,
      isRequired: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Import Summary</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Review the validation results before proceeding.
        </p>
      </div>

      <div className="space-y-3">
        {validationItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border"
          >
            <div className="flex items-center space-x-3">
              {item.isGood ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              )}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">{item.count}</span>
              {item.isRequired && !item.isGood && (
                <span className="text-xs text-orange-600">(Required)</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {canProceed ? (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-800">
            Ready to import {validLeads.length} leads
          </span>
        </div>
      ) : (
        <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <span className="text-sm text-orange-800">
            Please ensure you have at least one valid lead to import
          </span>
        </div>
      )}
    </div>
  );
}