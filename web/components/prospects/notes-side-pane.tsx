"use client";

import * as React from "react";
import { NotebookPen } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { NotesContent } from "../contact-points/notes-content";

export interface NotesSidePaneProps {
  lead: Lead;
}

export function NotesSidePane({ lead }: NotesSidePaneProps) {
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
      <div className="bg-surface-page flex-1 overflow-hidden flex flex-col">
        <NotesContent lead={lead} variant="sidepane" />
      </div>
    </div>
  );
}
