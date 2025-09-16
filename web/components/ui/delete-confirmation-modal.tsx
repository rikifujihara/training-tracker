"use client";

import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  deleteLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  deleteLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  isPending = false,
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent
          className="w-[320px] p-6 gap-4 rounded-lg bg-surface-primary"
          showCloseButton={false}
        >
          {/* Title */}
          <DialogTitle className="text-center text-sm font-normal text-text-body leading-normal">
            {title}
          </DialogTitle>

          {/* Description - hidden but keeping prop for flexibility */}
          {description && (
            <div className="text-center">
              <p className="text-xs text-text-body leading-normal">
                {description}
              </p>
            </div>
          )}

          {/* Delete Button */}
          <Button
            variant="destructive"
            className=" font-normal"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : deleteLabel}
          </Button>

          {/* Cancel Button */}
          <Button
            variant="secondary"
            className="w-full bg-surface-action-secondary text-text-body font-semibold"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
