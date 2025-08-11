import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/config";

const CreateInvitationSchema = z.object({
  inviteeEmail: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a trainer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "TRAINER") {
      return NextResponse.json(
        { error: "Only trainers can send invitations" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = CreateInvitationSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid invitation data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { inviteeEmail } = validation.data;

    // Find the invitee by email
    const invitee = await prisma.user.findUnique({
      where: { email: inviteeEmail },
    });

    if (!invitee) {
      return NextResponse.json(
        { error: "User with this email not found" },
        { status: 404 }
      );
    }

    if (invitee.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Can only invite users with CLIENT role" },
        { status: 400 }
      );
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        inviter: session.user.id,
        invitee: invitee.id,
        status: "pending",
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "Invitation already sent to this user" },
        { status: 409 }
      );
    }

    // Create the invitation
    const invitation = await prisma.invitation.create({
      data: {
        inviter: session.user.id,
        invitee: invitee.id,
      },
    });

    return NextResponse.json({ data: invitation }, { status: 201 });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'sent' for invitations sent by user, 'received' for invitations received

    let invitations;

    if (type === 'sent') {
      // Get invitations sent by the current user (for trainers)
      invitations = await prisma.invitation.findMany({
        where: { inviter: session.user.id },
        include: {
          inviteeUser: {
            select: {
              id: true,
              email: true,
              name: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (type === 'received') {
      // Get invitations received by the current user (for clients)
      invitations = await prisma.invitation.findMany({
        where: { invitee: session.user.id },
        include: {
          inviterUser: {
            select: {
              id: true,
              email: true,
              name: true,
              firstName: true,
              lastName: true,
              businessName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter. Use 'sent' or 'received'" },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: invitations });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}