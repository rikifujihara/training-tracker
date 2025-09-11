"use client";
import React, { useState } from "react";
import { ProspectCard } from "@/components/prospects/prospect-card";
import { NotesSidePane } from "@/components/prospects/notes-side-pane";

import { useLeads, useLeadStats } from "@/lib/hooks/use-leads";
import { useTasks } from "@/lib/hooks/use-tasks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lead } from "@/lib/types/lead";
import { TaskStatus } from "@/lib/types/task";
import { formatTaskType } from "@/lib/utils/task";

export default function ProspectsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNotesSidePane, setShowNotesSidePane] = useState(false);
  
  const {
    data: leadsData,
    isLoading: leadsLoading,
    error: leadsError,
  } = useLeads();
  const { isLoading: statsLoading } = useLeadStats();
  
  // Fetch all tasks to determine next actions
  const { data: allTasks, isLoading: tasksLoading } = useTasks();

  // Function to get next action for a lead
  const getNextActionForLead = (leadId: string): string => {
    if (!allTasks) return "First Call";
    
    // Find the first pending task for this lead
    const nextTask = allTasks.find(
      (task) => task.leadId === leadId && task.status === TaskStatus.PENDING
    );
    
    if (!nextTask) return "First Call";
    
    return formatTaskType(nextTask.taskType);
  };

  // Set the first lead as selected by default when leads load
  React.useEffect(() => {
    if (leadsData?.leads && leadsData.leads.length > 0 && !selectedLead) {
      setSelectedLead(leadsData.leads[0]);
    }
  }, [leadsData?.leads, selectedLead]);

  const handleShowNotes = (lead: Lead) => {
    setSelectedLead(lead);
    setShowNotesSidePane(true);
  };

  if (leadsLoading || statsLoading || tasksLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (leadsError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading leads: {leadsError.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recent Leads Cards */}
      {leadsData?.leads && leadsData.leads.length > 0 ? (
        <div className="flex gap-6">
          <div className="space-y-4 flex-shrink-0">
            {leadsData.leads.slice(0, 10).map((lead) => (
              <ProspectCard 
                key={lead.id} 
                lead={lead} 
                nextAction={getNextActionForLead(lead.id)}
                onShowNotes={handleShowNotes}
                selectedForNotes={selectedLead?.id === lead.id}
              />
            ))}
          </div>
          <div className="min-w-[400px] w-full">
            <div className="sticky top-6 h-[calc(100vh-120px)]">
              <NotesSidePane 
                lead={selectedLead} 
                isVisible={showNotesSidePane || !!selectedLead}
              />
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-4">
              No leads yet.{" "}
              <a href="/protected/upload-leads" className="underline">
                Upload your first leads
              </a>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
