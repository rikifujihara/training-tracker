"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, NotebookPen, History, MessageSquare } from "lucide-react";

export enum LeadStatus {
  HOT = "status-hot",
  WARM = "status-warm",
  COLD = "status-cold",
}

export interface Lead {
  id: string;
  firstName: string | null;
  lastName: string | null;
  age: string | null;
  gender: string | null;
  goals: string | null;
  phoneNumber: string | null;
  email: string | null;
  createdAt: Date;
  importedAt: Date;
}

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
  const name = parseName();
  const { statusBadgeType, statusAge } = getLeadStatus();
  const statusBarColor = getStatusBarColor(statusBadgeType);
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
            {name}
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
            >
              <MessageSquare className="w-6 h-6" />
              <Phone className="w-6 h-6" />
              Log
            </Button>
          </div>
        </div>

        {/* Status badge */}
        <Badge variant={statusBadgeType}>{statusAge}</Badge>
      </div>
    </div>
  );

  function parseName() {
    return `${lead.firstName ?? ""}${
      lead.firstName && lead.lastName ? " " : ""
    }${lead.lastName ?? ""}`.trim();
  }

  function getLeadStatus(): {
    statusBadgeType: LeadStatus;
    statusAge: string;
  } {
    const now = new Date();
    const createdAt = new Date(lead.createdAt);
    const diffInMs = now.getTime() - createdAt.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Less than 24 hours old - hot lead
    if (diffInHours < 24) {
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return {
          statusBadgeType: LeadStatus.HOT,
          statusAge:
            diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes old`,
        };
      }
      return {
        statusBadgeType: LeadStatus.HOT,
        statusAge:
          diffInHours === 1 ? "1 hour old" : `${diffInHours} hours old`,
      };
    }

    // 1-3 days old - warm lead
    if (diffInDays <= 3) {
      return {
        statusBadgeType: LeadStatus.WARM,
        statusAge: diffInDays === 1 ? "1 day old" : `${diffInDays} days old`,
      };
    }

    // Older than 3 days - cold lead
    return {
      statusBadgeType: LeadStatus.COLD,
      statusAge: `${diffInDays} days old`,
    };
  }

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
