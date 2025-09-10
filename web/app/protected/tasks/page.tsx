"use client";

import React, { useState, useMemo } from "react";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskDetailSidePane } from "@/components/tasks/task-detail-side-pane";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getTasksForToday, 
  getOverdueTasks,
  getUpcomingTasks,
  getAllPendingTasks,
  getCompletedTasks,
  sortTasksByDueDate
} from "@/lib/data/dummy-tasks";
import type { DummyTask } from "@/components/tasks/task-card";

type TaskFilter = "today" | "overdue" | "upcoming" | "all" | "completed";

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<DummyTask | null>(null);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("today");

  // Get filtered tasks based on active filter
  const filteredTasks = useMemo(() => {
    let tasks: DummyTask[] = [];
    
    switch (activeFilter) {
      case "today":
        tasks = getTasksForToday();
        break;
      case "overdue":
        tasks = getOverdueTasks();
        break;
      case "upcoming":
        tasks = getUpcomingTasks();
        break;
      case "all":
        tasks = getAllPendingTasks();
        break;
      case "completed":
        tasks = getCompletedTasks();
        break;
      default:
        tasks = getTasksForToday();
    }
    
    return sortTasksByDueDate(tasks);
  }, [activeFilter]);

  // Set the first task as selected by default when tasks change
  React.useEffect(() => {
    if (filteredTasks.length > 0 && !selectedTask) {
      setSelectedTask(filteredTasks[0]);
    }
  }, [filteredTasks, selectedTask]);

  const handleTaskSelect = (task: DummyTask) => {
    setSelectedTask(task);
  };

  const getFilterBadgeCount = (filter: TaskFilter): number => {
    switch (filter) {
      case "today":
        return getTasksForToday().length;
      case "overdue":
        return getOverdueTasks().length;
      case "upcoming":
        return getUpcomingTasks().length;
      case "all":
        return getAllPendingTasks().length;
      case "completed":
        return getCompletedTasks().length;
      default:
        return 0;
    }
  };

  const getFilterLabel = (filter: TaskFilter): string => {
    switch (filter) {
      case "today":
        return "Due Today";
      case "overdue":
        return "Overdue";
      case "upcoming":
        return "Upcoming";
      case "all":
        return "All Pending";
      case "completed":
        return "Completed";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-text-headings text-[20px] leading-[24px] font-semibold">
            Task Filters
          </h2>
          <div className="flex flex-wrap gap-3">
            {(["today", "overdue", "upcoming", "all", "completed"] as TaskFilter[]).map((filter) => {
              const count = getFilterBadgeCount(filter);
              const isActive = activeFilter === filter;
              
              return (
                <Button
                  key={filter}
                  variant={isActive ? "default" : "secondary"}
                  size="default"
                  onClick={() => setActiveFilter(filter)}
                  className={`flex items-center gap-2 ${
                    isActive 
                      ? "bg-surface-action text-text-on-action hover:bg-surface-action/90" 
                      : ""
                  }`}
                >
                  <span>{getFilterLabel(filter)}</span>
                  <Badge 
                    variant={
                      filter === "overdue" 
                        ? "destructive" 
                        : "secondary"
                    }
                    className={`${
                      isActive 
                        ? "bg-white/20 text-white hover:bg-white/30" 
                        : ""
                    }`}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tasks Content */}
      {filteredTasks.length > 0 ? (
        <div className="flex gap-6">
          {/* Tasks List */}
          <div className="space-y-4 flex-shrink-0">
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                selected={selectedTask?.id === task.id}
                onSelect={handleTaskSelect}
              />
            ))}
          </div>

          {/* Task Detail Side Pane */}
          <div className="min-w-[400px] w-full">
            <div className="sticky top-6 h-[calc(100vh-120px)]">
              <TaskDetailSidePane 
                task={selectedTask} 
                isVisible={!!selectedTask}
              />
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-text-headings text-[18px] leading-[22px] font-semibold mb-2">
                No {getFilterLabel(activeFilter).toLowerCase()} tasks
              </h3>
              <p className="text-text-disabled text-[16px] leading-[24px]">
                {activeFilter === "today" 
                  ? "You're all caught up for today! 🎉"
                  : activeFilter === "overdue"
                  ? "Great! No overdue tasks."
                  : activeFilter === "completed"
                  ? "No completed tasks yet."
                  : "No tasks match the current filter."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}