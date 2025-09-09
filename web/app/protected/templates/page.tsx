"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTemplateModal } from "@/components/templates/create-template-modal";

export default function TemplatesPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Mock data - empty for now since no backend is hooked up yet
  const templates: Array<{ id: string; name: string; message: string }> = [];

  const handleSaveTemplate = (templateData: {
    name: string;
    message: string;
  }) => {
    console.log("Template saved:", templateData);
    // TODO: Here we'll implement the actual save logic later
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start max-sm:flex-col max-sm:gap-3">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-text-headings mb-2">
            Message Templates
          </h1>
          <p className="text-text-body">
            Create and manage your message templates with dynamic variables.
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus size={20} />
          Create Template
        </Button>
      </div>

      {/* Templates List or Empty State */}
      {templates.length > 0 ? (
        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id}>
              {/* Template cards will go here - matching prospect-card design */}
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-surface-action-secondary rounded-full flex items-center justify-center mb-6">
                <Plus size={32} className="text-icon-body" />
              </div>
              <h3 className="text-xl font-semibold text-text-headings mb-2">
                No templates yet
              </h3>
              <p className="text-text-body mb-6 max-w-md mx-auto">
                Create your first message template to streamline your client
                communication.
              </p>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus size={20} />
                Create Your First Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Template Modal */}
      <CreateTemplateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}
