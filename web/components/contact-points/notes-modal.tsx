"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { NotebookPen, X } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { NotesContent } from "./notes-content";

export interface NotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

export function NotesModal({ open, onOpenChange, lead }: NotesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent
          className="max-w-[95vw] w-full max-h-[95vh] p-0 gap-0 rounded-lg overflow-hidden sm:max-w-[440px] flex flex-col"
          showCloseButton={false}
        >
          {/* Header */}
          <DialogHeader className="bg-surface-primary p-4 border-b-0 flex-shrink-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <NotebookPen className="w-6 h-6 text-text-body" />
                <DialogTitle className="text-[16px] leading-[24px] font-semibold text-black">
                  Notes
                </DialogTitle>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 p-3 rounded-lg hover:bg-surface-action-secondary"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          {/* Body - Scrollable Content */}
          <div className="bg-surface-page flex-1 overflow-y-auto flex flex-col max-h-[60vh]">
            <NotesContent lead={lead} variant="modal" />
          </div>

          {/* Footer */}
          <div className="bg-surface-primary p-3 border-t-0 flex-shrink-0">
            <div className="flex items-center justify-end w-full">
              <Button
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
