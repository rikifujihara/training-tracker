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
import { Label } from "@/components/ui/label";
import { Calendar, X, Save } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { CreateConsultationInput } from "@/lib/types/consultation";
import {
  formatDateForInput,
  getTodayFormatted,
  getTomorrowFormatted,
  combineDateAndTime,
} from "@/lib/utils/date";
import { Input } from "@/components/ui/input";

export interface BookConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSave?: (data: CreateConsultationInput) => void;
  isLoading?: boolean;
}

export function BookConsultationModal({
  open,
  onOpenChange,
  lead,
  onSave,
  isLoading = false,
}: BookConsultationModalProps) {
  const [scheduledDate, setScheduledDate] = React.useState<string>("");
  const [scheduledTime, setScheduledTime] = React.useState<string>("");
  const [durationMinutes, setDurationMinutes] = React.useState<number>(60);
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setScheduledDate(getTomorrowFormatted()); // Default to tomorrow
      setScheduledTime("10:00"); // Default to 10 AM
      setDurationMinutes(60); // Default to 60 minutes
      setNotes("");
    }
  }, [open]);

  const handleSave = () => {
    if (!scheduledDate || !scheduledTime) return;

    const scheduledDateTime = combineDateAndTime(scheduledDate, scheduledTime);
    const data: CreateConsultationInput = {
      leadId: lead.id,
      scheduledTime: scheduledDateTime,
      durationMinutes,
      notes: notes.trim() || undefined,
    };
    onSave?.(data);
    onOpenChange(false);
  };

  // Helper functions for date comparisons
  const isSelectedDateToday = scheduledDate === getTodayFormatted();
  const isSelectedDateTomorrow = scheduledDate === getTomorrowFormatted();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent
          className="max-w-[440px]  p-0 gap-0 rounded-lg overflow-hidden"
          showCloseButton={false}
        >
          {/* Header */}
          <DialogHeader className="bg-surface-primary p-4 border-b-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-text-body" />
                <DialogTitle className="text-[16px] leading-[24px] font-semibold text-black">
                  Book Consultation
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

          {/* Body */}
          <div className="bg-surface-page max-h-[70vh] max-sm:max-h-[60vh] overflow-y-auto p-4 flex-1 space-y-6">
            {/* Lead Summary */}
            <div className="bg-surface-primary p-4 rounded-lg">
              <h3 className="text-[16px] leading-[24px] font-semibold text-text-body">
                {lead.displayName}{" "}
                {lead.age && lead.gender && `${lead.age}, ${lead.gender}`}
              </h3>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="text-[16px] h-12 bg-surface-primary"
              />

              {/* Quick Date Selection Buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={isSelectedDateToday ? "default" : "outline"}
                  onClick={() => setScheduledDate(getTodayFormatted())}
                >
                  Today
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={isSelectedDateTomorrow ? "default" : "outline"}
                  onClick={() => setScheduledDate(getTomorrowFormatted())}
                >
                  Tomorrow
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (scheduledDate) {
                      const currentDate = new Date(scheduledDate);
                      currentDate.setDate(currentDate.getDate() + 1);
                      setScheduledDate(formatDateForInput(currentDate));
                    }
                  }}
                  disabled={!scheduledDate}
                >
                  +1 Day
                </Button>
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Time</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="text-[16px] h-12 bg-surface-primary w-full"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>

              {/* Quick Duration Selection Buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={durationMinutes === 30 ? "default" : "outline"}
                  onClick={() => setDurationMinutes(30)}
                >
                  30 mins
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={durationMinutes === 45 ? "default" : "outline"}
                  onClick={() => setDurationMinutes(45)}
                >
                  45 mins
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={durationMinutes === 60 ? "default" : "outline"}
                  onClick={() => setDurationMinutes(60)}
                >
                  60 mins
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add details about the consultation..."
                className="w-full min-h-[96px] p-3 bg-surface-primary border border-border-primary rounded resize-none text-[16px] leading-[24px] text-text-body placeholder:text-text-disabled"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-surface-primary p-4 border-t-0">
            <div className="flex items-center justify-end gap-2.5 w-full">
              <Button
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="bg-surface-action-secondary text-text-body hover:bg-surface-action-secondary/80 px-6 py-3"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-surface-action text-text-on-action hover:bg-surface-action/90 px-6 py-3 min-h-12 min-w-12"
              >
                Book Consultation
                <Save className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
