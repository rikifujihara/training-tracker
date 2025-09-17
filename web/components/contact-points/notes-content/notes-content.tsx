"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { NotInterestedConfirmationModal } from "@/components/prospects/not-interested-confirmation-modal";
import { useNotesContent } from "./use-notes-content";
import { NotesEditor } from "./notes-editor";
import { TaskEditor } from "./task-editor";
import { ContactHistory } from "./contact-history";

export interface NotesContentProps {
  lead: Lead;
  variant: "modal" | "sidepane";
}

export function NotesContent({ lead, variant }: NotesContentProps) {
  const {
    // Data
    contactPoints,
    nextTask,
    messageTemplates,
    consultations,

    // Loading states
    contactPointsLoading,
    templatesLoading,
    consultationsLoading,
    isUpdating,
    isUpdatingTask,

    // Notes state
    editingNotes,
    setEditingNotes,
    localNotes,
    hasNotesChanges,
    handleNotesChange,
    handleSaveNotes,

    // Task state
    editingTask,
    setEditingTask,
    taskDescription,
    setTaskDescription,
    taskType,
    setTaskType,
    taskDueDate,
    setTaskDueDate,
    taskDueTime,
    setTaskDueTime,
    selectedTemplateId,
    setSelectedTemplateId,
    hasTaskChanges,
    handleSaveTask,

    // Not interested state
    notInterestedModalOpen,
    setNotInterestedModalOpen,
    handleMarkNotInterested,
    markNotInterestedMutation,
  } = useNotesContent(lead);

  // Responsive sizing based on variant
  const containerClasses =
    variant === "modal" ? "p-3 space-y-3" : "p-4 space-y-4";

  return (
    <div className={containerClasses}>
      {/* Notes Editor Section */}
      <NotesEditor
        lead={lead}
        variant={variant}
        editingNotes={editingNotes}
        setEditingNotes={setEditingNotes}
        localNotes={localNotes}
        hasNotesChanges={hasNotesChanges}
        isUpdating={isUpdating}
        onNotesChange={handleNotesChange}
        onSaveNotes={handleSaveNotes}
      />

      {/* Task Editor Section */}
      <TaskEditor
        variant={variant}
        nextTask={nextTask || null}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
        taskType={taskType}
        setTaskType={setTaskType}
        taskDueDate={taskDueDate}
        setTaskDueDate={setTaskDueDate}
        taskDueTime={taskDueTime}
        setTaskDueTime={setTaskDueTime}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        hasTaskChanges={hasTaskChanges || false}
        isUpdatingTask={isUpdatingTask}
        messageTemplates={messageTemplates}
        templatesLoading={templatesLoading}
        onSaveTask={handleSaveTask}
      />

      {/* Contact History Section */}
      <ContactHistory
        variant={variant}
        contactPoints={contactPoints}
        consultations={consultations}
        contactPointsLoading={contactPointsLoading}
        consultationsLoading={consultationsLoading}
      />

      {/* Not Interested Section */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={() => setNotInterestedModalOpen(true)}
          variant="destructive"
          size="sm"
          className="flex items-center space-x-2"
          disabled={markNotInterestedMutation.isPending}
        >
          <UserX className="h-4 w-4" />
          <span>Mark as Not Interested</span>
        </Button>
      </div>

      {/* Not Interested Confirmation Modal */}
      <NotInterestedConfirmationModal
        open={notInterestedModalOpen}
        onOpenChange={setNotInterestedModalOpen}
        onConfirm={handleMarkNotInterested}
        leadName={lead.displayName}
        isPending={markNotInterestedMutation.isPending}
      />
    </div>
  );
}