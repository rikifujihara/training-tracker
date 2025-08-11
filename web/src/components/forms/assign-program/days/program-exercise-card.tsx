"use client";

import * as React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface ProgramExerciseCardProps {
  emoji: string;
  title: string;
  tableHeaders: React.ReactNode;
  tableBody: React.ReactNode;
  showDeleteWarning: boolean;
  onDelete?: () => void;
  addButton: {
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
  };
  className?: string;
}

export default function ProgramExerciseCard({
  emoji,
  title,
  tableHeaders,
  tableBody,
  showDeleteWarning,
  onDelete,
  addButton,
  className = "",
}: ProgramExerciseCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span>{emoji}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {onDelete && showDeleteWarning && (
          <ConfirmationDialog
            trigger={
              <button
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                type="button"
              >
                <X size={16} />
              </button>
            }
            title="Are you sure?"
            description="This will delete the whole section for this day."
            onConfirm={onDelete}
          />
        )}
        {onDelete && !showDeleteWarning && (
          <button
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            type="button"
            onClick={onDelete}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Table>
        {tableHeaders}
        <TableBody>{tableBody}</TableBody>
      </Table>

      <div className="p-4 border-t border-gray-100">
        <Button
          className="mt-2 rounded-xs"
          type="button"
          onClick={addButton.onClick}
        >
          {addButton.icon}
          {addButton.text}
        </Button>
      </div>
    </div>
  );
}
