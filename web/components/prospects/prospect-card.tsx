"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  History,
  MessageSquare,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { Lead, LeadStatus } from "@/lib/types/lead";
import { NotesModal } from "@/components/contact-points/notes-modal";
import {
  LogContactPointModal,
  LogContactPointData,
} from "@/components/contact-points/log-phone-call-modal";
import {
  LogTextMessageModal,
  LogTextMessageData,
} from "@/components/contact-points/log-text-message-modal";
import { BookConsultationModal } from "@/components/consultations/book-consultation-modal";
import { useCreateContactPoint } from "@/lib/hooks/use-contact-points";
import { useCreateConsultation } from "@/lib/hooks/use-consultations";
import { CreateConsultationInput } from "@/lib/types/consultation";

export interface ProspectCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  lead: Lead;
  nextAction?: string;
  onShowNotes?: (lead: Lead) => void;
  selectedForNotes?: boolean;
}

export function ProspectCard({
  className,
  lead,
  nextAction = "First Call",
  onShowNotes,
  selectedForNotes = false,
  ...props
}: ProspectCardProps) {
  const [notesModalOpen, setNotesModalOpen] = React.useState(false);
  const [logModalOpen, setLogModalOpen] = React.useState(false);
  const [logTextModalOpen, setLogTextModalOpen] = React.useState(false);
  const [consultationModalOpen, setConsultationModalOpen] =
    React.useState(false);
  const createContactPointMutation = useCreateContactPoint();
  const createConsultationMutation = useCreateConsultation();
  const statusBarColor = getStatusBarColor(lead.status);
  const statusAgeText =
    lead.statusAgeDays === 0
      ? "Today"
      : lead.statusAgeDays === 1
      ? "1 day old"
      : `${lead.statusAgeDays} days old`;

  const handleLogContactPoint = (data: LogContactPointData) => {
    createContactPointMutation.mutate({
      leadId: lead.id,
      contactType: data.contactType,
      contactDate: data.contactDate,
      outcome: data.outcome,
      notes: data.notes,
    });
  };

  const handleLogTextMessage = (data: LogTextMessageData) => {
    createContactPointMutation.mutate({
      leadId: lead.id,
      contactType: data.contactType,
      contactDate: data.contactDate,
      outcome: data.outcome,
      notes: data.notes,
    });
  };

  const handleBookConsultation = (data: CreateConsultationInput) => {
    createConsultationMutation.mutate(data);
  };

  // Placeholder handlers for mobile action buttons
  const handleSendMessage = () => {
    console.log("Send message clicked for:", lead.displayName);
  };

  const handleCall = () => {
    console.log("Call clicked for:", lead.displayName);
  };

  return (
    <div
      className={cn(
        "relative bg-surface-primary rounded border border-border-primary overflow-hidden shadow-sm cursor-pointer",
        selectedForNotes ? "outline-2" : "",
        className
      )}
      onClick={() =>
        onShowNotes ? onShowNotes(lead) : setNotesModalOpen(true)
      }
      {...props}
    >
      {/* Status bar on left - hidden on mobile */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${statusBarColor} sm:block hidden`}
      />

      {/* Desktop Layout - hidden on mobile */}
      <div className="hidden sm:block">
        <div className="flex gap-[11px] items-start justify-start px-4 py-5">
          {/* Main content */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Name and details */}
            <div className="text-text-body text-[20px] leading-[23px] font-normal">
              {lead.displayName}
              {lead.age && lead.gender && `: ${lead.age} yo ${lead.gender}`}
            </div>

            {/* Next action */}
            <div className="flex gap-2 items-center">
              <span className="text-text-disabled text-[16px] leading-[24px]">
                Next:
              </span>
              <span className="text-text-body text-[16px] leading-[24px] font-semibold">
                {nextAction}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 items-start">
              <Button
                variant="secondary"
                size="default"
                onClick={(e) => {
                  e.stopPropagation();
                  setConsultationModalOpen(true);
                }}
              >
                <Calendar className="w-6 h-6" />
                Consult
              </Button>

              <Button
                variant="secondary"
                size="default"
                onClick={() => setLogModalOpen(true)}
              >
                <Phone className="w-6 h-6" />
                Log
              </Button>
              <Button
                variant="secondary"
                size="default"
                onClick={() => setLogTextModalOpen(true)}
              >
                <MessageSquare className="w-6 h-6" />
                Log
              </Button>
            </div>
          </div>

          {/* Status badge */}
          <Badge variant={lead.status}>{statusAgeText}</Badge>
        </div>
      </div>

      {/* Mobile Layout - visible on mobile only */}
      <div className="block sm:hidden">
        <div className="flex flex-col gap-[11px] px-4 py-5">
          {/* Header with name, badge, and more button */}
          <div className="flex gap-[11px]">
            {/* Main content */}
            <div className="flex-1 flex flex-col gap-4 min-w-0 justify-center">
              {/* Name */}
              <div className="text-text-body text-[20px] leading-[23px] font-normal">
                {lead.displayName}
              </div>
            </div>

            {/* Status badge and more button */}
            <div className="flex items-center gap-3">
              <Badge variant={lead.status}>{statusAgeText}</Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-3 rounded"
              >
                <MoreHorizontal className="w-6 h-6 text-icon-body" />
              </Button>
            </div>
          </div>
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

          {/* Actions section */}
          <div className="flex flex-col gap-2.5 w-full">
            {/* Notes button */}
            <Button
              variant="secondary"
              size="default"
              className="justify-center"
              onClick={() => setNotesModalOpen(true)}
            >
              <History className="w-6 h-6" />
              Notes
            </Button>

            {/* Log button */}
            <Button
              variant="secondary"
              size="default"
              className="justify-center"
              onClick={() => setLogModalOpen(true)}
            >
              <Phone className="w-6 h-6" />
              Log
            </Button>
            <Button
              variant="secondary"
              size="default"
              className="justify-center"
              onClick={() => setLogTextModalOpen(true)}
            >
              <MessageSquare className="w-6 h-6" />
              Log
            </Button>

            {/* Message and Call buttons */}
            <div className="flex gap-2.5 w-full">
              <a
                href="sms:0452289538?body=I'm%20interested%20in%20your%20services"
                className="flex-1"
              >
                <Button
                  className="w-full justify-center gap-3 px-6 py-3 h-12"
                  onClick={handleSendMessage}
                >
                  <MessageSquare className="w-6 h-6" />
                  Message
                </Button>
              </a>
              <a href="tel:0452289538" className="flex-1">
                <Button
                  className="w-full justify-center gap-3 px-6 py-3 h-12"
                  onClick={handleCall}
                >
                  <Phone className="w-6 h-6" />
                  Call
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NotesModal
        open={notesModalOpen}
        onOpenChange={setNotesModalOpen}
        lead={lead}
      />

      <LogContactPointModal
        open={logModalOpen}
        onOpenChange={setLogModalOpen}
        lead={lead}
        onSave={handleLogContactPoint}
        isLoading={createContactPointMutation.isPending}
      />

      <LogTextMessageModal
        open={logTextModalOpen}
        onOpenChange={setLogTextModalOpen}
        lead={lead}
        onSave={handleLogTextMessage}
        isLoading={createContactPointMutation.isPending}
      />

      <BookConsultationModal
        open={consultationModalOpen}
        onOpenChange={setConsultationModalOpen}
        lead={lead}
        onSave={handleBookConsultation}
        isLoading={createConsultationMutation.isPending}
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
