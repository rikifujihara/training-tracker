"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ListCheck,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  FileText,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DummyTask } from "@/components/tasks/task-card";
import { TaskType, TaskStatus } from "@/lib/types/task";

export interface TaskDetailSidePaneProps {
  task: DummyTask | null;
  isVisible: boolean;
}

export function TaskDetailSidePane({
  task,
  isVisible,
}: TaskDetailSidePaneProps) {
  if (!isVisible || !task) {
    return (
      <div className="w-full h-full bg-surface-primary rounded-lg border border-border-primary flex items-center justify-center">
        <div className="text-center text-text-disabled">
          <ListCheck className="w-12 h-12 mx-auto mb-4 text-text-disabled/50" />
          <p className="text-lg font-medium">Select a task</p>
          <p className="text-sm">to view details and take actions</p>
        </div>
      </div>
    );
  }

  const statusBarColor = getStatusBarColor(task.status, task.isOverdue);
  const dueDateText = getDueDateText(task.dueDate);
  const taskTypeLabel = getTaskTypeLabel(task.taskType);

  const handleCompleteTask = () => {
    console.log("Complete task clicked for:", task.id);
    // TODO: Implement task completion logic
  };

  const handleEditTask = () => {
    console.log("Edit task clicked for:", task.id);
    // TODO: Implement task editing logic
  };

  return (
    <div className="w-full h-full bg-surface-primary rounded-lg border border-border-primary flex flex-col">
      {/* Header with status bar */}
      <div className="relative">
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${statusBarColor} rounded-tl-lg`}
        />
        <div className="bg-surface-primary p-4 border-b border-border-primary rounded-t-lg pl-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ListCheck className="w-6 h-6 text-text-body" />
              <h2 className="text-[16px] leading-[24px] font-semibold text-black">
                Task Details
              </h2>
            </div>
            <Badge variant={task.isOverdue ? "destructive" : "secondary"}>
              {task.status === TaskStatus.COMPLETED
                ? "Completed"
                : task.isOverdue
                ? "Overdue"
                : "Pending"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Body - Scrollable */}
      <div className="bg-surface-page p-4 flex-1 overflow-y-auto space-y-4">
        {/* Task Title */}
        <div className="bg-surface-primary p-4 rounded-lg">
          <h3 className="text-[20px] leading-[23px] font-normal text-text-body mb-4">
            {task.title}
          </h3>

          {task.description && (
            <div className="text-[16px] leading-[24px] text-text-disabled">
              {task.description}
            </div>
          )}
        </div>

        {/* Task Details */}
        <div className="bg-surface-primary p-4 rounded-lg space-y-4">
          {/* Lead Name */}
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-icon-body" />
            <div>
              <span className="text-[14px] leading-[20px] text-text-disabled">
                Assigned to:
              </span>
              <div className="text-[16px] leading-[24px] font-semibold text-text-body">
                {task.leadName}
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-icon-body" />
            <div>
              <span className="text-[14px] leading-[20px] text-text-disabled">
                Due date:
              </span>
              <div
                className={cn(
                  "text-[16px] leading-[24px] font-semibold",
                  task.isOverdue ? "text-text-error" : "text-text-body"
                )}
              >
                {dueDateText}
              </div>
            </div>
          </div>

          {/* Task Type */}
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-icon-body" />
            <div>
              <span className="text-[14px] leading-[20px] text-text-disabled">
                Type:
              </span>
              <div className="text-[16px] leading-[24px] font-semibold text-text-body">
                {taskTypeLabel}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-icon-body" />
            <div>
              <span className="text-[14px] leading-[20px] text-text-disabled">
                Status:
              </span>
              <div className="text-[16px] leading-[24px] font-semibold text-text-body">
                {task.status === TaskStatus.COMPLETED
                  ? "Completed"
                  : task.isOverdue
                  ? "Overdue - Needs Attention"
                  : "Pending"}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {task.status !== TaskStatus.COMPLETED && (
          <div className="space-y-3">
            <Button
              onClick={handleCompleteTask}
              className="w-full bg-surface-action text-text-on-action hover:bg-surface-action/90 flex items-center justify-center gap-2"
              size="default"
            >
              <CheckCircle2 className="w-5 h-5" />
              Mark Complete
            </Button>

            <Button
              onClick={handleEditTask}
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              size="default"
            >
              <FileText className="w-5 h-5" />
              Edit Task
            </Button>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-surface-primary p-4 rounded-lg">
          <h4 className="text-[16px] leading-[24px] font-semibold text-text-body mb-3">
            Task Information
          </h4>
          <div className="space-y-2 text-[14px] leading-[20px] text-text-disabled">
            <div>Created: {new Date(task.dueDate).toLocaleDateString()}</div>
            <div>Priority: {task.isOverdue ? "High" : "Normal"}</div>
            <div>Category: {getTaskTypeCategory(task.taskType)}</div>
          </div>
        </div>

        {/* Task Notes */}
        <div className="bg-surface-primary p-4 rounded-lg">
          <h4 className="text-[16px] leading-[24px] font-semibold text-text-body mb-3">
            Notes
          </h4>
          <div className="text-[14px] leading-[20px] text-text-disabled italic">
            No notes added yet. Click &quot;Edit Task&quot; to add notes.
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusBarColor(status: TaskStatus, isOverdue: boolean): string {
  if (status === TaskStatus.COMPLETED) {
    return "bg-green-500";
  }
  if (isOverdue) {
    return "bg-red-500";
  }
  return "bg-yellow-500"; // Pending
}

function getDueDateText(dueDate: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDate = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate()
  );

  const diffInMs = taskDate.getTime() - today.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === -1) {
    return "Yesterday";
  } else if (diffInDays === 1) {
    return "Tomorrow";
  } else if (diffInDays < 0) {
    return `${Math.abs(diffInDays)} days ago`;
  } else {
    return `In ${diffInDays} days`;
  }
}

function getTaskTypeLabel(taskType: TaskType): string {
  switch (taskType) {
    case TaskType.CALL:
      return "Initial Call";
    case TaskType.CALL:
      return "Follow Up Call";
    case TaskType.SEND_TEXT:
      return "Send Text";
    case TaskType.CONSULTATION:
      return "Book Consultation";
    case TaskType.OTHER:
      return "Other";
    default:
      return "Task";
  }
}

function getTaskTypeCategory(taskType: TaskType): string {
  switch (taskType) {
    case TaskType.CALL:
    case TaskType.CALL:
      return "Phone Call";
    case TaskType.SEND_TEXT:
      return "Text Message";
    case TaskType.CONSULTATION:
      return "Booking";
    case TaskType.OTHER:
      return "General";
    default:
      return "General";
  }
}
