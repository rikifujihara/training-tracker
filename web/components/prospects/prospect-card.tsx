"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  MessageSquare,
  MoreHorizontal,
  Calendar,
  UserX,
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
import { MobileMessageModal } from "@/components/prospects/mobile-message-modal";
import { NotInterestedConfirmationModal } from "@/components/prospects/not-interested-confirmation-modal";
import { useCreateContactPoint } from "@/lib/hooks/use-contact-points";
import { useCreateConsultation } from "@/lib/hooks/use-consultations";
import { useMarkLeadNotInterested } from "@/lib/hooks/use-leads";
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
  const [mobileMessageModalOpen, setMobileMessageModalOpen] =
    React.useState(false);
  const [notInterestedModalOpen, setNotInterestedModalOpen] =
    React.useState(false);
  const createContactPointMutation = useCreateContactPoint();
  const createConsultationMutation = useCreateConsultation();
  const markNotInterestedMutation = useMarkLeadNotInterested();
  const statusBarColor = getStatusBarColor(lead.status);

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

  // Handler for mobile message button
  const handleSendMessage = () => {
    setMobileMessageModalOpen(true);
  };

  const handleCall = () => {
    console.log("Call clicked for:", lead.displayName);
  };

  const handleMarkNotInterested = () => {
    markNotInterestedMutation.mutate(lead.id);
    setNotInterestedModalOpen(false);
  };

  return (
    <div
      className={cn(
        "relative bg-surface-primary rounded border border-border-primary overflow-hidden shadow-sm cursor-pointer",
        selectedForNotes ? "sm:outline-2" : "",
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
                Book
              </Button>

              <Button
                variant="secondary"
                size="default"
                onClick={() => setLogModalOpen(true)}
              >
                <Phone className="w-6 h-6" />
                Log
              </Button>
            </div>
          </div>

          {/* more button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-6 w-6 p-3 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-6 h-6 text-icon-body" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setNotInterestedModalOpen(true);
                }}
                className="text-destructive focus:text-destructive"
              >
                <UserX className="mr-2 h-4 w-4" />
                Not interested
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Layout - visible on mobile only */}
      <div className="block sm:hidden" onClick={() => setNotesModalOpen(true)}>
        <div className="flex flex-col gap-[11px] px-4 py-5">
          {/* Header with name, badge, and more button */}
          <div className="flex gap-[11px]">
            {/* Main content */}
            <div className="flex-1 flex flex-col gap-4 min-w-0 justify-center">
              {/* Name */}
              <div className="text-text-body text-[20px] leading-[23px] font-normal flex justify-between">
                {lead.displayName}
                <MoreHorizontal />
              </div>
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
              onClick={(e) => {
                e.stopPropagation();
                setConsultationModalOpen(true);
              }}
            >
              <Calendar className="w-6 h-6" />
              Book
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

            {/* Message and Call buttons */}
            <div className="flex gap-2.5 w-full">
              <Button
                className="flex-1 w-full justify-center gap-3 px-6 py-3 h-12"
                onClick={handleSendMessage}
              >
                <MessageSquare className="w-6 h-6" />
                Message
              </Button>
              <a href={`tel:${lead.phoneNumber || ""}`} className="flex-1">
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

      <MobileMessageModal
        open={mobileMessageModalOpen}
        onOpenChange={setMobileMessageModalOpen}
        lead={lead}
      />

      <NotInterestedConfirmationModal
        open={notInterestedModalOpen}
        onOpenChange={setNotInterestedModalOpen}
        onConfirm={handleMarkNotInterested}
        isPending={markNotInterestedMutation.isPending}
        leadName={lead.displayName}
      />
    </div>
  );

  function getStatusBarColor(status: LeadStatus): string {
    switch (status) {
      case LeadStatus.PROSPECT:
        return "bg-blue-500"; // Default prospect color
      case LeadStatus.NOT_INTERESTED:
        return "bg-gray-400";
      case LeadStatus.CONVERTED:
        return "bg-green-500";
      default:
        return "bg-border-warning";
    }
  }
}
