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
import { MessageSquare, X } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { useMessageTemplates } from "@/lib/hooks/use-message-templates";

export interface MobileMessageModalProps {
  open: boolean;
  // this is so we know whether to default to 'sent message'
  setWasMessageTemplateSelected: (open: boolean) => void;
  setMessageTemplateId: (data: string) => void;
  onOpenChange: (open: boolean) => void;
  setLogModalOpen: (open: boolean) => void;
  lead: Lead;
}

export function MobileMessageModal({
  open,
  setWasMessageTemplateSelected,
  setMessageTemplateId,
  onOpenChange,
  setLogModalOpen,
  lead,
}: MobileMessageModalProps) {
  const { data: messageTemplates, isLoading: templatesLoading } =
    useMessageTemplates();

  // Parse template content by replacing firstName placeholder
  const parseTemplate = (template: string): string => {
    const firstName = lead.firstName || lead.displayName?.split(" ")[0] || "";
    return template.replace(/first_name/g, firstName);
  };

  // Handle SMS link generation
  const handleSendSMS = (templateContent?: string) => {
    if (!lead.phoneNumber) {
      console.warn("No phone number available for lead:", lead.displayName);
      return;
    }

    const phoneNumber = lead.phoneNumber;
    let smsUrl = `sms:${phoneNumber}`;

    if (templateContent) {
      const parsedMessage = parseTemplate(templateContent);
      const encodedMessage = encodeURIComponent(parsedMessage);
      smsUrl += `?body=${encodedMessage}`;
    }

    // Open SMS app
    window.location.href = smsUrl;

    // Close modal
    onOpenChange(false);
    // Open log contact point modal
    setLogModalOpen(true);
    setWasMessageTemplateSelected(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent
          className="max-w-[440px] p-0 gap-0 rounded-lg overflow-hidden max-h-[90vh]"
          showCloseButton={false}
        >
          {/* Header */}
          <DialogHeader className="bg-surface-primary p-4 border-b-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-text-body" />
                <DialogTitle className="text-[16px] leading-[24px] font-semibold text-black">
                  Select Message Template
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
          <div className="bg-surface-page p-4 flex-1 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Lead Summary */}
            <div className="bg-surface-primary p-4 rounded-lg">
              <h3 className="text-[16px] leading-[24px] font-semibold text-text-body">
                {lead.displayName}{" "}
                {lead.age && lead.gender && `${lead.age}, ${lead.gender}`}
              </h3>
              {lead.phoneNumber && (
                <p className="text-[14px] leading-[20px] text-text-disabled mt-1">
                  {lead.phoneNumber}
                </p>
              )}
            </div>

            {/* Template List */}
            <div className="space-y-2">
              {templatesLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-16 bg-surface-primary rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : messageTemplates && messageTemplates.length > 0 ? (
                <div className="space-y-2">
                  {/* No Template Option */}
                  <Button
                    variant="outline"
                    className="w-full h-auto justify-start text-left p-4"
                    onClick={() => handleSendSMS()}
                  >
                    <div className="flex flex-col items-start w-full">
                      <span className="font-semibold text-[16px] leading-[24px]">
                        No Template
                      </span>
                      <span className="w-full overflow-ellipsis text-sm text-text-disabled mt-1 line-clamp-2">
                        Send blank message
                      </span>
                    </div>
                  </Button>
                  {messageTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className="w-full h-auto p-4 justify-start text-left"
                      onClick={() => {
                        setMessageTemplateId(template.id);
                        handleSendSMS(template.content);
                      }}
                    >
                      <div className="flex flex-col items-start w-full">
                        <span className="font-semibold text-[16px] leading-[24px]">
                          {template.name}
                        </span>
                        <span className="w-full overflow-ellipsis text-sm text-text-disabled mt-1 line-clamp-2">
                          {parseTemplate(template.content)}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-disabled text-[14px] leading-[20px]">
                    No message templates available
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
