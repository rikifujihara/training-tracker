"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  const [templateName, setTemplateName] = useState("Appointment reminder");
  const [messageText, setMessageText] = useState(
    "Hi first_name, just a quick reminder of our movement screen at 2pm. See you then! -Riki"
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (onSave) {
      onSave({ name: templateName, message: messageText });
    }
    onOpenChange(false);
  };

  const handleClear = () => {
    setTemplateName("");
    setMessageText("");
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setTemplateName("Appointment reminder");
      setMessageText(
        "Hi first_name, just a quick reminder of our movement screen at 2pm. See you then! -Riki"
      );
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl">
            Create Message Template
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 lg:grid-cols-2 overflow-auto flex-1 pr-2">
          {/* Template Editor */}
          <div className="space-y-8">
            <div>
              {/* Template Name */}
              <div className="space-y-3 mb-8">
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
                <Label htmlFor="message-content" className="text-base">
                  Content
                </Label>
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
                  className="flex min-h-30 w-full rounded-md border border-input bg-transparent px-4 py-3 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Preview - Hidden on mobile */}
          <div className="space-y-8 hidden lg:block">
            <div>
              <h3 className="font-semibold text-text-headings text-lg mb-6">
                Preview
              </h3>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Template Name</Label>
                  <div className="p-4 bg-surface-action-secondary rounded-md border">
                    <p className="font-semibold text-text-headings text-base">
                      {templateName || "Untitled Template"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Message Preview</Label>
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

        <DialogFooter className="pt-8">
          <Button
            variant="secondary"
            onClick={handleClear}
            className="h-12 px-8"
          >
            Clear
          </Button>
          <Button onClick={handleSave} className="h-12 px-8">
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
