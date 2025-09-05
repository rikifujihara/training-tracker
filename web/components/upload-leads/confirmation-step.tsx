"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CheckCircle2, Users, Mail, Phone, AlertTriangle } from "lucide-react";
import { useState } from "react";

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

interface ConfirmationStepProps {
  leads: Lead[];
  onPrevious: () => void;
  onConfirm: (result: { success: boolean; imported?: number; error?: string }) => void;
}

export function ConfirmationStep({ leads, onPrevious, onConfirm }: ConfirmationStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leads }),
      });

      const result = await response.json();

      if (result.success) {
        onConfirm({ 
          success: true, 
          imported: result.data.imported 
        });
      } else {
        onConfirm({ 
          success: false, 
          error: result.error || 'Failed to import leads' 
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      onConfirm({ 
        success: false, 
        error: 'Network error occurred while uploading leads' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation checks
  const leadsWithEmail = leads.filter(lead => lead.email.trim() !== '').length;
  const leadsWithPhone = leads.filter(lead => lead.phoneNumber.trim() !== '').length;
  const leadsWithFullName = leads.filter(lead => 
    lead.firstName.trim() !== '' && lead.lastName.trim() !== ''
  ).length;
  
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

  const hasIssues = duplicateEmails.size > 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <th className="px-3 py-2 text-left font-medium">Name</th>
                <th className="px-3 py-2 text-left font-medium">Email</th>
                <th className="px-3 py-2 text-left font-medium">Phone</th>
                <th className="px-3 py-2 text-left font-medium">Age</th>
                <th className="px-3 py-2 text-left font-medium">Goals</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={index} className="border-t">
                  <td className="px-3 py-2">
                    {lead.firstName || lead.lastName 
                      ? `${lead.firstName} ${lead.lastName}`.trim() 
                      : '-'}
                  </td>
                  <td className="px-3 py-2">
                    <span className={duplicateEmails.has(lead.email) ? "text-amber-600" : ""}>
                      {lead.email || '-'}
                    </span>
                  </td>
                  <td className="px-3 py-2">{lead.phoneNumber || '-'}</td>
                  <td className="px-3 py-2">{lead.age || '-'}</td>
                  <td className="px-3 py-2 max-w-xs truncate" title={lead.goals}>
                    {lead.goals || '-'}
                  </td>
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
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-surface-action hover:bg-surface-action-hover text-white"
        >
          {isSubmitting ? "Importing..." : "Import Leads"}
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}