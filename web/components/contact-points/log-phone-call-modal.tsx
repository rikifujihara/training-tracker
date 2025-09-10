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
import { Phone, MessageSquareText, X, Save } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { ContactType, ContactPointOutcome } from "@/lib/types/contactPoint";

export interface LogContactPointModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSave?: (data: LogContactPointData) => void;
  isLoading?: boolean;
}

export interface LogContactPointData {
  contactType: ContactType;
  outcome?: ContactPointOutcome;
  notes?: string;
  contactDate: Date;
}

const contactTypeOptions = [
  { value: ContactType.PHONE, label: "Call", icon: Phone },
  { value: ContactType.TEXT, label: "Text", icon: MessageSquareText },
];

const outcomeOptions = [
  { value: ContactPointOutcome.NO_ANSWER, label: "No Answer" },
  { value: ContactPointOutcome.LEFT_VOICEMAIL, label: "Left Voicemail" },
  { value: ContactPointOutcome.BUSY, label: "Busy" },
  { value: ContactPointOutcome.NOT_INTERESTED, label: "Not Interested" },
  { value: ContactPointOutcome.INTERESTED, label: "Interested" },
  {
    value: ContactPointOutcome.REQUESTED_CALLBACK,
    label: "Callback Requested",
  },
  {
    value: ContactPointOutcome.SCHEDULED_APPOINTMENT,
    label: "Scheduled Appointment",
  },
];

export function LogContactPointModal({
  open,
  onOpenChange,
  lead,
  onSave,
  isLoading = false,
}: LogContactPointModalProps) {
  const [contactType, setContactType] = React.useState<ContactType>(
    ContactType.PHONE
  );
  const [outcome, setOutcome] = React.useState<
    ContactPointOutcome | undefined
  >();
  const [notes, setNotes] = React.useState("");
  const [contactDate, setContactDate] = React.useState(new Date());

  React.useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setContactType(ContactType.PHONE);
      setOutcome(undefined);
      setNotes("");
      setContactDate(new Date());
    }
  }, [open]);

  const handleSave = () => {
    const data: LogContactPointData = {
      contactType,
      outcome,
      notes: notes.trim() || undefined,
      contactDate,
    };
    onSave?.(data);
    onOpenChange(false);
  };

  const selectedContactTypeConfig = contactTypeOptions.find(
    (opt) => opt.value === contactType
  );
  const SelectedIcon = selectedContactTypeConfig?.icon || Phone;

  const selectedCallOutcome = outcomeOptions.find(
    (opt) => opt.value === outcome
  );

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
                <SelectedIcon className="w-6 h-6 text-text-body" />
                <DialogTitle className="text-[16px] leading-[24px] font-semibold text-black">
                  Log Phone Call
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

            {/* Outcome */}
            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Select
                value={outcome}
                onValueChange={(value) =>
                  setOutcome(value as ContactPointOutcome)
                }
              >
                <SelectTrigger className="w-full h-12 bg-surface-primary border-border-primary">
                  <SelectValue
                    displayText={
                      selectedCallOutcome
                        ? selectedCallOutcome.label
                        : "Please select a call outcome"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {outcomeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add details about the call..."
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
                Save
                <Save className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
