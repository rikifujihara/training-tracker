import { Lead } from "@prisma/client";
export class TemplateProcessor {
  /**
   * Process template with lead's firstName
   */
  static processTemplate(template: string, lead: Lead): string {
    const firstName = lead.firstName || "there";
    return template.replace(/#{firstName}/g, firstName);
  }

  /**
   * Preview template with sample firstName
   */
  static previewTemplate(template: string): string {
    return template.replace(/#{firstName}/g, "John");
  }

  /**
   * Generate SMS URI with processed template
   */
  static generateSMSUri(template: string, lead: Lead): string {
    const processedMessage = this.processTemplate(template, lead);
    const encodedMessage = encodeURIComponent(processedMessage);
    const phoneNumber = lead.phoneNumber || "";

    return `sms:${phoneNumber}?body=${encodedMessage}`;
  }

  // Future extensibility: Add more variables here
  // static processTemplateExtended(template: string, lead: Lead, additionalVars?: Record<string, string>): string {
  //   let processed = template.replace(/#{firstName}/g, lead.firstName || 'there');
  //   // Add more variables as needed
  //   return processed;
  // }
}
