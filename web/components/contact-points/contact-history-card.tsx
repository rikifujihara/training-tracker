"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquareText, Trash2 } from "lucide-react";
import { ContactType, ContactPointOutcome } from "@/lib/types/contactPoint";
import { formatDateTimeLongAustralian } from "@/lib/utils/date";
import { useDeleteContactPoint } from "@/lib/hooks/use-contact-points";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

export interface ContactHistoryCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  contactType: ContactType;
  outcome?: ContactPointOutcome | null;
  contactDate: Date | string;
  notes?: string | null;
  showNotes?: boolean;
  showOutcomeBadge?: boolean;
  onDelete?: () => void;
}

const contactTypeConfig = {
  [ContactType.PHONE]: {
    icon: Phone,
    label: "Call",
    bgColor: "bg-icon-information",
  },
  [ContactType.TEXT]: {
    icon: MessageSquareText,
    label: "Text",
    bgColor: "bg-icon-information",
  },
};

const outcomeConfig: Record<
  ContactPointOutcome,
  { label: string; bgColor: string }
> = {
  [ContactPointOutcome.SENT_MESSAGE]: {
    label: "Sent Message",
    bgColor: "bg-surface-action",
  },
  [ContactPointOutcome.NO_ANSWER]: {
    label: "No Answer",
    bgColor: "bg-surface-action",
  },
  [ContactPointOutcome.NOT_INTERESTED]: {
    label: "Not Interested",
    bgColor: "bg-destructive",
  },
  [ContactPointOutcome.REQUESTED_CALLBACK]: {
    label: "Callback Requested",
    bgColor: "bg-icon-warning",
  },
  [ContactPointOutcome.INTERESTED]: {
    label: "Interested",
    bgColor: "bg-green-500",
  },
  [ContactPointOutcome.SCHEDULED_APPOINTMENT]: {
    label: "Scheduled",
    bgColor: "bg-green-600",
  },
  [ContactPointOutcome.LEFT_VOICEMAIL]: {
    label: "Left Voicemail",
    bgColor: "bg-surface-action",
  },
  [ContactPointOutcome.BUSY]: { label: "Busy", bgColor: "bg-yellow-500" },
};

export function ContactHistoryCard({
  className,
  id,
  contactType,
  outcome,
  contactDate,
  notes,
  showNotes = true,
  showOutcomeBadge = true,
  onDelete,
  ...props
}: ContactHistoryCardProps) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteContactPoint = useDeleteContactPoint();

  const typeConfig = contactTypeConfig[contactType];
  const TypeIcon = typeConfig.icon;

  const handleDelete = () => {
    deleteContactPoint.mutate(id, {
      onSuccess: () => {
        onDelete?.();
      },
    });
  };

  return (
    <>
      <div
        className={cn(
          "bg-surface-primary rounded-lg p-4 flex flex-col gap-4 border border-border relative",
          className
        )}
        {...props}
      >
        {/* Delete button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 w-8 h-8 p-0 text-text-disabled hover:text-destructive hover:bg-destructive/10"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        {/* Header with badges and date */}
        <div className="flex items-start justify-between w-full max-sm:flex-col-reverse gap-2 pr-10">
        <div className="flex flex-col gap-2 items-start">
          {/* Contact type badge */}
          <Badge variant="default" className={cn(typeConfig.bgColor)}>
            <TypeIcon className="w-4 h-4" />
            {typeConfig.label}
          </Badge>

          {/* Outcome badge */}
          {showOutcomeBadge && outcome && (
            <Badge
              variant="default"
              className={cn(outcomeConfig[outcome].bgColor)}
            >
              {outcomeConfig[outcome].label}
            </Badge>
          )}
        </div>

        {/* Date */}
        <div className="text-text-disabled text-[16px] leading-[24px] font-normal">
          {formatDateTimeLongAustralian(contactDate)}
        </div>
      </div>

        {/* Notes */}
        {showNotes && notes && (
          <div className="text-text-body text-[16px] leading-[24px] font-normal w-full">
            {notes}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete contact point?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        isPending={deleteContactPoint.isPending}
      />
    </>
  );
}
