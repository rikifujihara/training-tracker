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
import { Save, PenLine, Calendar } from "lucide-react";
import { TaskType, Task } from "@/lib/types/task";
import { MessageTemplate } from "@prisma/client";
import { getTodayFormatted, getTomorrowFormatted, formatDateForInput, formatTimeForInput, formatDateTimeAustralian } from "@/lib/utils/date";

interface TaskEditorProps {
  variant: "modal" | "sidepane";
  nextTask: Task | null;
  editingTask: boolean;
  setEditingTask: (editing: boolean) => void;
  taskDescription: string;
  setTaskDescription: (description: string) => void;
  taskType: TaskType;
  setTaskType: (type: TaskType) => void;
  taskDueDate: string;
  setTaskDueDate: (date: string) => void;
  taskDueTime: string;
  setTaskDueTime: (time: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  notificationEnabled: boolean;
  setNotificationEnabled: (enabled: boolean) => void;
  hasTaskChanges: boolean;
  isUpdatingTask: boolean;
  messageTemplates?: MessageTemplate[];
  templatesLoading: boolean;
  onSaveTask: () => void;
}

export function TaskEditor({
  variant,
  nextTask,
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
  notificationEnabled,
  setNotificationEnabled,
  hasTaskChanges,
  isUpdatingTask,
  messageTemplates,
  templatesLoading,
  onSaveTask,
}: TaskEditorProps) {
  const sectionClasses =
    variant === "modal"
      ? "bg-surface-primary p-3 rounded-lg space-y-3"
      : "bg-surface-primary p-4 rounded-lg space-y-4";

  const inputClasses =
    variant === "modal" ? "text-[14px] h-10" : "text-[16px] h-12";

  // Format task type for display
  const formatTaskType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Removed local formatDate function - using imported Australian formatter

  // Check if selected date is today/tomorrow
  const isSelectedDateToday = taskDueDate === getTodayFormatted();
  const isSelectedDateTomorrow = taskDueDate === getTomorrowFormatted();

  if (!nextTask) {
    return (
      <div className={sectionClasses}>
        <h3 className="text-lg font-semibold">Next Follow-up Task</h3>
        <p className="text-sm text-muted-foreground">
          No follow-up task scheduled for this lead.
        </p>
      </div>
    );
  }

  return (
    <div className={sectionClasses}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Next Follow-up Task</h3>
        <div className="flex items-center space-x-2">
          {editingTask ? (
            <div className="flex items-center space-x-2">
              <Button
                onClick={onSaveTask}
                disabled={!hasTaskChanges || isUpdatingTask}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Save className="h-3 w-3" />
                <span>Save</span>
              </Button>
              <Button
                onClick={() => setEditingTask(false)}
                variant="outline"
                size="sm"
                disabled={isUpdatingTask}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setEditingTask(true)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <PenLine className="h-3 w-3" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </div>

      {editingTask ? (
        <div className="space-y-4">
          {/* Task Type Selection */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Task Type
            </label>
            <Select value={taskType} onValueChange={(value) => setTaskType(value as TaskType)}>
              <SelectTrigger className={inputClasses}>
                <span>{formatTaskType(taskType)}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskType.CALL}>Call</SelectItem>
                <SelectItem value={TaskType.SEND_TEXT}>Send Text</SelectItem>
                <SelectItem value={TaskType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Description */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Description (Optional)
            </label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Add task details..."
              className={`w-full min-h-[80px] p-3 border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${inputClasses}`}
              disabled={isUpdatingTask}
            />
          </div>

          {/* Date Selection */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Due Date
            </label>
            <div className="flex flex-col space-y-2">
              <Input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className={inputClasses}
                disabled={isUpdatingTask}
              />
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={isSelectedDateToday ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTaskDueDate(getTodayFormatted())}
                  disabled={isUpdatingTask}
                >
                  Today
                </Button>
                <Button
                  type="button"
                  variant={isSelectedDateTomorrow ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTaskDueDate(getTomorrowFormatted())}
                  disabled={isUpdatingTask}
                >
                  Tomorrow
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (taskDueDate) {
                      const currentDate = new Date(taskDueDate);
                      currentDate.setDate(currentDate.getDate() + 1);
                      setTaskDueDate(formatDateForInput(currentDate));
                    }
                  }}
                  disabled={!taskDueDate}
                >
                  +1 Day
                </Button>
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Due Time
            </label>
            <Input
              type="time"
              value={taskDueTime}
              onChange={(e) => setTaskDueTime(e.target.value)}
              className={inputClasses}
              disabled={isUpdatingTask}
            />
          </div>

          {/* Message Template Selection for Text Tasks */}
          {taskType === TaskType.SEND_TEXT && (
            <div>
              <label className="text-sm font-medium text-foreground">
                Message Template (Optional)
              </label>
              <Select
                value={selectedTemplateId}
                onValueChange={setSelectedTemplateId}
                disabled={templatesLoading || isUpdatingTask}
              >
                <SelectTrigger className={inputClasses}>
                  <span>
                    {selectedTemplateId
                      ? messageTemplates?.find((t) => t.id === selectedTemplateId)
                          ?.name || "Select template"
                      : "Select template"}
                  </span>
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
            </div>
          )}

          {/* Reset to Current Task Data Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (nextTask) {
                setTaskDescription(nextTask.description || "");
                setTaskType(nextTask.taskType);
                const dueDate = new Date(nextTask.dueDate);
                setTaskDueDate(formatDateForInput(dueDate));
                setTaskDueTime(formatTimeForInput(dueDate));
                setSelectedTemplateId(nextTask.messageTemplateId || "");
              }
            }}
            disabled={isUpdatingTask}
          >
            Reset to Current
          </Button>

          {/* Notification Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notification"
              checked={notificationEnabled}
              onCheckedChange={(checked) => setNotificationEnabled(!!checked)}
              disabled={isUpdatingTask}
            />
            <label
              htmlFor="notification"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Enable notifications for this task
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Type:</span>
            <span className="text-sm text-muted-foreground">
              {formatTaskType(nextTask.taskType)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Due:</span>
            <span className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDateTimeAustralian(nextTask.dueDate)}
            </span>
          </div>

          {nextTask.description && (
            <div>
              <span className="text-sm font-medium text-foreground">
                Description:
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                {nextTask.description}
              </p>
            </div>
          )}

          {nextTask.messageTemplateId && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Template:
              </span>
              <span className="text-sm text-muted-foreground">
                {messageTemplates?.find((t) => t.id === nextTask.messageTemplateId)
                  ?.name || "Unknown template"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}