"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CheckCircle2, Users, Mail, Phone, AlertTriangle } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { CreateLeadInput } from "@/lib/types/lead";
import { parseAustralianDateToDate, parseYearOfBirth } from "@/lib/utils/lead-data-processing";

// Field configuration for dynamic columns
type FieldConfig = {
  key: keyof Lead;
  label: string;
  getValue: (lead: Lead) => string;
  render?: (lead: Lead, value: string) => React.ReactNode;
};

const FIELD_CONFIGS: FieldConfig[] = [
  {
    key: 'firstName',
    label: 'Name',
    getValue: (lead) => {
      const fullName = `${lead.firstName} ${lead.lastName}`.trim();
      return fullName || '-';
    }
  },
  {
    key: 'email',
    label: 'Email',
    getValue: (lead) => lead.email || '-',
    render: (lead, value) => {
      // We'll handle duplicate highlighting here if needed
      return <span>{value}</span>;
    }
  },
  {
    key: 'phoneNumber',
    label: 'Phone',
    getValue: (lead) => lead.phoneNumber || '-'
  },
  {
    key: 'age',
    label: 'Age',
    getValue: (lead) => lead.age || '-'
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    getValue: (lead) => lead.joinDate || '-'
  },
  {
    key: 'yearOfBirth',
    label: 'Year of Birth',
    getValue: (lead) => lead.yearOfBirth || '-'
  },
  {
    key: 'dateOfBirth',
    label: 'Date of Birth',
    getValue: (lead) => lead.dateOfBirth || '-'
  },
  {
    key: 'leadType',
    label: 'Lead Type',
    getValue: (lead) => lead.leadType || '-'
  },
  {
    key: 'gender',
    label: 'Gender',
    getValue: (lead) => lead.gender || '-'
  },
  {
    key: 'goals',
    label: 'Goals',
    getValue: (lead) => lead.goals || '-'
  }
];

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

interface ConfirmationStepProps {
  leads: Lead[];
  onPrevious: () => void;
  uploadMutation: UseMutationResult<unknown, Error, CreateLeadInput[], unknown>;
}

export function ConfirmationStep({ leads, onPrevious, uploadMutation }: ConfirmationStepProps) {

  // Determine which fields have data across all leads
  const getActiveFields = (): FieldConfig[] => {
    return FIELD_CONFIGS.filter((fieldConfig) => {
      return leads.some((lead) => {
        const value = fieldConfig.getValue(lead);
        return value !== '-' && value.trim().length > 0;
      });
    });
  };

  const activeFields = getActiveFields();

  const handleConfirm = () => {
    // Convert string-based lead data to properly typed API data
    const convertedLeads: CreateLeadInput[] = leads.map((lead) => ({
      firstName: lead.firstName.trim() || undefined,
      lastName: lead.lastName.trim() || undefined,
      age: lead.age.trim() || undefined,
      birthday: lead.birthday.trim() || undefined,
      joinDate: lead.joinDate.trim() ? parseAustralianDateToDate(lead.joinDate.trim()) || undefined : undefined,
      yearOfBirth: lead.yearOfBirth.trim() ? parseYearOfBirth(lead.yearOfBirth.trim()) || undefined : undefined,
      dateOfBirth: lead.dateOfBirth.trim() ? parseAustralianDateToDate(lead.dateOfBirth.trim()) || undefined : undefined,
      gender: lead.gender.trim() || undefined,
      phoneNumber: lead.phoneNumber.trim() || undefined,
      email: lead.email.trim() || undefined,
      leadType: lead.leadType.trim() || undefined,
      goals: lead.goals.trim() || undefined,
    }));

    uploadMutation.mutate(convertedLeads);
  };

  // Validation checks
  const leadsWithEmail = leads.filter(lead => lead.email.trim() !== '').length;
  const leadsWithPhone = leads.filter(lead => lead.phoneNumber.trim() !== '').length;
  const leadsWithFullName = leads.filter(lead =>
    lead.firstName.trim() !== '' && lead.lastName.trim() !== ''
  ).length;
  const leadsWithJoinDate = leads.filter(lead => lead.joinDate.trim() !== '').length;
  const leadsWithYearOfBirth = leads.filter(lead => lead.yearOfBirth.trim() !== '').length;
  
  const duplicateEmails = new Set();
  const emailCounts = new Map();
  leads.forEach(lead => {
    if (lead.email.trim()) {
      const count = emailCounts.get(lead.email) || 0;
      emailCounts.set(lead.email, count + 1);
      if (count > 0) {
        duplicateEmails.add(lead.email);
      }
    }
  });

  // Update email field config to handle duplicate highlighting
  const emailFieldIndex = activeFields.findIndex(field => field.key === 'email');
  if (emailFieldIndex !== -1 && duplicateEmails.size > 0) {
    activeFields[emailFieldIndex] = {
      ...activeFields[emailFieldIndex],
      render: (lead, value) => (
        <span className={duplicateEmails.has(lead.email) ? "text-amber-600" : ""}>
          {value}
        </span>
      )
    };
  }

  const hasIssues = duplicateEmails.size > 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-surface-primary border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-surface-action-hover-2 rounded-full mx-auto mb-2">
            <Users className="w-4 h-4 text-surface-action" />
          </div>
          <div className="text-2xl font-bold">{leads.length}</div>
          <div className="text-xs text-muted-foreground">Total Leads</div>
        </div>

        <div className="bg-surface-primary border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold">{leadsWithFullName}</div>
          <div className="text-xs text-muted-foreground">Complete Names</div>
        </div>

        <div className="bg-surface-primary border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{leadsWithEmail}</div>
          <div className="text-xs text-muted-foreground">With Email</div>
        </div>

        <div className="bg-surface-primary border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2">
            <Phone className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">{leadsWithPhone}</div>
          <div className="text-xs text-muted-foreground">With Phone</div>
        </div>

        <div className="bg-surface-primary border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-2">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v8m6-8v8M5 7h14l-1 10H6L5 7z" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{leadsWithJoinDate}</div>
          <div className="text-xs text-muted-foreground">With Join Date</div>
        </div>

        <div className="bg-surface-primary border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-teal-100 rounded-full mx-auto mb-2">
            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{leadsWithYearOfBirth}</div>
          <div className="text-xs text-muted-foreground">With Birth Year</div>
        </div>
      </div>

      {/* Issues Warning */}
      {hasIssues && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-amber-800">Issues Detected</h4>
              {duplicateEmails.size > 0 && (
                <p className="text-sm text-amber-700">
                  <strong>{duplicateEmails.size} duplicate email(s) found:</strong> {Array.from(duplicateEmails).join(', ')}
                </p>
              )}
              <p className="text-xs text-amber-600">
                Review your data before proceeding. Duplicates will be handled automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lead Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Lead Preview</h3>
          <Badge variant="secondary">{leads.length} leads</Badge>
        </div>
        
        <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                {activeFields.map((field) => (
                  <th key={field.key} className="px-3 py-2 text-left font-medium">
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={index} className="border-t">
                  {activeFields.map((field) => {
                    const value = field.getValue(lead);
                    const content = field.render ? field.render(lead, value) : value;
                    const isGoalsField = field.key === 'goals';

                    return (
                      <td
                        key={field.key}
                        className={`px-3 py-2 ${isGoalsField ? 'max-w-xs truncate' : ''}`}
                        title={isGoalsField ? value : undefined}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Message */}
      <div className="bg-surface-action-hover-2 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-surface-action mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-sm">Ready to Import</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Click &ldquo;Import Leads&rdquo; to add these {leads.length} leads to your system.
              {hasIssues && " Issues will be handled automatically during import."}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={uploadMutation.isPending}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={uploadMutation.isPending}
          className="flex items-center gap-2 bg-surface-action hover:bg-surface-action-hover text-white"
        >
          {uploadMutation.isPending ? "Importing..." : "Import Leads"}
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}