import { Invitation, User } from "@/types/generated";

export interface CreateInvitationRequest {
  inviteeEmail: string;
}

export type InvitationUser = Pick<User, 'id' | 'email' | 'name' | 'firstName' | 'lastName' | 'businessName'>;

export interface InvitationWithInviter extends Invitation {
  inviterUser: InvitationUser;
}

export interface InvitationWithInvitee extends Invitation {
  inviteeUser: InvitationUser;
}

export type InvitationType = 'sent' | 'received';