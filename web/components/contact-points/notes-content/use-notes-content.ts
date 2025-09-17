import * as React from "react";
import { Lead } from "@/lib/types/lead";
import { TaskType } from "@/lib/types/task";
import { useContactPointsByLeadId } from "@/lib/hooks/use-contact-points";
import { useMarkLeadNotInterested, useUpdateLead } from "@/lib/hooks/use-leads";
import { useNextFollowUpTask, useUpdateTask } from "@/lib/hooks/use-tasks";
import { useMessageTemplates } from "@/lib/hooks/use-message-templates";
import { useConsultations } from "@/lib/hooks/use-consultations";
import { formatDateForInput, formatTimeForInput } from "@/lib/utils/date";

export function useNotesContent(lead: Lead) {
  // Data fetching hooks
  const { data: contactPointsData, isLoading: contactPointsLoading } =
    useContactPointsByLeadId(lead?.id || "");

  const { data: nextTask, isLoading: taskLoading } = useNextFollowUpTask(
    lead?.id || ""
  );

  const { data: messageTemplates, isLoading: templatesLoading } =
    useMessageTemplates();

  const { data: consultations, isLoading: consultationsLoading } =
    useConsultations(lead?.id || "", false);

  // Mutation hooks
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask();
  const markNotInterestedMutation = useMarkLeadNotInterested();

  // Notes state
  const [editingNotes, setEditingNotes] = React.useState(false);
  const [localNotes, setLocalNotes] = React.useState(lead?.generalNotes || "");

  // Task editing states
  const [editingTask, setEditingTask] = React.useState(false);
  const [taskDescription, setTaskDescription] = React.useState("");
  const [taskType, setTaskType] = React.useState<TaskType>(TaskType.CALL);
  const [taskDueDate, setTaskDueDate] = React.useState("");
  const [taskDueTime, setTaskDueTime] = React.useState("");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("");

  // Not interested modal state
  const [notInterestedModalOpen, setNotInterestedModalOpen] = React.useState(false);

  // Update local notes when lead changes
  React.useEffect(() => {
    setLocalNotes(lead?.generalNotes || "");
  }, [lead?.generalNotes]);

  // Initialize task form when task loads
  React.useEffect(() => {
    if (nextTask) {
      setTaskDescription(nextTask.description || "");
      setTaskType(nextTask.taskType);
      const dueDate = new Date(nextTask.dueDate);
      setTaskDueDate(formatDateForInput(dueDate));
      setTaskDueTime(formatTimeForInput(dueDate));
      setSelectedTemplateId(nextTask.messageTemplateId || "");
    }
  }, [nextTask]);

  // Computed values
  const contactPoints = contactPointsData?.contactPoints || [];
  const hasNotesChanges = localNotes !== (lead?.generalNotes || "");

  const hasTaskChanges =
    nextTask &&
    (taskDescription !== (nextTask.description || "") ||
      taskType !== nextTask.taskType ||
      taskDueDate !== formatDateForInput(new Date(nextTask.dueDate)) ||
      taskDueTime !== formatTimeForInput(new Date(nextTask.dueDate)) ||
      selectedTemplateId !== (nextTask.messageTemplateId || ""));

  // Action handlers
  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
  };

  const handleSaveNotes = () => {
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

  const handleSaveTask = () => {
    if (!nextTask || !taskDueDate || !taskDueTime) return;

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

  const handleMarkNotInterested = () => {
    markNotInterestedMutation.mutate(lead.id);
    setNotInterestedModalOpen(false);
  };

  return {
    // Data
    contactPoints,
    nextTask,
    messageTemplates,
    consultations,

    // Loading states
    contactPointsLoading,
    taskLoading,
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
  };
}