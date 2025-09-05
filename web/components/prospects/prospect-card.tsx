"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, NotebookPen, History, MessageSquare } from "lucide-react";

export interface ProspectCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  firstName?: string;
  lastName?: string;
  age?: string;
  gender?: string;
  goals?: string;
  interests?: string;
  nextAction?: string;
  statusBadgeType?: "status-hot" | "status-warm" | "status-cold";
  statusAge?: string;
}

export function ProspectCard({
  className,
  firstName,
  lastName,
  age,
  gender,
  goals,
  interests,
  nextAction = "First Call",
  statusBadgeType = "status-warm",
  statusAge = "1 day old",
  ...props
}: ProspectCardProps) {
  const name = parseName();
  return (
    <div
      className={cn(
        "relative bg-surface-primary rounded-md border border-border-primary overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Orange status bar on left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-border-warning" />

      <div className="flex gap-[11px] items-start justify-start px-4 py-5">
        {/* Main content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Name and details */}
          <div className="text-text-body text-[20px] leading-[23px] font-normal">
            {name}
            {age && gender && `: ${age} yo ${gender}`}
          </div>

          {/* Goals */}
          {goals && (
            <div className="text-text-body text-[16px] leading-[24px]">
              Goals: {goals}
            </div>
          )}

          {/* Interests */}
          {interests && (
            <div className="text-text-body text-[16px] leading-[24px]">
              Interests: {interests}
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
              Log
              <MessageSquare className="w-6 h-6" />
              <Phone className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Status badge */}
        <Badge variant={statusBadgeType}>{statusAge}</Badge>
      </div>
    </div>
  );

  function parseName() {
    return `${firstName ?? ""}${firstName && lastName ? " " : ""}${
      lastName ?? ""
    }`.trim();
  }
}
