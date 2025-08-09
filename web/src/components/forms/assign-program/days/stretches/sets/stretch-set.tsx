"use client";
import { Button } from "@/components/ui/button";
import { TableInputField } from "@/components/ui/form";
import { TableCell } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { Plus, PlusCircle, X } from "lucide-react";
import { Control } from "react-hook-form";

export default function StretchSet({
  dayIndex,
  stretchIndex,
  setIndex,
  control,
  onRemoveLift,
  onRemoveSet,
  isOnlySet,
  isLastSet,
}: {
  dayIndex: number;
  stretchIndex: number;
  setIndex: number;
  control: Control<AssignTrainingProgramForm>;
  onRemoveLift: () => void;
  onRemoveSet: () => void;
  isOnlySet: boolean;
  isLastSet: boolean;
}) {
  function handleRemoveSet() {
    if (isOnlySet) {
      onRemoveLift();
    } else {
      onRemoveSet();
    }
  }
  return (
    <>
      {/* Weight */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.stretches.${stretchIndex}.sets.${setIndex}.weight`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* Total (s) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.stretches.${stretchIndex}.sets.${setIndex}.totalSeconds`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* Set Rep Range */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.stretches.${stretchIndex}.sets.${setIndex}.holdSeconds`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* Rest Range (nullable) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.stretches.${stretchIndex}.sets.${setIndex}.restSeconds`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* Add Set (only show for last set) */}
      <TableCell>
        {isLastSet && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="cursor-pointer hover:text-destructive"
            onClick={handleRemoveSet}
          >
            <X />
          </Button>
        )}
      </TableCell>
    </>
  );
}
