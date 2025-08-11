import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/config";

const InvitationIdSchema = z.object({
  invitationId: z.string().min(1, "Invitation ID is required"),
});

export async function PATCH(
  req: NextRequest, 
  context: { params: Promise<{ invitationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;

    // Validate invitation ID parameter
    const paramValidation = InvitationIdSchema.safeParse(params);
    
    if (!paramValidation.success) {
      return NextResponse.json(
        { error: "Invalid invitation ID", details: paramValidation.error.issues },
        { status: 400 }
      );
    }

    const { invitationId } = paramValidation.data;

    // Find the invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if the current user is the invitee
    if (invitation.invitee !== session.user.id) {
      return NextResponse.json(
        { error: "You can only decline invitations sent to you" },
        { status: 403 }
      );
    }

    // Check if invitation is still pending
    if (invitation.status !== "pending") {
      return NextResponse.json(
        { error: "This invitation has already been processed" },
        { status: 400 }
      );
    }

    // Update invitation status to declined
    const updatedInvitation = await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: "declined" },
    });

    return NextResponse.json({ data: updatedInvitation });
  } catch (error) {
    console.error("Error declining invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}