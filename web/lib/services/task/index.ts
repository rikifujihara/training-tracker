/**
 * Task Service - Modular task management system
 *
 * Organized into focused modules:
 * - TaskQueries: All read operations
 * - TaskMutations: All write operations
 */

import { TaskQueries } from "./queries";
import { TaskMutations } from "./mutations";

/**
 * Main TaskService facade that maintains the original API
 * for backward compatibility while using the modular structure
 */
export class TaskService {
  // Query operations
  static getTasksByUserId = TaskQueries.getTasksByUserId;
  static getTasksByLeadId = TaskQueries.getTasksByLeadId;
  static getTasksWithRelations = TaskQueries.getTasksWithRelations;
  static getTaskById = TaskQueries.getTaskById;
  static getTaskByIdWithRelations = TaskQueries.getTaskByIdWithRelations;
  static getTaskStats = TaskQueries.getTaskStats;
  static getUpcomingTasks = TaskQueries.getUpcomingTasks;
  static getOverdueTasks = TaskQueries.getOverdueTasks;

  // Mutation operations
  static createTask = TaskMutations.createTask;
  static updateTask = TaskMutations.updateTask;
  static deleteTask = TaskMutations.deleteTask;
  static markTaskCompleted = TaskMutations.markTaskCompleted;
}

// Re-export individual modules for direct access if needed
export { TaskQueries, TaskMutations };