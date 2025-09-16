import { prisma } from "@/lib/prisma";
import { MessageTemplate } from "@prisma/client";

export class MessageTemplateQueries {
  /**
   * Get all templates for a user
   */
  static async getTemplatesForUser(userId: string): Promise<MessageTemplate[]> {
    return prisma.messageTemplate.findMany({
      where: { userId },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }
}