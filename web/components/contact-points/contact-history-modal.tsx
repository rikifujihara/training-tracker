"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { ContactHistoryCard } from "./contact-history-card";
import { History, X, Save } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { useContactPointsByLeadId } from "@/lib/hooks/use-contact-points";

export interface ContactHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSave?: () => void;
}

export function ContactHistoryModal({
  open,
  onOpenChange,
  lead,
  onSave,
}: ContactHistoryModalProps) {
  // Fetch contact points for this lead
  const {
    data: contactPointsData,
    isLoading,
    error,
  } = useContactPointsByLeadId(lead.id);

  const contactPoints = contactPointsData?.contactPoints || [];

  const handleSave = () => {
    onSave?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent
          className="max-w-[440px] max-h-[90vh] p-0 gap-0 rounded-lg overflow-hidden"
          showCloseButton={false}
        >
          {/* Header */}
          <DialogHeader className="bg-surface-primary p-4 border-b-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-text-body" />
                <DialogTitle className="text-[16px] leading-[24px] font-semibold text-black">
                  History
                </DialogTitle>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 p-3 rounded-lg hover:bg-surface-action-secondary"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          {/* Body - Scrollable */}
          <div className="bg-surface-page p-2 flex-1 overflow-y-auto max-h-[588px] space-y-2.5">
            {/* Lead Summary */}
            <div className="bg-surface-primary p-4 rounded-lg">
              <h3 className="text-[16px] leading-[24px] font-semibold text-text-body">
                {lead.displayName}
              </h3>
            </div>

            {/* Contact History Cards */}
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-surface-primary p-4 rounded-lg animate-pulse"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-2">
                        <div className="h-6 w-12 bg-text-disabled/20 rounded-full"></div>
                        <div className="h-6 w-16 bg-text-disabled/20 rounded-full"></div>
                      </div>
                      <div className="h-6 w-32 bg-text-disabled/20 rounded"></div>
                    </div>
                    <div className="h-4 bg-text-disabled/20 rounded w-full mb-2"></div>
                    <div className="h-4 bg-text-disabled/20 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-surface-primary p-4 rounded-lg text-center text-red-600">
                Error loading contact history: {error.message}
              </div>
            ) : contactPoints.length > 0 ? (
              <div className="space-y-2">
                {contactPoints.map((contactPoint) => (
                  <ContactHistoryCard
                    key={contactPoint.id}
                    contactType={contactPoint.contactType}
                    outcome={contactPoint.outcome}
                    contactDate={contactPoint.contactDate}
                    notes={contactPoint.notes}
                    showNotes={true}
                    showOutcomeBadge={true}
                    className="w-full"
                  />
                ))}
              </div>
            ) : (
              <div className="bg-surface-primary p-4 rounded-lg text-center text-text-disabled">
                No contact history yet
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-surface-primary p-4 border-t-0">
            <div className="flex items-center justify-end gap-2.5 w-full">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={false}>
                Save
                <Save className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
