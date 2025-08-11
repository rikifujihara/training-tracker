"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvitations } from "@/hooks";
import { InvitationsTable } from "@/components/tables/invitations-table";

export default function ClientInvitationsPage() {
  const { data: invitationsResponse, isLoading, error } = useInvitations("received");

  const invitations = invitationsResponse?.data || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Trainer Invitations</h1>
        <p className="text-muted-foreground">
          View and respond to invitations from trainers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Received Invitations</CardTitle>
          <CardDescription>
            Invitations from trainers who want to work with you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading invitations...</div>
          ) : error ? (
            <div className="text-red-600">Failed to load invitations</div>
          ) : (
            <InvitationsTable invitations={invitations} type="received" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}