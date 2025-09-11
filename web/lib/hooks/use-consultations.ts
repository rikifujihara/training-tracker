"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Consultation, ConsultationWithRelations, CreateConsultationInput, UpdateConsultationInput } from "@/lib/types/consultation";

// Query keys
export const consultationKeys = {
  all: ['consultations'] as const,
  lists: () => [...consultationKeys.all, 'list'] as const,
  list: (leadId?: string, includeRelations?: boolean) => [...consultationKeys.lists(), { leadId, includeRelations }] as const,
  details: () => [...consultationKeys.all, 'detail'] as const,
  detail: (id: string, includeRelations?: boolean) => [...consultationKeys.details(), id, { includeRelations }] as const,
  stats: () => [...consultationKeys.all, 'stats'] as const,
  upcoming: (days?: number) => [...consultationKeys.all, 'upcoming', { days }] as const,
};

// API Response Types
type ConsultationResponse = {
  success: boolean;
  data: { consultation: Consultation };
};

type ConsultationsResponse = {
  success: boolean;
  data: { consultations: Consultation[] | ConsultationWithRelations[] };
};

// type ConsultationStatsResponse = {
//   success: boolean;
//   data: {
//     stats: {
//       total: number;
//       scheduled: number;
//       completed: number;
//       converted: number;
//       notConverted: number;
//       scheduledToday: number;
//       scheduledThisWeek: number;
//       conversionRate: number;
//     };
//   };
// };

// Fetch functions
const fetchConsultations = async (leadId?: string, includeRelations?: boolean): Promise<ConsultationsResponse> => {
  const params = new URLSearchParams();
  if (leadId) params.append('leadId', leadId);
  if (includeRelations) params.append('includeRelations', 'true');

  const response = await fetch(`/api/consultations?${params}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchConsultation = async (consultationId: string, includeRelations?: boolean): Promise<ConsultationResponse> => {
  const params = new URLSearchParams();
  if (includeRelations) params.append('includeRelations', 'true');

  const response = await fetch(`/api/consultations/${consultationId}?${params}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const createConsultation = async (data: CreateConsultationInput): Promise<ConsultationResponse> => {
  const response = await fetch('/api/consultations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const updateConsultation = async (consultationId: string, data: UpdateConsultationInput): Promise<ConsultationResponse> => {
  const response = await fetch(`/api/consultations/${consultationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const deleteConsultation = async (consultationId: string): Promise<void> => {
  const response = await fetch(`/api/consultations/${consultationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
};

// Query hooks
export const useConsultations = (leadId?: string, includeRelations: boolean = false) => {
  return useQuery({
    queryKey: consultationKeys.list(leadId, includeRelations),
    queryFn: () => fetchConsultations(leadId, includeRelations),
    select: (data) => data.data.consultations,
  });
};

export const useConsultation = (consultationId: string, includeRelations: boolean = false) => {
  return useQuery({
    queryKey: consultationKeys.detail(consultationId, includeRelations),
    queryFn: () => fetchConsultation(consultationId, includeRelations),
    select: (data) => data.data.consultation,
    enabled: !!consultationId,
  });
};

export const useNextConsultation = (leadId: string) => {
  return useQuery({
    queryKey: consultationKeys.list(leadId, false),
    queryFn: () => fetchConsultations(leadId, false),
    select: (data) => {
      const consultations = data.data.consultations as Consultation[];
      // Get the next scheduled consultation
      return consultations
        .filter(consultation => consultation.status === 'SCHEDULED')
        .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())[0] || null;
    },
    enabled: !!leadId,
  });
};

// Mutation hooks
export const useCreateConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConsultation,
    onSuccess: (response) => {
      // Invalidate and refetch consultations
      queryClient.invalidateQueries({ queryKey: consultationKeys.all });
      
      // Optimistically add the consultation to cache
      queryClient.setQueryData(consultationKeys.list(), (old: ConsultationsResponse | undefined) => {
        if (!old) return { success: true, data: { consultations: [response.data.consultation] } };
        return {
          ...old,
          data: {
            consultations: [response.data.consultation, ...old.data.consultations],
          },
        };
      });
    },
    onError: (error) => {
      console.error('Create consultation error:', error);
    },
  });
};

export const useUpdateConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ consultationId, data }: { consultationId: string; data: UpdateConsultationInput }) => 
      updateConsultation(consultationId, data),
    onSuccess: (response) => {
      // Invalidate and refetch consultations
      queryClient.invalidateQueries({ queryKey: consultationKeys.all });
      
      // Optimistically update the consultation in cache
      queryClient.setQueryData(consultationKeys.list(), (old: ConsultationsResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            consultations: old.data.consultations.map((consultation) =>
              consultation.id === response.data.consultation.id ? response.data.consultation : consultation
            ),
          },
        };
      });
    },
    onError: (error) => {
      console.error('Update consultation error:', error);
    },
  });
};

export const useDeleteConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConsultation,
    onSuccess: (_, consultationId) => {
      // Invalidate and refetch consultations
      queryClient.invalidateQueries({ queryKey: consultationKeys.all });
      
      // Optimistically remove the consultation from cache
      queryClient.setQueryData(consultationKeys.list(), (old: ConsultationsResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            consultations: old.data.consultations.filter((consultation) => consultation.id !== consultationId),
          },
        };
      });
    },
    onError: (error) => {
      console.error('Delete consultation error:', error);
    },
  });
};