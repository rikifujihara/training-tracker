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
import { useMessageTemplates } from "@/lib/hooks/use-message-templates";

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
  messageTemplateId?: string;
}

const contactTypeOptions = [
  { value: ContactType.PHONE, label: "Call", icon: Phone },
  { value: ContactType.TEXT, label: "Text", icon: MessageSquareText },
];

const outcomeOptions = [
  { value: ContactPointOutcome.SENT_MESSAGE, label: "Sent Message" },
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
  const [messageTemplateId, setMessageTemplateId] = React.useState<string>("");

  // Fetch message templates
  const { data: messageTemplates, isLoading: templatesLoading } =
    useMessageTemplates();

  React.useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setContactType(ContactType.PHONE);
      setOutcome(undefined);
      setNotes("");
      setContactDate(new Date());
      setMessageTemplateId("");
    }
  }, [open]);

  // Auto-set contact type to TEXT when "Sent Message" is selected
  React.useEffect(() => {
    if (outcome === ContactPointOutcome.SENT_MESSAGE) {
      setContactType(ContactType.TEXT);
    }
  }, [outcome]);

  // Auto-populate notes with template content when template is selected
  React.useEffect(() => {
    // Parse template content by replacing placeholders
    const parseTemplate = (template: string): string => {
      const firstName = lead.firstName || lead.displayName?.split(" ")[0] || "";
      const lastName = lead.lastName || lead.displayName?.split(" ").slice(1).join(" ") || "";
      const fullName = lead.displayName || "";

      let parsed = template;
      parsed = parsed.replace(/first_name/g, firstName);
      parsed = parsed.replace(/last_name/g, lastName);
      parsed = parsed.replace(/name/g, fullName);
      return parsed;
    };

    if (messageTemplateId && messageTemplates) {
      const selectedTemplate = messageTemplates.find(
        (t) => t.id === messageTemplateId
      );
      if (selectedTemplate) {
        const parsedContent = parseTemplate(selectedTemplate.content);
        setNotes(parsedContent);
      }
    } else if (
      messageTemplateId === "" &&
      outcome === ContactPointOutcome.SENT_MESSAGE
    ) {
      // Clear notes when template is deselected
      setNotes("");
    }
  }, [messageTemplateId, messageTemplates, lead, outcome]);

  const handleSave = () => {
    const data: LogContactPointData = {
      contactType,
      outcome,
      notes: notes,
      contactDate,
      messageTemplateId: messageTemplateId || undefined,
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
                  Log Reach Out
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
                        : "Please select an outcome"
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

            {/* Message Template - Only shown when "Sent Message" is selected */}
            {outcome === ContactPointOutcome.SENT_MESSAGE && (
              <div className="space-y-2">
                <Label htmlFor="messageTemplate">
                  Message Template (Optional)
                </Label>
                {templatesLoading ? (
                  <div className="h-12 bg-surface-primary border border-border-primary rounded animate-pulse"></div>
                ) : (
                  <Select
                    value={messageTemplateId}
                    onValueChange={setMessageTemplateId}
                  >
                    <SelectTrigger className="w-full h-12 bg-surface-primary border-border-primary">
                      <SelectValue
                        displayText={
                          messageTemplateId && messageTemplates
                            ? messageTemplates.find(
                                (t) => t.id === messageTemplateId
                              )?.name || "Select a template..."
                            : "Select a template..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No template</SelectItem>
                      {messageTemplates?.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  outcome === ContactPointOutcome.SENT_MESSAGE
                    ? "Add details about the message..."
                    : "Add details about the call..."
                }
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
