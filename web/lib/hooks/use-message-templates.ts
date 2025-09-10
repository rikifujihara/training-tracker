import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageTemplate } from '@prisma/client';

// Types for API responses
export interface CreateTemplateInput {
  name: string;
  content: string;
}

export interface UpdateTemplateInput {
  name?: string;
  content?: string;
}

interface TemplatesResponse {
  success: boolean;
  data: {
    templates: MessageTemplate[];
  };
  error?: string;
}

interface TemplateResponse {
  success: boolean;
  data: {
    template: MessageTemplate;
  };
  error?: string;
}

interface DeleteTemplateResponse {
  success: boolean;
  data: {
    deleted: boolean;
  };
  error?: string;
}

// API functions
const fetchTemplates = async (): Promise<TemplatesResponse> => {
  const response = await fetch('/api/message-templates');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const createTemplate = async (data: CreateTemplateInput): Promise<TemplateResponse> => {
  const response = await fetch('/api/message-templates', {
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

const updateTemplate = async (
  templateId: string, 
  data: UpdateTemplateInput
): Promise<TemplateResponse> => {
  const response = await fetch(`/api/message-templates/${templateId}`, {
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

const deleteTemplate = async (templateId: string): Promise<DeleteTemplateResponse> => {
  const response = await fetch(`/api/message-templates/${templateId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Query keys
const templateKeys = {
  all: ['message-templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
} as const;

// Hooks
export const useMessageTemplates = () => {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: fetchTemplates,
    select: (data) => data.data.templates, // Extract templates from response
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTemplate,
    onSuccess: (response) => {
      // Invalidate and refetch templates after successful creation
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      
      // Optimistically update the cache
      queryClient.setQueryData(templateKeys.lists(), (oldData: TemplatesResponse | undefined) => {
        if (!oldData) {
          return {
            success: true,
            data: { templates: [response.data.template] }
          };
        }
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            templates: [...oldData.data.templates, response.data.template],
          },
        };
      });
    },
    onError: (error) => {
      console.error('Create template error:', error);
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string; data: UpdateTemplateInput }) => 
      updateTemplate(templateId, data),
    onSuccess: (response) => {
      // Invalidate and refetch templates
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      
      // Optimistically update the template in cache
      queryClient.setQueryData(templateKeys.lists(), (oldData: TemplatesResponse | undefined) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            templates: oldData.data.templates.map(template => 
              template.id === response.data.template.id ? response.data.template : template
            ),
          },
        };
      });
    },
    onError: (error) => {
      console.error('Update template error:', error);
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: (_, templateId) => {
      // Invalidate and refetch templates
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      
      // Optimistically remove the template from cache
      queryClient.setQueryData(templateKeys.lists(), (oldData: TemplatesResponse | undefined) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            templates: oldData.data.templates.filter(template => template.id !== templateId),
          },
        };
      });
    },
    onError: (error) => {
      console.error('Delete template error:', error);
    },
  });
};