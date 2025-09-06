"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquareText } from "lucide-react";
import { ContactType, ContactPointOutcome } from "@/lib/types/contactPoint";

export interface ContactHistoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
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

const outcomeConfig: Record<ContactPointOutcome, { label: string; bgColor: string }> = {
  [ContactPointOutcome.NO_ANSWER]: { label: "No Answer", bgColor: "bg-surface-action" },
  [ContactPointOutcome.NOT_INTERESTED]: { label: "Not Interested", bgColor: "bg-destructive" },
  [ContactPointOutcome.REQUESTED_CALLBACK]: { label: "Callback Requested", bgColor: "bg-icon-warning" },
  [ContactPointOutcome.INTERESTED]: { label: "Interested", bgColor: "bg-green-500" },
  [ContactPointOutcome.SCHEDULED_APPOINTMENT]: { label: "Scheduled", bgColor: "bg-green-600" },
  [ContactPointOutcome.LEFT_VOICEMAIL]: { label: "Left Voicemail", bgColor: "bg-surface-action" },
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

  const formatDate = (date: Date | string) => {
    // Ensure we have a valid Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj);
  };

  return (
    <div
      className={cn(
        "bg-surface-primary rounded-lg p-4 flex flex-col gap-4",
        className
      )}
      {...props}
    >
      {/* Header with badges and date */}
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-2 items-center">
          {/* Contact type badge */}
          <Badge
            variant="default"
            className={cn(
              "px-1.5 py-0 h-6 gap-1 rounded-[50px] text-[12px] leading-[20px] font-normal text-text-on-action",
              typeConfig.bgColor
            )}
          >
            <TypeIcon className="w-4 h-4" />
            {typeConfig.label}
          </Badge>

          {/* Outcome badge */}
          {showOutcomeBadge && outcome && (
            <Badge
              variant="default"
              className={cn(
                "px-1.5 py-0 h-6 rounded-[50px] text-[12px] leading-[20px] font-normal text-text-on-action",
                outcomeConfig[outcome].bgColor
              )}
            >
              {outcomeConfig[outcome].label}
            </Badge>
          )}
        </div>

        {/* Date */}
        <div className="text-text-disabled text-[16px] leading-[24px] font-normal">
          {formatDate(contactDate)}
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