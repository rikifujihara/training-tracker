import { ConsultationQueries } from "./queries";
import { ConsultationMutations } from "./mutations";

export class ConsultationService {
  // Query operations
  static getConsultationsByUserId = ConsultationQueries.getConsultationsByUserId;
  static getConsultationsByLeadId = ConsultationQueries.getConsultationsByLeadId;
  static getConsultationsWithRelations = ConsultationQueries.getConsultationsWithRelations;
  static getConsultationById = ConsultationQueries.getConsultationById;
  static getConsultationByIdWithRelations = ConsultationQueries.getConsultationByIdWithRelations;
  static getUpcomingConsultations = ConsultationQueries.getUpcomingConsultations;
  static getConsultationStats = ConsultationQueries.getConsultationStats;

  // Mutation operations
  static createConsultation = ConsultationMutations.createConsultation;
  static updateConsultation = ConsultationMutations.updateConsultation;
  static deleteConsultation = ConsultationMutations.deleteConsultation;
  static markConsultationCompleted = ConsultationMutations.markConsultationCompleted;
}

// Re-export individual modules for direct access if needed
export { ConsultationQueries, ConsultationMutations };