"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  MoreHorizontal,
  User,
  Calendar,
} from "lucide-react";
import { TaskType, TaskStatus } from "@/lib/types/task";

// Dummy task interface for visual testing
export interface DummyTask {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  taskType: TaskType;
  status: TaskStatus;
  leadName: string;
  isOverdue: boolean;
}

export interface TaskCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  task: DummyTask;
  selected?: boolean;
  onSelect?: (task: DummyTask) => void;
}

export function TaskCard({
  className,
  task,
  selected = false,
  onSelect,
  ...props
}: TaskCardProps) {
  const statusBarColor = getStatusBarColor(task.status, task.isOverdue);
  const dueDateText = getDueDateText(task.dueDate);
  const taskTypeLabel = getTaskTypeLabel(task.taskType);

  const handleCardClick = () => {
    onSelect?.(task);
  };

  return (
    <div
      className={cn(
        "relative bg-surface-primary rounded border border-border-primary overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow",
        selected && "ring-2 ring-surface-action ring-opacity-50",
        className
      )}
      onClick={handleCardClick}
      {...props}
    >
      {/* Status bar on left - hidden on mobile */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${statusBarColor} sm:block hidden`}
      />

      {/* Desktop Layout - hidden on mobile */}
      <div className="hidden sm:block">
        <div className="flex gap-[11px] items-start justify-start px-4 py-5">
          {/* Main content */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Task title and type */}
            <div className="text-text-body text-[20px] leading-[23px] font-normal">
              {task.title}
            </div>

            {/* Task details */}
            <div className="flex gap-4 items-center text-[16px] leading-[24px]">
              <div className="flex gap-2 items-center">
                <User className="w-4 h-4 text-icon-body" />
                <span className="text-text-body">{task.leadName}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-text-disabled">Type:</span>
                <span className="text-text-body font-semibold">
                  {taskTypeLabel}
                </span>
              </div>
            </div>

            {/* Due date */}
            <div className="flex gap-2 items-center">
              <Calendar className="w-4 h-4 text-icon-body" />
              <span className="text-text-disabled text-[16px] leading-[24px]">
                Due:
              </span>
              <span
                className={cn(
                  "text-[16px] leading-[24px] font-semibold",
                  task.isOverdue ? "text-text-error" : "text-text-body"
                )}
              >
                {dueDateText}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 items-start">
              <Button
                variant="secondary"
                size="default"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle complete action
                }}
              >
                <CheckCircle2 className="w-6 h-6" />
                Complete
              </Button>

              <Button
                variant="secondary"
                size="default"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle details action
                }}
              >
                <Clock className="w-6 h-6" />
                Details
              </Button>
            </div>
          </div>

          {/* Status badge */}
          <Badge variant={task.isOverdue ? "destructive" : "secondary"}>
            {task.status === TaskStatus.COMPLETED
              ? "Completed"
              : task.isOverdue
              ? "Overdue"
              : "Pending"}
          </Badge>
        </div>
      </div>

      {/* Mobile Layout - visible on mobile only */}
      <div className="block sm:hidden">
        <div className="flex flex-col gap-[11px] px-4 py-5">
          {/* Header with title, badge, and more button */}
          <div className="flex gap-[11px]">
            {/* Main content */}
            <div className="flex-1 flex flex-col gap-2 min-w-0 justify-center">
              {/* Task title */}
              <div className="text-text-body text-[20px] leading-[23px] font-normal">
                {task.title}
              </div>
              {/* Lead name */}
              <div className="text-text-disabled text-[14px] leading-[20px]">
                {task.leadName}
              </div>
            </div>

            {/* Status badge and more button */}
            <div className="flex items-center gap-3">
              <Badge variant={task.isOverdue ? "destructive" : "secondary"}>
                {task.status === TaskStatus.COMPLETED
                  ? "Done"
                  : task.isOverdue
                  ? "Late"
                  : "Todo"}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-3 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-6 h-6 text-icon-body" />
              </Button>
            </div>
          </div>

          {/* Due date and type */}
          <div className="flex justify-between items-center text-[14px] leading-[20px]">
            <div className="flex gap-2 items-center">
              <Calendar className="w-4 h-4 text-icon-body" />
              <span
                className={cn(
                  "font-medium",
                  task.isOverdue ? "text-text-error" : "text-text-body"
                )}
              >
                {dueDateText}
              </span>
            </div>
            <div className="text-text-disabled">{taskTypeLabel}</div>
          </div>

          {/* Actions section */}
          <div className="flex gap-2.5 w-full">
            <Button
              variant="secondary"
              size="default"
              className="flex-1 justify-center"
              onClick={(e) => {
                e.stopPropagation();
                // Handle complete
              }}
            >
              <CheckCircle2 className="w-6 h-6" />
              Complete
            </Button>
            <Button
              variant="secondary"
              size="default"
              className="flex-1 justify-center"
              onClick={(e) => {
                e.stopPropagation();
                // Handle details
              }}
            >
              <Clock className="w-6 h-6" />
              Details
            </Button>
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
      return "Follow Up Call";
    case TaskType.SEND_TEXT:
      return "Send Text";
    case TaskType.OTHER:
      return "Other";
    default:
      return "Task";
  }
}
