import { apiClient } from "./client";

// API endpoints
const ENDPOINTS = {
  DASHBOARD: "/trainers/dashboard",
  AVAILABLE: "/trainers/available",
} as const;

// Response types
export interface TrainerDashboardResponse {
  trainer: {
    id: string;
    name: string | null;
    businessName: string | null;
    bio: string | null;
  };
  clients: Array<{
    id: string;
    name: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    createdAt: Date;
  }>;
  stats: {
    totalClients: number;
    totalClientsInSystem: number;
  };
}

export interface Trainer {
  id: string;
  name: string | null;
  businessName: string | null;
  bio: string | null;
  createdAt: Date;
}

export interface AvailableTrainersResponse {
  trainers: Trainer[];
  count: number;
}

/**
 * Trainer API service - handles trainer-related API calls
 */
export const trainerApi = {
  async getDashboard(): Promise<TrainerDashboardResponse> {
    return apiClient.get<TrainerDashboardResponse>(ENDPOINTS.DASHBOARD);
  },

  async getAvailable(): Promise<AvailableTrainersResponse> {
    return apiClient.get<AvailableTrainersResponse>(ENDPOINTS.AVAILABLE);
  },
} as const;
