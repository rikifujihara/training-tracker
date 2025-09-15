/**
 * Notes Content component system
 *
 * A modular system for managing lead notes, tasks, and contact history:
 * - Notes Editor: For editing lead general notes
 * - Task Editor: For managing follow-up tasks
 * - Contact History: For displaying contact points and consultations
 * - Custom hook: For state management and business logic
 */

export { useNotesContent } from "./use-notes-content";
export { NotesEditor } from "./notes-editor";
export { TaskEditor } from "./task-editor";
export { ContactHistory } from "./contact-history";

// Re-export the main component for backward compatibility
export { NotesContent } from "./notes-content";