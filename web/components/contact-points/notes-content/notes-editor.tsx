import * as React from "react";
import { Button } from "@/components/ui/button";
import { Save, PenLine } from "lucide-react";
import { Lead } from "@/lib/types/lead";

interface NotesEditorProps {
  lead: Lead;
  variant: "modal" | "sidepane";
  editingNotes: boolean;
  setEditingNotes: (editing: boolean) => void;
  localNotes: string;
  hasNotesChanges: boolean;
  isUpdating: boolean;
  onNotesChange: (value: string) => void;
  onSaveNotes: () => void;
}

export function NotesEditor({
  lead,
  variant,
  editingNotes,
  setEditingNotes,
  localNotes,
  hasNotesChanges,
  isUpdating,
  onNotesChange,
  onSaveNotes,
}: NotesEditorProps) {
  const sectionClasses =
    variant === "modal"
      ? "bg-surface-primary p-3 rounded-lg space-y-3"
      : "bg-surface-primary p-4 rounded-lg space-y-4";

  const inputClasses =
    variant === "modal" ? "text-[14px] h-10" : "text-[16px] h-12";

  return (
    <div className={sectionClasses}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">General Notes</h3>
        <div className="flex items-center space-x-2">
          {editingNotes ? (
            <div className="flex items-center space-x-2">
              <Button
                onClick={onSaveNotes}
                disabled={!hasNotesChanges || isUpdating}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Save className="h-3 w-3" />
                <span>Save</span>
              </Button>
              <Button
                onClick={() => setEditingNotes(false)}
                variant="outline"
                size="sm"
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setEditingNotes(true)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <PenLine className="h-3 w-3" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </div>

      {editingNotes ? (
        <textarea
          value={localNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add general notes about this lead..."
          className={`w-full min-h-[100px] p-3 border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${inputClasses}`}
          disabled={isUpdating}
        />
      ) : (
        <div className="min-h-[60px] p-3 border border-input bg-muted rounded-md">
          {lead?.generalNotes ? (
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {lead.generalNotes}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No notes added yet. Click Edit to add notes about this lead.
            </p>
          )}
        </div>
      )}
    </div>
  );
}