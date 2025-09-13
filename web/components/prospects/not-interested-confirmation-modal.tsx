"use client";

import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

export interface NotInterestedConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
  leadName?: string;
}

export function NotInterestedConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  leadName = "this lead",
}: NotInterestedConfirmationModalProps) {
  return (
    <DeleteConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Mark ${leadName} as not interested?`}
      description="This will update the lead's status and may affect their visibility in certain filters."
      deleteLabel="Mark Not Interested"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      isPending={isPending}
    />
  );
}