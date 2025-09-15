"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ContactHistoryCard } from "./contact-history-card";
import { Save, PenLine, Clock, Calendar, UserX } from "lucide-react";
import { Lead } from "@/lib/types/lead";
import { TaskType } from "@/lib/types/task";
import { useContactPointsByLeadId } from "@/lib/hooks/use-contact-points";
import { useMarkLeadNotInterested, useUpdateLead } from "@/lib/hooks/use-leads";
import { useNextFollowUpTask, useUpdateTask } from "@/lib/hooks/use-tasks";
import { useMessageTemplates } from "@/lib/hooks/use-message-templates";
import { useConsultations } from "@/lib/hooks/use-consultations";
import { NotInterestedConfirmationModal } from "@/components/prospects/not-interested-confirmation-modal";

export interface NotesContentProps {
  lead: Lead;
  variant: "modal" | "sidepane";
}

export function NotesContent({ lead, variant }: NotesContentProps) {
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

  // Fetch consultations for this lead
  const { data: consultations, isLoading: consultationsLoading } =
    useConsultations(lead?.id || "", false);

  // Hook for updating lead
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask();

  const markNotInterestedMutation = useMarkLeadNotInterested();

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

  // Not interested modal
  const [notInterestedModalOpen, setNotInterestedModalOpen] =
    React.useState(false);

  const handleMarkNotInterested = () => {
    markNotInterestedMutation.mutate(lead.id);
    setNotInterestedModalOpen(false);
  };

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

  // Helper function to get today's date string
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Helper function to get tomorrow's date string
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Check if selected date is today
  const isSelectedDateToday = taskDueDate === getTodayDateString();

  // Check if selected date is tomorrow
  const isSelectedDateTomorrow = taskDueDate === getTomorrowDateString();

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

  // Responsive sizing based on variant
  const containerClasses =
    variant === "modal" ? "p-3 space-y-3" : "p-4 space-y-4";

  const sectionClasses =
    variant === "modal"
      ? "bg-surface-primary p-3 rounded-lg space-y-3"
      : "bg-surface-primary p-4 rounded-lg space-y-4";

  const inputClasses =
    variant === "modal" ? "text-[14px] h-10" : "text-[16px] h-12";

  return (
    <div className={`flex-1 overflow-y-auto ${containerClasses}`}>
      {/* Next Follow-Up Task */}
      <div className={sectionClasses}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-text-body" />
          <h3
            className={`font-semibold text-black ${
              variant === "modal"
                ? "text-[14px] leading-[20px]"
                : "text-[16px] leading-[24px]"
            }`}
          >
            Next Follow-Up Task
          </h3>
        </div>

        {taskLoading ? (
          <div className="animate-pulse">
            <div className="h-3 bg-text-disabled/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-text-disabled/20 rounded w-1/2"></div>
          </div>
        ) : nextTask ? (
          <div className="space-y-2">
            {!editingTask ? (
              <>
                <div className="space-y-1">
                  <div
                    className={`text-text-body ${
                      variant === "modal"
                        ? "text-[14px] leading-[20px]"
                        : "text-[16px] leading-[24px]"
                    }`}
                  >
                    <span className="font-bold">Type</span>:{" "}
                    {formatTaskType(nextTask.taskType)}
                  </div>
                  <div
                    className={`text-text-body ${
                      variant === "modal"
                        ? "text-[14px] leading-[20px]"
                        : "text-[16px] leading-[24px]"
                    }`}
                  >
                    <span className="font-bold">Due</span>:{" "}
                    {formatDate(new Date(nextTask.dueDate))}
                  </div>
                  {nextTask.messageTemplateId && messageTemplates && (
                    <div
                      className={`text-text-body ${
                        variant === "modal"
                          ? "text-[14px] leading-[20px]"
                          : "text-[16px] leading-[24px]"
                      }`}
                    >
                      <span className="font-bold">Template</span>:{" "}
                      {messageTemplates.find(
                        (t) => t.id === nextTask.messageTemplateId
                      )?.name || "Unknown"}
                    </div>
                  )}
                  {nextTask.description && (
                    <div
                      className={`text-text-body ${
                        variant === "modal"
                          ? "text-[14px] leading-[20px]"
                          : "text-[16px] leading-[24px]"
                      }`}
                    >
                      <span className="font-bold">Description</span>:{" "}
                      {nextTask.description}
                    </div>
                  )}
                </div>
                <Button
                  size={variant === "modal" ? "sm" : "default"}
                  className="w-full"
                  onClick={() => setEditingTask(true)}
                >
                  Update follow up
                </Button>
              </>
            ) : (
              /* Task Edit Form */
              <div className="space-y-3">
                {/* Task Type */}
                <div className="space-y-1">
                  <label
                    className={`font-medium text-text-body ${
                      variant === "modal"
                        ? "text-[12px] leading-[16px]"
                        : "text-[14px] leading-[20px]"
                    }`}
                  >
                    Task Type
                  </label>
                  <Select
                    value={taskType}
                    onValueChange={(value) => {
                      const newTaskType = value as TaskType;
                      setTaskType(newTaskType);
                      if (newTaskType !== TaskType.SEND_TEXT) {
                        setSelectedTemplateId("");
                      }
                    }}
                  >
                    <SelectTrigger className={inputClasses}>
                      {formatTaskType(taskType)}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TaskType.CALL}>Call</SelectItem>
                      <SelectItem value={TaskType.SEND_TEXT}>
                        Send Text
                      </SelectItem>
                      <SelectItem value={TaskType.OTHER}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Task Description */}
                <div className="space-y-1">
                  <label
                    className={`font-medium text-text-body ${
                      variant === "modal"
                        ? "text-[12px] leading-[16px]"
                        : "text-[14px] leading-[20px]"
                    }`}
                  >
                    Description
                  </label>
                  <Input
                    type="text"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className={inputClasses}
                    placeholder="Enter task description"
                  />
                </div>

                {/* Message Template (only for SEND_TEXT) */}
                {taskType === TaskType.SEND_TEXT && (
                  <div className="space-y-1">
                    <label
                      className={`font-medium text-text-body ${
                        variant === "modal"
                          ? "text-[12px] leading-[16px]"
                          : "text-[14px] leading-[20px]"
                      }`}
                    >
                      Message Template
                    </label>
                    {templatesLoading ? (
                      <div
                        className={`${
                          inputClasses.includes("h-10") ? "h-10" : "h-12"
                        } bg-text-disabled/20 rounded animate-pulse`}
                      ></div>
                    ) : (
                      <Select
                        value={selectedTemplateId}
                        onValueChange={setSelectedTemplateId}
                      >
                        <SelectTrigger className={inputClasses}>
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
                <div className="space-y-2">
                  <div
                    className={
                      variant === "modal"
                        ? "grid grid-cols-2 gap-2"
                        : "flex gap-4"
                    }
                  >
                    <div className="space-y-1 flex-1">
                      <label
                        className={`font-medium text-text-body ${
                          variant === "modal"
                            ? "text-[12px] leading-[16px]"
                            : "text-[14px] leading-[20px]"
                        }`}
                      >
                        Date
                      </label>
                      <Input
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        className={`${inputClasses} max-w-full min-w-0`}
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <label
                        className={`font-medium text-text-body ${
                          variant === "modal"
                            ? "text-[12px] leading-[16px]"
                            : "text-[14px] leading-[20px]"
                        }`}
                      >
                        Time
                      </label>
                      <Input
                        type="time"
                        value={taskDueTime}
                        onChange={(e) => setTaskDueTime(e.target.value)}
                        className={`${inputClasses} max-w-full min-w-0`}
                      />
                    </div>
                  </div>

                  {/* Quick Date Selection */}
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={isSelectedDateToday ? "default" : "outline"}
                      className="flex-1 text-xs"
                      onClick={() => setTaskDueDate(getTodayDateString())}
                    >
                      Today
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={isSelectedDateTomorrow ? "default" : "outline"}
                      className="flex-1 text-xs"
                      onClick={() => setTaskDueDate(getTomorrowDateString())}
                    >
                      Tomorrow
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => {
                        if (taskDueDate) {
                          const currentDate = new Date(taskDueDate);
                          currentDate.setDate(currentDate.getDate() + 1);
                          setTaskDueDate(
                            currentDate.toISOString().split("T")[0]
                          );
                        }
                      }}
                      disabled={!taskDueDate}
                    >
                      +1 Day
                    </Button>
                  </div>
                </div>

                {/* Notification Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notification"
                    checked={notificationEnabled}
                    onCheckedChange={(checked) =>
                      setNotificationEnabled(checked === true)
                    }
                  />
                  <label
                    htmlFor="notification"
                    className={`font-normal text-text-body cursor-pointer ${
                      variant === "modal"
                        ? "text-[12px] leading-[16px]"
                        : "text-[14px] leading-[20px]"
                    }`}
                  >
                    Send me a notification
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size={variant === "modal" ? "sm" : "default"}
                    variant="ghost"
                    className="flex-1"
                    onClick={() => {
                      setEditingTask(false);
                      if (nextTask) {
                        setTaskDescription(nextTask.description || "");
                        setTaskType(nextTask.taskType);
                        const dueDate = new Date(nextTask.dueDate);
                        setTaskDueDate(dueDate.toISOString().split("T")[0]);
                        setTaskDueTime(dueDate.toTimeString().slice(0, 5));
                        setSelectedTemplateId(nextTask.messageTemplateId || "");
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size={variant === "modal" ? "sm" : "default"}
                    className="flex-1"
                    onClick={handleTaskSave}
                    disabled={isUpdatingTask || !hasTaskChanges}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-text-disabled py-3">
            <Calendar className="w-6 h-6 mx-auto mb-1 text-text-disabled/50" />
            <p
              className={
                variant === "modal"
                  ? "text-[12px] leading-[16px]"
                  : "text-[14px] leading-[20px]"
              }
            >
              No follow-up task scheduled
            </p>
          </div>
        )}
      </div>

      {/* Consultations */}
      <div className={sectionClasses}>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text-body" />
          <h3
            className={`font-semibold text-black ${
              variant === "modal"
                ? "text-[14px] leading-[20px]"
                : "text-[16px] leading-[24px]"
            }`}
          >
            Consultations
          </h3>
        </div>

        {consultationsLoading ? (
          <div className="space-y-2">
            <div className="bg-surface-page p-2 rounded-lg animate-pulse">
              <div className="h-3 bg-text-disabled/20 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-text-disabled/20 rounded w-1/2"></div>
            </div>
          </div>
        ) : consultations && consultations.length > 0 ? (
          <div className="space-y-2">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-surface-page p-2 rounded-lg space-y-1"
              >
                <div
                  className={`text-text-body ${
                    variant === "modal"
                      ? "text-[12px] leading-[16px]"
                      : "text-[14px] leading-[20px]"
                  }`}
                >
                  <span className="font-bold">Scheduled</span>:{" "}
                  {formatDate(new Date(consultation.scheduledTime))}
                </div>
                <div
                  className={`text-text-body ${
                    variant === "modal"
                      ? "text-[12px] leading-[16px]"
                      : "text-[14px] leading-[20px]"
                  }`}
                >
                  <span className="font-bold">Duration</span>:{" "}
                  {consultation.durationMinutes} minutes
                </div>
                <div
                  className={`text-text-body ${
                    variant === "modal"
                      ? "text-[12px] leading-[16px]"
                      : "text-[14px] leading-[20px]"
                  }`}
                >
                  <span className="font-bold">Status</span>:{" "}
                  <span
                    className={`px-1 py-0.5 rounded text-xs ${
                      consultation.status === "SCHEDULED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {consultation.status}
                  </span>
                </div>
                {consultation.outcome && (
                  <div
                    className={`text-text-body ${
                      variant === "modal"
                        ? "text-[12px] leading-[16px]"
                        : "text-[14px] leading-[20px]"
                    }`}
                  >
                    <span className="font-bold">Outcome</span>:{" "}
                    <span
                      className={`px-1 py-0.5 rounded text-xs ${
                        consultation.outcome === "CONVERTED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {consultation.outcome}
                    </span>
                  </div>
                )}
                {consultation.notes && (
                  <div
                    className={`text-text-body ${
                      variant === "modal"
                        ? "text-[12px] leading-[16px]"
                        : "text-[14px] leading-[20px]"
                    }`}
                  >
                    <span className="font-bold">Notes</span>:{" "}
                    {consultation.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-text-disabled py-3">
            <Calendar className="w-6 h-6 mx-auto mb-1 text-text-disabled/50" />
            <p
              className={
                variant === "modal"
                  ? "text-[12px] leading-[16px]"
                  : "text-[14px] leading-[20px]"
              }
            >
              No consultations scheduled
            </p>
          </div>
        )}
      </div>

      {/* Lead Summary */}
      <div
        className={sectionClasses
          .replace("space-y-3", "space-y-2")
          .replace("space-y-4", "space-y-2")}
      >
        <div
          className={`text-text-body ${
            variant === "modal"
              ? "text-[14px] leading-[20px]"
              : "text-[16px] leading-[24px]"
          }`}
        >
          <span className="font-bold">Age</span>: {lead.age || "Not specified"}
        </div>
        <div
          className={`text-text-body ${
            variant === "modal"
              ? "text-[14px] leading-[20px]"
              : "text-[16px] leading-[24px]"
          }`}
        >
          <span className="font-bold">Goals</span>:{" "}
          {lead.goals || "Not specified"}
        </div>
      </div>

      {/* Editable Text Area */}
      <div className="relative">
        <div
          className={`bg-surface-primary p-${
            variant === "modal" ? "3" : "4"
          } rounded border border-border-primary min-h-[100px]`}
        >
          {editingNotes ? (
            <textarea
              value={localNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              onBlur={() => setEditingNotes(false)}
              className={`w-full h-full min-h-[76px] resize-none border-none outline-none bg-transparent text-text-body ${
                variant === "modal"
                  ? "text-[14px] leading-[20px]"
                  : "text-[16px] leading-[24px]"
              }`}
              placeholder="Add your notes here..."
              autoFocus
            />
          ) : (
            <div
              className={`text-text-body cursor-text min-h-[76px] whitespace-pre-wrap ${
                variant === "modal"
                  ? "text-[14px] leading-[20px]"
                  : "text-[16px] leading-[24px]"
              }`}
              onClick={() => setEditingNotes(true)}
            >
              {localNotes || "Add your notes here..."}
            </div>
          )}
        </div>
        {!editingNotes && (
          <button
            onClick={() => setEditingNotes(true)}
            className="absolute bottom-2 right-2 p-1 hover:bg-surface-action-secondary rounded"
          >
            <PenLine className="w-4 h-4 text-text-disabled" />
          </button>
        )}
      </div>

      {/* Save Button - Only shown when there are changes */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            size={variant === "modal" ? "sm" : "default"}
            className="bg-surface-action text-text-on-action hover:bg-surface-action/90"
          >
            Save
            <Save className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Contact History Cards */}
      {contactPointsLoading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className={`bg-surface-primary p-${
                variant === "modal" ? "3" : "4"
              } rounded-lg animate-pulse`}
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
        <div
          className={`bg-surface-primary p-${
            variant === "modal" ? "3" : "4"
          } rounded-lg text-center text-text-disabled`}
        >
          No contact history yet
        </div>
      )}

      <hr></hr>
      {/* Not Interested Button */}
      <div className="flex justify-center sm:justify-end">
        <Button
          variant="destructive"
          size={variant === "modal" ? "sm" : "default"}
          onClick={() => setNotInterestedModalOpen(true)}
          className="max-sm:w-full"
        >
          <UserX className="w-4 h-4 mr-2" />
          Not Interested
        </Button>
      </div>

      {/* Not Interested Confirmation Modal */}
      <NotInterestedConfirmationModal
        open={notInterestedModalOpen}
        onOpenChange={setNotInterestedModalOpen}
        onConfirm={handleMarkNotInterested}
        isPending={markNotInterestedMutation.isPending}
        leadName={lead.displayName}
      />
    </div>
  );
}
