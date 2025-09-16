"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquareText } from "lucide-react";
import { ContactType, ContactPointOutcome } from "@/lib/types/contactPoint";
import { formatDateTimeLongAustralian } from "@/lib/utils/date";

export interface ContactHistoryCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  contactType: ContactType;
  outcome?: ContactPointOutcome | null;
  contactDate: Date | string;
  notes?: string | null;
  showNotes?: boolean;
  showOutcomeBadge?: boolean;
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
  contactType,
  outcome,
  contactDate,
  notes,
  showNotes = true,
  showOutcomeBadge = true,
  ...props
}: ContactHistoryCardProps) {
  const typeConfig = contactTypeConfig[contactType];
  const TypeIcon = typeConfig.icon;

  // Removed local formatDate function - using imported Australian formatter

  return (
    <div
      className={cn(
        "bg-surface-primary rounded-lg p-4 flex flex-col gap-4",
        className
      )}
      {...props}
    >
      {/* Header with badges and date */}
      <div className="flex items-start justify-between w-full max-sm:flex-col-reverse gap-2">
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
  );
}
