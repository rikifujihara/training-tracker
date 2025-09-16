import { prisma } from "@/lib/prisma";
import { MessageTemplate } from "@prisma/client";

export interface CreateTemplateInput {
  name: string;
  content: string;
}

export class MessageTemplateMutations {
  /**
   * Create a template for user
   */
  static async createTemplate(
    userId: string,
    data: CreateTemplateInput
  ): Promise<MessageTemplate> {
    return prisma.messageTemplate.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  /**
   * Update user's template
   */
  static async updateTemplate(
    templateId: string,
    userId: string,
    data: Partial<CreateTemplateInput>
  ): Promise<MessageTemplate> {
    return prisma.messageTemplate.update({
      where: {
        id: templateId,
        userId: userId, // Ensures user owns this template
      },
      data,
    });
  }

  /**
   * Delete template
   */
  static async deleteTemplate(
    templateId: string,
    userId: string
  ): Promise<void> {
    await prisma.messageTemplate.delete({
      where: {
        id: templateId,
        userId: userId, // Only delete user's own templates
      },
    });
  }
}