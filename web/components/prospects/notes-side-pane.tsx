"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ContactHistoryCard } from "@/components/contact-points/contact-history-card";
import { NotebookPen, Save, PenLine } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { useContactPointsByLeadId } from "@/lib/hooks/use-contact-points";
import { useUpdateLead } from "@/lib/hooks/use-leads";

export interface NotesSidePaneProps {
  lead: Lead | null;
  isVisible: boolean;
}

export function NotesSidePane({ lead, isVisible }: NotesSidePaneProps) {
  // Fetch contact points for this lead
  const { data: contactPointsData, isLoading: contactPointsLoading } =
    useContactPointsByLeadId(lead?.id || "");

  // Hook for updating lead
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();

  const contactPoints = contactPointsData?.contactPoints || [];
  const [editingNotes, setEditingNotes] = React.useState(false);
  const [localNotes, setLocalNotes] = React.useState(lead?.generalNotes || "");

  React.useEffect(() => {
    setLocalNotes(lead?.generalNotes || "");
  }, [lead?.generalNotes]);

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
  };

  // Check if there are changes to save
  const hasChanges = localNotes !== (lead?.generalNotes || "");

  const handleSave = () => {
    if (!lead) return;

    updateLead(
      {
        leadId: lead.id,
        data: {
          generalNotes: localNotes,
        },
      },
      {
        onSuccess: () => {
          setEditingNotes(false);
        },
        onError: (error) => {
          console.error("Failed to save notes:", error);
        },
      }
    );
  };

  if (!isVisible || !lead) {
    return (
      <div className="w-full h-full bg-surface-primary rounded-lg border border-border-primary flex items-center justify-center">
        <div className="text-center text-text-disabled">
          <NotebookPen className="w-12 h-12 mx-auto mb-4 text-text-disabled/50" />
          <p className="text-lg font-medium">Select a prospect</p>
          <p className="text-sm">to view their notes and contact history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-surface-primary rounded-lg border border-border-primary flex flex-col">
      {/* Header */}
      <div className="bg-surface-primary p-4 border-b border-border-primary rounded-t-lg">
        <div className="flex items-center gap-3">
          <NotebookPen className="w-6 h-6 text-text-body" />
          <h2 className="text-[16px] leading-[24px] font-semibold text-black">
            {lead.displayName}
          </h2>
        </div>
      </div>

      {/* Body - Scrollable */}
      <div className="bg-surface-page p-4 flex-1 overflow-y-auto space-y-4">
        {/* Lead Summary */}
        <div className="bg-surface-primary p-4 rounded-lg space-y-4">
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

        {/* Save Button - Only shown when there are changes */}
        {hasChanges && (
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-surface-action text-text-on-action hover:bg-surface-action/90"
            >
              Save
              <Save className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

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
    </div>
  );
}
