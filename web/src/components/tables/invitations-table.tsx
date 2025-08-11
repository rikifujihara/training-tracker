"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAcceptInvitation, useDeclineInvitation } from "@/hooks";
import { InvitationWithInviter, InvitationWithInvitee, InvitationType } from "@/lib/api/invitations/types";

interface InvitationsTableProps {
  invitations: (InvitationWithInviter | InvitationWithInvitee)[];
  type: InvitationType;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "accepted":
      return "default";
    case "declined":
      return "destructive";
    default:
      return "secondary";
  }
};

const formatName = (firstName: string | null, lastName: string | null, name: string | null) => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return name || "Unknown";
};

export function InvitationsTable({ invitations, type }: InvitationsTableProps) {
  const acceptInvitationMutation = useAcceptInvitation();
  const declineInvitationMutation = useDeclineInvitation();

  const handleAccept = (invitationId: string) => {
    acceptInvitationMutation.mutate(invitationId);
  };

  const handleDecline = (invitationId: string) => {
    declineInvitationMutation.mutate(invitationId);
  };

  if (invitations.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {type === "sent" ? "No invitations sent yet." : "No invitations received yet."}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {type === "sent" ? "Client" : "Trainer"}
            </TableHead>
            <TableHead>Email</TableHead>
            {type === "received" && <TableHead>Business</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Date Sent</TableHead>
            {type === "received" && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => {
            const user = type === "sent" 
              ? (invitation as InvitationWithInvitee).inviteeUser 
              : (invitation as InvitationWithInviter).inviterUser;

            return (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">
                  {formatName(user.firstName, user.lastName, user.name)}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                {type === "received" && (
                  <TableCell>
                    {(user as InvitationWithInviter["inviterUser"]).businessName || "N/A"}
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(invitation.status)}>
                    {invitation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(invitation.createdAt).toLocaleDateString()}
                </TableCell>
                {type === "received" && invitation.status === "pending" && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(invitation.id)}
                        disabled={acceptInvitationMutation.isPending}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecline(invitation.id)}
                        disabled={declineInvitationMutation.isPending}
                      >
                        Decline
                      </Button>
                    </div>
                  </TableCell>
                )}
                {type === "received" && invitation.status !== "pending" && (
                  <TableCell>-</TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}