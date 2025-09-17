import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Calendar } from "lucide-react";
import { Task } from "@/lib/types/task";
import {
  getTodayFormatted,
  getTomorrowFormatted,
  formatDateForInput,
  formatDateTimeAustralian,
} from "@/lib/utils/date";

interface TaskEditorProps {
  variant: "modal" | "sidepane";
  nextTask: Task | null;
  editingTask: boolean;
  setEditingTask: (editing: boolean) => void;
  taskDueDate: string;
  setTaskDueDate: (date: string) => void;
  taskDueTime: string;
  setTaskDueTime: (time: string) => void;
  hasTaskChanges: boolean;
  isUpdatingTask: boolean;
  onSaveTask: () => void;
}

export function TaskEditor({
  variant,
  nextTask,
  editingTask,
  setEditingTask,
  taskDueDate,
  setTaskDueDate,
  taskDueTime,
  setTaskDueTime,
  hasTaskChanges,
  isUpdatingTask,
  onSaveTask,
}: TaskEditorProps) {
  const sectionClasses =
    variant === "modal"
      ? "bg-surface-primary p-3 rounded-lg space-y-3"
      : "bg-surface-primary p-4 rounded-lg space-y-4";

  const inputClasses =
    variant === "modal" ? "text-[14px] h-10" : "text-[16px] h-12";

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
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h3 className="text-lg font-medium">Next follow-up is due:</h3>
      </div>

      {editingTask ? (
        <div className="space-y-4">
          {/* Date Selection */}
          <div>
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
            <label className="text-sm font-medium text-foreground">Time</label>
            <Input
              type="time"
              value={taskDueTime}
              onChange={(e) => setTaskDueTime(e.target.value)}
              className={inputClasses}
              disabled={isUpdatingTask}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <span className="text-xl flex gap-2 items-center">
            <Calendar className="h-5 w-5 mr-1" />
            {formatDateTimeAustralian(nextTask.dueDate, true)}
          </span>
        </div>
      )}
      <div className="flex justify-end items-center space-x-2">
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
              variant="secondary"
              size="sm"
              disabled={isUpdatingTask}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setEditingTask(true)}
            className="flex items-center space-x-1"
          >
            <Calendar className="h-3 w-3" />
            <span>Update</span>
          </Button>
        )}
      </div>
    </div>
  );
}
