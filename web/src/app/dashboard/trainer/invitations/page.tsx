"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateInvitation, useInvitations } from "@/hooks";
import { InvitationsTable } from "@/components/tables/invitations-table";

export default function TrainerInvitationsPage() {
  const [email, setEmail] = useState("");
  const createInvitationMutation = useCreateInvitation();
  const { data: invitationsResponse, isLoading, error } = useInvitations("sent");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    createInvitationMutation.mutate(
      { inviteeEmail: email },
      {
        onSuccess: () => {
          setEmail("");
        },
      }
    );
  };

  const invitations = invitationsResponse?.data || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Client Invitations</h1>
        <p className="text-muted-foreground">
          Invite clients to join your training program by entering their email address.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Invitation</CardTitle>
          <CardDescription>
            Enter the email address of the client you want to invite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Client Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={createInvitationMutation.isPending}
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={createInvitationMutation.isPending || !email.trim()}
            >
              {createInvitationMutation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
            
            {createInvitationMutation.error && (
              <div className="text-sm text-red-600">
                {createInvitationMutation.error.message}
              </div>
            )}
            
            {createInvitationMutation.isSuccess && (
              <div className="text-sm text-green-600">
                Invitation sent successfully!
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outgoing Invitations</CardTitle>
          <CardDescription>
            View and manage the invitations you&apos;ve sent to clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading invitations...</div>
          ) : error ? (
            <div className="text-red-600">Failed to load invitations</div>
          ) : (
            <InvitationsTable invitations={invitations} type="sent" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}