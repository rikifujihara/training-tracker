"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, NotebookPen, History, MessageSquare } from "lucide-react";
import { Lead, LeadStatus } from "@/lib/types/lead";
import { NotesModal } from "@/components/contact-points/notes-modal";
import { LogContactPointModal, LogContactPointData } from "@/components/contact-points/log-contact-point-modal";
import { ContactPoint, ContactType, ContactPointOutcome } from "@/lib/types/contactPoint";
import { useCreateContactPoint } from "@/lib/hooks/use-contact-points";

export interface ProspectCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  lead: Lead;
  nextAction?: string;
}

export function ProspectCard({
  className,
  lead,
  nextAction = "First Call",
  ...props
}: ProspectCardProps) {
  const [notesModalOpen, setNotesModalOpen] = React.useState(false);
  const [logModalOpen, setLogModalOpen] = React.useState(false);
  const createContactPointMutation = useCreateContactPoint();
  const statusBarColor = getStatusBarColor(lead.status);
  const statusAgeText = lead.statusAgeDays === 0 ? "Today" : 
                       lead.statusAgeDays === 1 ? "1 day old" : 
                       `${lead.statusAgeDays} days old`;

  // Mock contact points for testing
  const mockContactPoints: ContactPoint[] = [
    {
      id: "1",
      leadId: lead.id,
      userId: "user1",
      contactType: ContactType.PHONE,
      outcome: ContactPointOutcome.NO_ANSWER,
      notes: "Called at 2:30 PM. Phone went straight to voicemail. Left a detailed message about our fitness programs.",
      contactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2", 
      leadId: lead.id,
      userId: "user1",
      contactType: ContactType.TEXT,
      outcome: ContactPointOutcome.INTERESTED,
      notes: "Sent text with program details. Prospect replied showing interest in personal training packages.",
      contactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      leadId: lead.id, 
      userId: "user1",
      contactType: ContactType.PHONE,
      outcome: ContactPointOutcome.SCHEDULED_APPOINTMENT,
      notes: "Great conversation! Scheduled consultation for this Friday at 3 PM. Very motivated to start their fitness journey.",
      contactDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  const handleLogContactPoint = (data: LogContactPointData) => {
    createContactPointMutation.mutate({
      leadId: lead.id,
      contactType: data.contactType,
      contactDate: data.contactDate,
      outcome: data.outcome,
      notes: data.notes,
    });
  };

  return (
    <div
      className={cn(
        "relative bg-surface-primary rounded-md border border-border-primary overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Status bar on left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusBarColor}`} />

      <div className="flex gap-[11px] items-start justify-start px-4 py-5">
        {/* Main content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Name and details */}
          <div className="text-text-body text-[20px] leading-[23px] font-normal">
            {lead.displayName}
            {lead.age && lead.gender && `: ${lead.age} yo ${lead.gender}`}
          </div>

          {/* Goals */}
          {lead.goals && (
            <div className="text-text-body text-[16px] leading-[24px]">
              Goals: {lead.goals}
            </div>
          )}

          {/* Contact info */}
          {(lead.phoneNumber || lead.email) && (
            <div className="text-text-body text-[16px] leading-[24px]">
              Contact:{" "}
              {[lead.phoneNumber, lead.email].filter(Boolean).join(" • ")}
            </div>
          )}

          {/* Next action */}
          <div className="flex gap-2 items-center">
            <span className="text-text-disabled text-[16px] leading-[24px]">
              Next:
            </span>
            <span className="text-text-body text-[16px] leading-[24px] font-semibold">
              {nextAction}
            </span>
            <Phone className="w-6 h-6 text-icon-body" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 items-start">
            <Button
              variant="secondary"
              size="default"
              className="bg-surface-action-secondary text-text-body hover:bg-surface-action-secondary/80 h-12 px-6 py-3 gap-3 font-semibold"
              onClick={() => setNotesModalOpen(true)}
            >
              <NotebookPen className="w-6 h-6" />
              Notes
            </Button>

            <Button
              variant="secondary"
              size="default"
              className="bg-surface-action-secondary text-text-body hover:bg-surface-action-secondary/80 h-12 px-6 py-3 gap-3 font-semibold"
            >
              <History className="w-6 h-6" />
              History
            </Button>

            <Button
              variant="secondary"
              size="default"
              className="bg-surface-action-secondary text-text-body hover:bg-surface-action-secondary/80 h-12 px-6 py-3 gap-3 font-semibold w-[137px]"
              onClick={() => setLogModalOpen(true)}
            >
              <MessageSquare className="w-6 h-6" />
              <Phone className="w-6 h-6" />
              Log
            </Button>
          </div>
        </div>

        {/* Status badge */}
        <Badge variant={lead.status}>{statusAgeText}</Badge>
      </div>

      {/* Modals */}
      <NotesModal
        open={notesModalOpen}
        onOpenChange={setNotesModalOpen}
        lead={lead}
        contactPoints={mockContactPoints}
        generalNotes="This prospect seems very motivated and has clear fitness goals. Follow up scheduled for Friday consultation."
        onGeneralNotesChange={() => {}}
        onSave={() => {}}
      />

      <LogContactPointModal
        open={logModalOpen}
        onOpenChange={setLogModalOpen}
        lead={lead}
        onSave={handleLogContactPoint}
        isLoading={createContactPointMutation.isPending}
      />
    </div>
  );

  function getStatusBarColor(status: LeadStatus): string {
    switch (status) {
      case LeadStatus.HOT:
        return "bg-red-500";
      case LeadStatus.WARM:
        return "bg-icon-warning";
      case LeadStatus.COLD:
        return "bg-blue-500";
      default:
        return "bg-border-warning";
    }
  }
}
