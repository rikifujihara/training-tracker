import { MessageTemplateQueries } from "./queries";
import { MessageTemplateMutations } from "./mutations";

export class MessageTemplateService {
  // Query operations
  static getTemplatesForUser = MessageTemplateQueries.getTemplatesForUser;

  // Mutation operations
  static createTemplate = MessageTemplateMutations.createTemplate;
  static updateTemplate = MessageTemplateMutations.updateTemplate;
  static deleteTemplate = MessageTemplateMutations.deleteTemplate;
}

// Re-export individual modules for direct access if needed
export { MessageTemplateQueries, MessageTemplateMutations };

// Re-export types
export type { CreateTemplateInput } from "./mutations";