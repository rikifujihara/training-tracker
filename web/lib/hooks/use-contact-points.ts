import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContactPoint, CreateContactPointInput, ContactType, ContactPointOutcome } from '@/lib/types/contactPoint';

// Types for API responses
interface ContactPointResponse {
  success: boolean;
  data: ContactPoint;
  error?: string;
}

interface ContactPointsResponse {
  success: boolean;
  data: {
    contactPoints: ContactPoint[];
  };
  error?: string;
}

interface ContactPointStatsResponse {
  success: boolean;
  data: {
    total: number;
    byOutcome: Record<ContactPointOutcome, number>;
    byType: Record<ContactType, number>;
    last7Days: number;
  };
  error?: string;
}

interface ContactPointsWithLeadsResponse {
  success: boolean;
  data: {
    contactPoints: (ContactPoint & {
      lead: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phoneNumber: string | null;
      };
    })[];
  };
  error?: string;
}

// API functions
const createContactPoint = async (data: CreateContactPointInput): Promise<ContactPointResponse> => {
  const response = await fetch('/api/contact-points', {
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

const fetchContactPoints = async (): Promise<ContactPointsResponse> => {
  const response = await fetch('/api/contact-points');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const fetchContactPointsByLeadId = async (leadId: string): Promise<ContactPointsResponse> => {
  const response = await fetch(`/api/contact-points?leadId=${encodeURIComponent(leadId)}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const fetchContactPointStats = async (): Promise<ContactPointStatsResponse> => {
  const response = await fetch('/api/contact-points/stats');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const fetchRecentContactPoints = async (limit: number = 10): Promise<ContactPointsWithLeadsResponse> => {
  const response = await fetch(`/api/contact-points/recent?limit=${limit}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const updateContactPoint = async ({ 
  id, 
  data 
}: { 
  id: string; 
  data: Partial<CreateContactPointInput> 
}): Promise<ContactPointResponse> => {
  const response = await fetch(`/api/contact-points/${id}`, {
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

const deleteContactPoint = async (id: string): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/contact-points/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Query keys
const contactPointKeys = {
  all: ['contactPoints'] as const,
  lists: () => [...contactPointKeys.all, 'list'] as const,
  byLead: (leadId: string) => [...contactPointKeys.all, 'byLead', leadId] as const,
  stats: () => [...contactPointKeys.all, 'stats'] as const,
  recent: (limit: number) => [...contactPointKeys.all, 'recent', limit] as const,
  detail: (id: string) => [...contactPointKeys.all, 'detail', id] as const,
} as const;

// Hooks
export const useContactPoints = () => {
  return useQuery({
    queryKey: contactPointKeys.lists(),
    queryFn: fetchContactPoints,
    select: (data) => data.data,
  });
};

export const useContactPointsByLeadId = (leadId: string) => {
  return useQuery({
    queryKey: contactPointKeys.byLead(leadId),
    queryFn: () => fetchContactPointsByLeadId(leadId),
    select: (data) => data.data,
    enabled: !!leadId,
  });
};

export const useContactPointStats = () => {
  return useQuery({
    queryKey: contactPointKeys.stats(),
    queryFn: fetchContactPointStats,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useRecentContactPoints = (limit: number = 10) => {
  return useQuery({
    queryKey: contactPointKeys.recent(limit),
    queryFn: () => fetchRecentContactPoints(limit),
    select: (data) => data.data,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
};

export const useCreateContactPoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContactPoint,
    onSuccess: (response, variables) => {
      // Invalidate all contact point queries
      queryClient.invalidateQueries({ queryKey: contactPointKeys.all });
      
      // Specifically invalidate lead-specific contact points
      queryClient.invalidateQueries({ 
        queryKey: contactPointKeys.byLead(variables.leadId) 
      });

      // Optimistically update the lists
      queryClient.setQueryData(
        contactPointKeys.lists(), 
        (oldData: ContactPointsResponse | undefined) => {
          if (!oldData) return { success: true, data: { contactPoints: [response.data] } };
          
          return {
            ...oldData,
            data: {
              ...oldData.data,
              contactPoints: [response.data, ...oldData.data.contactPoints],
            },
          };
        }
      );
    },
    onError: (error) => {
      console.error('Contact point creation error:', error);
    },
  });
};

export const useUpdateContactPoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContactPoint,
    onSuccess: (response, variables) => {
      // Invalidate all contact point queries
      queryClient.invalidateQueries({ queryKey: contactPointKeys.all });
      
      // Update the specific contact point in cache if available
      queryClient.setQueryData(
        contactPointKeys.detail(variables.id),
        response
      );
    },
    onError: (error) => {
      console.error('Contact point update error:', error);
    },
  });
};

export const useDeleteContactPoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactPoint,
    onSuccess: (_, contactPointId) => {
      // Invalidate all contact point queries
      queryClient.invalidateQueries({ queryKey: contactPointKeys.all });
      
      // Remove from cache optimistically
      queryClient.setQueryData(
        contactPointKeys.lists(),
        (oldData: ContactPointsResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            data: {
              ...oldData.data,
              contactPoints: oldData.data.contactPoints.filter(
                cp => cp.id !== contactPointId
              ),
            },
          };
        }
      );
    },
    onError: (error) => {
      console.error('Contact point deletion error:', error);
    },
  });
};