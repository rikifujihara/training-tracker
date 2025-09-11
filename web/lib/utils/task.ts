import { TaskType } from "@/lib/types/task";

/**
 * Format task type for display as user-friendly text
 */
export function formatTaskType(taskType: TaskType): string {
  switch (taskType) {
    case TaskType.CALL:
      return "Call";
    case TaskType.SEND_TEXT:
      return "Send Text";
    case TaskType.OTHER:
      return "Other";
    default:
      // Fallback for any new task types
      return String(taskType)
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}