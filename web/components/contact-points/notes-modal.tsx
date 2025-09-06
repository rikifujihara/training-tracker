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
import {
  NotebookPen,
  X,
  Save,
  PenLine,
  Phone,
  MessageSquareText,
} from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { useContactPointsByLeadId } from "@/lib/hooks/use-contact-points";
import { useUpdateLead } from "@/lib/hooks/use-leads";

export interface NotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

export function NotesModal({
  open,
  onOpenChange,
  lead,
}: NotesModalProps) {
  // Fetch contact points for this lead
  const { data: contactPointsData, isLoading: contactPointsLoading } =
    useContactPointsByLeadId(lead.id);

  // Hook for updating lead
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();

  const contactPoints = contactPointsData?.contactPoints || [];
  const [editingNotes, setEditingNotes] = React.useState(false);
  const [localNotes, setLocalNotes] = React.useState(lead.generalNotes || "");

  React.useEffect(() => {
    setLocalNotes(lead.generalNotes || "");
  }, [lead.generalNotes]);

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
  };

  const handleSave = () => {
    updateLead(
      {
        leadId: lead.id,
        data: {
          generalNotes: localNotes,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Failed to save notes:", error);
        },
      }
    );
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
                <NotebookPen className="w-6 h-6 text-text-body" />
                <DialogTitle className="text-[16px] leading-[24px] font-semibold text-black">
                  Notes
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
            <div className="bg-surface-primary p-4 rounded-lg space-y-4">
              <h3 className="text-[16px] leading-[24px] font-semibold text-text-body">
                {lead.displayName}:{" "}
                {lead.age && lead.gender && `${lead.age}, ${lead.gender}`}
              </h3>

              <div className="text-[16px] leading-[24px] text-text-body">
                <span className="font-bold">Age</span>:{" "}
                {lead.age || "Not specified"}
              </div>

              <div className="text-[16px] leading-[24px] text-text-body">
                <span className="font-bold">Goals</span>:{" "}
                {lead.goals || "Not specified"}
              </div>

              <div className="text-[16px] leading-[24px] text-text-body">
                <span className="font-bold">Next</span>: First call scheduled
              </div>
            </div>

            {/* General Notes Section */}
            <h3 className="text-[16px] leading-[24px] font-semibold text-black">
              General Notes
            </h3>

            {/* Editable Text Area */}
            <div className="relative">
              <div className="bg-surface-primary p-3 rounded border border-border-primary min-h-[120px]">
                {editingNotes ? (
                  <textarea
                    value={localNotes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    onBlur={() => setEditingNotes(false)}
                    className="w-full h-full min-h-[96px] resize-none border-none outline-none bg-transparent text-[16px] leading-[24px] text-text-body"
                    placeholder="Add your notes here..."
                    autoFocus
                  />
                ) : (
                  <div
                    className="text-[16px] leading-[24px] text-text-body cursor-text min-h-[96px] whitespace-pre-wrap"
                    onClick={() => setEditingNotes(true)}
                  >
                    {localNotes || "Add your notes here..."}
                  </div>
                )}
              </div>
              {!editingNotes && (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="absolute bottom-2.5 right-3 p-1 hover:bg-surface-action-secondary rounded"
                >
                  <PenLine className="w-6 h-6 text-text-disabled" />
                </button>
              )}
            </div>

            {/* Contact Notes Header */}
            <div className="flex items-center gap-2.5">
              <Phone className="w-6 h-6 text-text-body" />
              <MessageSquareText className="w-6 h-6 text-text-body" />
              <h3 className="text-[16px] leading-[24px] font-semibold text-black">
                Notes
              </h3>
            </div>

            {/* Contact History Cards */}
            {contactPointsLoading ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
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
              <Button onClick={handleSave} disabled={isUpdating}>
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
