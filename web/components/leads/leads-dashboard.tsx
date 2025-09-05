"use client";

import { useLeads, useLeadStats } from "@/lib/hooks/use-leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone, TrendingUp } from "lucide-react";

export function LeadsDashboard() {
  const { data: leadsData, isLoading: leadsLoading, error: leadsError } = useLeads();
  const { data: statsData, isLoading: statsLoading } = useLeadStats();

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

  const stats = statsData || {
    total: 0,
    withEmail: 0,
    withPhone: 0,
    recentImports: 0,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withEmail}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.withEmail / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Phone</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withPhone}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.withPhone / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Imports</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentImports}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {leadsData?.leads && leadsData.leads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Goals</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsData.leads.slice(0, 10).map((lead, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        {lead.firstName || lead.lastName 
                          ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim() 
                          : '-'}
                      </td>
                      <td className="p-2">{lead.email || '-'}</td>
                      <td className="p-2">{lead.phoneNumber || '-'}</td>
                      <td className="p-2 max-w-xs truncate">{lead.goals || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leadsData.leads.length > 10 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Showing 10 of {leadsData.leads.length} leads
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No leads yet. <a href="/protected/upload-leads" className="underline">Upload your first leads</a>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}