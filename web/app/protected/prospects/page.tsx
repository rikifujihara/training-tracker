"use client";
import { ProspectCard } from "@/components/prospects/prospect-card";

import { useLeads, useLeadStats } from "@/lib/hooks/use-leads";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProspectsPage() {
  const {
    data: leadsData,
    isLoading: leadsLoading,
    error: leadsError,
  } = useLeads();
  const { isLoading: statsLoading } = useLeadStats();

  if (leadsLoading || statsLoading) {
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
        <div className="space-y-4">
          {leadsData.leads.slice(0, 10).map((lead) => (
            <ProspectCard key={lead.id} lead={lead} nextAction="First Call" />
          ))}
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
