"use client";

import * as React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                type="button"
                onClick={showDeleteWarning ? () => {} : onDelete}
              >
                <X size={16} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete the whole section.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
