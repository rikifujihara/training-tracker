import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateLeadInput, Lead } from '@/lib/types/lead';

// Types for API responses
interface LeadUploadResponse {
  success: boolean;
  data: {
    leads: Lead[];
    stats: {
      total: number;
      withEmail: number;
      withPhone: number;
      recentImports: number;
    };
    imported: number;
    skipped: number;
  };
  error?: string;
}

interface LeadsResponse {
  success: boolean;
  data: {
    leads: Lead[];
    stats: {
      total: number;
      withEmail: number;
      withPhone: number;
      recentImports: number;
    };
  };
  error?: string;
}

// API functions
const uploadLeads = async (leads: CreateLeadInput[]): Promise<LeadUploadResponse> => {
  const response = await fetch('/api/leads/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ leads }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const fetchLeads = async (): Promise<LeadsResponse> => {
  const response = await fetch('/api/leads');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Query keys
const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  stats: () => [...leadKeys.all, 'stats'] as const,
} as const;

// Hooks
export const useLeads = () => {
  return useQuery({
    queryKey: leadKeys.lists(),
    queryFn: fetchLeads,
    select: (data) => data.data, // Extract the data from the response
  });
};

export const useUploadLeads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadLeads,
    onSuccess: (data) => {
      // Invalidate and refetch leads after successful upload
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      
      // Optionally update the cache optimistically
      queryClient.setQueryData(leadKeys.lists(), (oldData: LeadsResponse | undefined) => {
        if (!oldData) return { success: true, data };
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            leads: [...oldData.data.leads, ...data.data.leads],
            stats: data.data.stats, // Update stats with latest
          },
        };
      });
    },
    onError: (error) => {
      console.error('Lead upload error:', error);
    },
  });
};

// Hook for getting just the stats
export const useLeadStats = () => {
  return useQuery({
    queryKey: leadKeys.stats(),
    queryFn: fetchLeads,
    select: (data) => data.data.stats,
    staleTime: 5 * 60 * 1000, // Stats don't change as frequently, cache for 5 minutes
  });
};