"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ContactHistoryCard } from "@/components/contact-points/contact-history-card";
import {
  NotebookPen,
  Save,
  PenLine,
  Clock,
  Calendar,
  Bell,
  BellOff,
} from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { TaskType } from "@/lib/types/task";
import { useContactPointsByLeadId } from "@/lib/hooks/use-contact-points";
import { useUpdateLead } from "@/lib/hooks/use-leads";
import { useNextFollowUpTask, useUpdateTask } from "@/lib/hooks/use-tasks";
import { useMessageTemplates } from "@/lib/hooks/use-message-templates";

export interface NotesSidePaneProps {
  lead: Lead | null;
  isVisible: boolean;
}

export function NotesSidePane({ lead, isVisible }: NotesSidePaneProps) {
  // Fetch contact points for this lead
  const { data: contactPointsData, isLoading: contactPointsLoading } =
    useContactPointsByLeadId(lead?.id || "");

  // Fetch next follow-up task for this lead
  const { data: nextTask, isLoading: taskLoading } = useNextFollowUpTask(
    lead?.id || ""
  );

  // Fetch message templates
  const { data: messageTemplates, isLoading: templatesLoading } =
    useMessageTemplates();

  // Hook for updating lead
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask();

  const contactPoints = contactPointsData?.contactPoints || [];
  const [editingNotes, setEditingNotes] = React.useState(false);
  const [localNotes, setLocalNotes] = React.useState(lead?.generalNotes || "");

  // Follow-up task editing states
  const [editingTask, setEditingTask] = React.useState(false);
  const [taskDescription, setTaskDescription] = React.useState("");
  const [taskType, setTaskType] = React.useState<TaskType>(TaskType.CALL);
  const [taskDueDate, setTaskDueDate] = React.useState("");
  const [taskDueTime, setTaskDueTime] = React.useState("");
  const [selectedTemplateId, setSelectedTemplateId] =
    React.useState<string>("");
  const [notificationEnabled, setNotificationEnabled] = React.useState(false);

  React.useEffect(() => {
    setLocalNotes(lead?.generalNotes || "");
  }, [lead?.generalNotes]);

  // Initialize task form when task loads
  React.useEffect(() => {
    if (nextTask) {
      setTaskDescription(nextTask.description || "");
      setTaskType(nextTask.taskType);
      const dueDate = new Date(nextTask.dueDate);
      setTaskDueDate(dueDate.toISOString().split("T")[0]);
      setTaskDueTime(dueDate.toTimeString().slice(0, 5));
      setSelectedTemplateId(nextTask.messageTemplateId || "");
      // In the future, we might want to check if notifications are enabled
      setNotificationEnabled(false);
    }
  }, [nextTask]);

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
  };

  // Check if there are changes to save
  const hasChanges = localNotes !== (lead?.generalNotes || "");

  // Check if task has changes
  const hasTaskChanges =
    nextTask &&
    (taskDescription !== (nextTask.description || "") ||
      taskType !== nextTask.taskType ||
      taskDueDate !== new Date(nextTask.dueDate).toISOString().split("T")[0] ||
      taskDueTime !== new Date(nextTask.dueDate).toTimeString().slice(0, 5) ||
      selectedTemplateId !== (nextTask.messageTemplateId || ""));

  // Format task type for display
  const formatTaskType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const handleSave = () => {
    if (!lead) return;

    updateLead(
      {
        leadId: lead.id,
        data: {
          generalNotes: localNotes,
        },
      },
      {
        onSuccess: () => {
          setEditingNotes(false);
        },
        onError: (error) => {
          console.error("Failed to save notes:", error);
        },
      }
    );
  };

  const handleTaskSave = () => {
    if (!nextTask || !taskDueDate || !taskDueTime) return;

    // Combine date and time
    const combinedDateTime = new Date(`${taskDueDate}T${taskDueTime}`);

    updateTask(
      {
        taskId: nextTask.id,
        data: {
          description: taskDescription.trim() || undefined,
          taskType: taskType,
          dueDate: combinedDateTime,
          messageTemplateId:
            taskType === TaskType.SEND_TEXT && selectedTemplateId
              ? selectedTemplateId
              : undefined,
        },
      },
      {
        onSuccess: () => {
          setEditingTask(false);
        },
        onError: (error) => {
          console.error("Failed to update task:", error);
        },
      }
    );
  };

  if (!isVisible || !lead) {
    return (
      <div className="w-full h-full bg-surface-primary rounded-lg border border-border-primary flex items-center justify-center">
        <div className="text-center text-text-disabled">
          <NotebookPen className="w-12 h-12 mx-auto mb-4 text-text-disabled/50" />
          <p className="text-lg font-medium">Select a prospect</p>
          <p className="text-sm">to view their notes and contact history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-surface-primary rounded-lg border border-border-primary flex flex-col">
      {/* Header */}
      <div className="bg-surface-primary p-4 border-b border-border-primary rounded-t-lg">
        <div className="flex items-center gap-3">
          <NotebookPen className="w-6 h-6 text-text-body" />
          <h2 className="text-[16px] leading-[24px] font-semibold text-black">
            {lead.displayName}
          </h2>
        </div>
      </div>

      {/* Body - Scrollable */}
      <div className="bg-surface-page p-4 flex-1 overflow-y-auto space-y-4">
        {/* Next Follow-Up Task */}
        <div className="bg-surface-primary p-4 rounded-lg space-y-4 relative">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-text-body" />
            <h3 className="text-[16px] leading-[24px] font-semibold text-black">
              Next Follow-Up Task
            </h3>
          </div>

          {taskLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-text-disabled/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-text-disabled/20 rounded w-1/2"></div>
            </div>
          ) : nextTask ? (
            <div className="space-y-3">
              {/* Task Info Display */}
              {!editingTask ? (
                <>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="text-[16px] leading-[24px] text-text-body">
                        <span className="font-bold">Type</span>:{" "}
                        {formatTaskType(nextTask.taskType)}
                      </div>
                      <div className="text-[16px] leading-[24px] text-text-body">
                        <span className="font-bold">Due</span>:{" "}
                        {formatDate(new Date(nextTask.dueDate))}
                      </div>
                      {nextTask.messageTemplateId && messageTemplates && (
                        <div className="text-[16px] leading-[24px] text-text-body">
                          <span className="font-bold">Template</span>:{" "}
                          {messageTemplates.find(
                            (t) => t.id === nextTask.messageTemplateId
                          )?.name || "Unknown"}
                        </div>
                      )}
                      {nextTask.description && (
                        <div className="text-[16px] leading-[24px] text-text-body">
                          <span className="font-bold">Description</span>:{" "}
                          {nextTask.description}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingTask(true)}
                      className="absolute bottom-2.5 right-3 p-1 hover:bg-surface-action-secondary rounded"
                    >
                      <PenLine className="w-6 h-6 text-text-disabled" />
                    </button>
                  </div>
                </>
              ) : (
                /* Task Edit Form */
                <div className="space-y-4">
                  {/* Task Type */}
                  <div className="space-y-2">
                    <label className="text-[14px] leading-[20px] font-medium text-text-body">
                      Task Type
                    </label>
                    <Select
                      value={taskType}
                      onValueChange={(value) => setTaskType(value as TaskType)}
                    >
                      <SelectTrigger className="text-[14px] leading-[20px]">
                        {formatTaskType(taskType)}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TaskType.CALL}>Call</SelectItem>
                        <SelectItem value={TaskType.SEND_TEXT}>
                          Send Text
                        </SelectItem>
                        <SelectItem value={TaskType.CONSULTATION}>
                          Consultation
                        </SelectItem>
                        <SelectItem value={TaskType.OTHER}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Task Description */}
                  <div className="space-y-2">
                    <label className="text-[14px] leading-[20px] font-medium text-text-body">
                      Task Description
                    </label>
                    <Input
                      type="text"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="text-[14px] leading-[20px]"
                      placeholder="Enter task description"
                    />
                  </div>
                  {/* Message Template (only for SEND_TEXT) */}
                  {taskType === TaskType.SEND_TEXT && (
                    <div className="space-y-2">
                      <label className="text-[14px] leading-[20px] font-medium text-text-body">
                        Message Template
                      </label>
                      {templatesLoading ? (
                        <div className="h-12 bg-text-disabled/20 rounded animate-pulse"></div>
                      ) : (
                        <Select
                          value={selectedTemplateId}
                          onValueChange={setSelectedTemplateId}
                        >
                          <SelectTrigger className="text-[14px] leading-[20px]">
                            {selectedTemplateId && messageTemplates
                              ? messageTemplates.find(
                                  (t) => t.id === selectedTemplateId
                                )?.name || "Select template"
                              : "Select template"}
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

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[14px] leading-[20px] font-medium text-text-body">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        className="text-[14px] leading-[20px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] leading-[20px] font-medium text-text-body">
                        Time
                      </label>
                      <Input
                        type="time"
                        value={taskDueTime}
                        onChange={(e) => setTaskDueTime(e.target.value)}
                        className="text-[14px] leading-[20px]"
                      />
                    </div>
                  </div>

                  {/* Notification Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setNotificationEnabled(!notificationEnabled)
                      }
                      className="flex items-center gap-2 text-[14px] leading-[20px] text-text-body hover:text-text-action"
                    >
                      {notificationEnabled ? (
                        <Bell className="w-4 h-4" />
                      ) : (
                        <BellOff className="w-4 h-4" />
                      )}
                      {notificationEnabled
                        ? "Notification enabled"
                        : "Enable notification"}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingTask(false);
                        // Reset form to original values
                        if (nextTask) {
                          setTaskDescription(nextTask.description || "");
                          setTaskType(nextTask.taskType);
                          const dueDate = new Date(nextTask.dueDate);
                          setTaskDueDate(dueDate.toISOString().split("T")[0]);
                          setTaskDueTime(dueDate.toTimeString().slice(0, 5));
                          setSelectedTemplateId(
                            nextTask.messageTemplateId || ""
                          );
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleTaskSave}
                      disabled={isUpdatingTask || !hasTaskChanges}
                    >
                      Save
                      <Save className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-text-disabled py-4">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-text-disabled/50" />
              <p className="text-[14px] leading-[20px]">
                No follow-up task scheduled
              </p>
            </div>
          )}
        </div>
        {/* Lead Summary */}
        <div className="bg-surface-primary p-4 rounded-lg space-y-4">
          <div className="text-[16px] leading-[24px] text-text-body">
            <span className="font-bold">Age</span>:{" "}
            {lead.age || "Not specified"}
          </div>

          <div className="text-[16px] leading-[24px] text-text-body">
            <span className="font-bold">Goals</span>:{" "}
            {lead.goals || "Not specified"}
          </div>
        </div>

        {/* Editable Text Area */}
        <div className="relative">
          <div className="bg-surface-primary p-3 rounded border border-border-primary min-h-[120px]">
            {editingNotes ? (
              <textarea
                value={localNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                onBlur={() => setEditingNotes(false)}
                className="w-full h-full min-h-[96px] resize-none border-none outline-none bg-transparent text-[16px] leading-[24px] text-text-body"
                placeholder="Add your notes here..."
                autoFocus
              />
            ) : (
              <div
                className="text-[16px] leading-[24px] text-text-body cursor-text min-h-[96px] whitespace-pre-wrap"
                onClick={() => setEditingNotes(true)}
              >
                {localNotes || "Add your notes here..."}
              </div>
            )}
          </div>
          {!editingNotes && (
            <button
              onClick={() => setEditingNotes(true)}
              className="absolute bottom-2.5 right-3 p-1 hover:bg-surface-action-secondary rounded"
            >
              <PenLine className="w-6 h-6 text-text-disabled" />
            </button>
          )}
        </div>

        {/* Save Button - Only shown when there are changes */}
        {hasChanges && (
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-surface-action text-text-on-action hover:bg-surface-action/90"
            >
              Save
              <Save className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Contact History Cards */}
        {contactPointsLoading ? (
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-surface-primary p-4 rounded-lg animate-pulse"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <div className="h-6 w-12 bg-text-disabled/20 rounded-full"></div>
                    <div className="h-6 w-16 bg-text-disabled/20 rounded-full"></div>
                  </div>
                  <div className="h-6 w-32 bg-text-disabled/20 rounded"></div>
                </div>
                <div className="h-4 bg-text-disabled/20 rounded w-full mb-2"></div>
                <div className="h-4 bg-text-disabled/20 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : contactPoints.length > 0 ? (
          <div className="space-y-2">
            {contactPoints.map((contactPoint) => (
              <ContactHistoryCard
                key={contactPoint.id}
                contactType={contactPoint.contactType}
                outcome={contactPoint.outcome}
                contactDate={contactPoint.contactDate}
                notes={contactPoint.notes}
                showNotes={true}
                showOutcomeBadge={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-surface-primary p-4 rounded-lg text-center text-text-disabled">
            No contact history yet
          </div>
        )}
      </div>
    </div>
  );
}
