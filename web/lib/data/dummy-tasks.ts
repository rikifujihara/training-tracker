"use client";

import { TaskType, TaskStatus } from "@/lib/types/task";
import type { DummyTask } from "@/components/tasks/task-card";

export const DUMMY_TASKS: DummyTask[] = [
  // Overdue tasks
  {
    id: "1",
    title: "Initial call",
    description: "Make the first contact with this lead",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    taskType: TaskType.CALL,
    status: TaskStatus.PENDING,
    leadName: "Sarah Johnson",
    isOverdue: true,
  },
  {
    id: "2",
    title: "Follow up call",
    description: "Check on progress and next steps",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    taskType: TaskType.CALL,
    status: TaskStatus.PENDING,
    leadName: "Mike Chen",
    isOverdue: true,
  },
  // Due today
  {
    id: "3",
    title: "Send consultation booking link",
    description: "Send Calendly link for consultation booking",
    dueDate: new Date(), // Today
    taskType: TaskType.CONSULTATION,
    status: TaskStatus.PENDING,
    leadName: "Emma Rodriguez",
    isOverdue: false,
  },
  {
    id: "4",
    title: "Initial call",
    description: "Make the first contact with this lead",
    dueDate: new Date(), // Today
    taskType: TaskType.CALL,
    status: TaskStatus.PENDING,
    leadName: "David Kim",
    isOverdue: false,
  },
  {
    id: "5",
    title: "Send text message",
    description: "Follow up with text message about program details",
    dueDate: new Date(), // Today
    taskType: TaskType.SEND_TEXT,
    status: TaskStatus.PENDING,
    leadName: "Lisa Wong",
    isOverdue: false,
  },
  // Tomorrow
  {
    id: "6",
    title: "Initial call",
    description: "Make the first contact with this lead",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    taskType: TaskType.CALL,
    status: TaskStatus.PENDING,
    leadName: "Robert Smith",
    isOverdue: false,
  },
  {
    id: "7",
    title: "Follow up call",
    description: "Check interest level and schedule consultation",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    taskType: TaskType.CALL,
    status: TaskStatus.PENDING,
    leadName: "Jessica Brown",
    isOverdue: false,
  },
  // Future tasks
  {
    id: "8",
    title: "Follow up call",
    description: "Check on progress after initial consultation",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    taskType: TaskType.CALL,
    status: TaskStatus.PENDING,
    leadName: "Alex Thompson",
    isOverdue: false,
  },
  {
    id: "9",
    title: "Send text message",
    description: "Check in with nutrition plan progress",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    taskType: TaskType.SEND_TEXT,
    status: TaskStatus.PENDING,
    leadName: "Maria Garcia",
    isOverdue: false,
  },
  // Completed task
  {
    id: "10",
    title: "Initial call",
    description: "Successfully contacted and scheduled consultation",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    taskType: TaskType.CALL,
    status: TaskStatus.COMPLETED,
    leadName: "Kevin Lee",
    isOverdue: false,
  },
];

// Helper functions for filtering
export const getTasksForToday = () => {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  return DUMMY_TASKS.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return (
      taskDate >= startOfDay &&
      taskDate < endOfDay &&
      task.status === TaskStatus.PENDING
    );
  });
};

export const getOverdueTasks = () => {
  return DUMMY_TASKS.filter(
    (task) => task.isOverdue && task.status === TaskStatus.PENDING
  );
};

export const getUpcomingTasks = () => {
  const today = new Date();
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  return DUMMY_TASKS.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= endOfDay && task.status === TaskStatus.PENDING;
  });
};

export const getAllPendingTasks = () => {
  return DUMMY_TASKS.filter((task) => task.status === TaskStatus.PENDING);
};

export const getCompletedTasks = () => {
  return DUMMY_TASKS.filter((task) => task.status === TaskStatus.COMPLETED);
};

// Sort tasks by due date (overdue first, then by ascending date)
export const sortTasksByDueDate = (tasks: DummyTask[]) => {
  return [...tasks].sort((a, b) => {
    // Overdue tasks first
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;

    // Then sort by due date (ascending)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};
