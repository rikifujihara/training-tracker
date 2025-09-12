"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, TaskWithRelations, CreateTaskInput, UpdateTaskInput } from "@/lib/types/task";

// Import leadKeys to invalidate filter counts when tasks change
const leadKeys = {
  all: ['leads'] as const,
  filterCounts: () => ['leads', 'filter-counts'] as const,
} as const;

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (leadId?: string, includeRelations?: boolean) => [...taskKeys.lists(), { leadId, includeRelations }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string, includeRelations?: boolean) => [...taskKeys.details(), id, { includeRelations }] as const,
  stats: () => [...taskKeys.all, 'stats'] as const,
  upcoming: (days?: number) => [...taskKeys.all, 'upcoming', { days }] as const,
  overdue: () => [...taskKeys.all, 'overdue'] as const,
};

// API Response Types
type TaskResponse = {
  success: boolean;
  data: { task: Task };
};

type TasksResponse = {
  success: boolean;
  data: { tasks: Task[] | TaskWithRelations[] };
};

type TaskStatsResponse = {
  success: boolean;
  data: {
    stats: {
      total: number;
      pending: number;
      completed: number;
      overdue: number;
      dueToday: number;
      dueThisWeek: number;
      byType: Record<string, number>;
    };
  };
};

// Fetch functions
const fetchTasks = async (leadId?: string, includeRelations?: boolean): Promise<TasksResponse> => {
  const params = new URLSearchParams();
  if (leadId) params.append('leadId', leadId);
  if (includeRelations) params.append('includeRelations', 'true');

  const response = await fetch(`/api/tasks?${params}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchTask = async (taskId: string, includeRelations?: boolean): Promise<TaskResponse> => {
  const params = new URLSearchParams();
  if (includeRelations) params.append('includeRelations', 'true');

  const response = await fetch(`/api/tasks/${taskId}?${params}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchTaskStats = async (): Promise<TaskStatsResponse> => {
  const response = await fetch('/api/tasks/stats');
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchUpcomingTasks = async (days: number = 7): Promise<TasksResponse> => {
  const response = await fetch(`/api/tasks/upcoming?days=${days}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchOverdueTasks = async (): Promise<TasksResponse> => {
  const response = await fetch('/api/tasks/overdue');
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const createTask = async (data: CreateTaskInput): Promise<TaskResponse> => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const updateTask = async (taskId: string, data: UpdateTaskInput): Promise<TaskResponse> => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const deleteTask = async (taskId: string): Promise<void> => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
};

const completeTask = async ({ taskId, notes }: { taskId: string; notes?: string }): Promise<TaskResponse> => {
  const response = await fetch(`/api/tasks/${taskId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notes }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Query hooks
export const useTasks = (leadId?: string, includeRelations: boolean = false) => {
  return useQuery({
    queryKey: taskKeys.list(leadId, includeRelations),
    queryFn: () => fetchTasks(leadId, includeRelations),
    select: (data) => data.data.tasks,
  });
};

export const useTask = (taskId: string, includeRelations: boolean = false) => {
  return useQuery({
    queryKey: taskKeys.detail(taskId, includeRelations),
    queryFn: () => fetchTask(taskId, includeRelations),
    select: (data) => data.data.task,
    enabled: !!taskId,
  });
};

export const useTaskStats = () => {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: fetchTaskStats,
    select: (data) => data.data.stats,
  });
};

export const useUpcomingTasks = (days: number = 7) => {
  return useQuery({
    queryKey: taskKeys.upcoming(days),
    queryFn: () => fetchUpcomingTasks(days),
    select: (data) => data.data.tasks,
  });
};

export const useOverdueTasks = () => {
  return useQuery({
    queryKey: taskKeys.overdue(),
    queryFn: fetchOverdueTasks,
    select: (data) => data.data.tasks,
  });
};

export const useNextFollowUpTask = (leadId: string) => {
  return useQuery({
    queryKey: taskKeys.list(leadId, false),
    queryFn: () => fetchTasks(leadId, false),
    select: (data) => {
      const tasks = data.data.tasks as Task[];
      // Get the first pending task (should be the next follow-up task)
      return tasks.find(task => task.status === 'PENDING') || null;
    },
    enabled: !!leadId,
  });
};

// Mutation hooks
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (response) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      // Invalidate lead filter counts since new tasks affect prospect filtering
      queryClient.invalidateQueries({ queryKey: leadKeys.filterCounts() });
      
      // Optimistically add the task to cache
      queryClient.setQueryData(taskKeys.list(), (old: TasksResponse | undefined) => {
        if (!old) return { success: true, data: { tasks: [response.data.task] } };
        return {
          ...old,
          data: {
            tasks: [response.data.task, ...old.data.tasks],
          },
        };
      });
    },
    onError: (error) => {
      console.error('Create task error:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskInput }) => 
      updateTask(taskId, data),
    onSuccess: (response) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      // Invalidate lead filter counts since task updates affect prospect filtering
      queryClient.invalidateQueries({ queryKey: leadKeys.filterCounts() });
      
      // Optimistically update the task in cache
      queryClient.setQueryData(taskKeys.list(), (old: TasksResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            tasks: old.data.tasks.map((task) =>
              task.id === response.data.task.id ? response.data.task : task
            ),
          },
        };
      });
    },
    onError: (error) => {
      console.error('Update task error:', error);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, taskId) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      // Invalidate lead filter counts since task deletion affects prospect filtering
      queryClient.invalidateQueries({ queryKey: leadKeys.filterCounts() });
      
      // Optimistically remove the task from cache
      queryClient.setQueryData(taskKeys.list(), (old: TasksResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            tasks: old.data.tasks.filter((task) => task.id !== taskId),
          },
        };
      });
    },
    onError: (error) => {
      console.error('Delete task error:', error);
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeTask,
    onSuccess: (response) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      // Invalidate lead filter counts since task completion affects prospect filtering
      queryClient.invalidateQueries({ queryKey: leadKeys.filterCounts() });
      
      // Optimistically update the task in cache
      queryClient.setQueryData(taskKeys.list(), (old: TasksResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            tasks: old.data.tasks.map((task) =>
              task.id === response.data.task.id ? response.data.task : task
            ),
          },
        };
      });
    },
    onError: (error) => {
      console.error('Complete task error:', error);
    },
  });
};