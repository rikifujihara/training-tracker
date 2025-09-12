import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { CreateLeadInput, UpdateLeadInput, Lead } from '@/lib/types/lead';

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

interface PaginatedLeadsResponse {
  success: boolean;
  data: {
    leads: Lead[];
    hasNextPage: boolean;
    totalCount: number;
    stats?: {
      total: number;
      withEmail: number;
      withPhone: number;
      recentImports: number;
    };
  };
  error?: string;
}

interface FilterCountsResponse {
  success: boolean;
  data: {
    today: number;
    overdue: number;
    upcoming: number;
    all: number;
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

const fetchLeadsPaginated = async ({
  pageParam = 0,
  filter = 'all',
  pageSize = 10,
}: {
  pageParam?: number;
  filter?: 'today' | 'overdue' | 'upcoming' | 'all';
  pageSize?: number;
}): Promise<PaginatedLeadsResponse> => {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    pageSize: pageSize.toString(),
    filter,
  });

  const response = await fetch(`/api/leads?${params}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const fetchFilterCounts = async (): Promise<FilterCountsResponse> => {
  const response = await fetch('/api/leads/filter-counts');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const updateLead = async (leadId: string, data: UpdateLeadInput): Promise<{ success: boolean; data: Lead }> => {
  const response = await fetch(`/api/leads/${leadId}`, {
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

// Query keys
const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  infinite: (filter: string) => [...leadKeys.all, 'infinite', { filter }] as const,
  stats: () => [...leadKeys.all, 'stats'] as const,
  filterCounts: () => [...leadKeys.all, 'filter-counts'] as const,
} as const;

// Hooks
export const useLeads = () => {
  return useQuery({
    queryKey: leadKeys.lists(),
    queryFn: fetchLeads,
    select: (data) => data.data, // Extract the data from the response
  });
};

export const useInfiniteLeads = (
  filter: 'today' | 'overdue' | 'upcoming' | 'all' = 'all',
  pageSize: number = 10
) => {
  return useInfiniteQuery({
    queryKey: leadKeys.infinite(filter),
    queryFn: ({ pageParam }) => fetchLeadsPaginated({ pageParam, filter, pageSize }),
    getNextPageParam: (lastPage, allPages) => {
      const { hasNextPage } = lastPage.data;
      return hasNextPage ? allPages.length : undefined;
    },
    initialPageParam: 0,
    select: (data) => ({
      pages: data.pages.map(page => page.data),
      pageParams: data.pageParams,
    }),
  });
};

export const useProspectFilterCounts = () => {
  return useQuery({
    queryKey: leadKeys.filterCounts(),
    queryFn: fetchFilterCounts,
    select: (data) => data.data,
    staleTime: 30 * 1000, // Cache for 30 seconds since counts can change frequently
  });
};

export const useUploadLeads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadLeads,
    onSuccess: (data) => {
      // Invalidate and refetch leads after successful upload
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      // Also invalidate filter counts since new leads affect counts
      queryClient.invalidateQueries({ queryKey: leadKeys.filterCounts() });
      
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

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: UpdateLeadInput }) => 
      updateLead(leadId, data),
    onSuccess: (response) => {
      // Invalidate and refetch leads
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      // Also invalidate filter counts since lead updates might affect task relationships
      queryClient.invalidateQueries({ queryKey: leadKeys.filterCounts() });
      
      // Optimistically update the lead in cache
      queryClient.setQueryData(leadKeys.lists(), (oldData: LeadsResponse | undefined) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            leads: oldData.data.leads.map(lead => 
              lead.id === response.data.id ? response.data : lead
            ),
          },
        };
      });
    },
    onError: (error) => {
      console.error('Update lead error:', error);
    },
  });
};