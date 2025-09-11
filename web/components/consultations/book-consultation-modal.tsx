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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar, X, Save, Clock } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { CreateConsultationInput } from "@/lib/types/consultation";
import { useMessageTemplates } from "@/lib/hooks/use-message-templates";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [scheduledTime, setScheduledTime] = React.useState<Date>(new Date());
  const [notes, setNotes] = React.useState("");
  const [messageTemplateId, setMessageTemplateId] = React.useState<string | undefined>(undefined);
  const [reminderEnabled, setReminderEnabled] = React.useState(false);
  const [reminderTime, setReminderTime] = React.useState<Date | undefined>(undefined);

  // Fetch message templates
  const { data: messageTemplates, isLoading: templatesLoading } = useMessageTemplates();

  React.useEffect(() => {
    if (open) {
      // Reset form when modal opens
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0); // Default to 10 AM tomorrow
      
      setScheduledTime(tomorrow);
      setNotes("");
      setMessageTemplateId(undefined);
      setReminderEnabled(false);
      setReminderTime(undefined);
    }
  }, [open]);

  React.useEffect(() => {
    // Set reminder time to 30 minutes before scheduled time when enabled
    if (reminderEnabled) {
      const reminderDate = new Date(scheduledTime);
      reminderDate.setMinutes(reminderDate.getMinutes() - 30);
      setReminderTime(reminderDate);
    } else {
      setReminderTime(undefined);
    }
  }, [reminderEnabled, scheduledTime]);

  const handleSave = () => {
    const data: CreateConsultationInput = {
      leadId: lead.id,
      scheduledTime,
      notes: notes.trim() || undefined,
      messageTemplateId: messageTemplateId || undefined,
      reminderTime,
    };
    onSave?.(data);
    onOpenChange(false);
  };

  // Format date for datetime-local input
  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setScheduledTime(new Date(value));
    }
  };

  // Helper function to get today's date with time
  const getTodayDateTime = (): Date => {
    const today = new Date();
    today.setHours(10, 0, 0, 0); // Default to 10 AM
    return today;
  };

  // Helper function to get tomorrow's date with time
  const getTomorrowDateTime = (): Date => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0); // Default to 10 AM
    return tomorrow;
  };

  // Check if selected date is today
  const isSelectedDateToday = (): boolean => {
    const today = new Date();
    const scheduledDate = new Date(scheduledTime);
    
    return (
      scheduledDate.getFullYear() === today.getFullYear() &&
      scheduledDate.getMonth() === today.getMonth() &&
      scheduledDate.getDate() === today.getDate()
    );
  };

  // Check if selected date is tomorrow
  const isSelectedDateTomorrow = (): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const scheduledDate = new Date(scheduledTime);
    
    return (
      scheduledDate.getFullYear() === tomorrow.getFullYear() &&
      scheduledDate.getMonth() === tomorrow.getMonth() &&
      scheduledDate.getDate() === tomorrow.getDate()
    );
  };

  const selectedTemplate = messageTemplates?.find(t => t.id === messageTemplateId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent
          className="max-w-[440px] p-0 gap-0 rounded-lg overflow-hidden"
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
          <div className="bg-surface-page p-4 flex-1 space-y-6">
            {/* Lead Summary */}
            <div className="bg-surface-primary p-4 rounded-lg">
              <h3 className="text-[16px] leading-[24px] font-semibold text-text-body">
                {lead.displayName}{" "}
                {lead.age && lead.gender && `${lead.age}, ${lead.gender}`}
              </h3>
            </div>

            {/* Scheduled Time */}
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Scheduled Time</Label>
              <input
                id="scheduledTime"
                type="datetime-local"
                value={formatDateTimeLocal(scheduledTime)}
                onChange={handleDateTimeChange}
                className="w-full h-12 p-3 bg-surface-primary border border-border-primary rounded text-[16px] leading-[24px] text-text-body"
              />
              
              {/* Quick Date Selection Buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={isSelectedDateToday() ? "default" : "outline"}
                  onClick={() => {
                    setScheduledTime(getTodayDateTime());
                  }}
                >
                  Today
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={isSelectedDateTomorrow() ? "default" : "outline"}
                  onClick={() => {
                    setScheduledTime(getTomorrowDateTime());
                  }}
                >
                  Tomorrow
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const nextDay = new Date(scheduledTime);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setScheduledTime(nextDay);
                  }}
                >
                  +1 Day
                </Button>
              </div>
            </div>

            {/* Message Template */}
            <div className="space-y-2">
              <Label htmlFor="messageTemplate">Message Template (Optional)</Label>
              <Select
                value={messageTemplateId}
                onValueChange={(value) => setMessageTemplateId(value)}
              >
                <SelectTrigger className="w-full h-12 bg-surface-primary border-border-primary">
                  <SelectValue
                    displayText={
                      selectedTemplate
                        ? selectedTemplate.name
                        : "Select a message template..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {templatesLoading ? (
                    <SelectItem value="loading">
                      Loading templates...
                    </SelectItem>
                  ) : messageTemplates?.length ? (
                    messageTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-templates">
                      No templates available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Reminder */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminderEnabled"
                  checked={reminderEnabled}
                  onCheckedChange={(checked) => setReminderEnabled(checked === true)}
                />
                <Label 
                  htmlFor="reminderEnabled"
                  className="text-[16px] leading-[24px] font-normal text-text-body cursor-pointer"
                >
                  Send reminder 30 minutes before
                </Label>
              </div>
              {reminderEnabled && reminderTime && (
                <div className="flex items-center gap-2 text-sm text-text-disabled">
                  <Clock className="w-4 h-4" />
                  <span>
                    Reminder will be sent at {reminderTime.toLocaleString()}
                  </span>
                </div>
              )}
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