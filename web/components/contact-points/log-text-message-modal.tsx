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
import { MessageSquareText, X, Save } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { ContactType, ContactPointOutcome } from "@/lib/types/contactPoint";
import { useMessageTemplates } from "@/lib/hooks/use-message-templates";

export interface LogTextMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSave?: (data: LogTextMessageData) => void;
  isLoading?: boolean;
}

export interface LogTextMessageData {
  contactType: ContactType;
  outcome?: ContactPointOutcome;
  notes?: string;
  contactDate: Date;
}

const CUSTOM_TEMPLATE_ID = "custom";

export function LogTextMessageModal({
  open,
  onOpenChange,
  lead,
  onSave,
  isLoading = false,
}: LogTextMessageModalProps) {
  const [outcome, setOutcome] = React.useState<
    ContactPointOutcome | undefined
  >();
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("");
  const [customNotes, setCustomNotes] = React.useState("");
  const [contactDate, setContactDate] = React.useState(new Date());

  // Fetch message templates
  const { data: templates = [], isLoading: templatesLoading } =
    useMessageTemplates();

  React.useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setOutcome(undefined);
      setSelectedTemplate("");
      setCustomNotes("");
      setContactDate(new Date());
    }
  }, [open]);

  const selectedTemplateData = templates.find(
    (template) => template.id === selectedTemplate
  );

  const isCustomSelected = selectedTemplate === CUSTOM_TEMPLATE_ID;
  const showNotesTextarea = isCustomSelected;

  const handleSave = () => {
    let notes: string | undefined;

    if (isCustomSelected) {
      notes = customNotes.trim() || undefined;
    } else if (selectedTemplateData) {
      // Use the template content as notes, with first_name substitution
      notes = selectedTemplateData.content.replace(
        /\bfirst_name\b/g,
        lead.firstName || "there"
      );
    }

    const data: LogTextMessageData = {
      contactType: ContactType.TEXT,
      outcome,
      notes,
      contactDate,
    };
    onSave?.(data);
    onOpenChange(false);
  };

  const canSave =
    selectedTemplate && (isCustomSelected ? customNotes.trim() : true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60" />
        <DialogContent
          className="max-w-[440px] p-0 gap-0 rounded-lg overflow-hidden"
          showCloseButton={false}
        >
          {/* Header */}
          <DialogHeader className="bg-surface-primary p-4 border-b-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <MessageSquareText className="w-6 h-6 text-text-body" />
                <DialogTitle className="text-[16px] leading-[24px] font-semibold text-black">
                  Log Text Message
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
          <div className="min-h-[400px] bg-surface-page p-4 flex-1 space-y-6">
            {/* Lead Summary */}
            <div className="bg-surface-primary p-4 rounded-lg">
              <h3 className="text-[16px] leading-[24px] font-semibold text-text-body">
                {lead.displayName}{" "}
                {lead.age && lead.gender && `${lead.age}, ${lead.gender}`}
              </h3>
            </div>

            {/* Message Template Selection */}
            <div className="space-y-2">
              <Label htmlFor="template">Message Sent</Label>
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
                disabled={templatesLoading}
              >
                <SelectTrigger className="w-full h-12 bg-surface-primary border-border-primary">
                  <SelectValue
                    displayText={
                      templatesLoading
                        ? "Loading templates..."
                        : selectedTemplate === CUSTOM_TEMPLATE_ID
                        ? "Custom Message"
                        : selectedTemplateData?.name ||
                          "Select a message template"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CUSTOM_TEMPLATE_ID}>
                    Custom Message
                  </SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Notes - Only shown when "Custom" is selected */}
            {showNotesTextarea && (
              <div className="space-y-2">
                <Label htmlFor="notes">Custom Message</Label>
                <textarea
                  id="notes"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Enter your custom message..."
                  className="w-full min-h-[96px] p-3 bg-surface-primary border border-border-primary rounded resize-none text-[16px] leading-[24px] text-text-body placeholder:text-text-disabled"
                />
              </div>
            )}
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
                disabled={isLoading || !canSave}
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
