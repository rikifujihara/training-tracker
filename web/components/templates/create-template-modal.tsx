"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { useCreateTemplate } from "@/lib/hooks/use-message-templates";

export interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (templateData: { name: string; message: string }) => void;
}

export function CreateTemplateModal({
  open,
  onOpenChange,
  onSave,
}: CreateTemplateModalProps) {
  const [templateName, setTemplateName] = useState("");
  const [messageText, setMessageText] = useState(
    "Hi first_name, just a quick reminder of our movement screen at 2pm. See you then! -Riki"
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const createTemplateMutation = useCreateTemplate();

  // Function to generate preview with placeholder substitution
  const generatePreview = (text: string) => {
    return text.replace(/\bfirst_name\b/g, "John");
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);

  const handleSave = () => {
    if (!templateName.trim() || !messageText.trim()) {
      return; // Don't save if fields are empty
    }

    createTemplateMutation.mutate(
      {
        name: templateName.trim(),
        content: messageText.trim(),
      },
      {
        onSuccess: () => {
          // Call the optional onSave callback
          if (onSave) {
            onSave({ name: templateName, message: messageText });
          }
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Failed to create template:", error);
          // TODO: Show error toast/notification
        },
      }
    );
  };

  const handleClear = () => {
    setTemplateName("");
    setMessageText("");
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setTemplateName("");
      setMessageText(
        "Hi first_name, just a quick reminder of our movement screen at 2pm. See you then!"
      );
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent
          className="w-[95vw] max-w-6xl max-h-[95vh] p-0 gap-0 rounded-lg overflow-hidden"
          showCloseButton={false}
        >
          {/* Header */}
          <DialogHeader className="bg-surface-primary p-4 border-b-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-text-body" />
                <DialogTitle className="text-[16px] leading-[24px] font-semibold text-black">
                  Create Message Template
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

          {/* Body - Scrollable */}
          <div className="bg-surface-page p-4 flex-1 overflow-y-auto max-h-[calc(95vh-200px)]">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Template Editor */}
              <div className="bg-surface-primary p-6 rounded-lg space-y-6">
                {/* Template Name */}
                <div className="space-y-3">
                  <Label htmlFor="template-name" className="text-base">
                    Name
                  </Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>

                {/* Message Content */}
                <div className="space-y-3">
                  {/* <Label htmlFor="message-content" className="text-base">
                    Content
                  </Label> */}
                  <div className="flex items-start gap-2 p-4 bg-surface-action-hover-2 rounded-md border-l-4 border-surface-action">
                    <div className="flex-1">
                      <p className="text-sm text-text-body">
                        Use{" "}
                        <code className="bg-white px-2 py-1 rounded text-sm font-mono">
                          first_name
                        </code>{" "}
                        and we&apos;ll fill it in for you.
                      </p>
                    </div>
                  </div>
                  <textarea
                    ref={textareaRef}
                    id="message-content"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Enter your message template with variables like first_name"
                    className="flex min-h-48 w-full rounded-md border border-input bg-transparent px-4 py-3 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Preview - Hidden on mobile */}
              <div className="bg-surface-primary p-6 rounded-lg space-y-6 hidden lg:block">
                <h3 className="font-semibold text-text-headings text-lg">
                  Preview
                </h3>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="p-5 bg-surface-action-secondary rounded-md border min-h-48">
                      <p className="text-text-body whitespace-pre-wrap leading-relaxed text-base">
                        {generatePreview(messageText) ||
                          "Your message preview will appear here..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-surface-primary p-4 border-t-0">
            <div className="flex items-center justify-end gap-2.5 w-full">
              <Button 
                variant="secondary" 
                onClick={handleClear}
                disabled={createTemplateMutation.isPending}
              >
                Clear
              </Button>
              <Button 
                onClick={handleSave}
                disabled={createTemplateMutation.isPending || !templateName.trim() || !messageText.trim()}
              >
                {createTemplateMutation.isPending ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
