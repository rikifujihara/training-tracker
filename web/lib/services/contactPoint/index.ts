import { ContactPointQueries } from "./queries";
import { ContactPointMutations } from "./mutations";

export class ContactPointService {
  // Query operations
  static getContactPointsByUserId = ContactPointQueries.getContactPointsByUserId;
  static getContactPointsByLeadId = ContactPointQueries.getContactPointsByLeadId;
  static getContactPointById = ContactPointQueries.getContactPointById;
  static getContactPointStats = ContactPointQueries.getContactPointStats;
  static getRecentContactPointsWithLeads = ContactPointQueries.getRecentContactPointsWithLeads;

  // Mutation operations
  static createContactPoint = ContactPointMutations.createContactPoint;
  static updateContactPoint = ContactPointMutations.updateContactPoint;
  static deleteContactPoint = ContactPointMutations.deleteContactPoint;
}

// Re-export individual modules for direct access if needed
export { ContactPointQueries, ContactPointMutations };