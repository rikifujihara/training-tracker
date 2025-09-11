"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTemplateModal } from "@/components/templates/create-template-modal";
import {
  EditTemplateModal,
  MessageTemplate,
} from "@/components/templates/edit-template-modal";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import {
  useMessageTemplates,
  useDeleteTemplate,
} from "@/lib/hooks/use-message-templates";

export default function TemplatesPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<MessageTemplate | null>(
    null
  );
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Fetch templates using our hook
  const { data: templates = [], isLoading, error } = useMessageTemplates();
  const deleteTemplateMutation = useDeleteTemplate();

  const handleEditClick = (template: MessageTemplate) => {
    setTemplateToEdit(template);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (templateId: string) => {
    setTemplateToDelete(templateId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      deleteTemplateMutation.mutate(templateToDelete, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setTemplateToDelete(null);
        },
        onError: (error) => {
          console.error("Failed to delete template:", error);
          // TODO: Show error toast/notification
        },
      });
    }
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

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading templates: {error.message}
            </div>
          </CardContent>
        </Card>
      ) : templates.length > 0 ? (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start max-sm:flex-col max-sm:gap-4 max-sm:items-end">
                  <div>
                    <h3 className="font-semibold text-text-headings mb-2">
                      {template.name}
                    </h3>
                    <p className="text-text-body text-sm line-clamp-2">
                      {template.content}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditClick(template)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteClick(template.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
      />

      {/* Edit Template Modal */}
      <EditTemplateModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        template={templateToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Are you sure you want to delete this template?"
        description=""
        deleteLabel="Delete template"
        onConfirm={handleDeleteConfirm}
        isPending={deleteTemplateMutation.isPending}
      />
    </div>
  );
}
