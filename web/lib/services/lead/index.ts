/**
 * Lead Service - Modular lead management system
 *
 * Organized into focused modules:
 * - LeadQueries: All read operations
 * - LeadMutations: All write operations
 * - LeadUtils: Utility functions and data processing
 */

import { LeadQueries } from "./queries";
import { LeadMutations } from "./mutations";
import { LeadUtils } from "./utils";

/**
 * Main LeadService facade that maintains the original API
 * for backward compatibility while using the modular structure
 */
export class LeadService {
  // Query operations
  static getLeadsByUserId = LeadQueries.getLeadsByUserId;
  static getLeadsByUserIdPaginated = LeadQueries.getLeadsByUserIdPaginated;
  static getProspectFilterCounts = LeadQueries.getProspectFilterCounts;
  static getLeadById = LeadQueries.getLeadById;
  static getLeadStats = LeadQueries.getLeadStats;
  static searchLeads = LeadQueries.searchLeads;

  // Mutation operations
  static createLeads = LeadMutations.createLeads;
  static updateLead = LeadMutations.updateLead;
  static deleteLead = LeadMutations.deleteLead;

  // Utility operations (if needed externally)
  static enrichLeadWithDisplayFields = LeadUtils.enrichLeadWithDisplayFields;
}

// Re-export individual modules for direct access if needed
export { LeadQueries, LeadMutations, LeadUtils };