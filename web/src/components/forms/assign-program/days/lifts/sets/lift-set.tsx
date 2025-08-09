"use client";
import { Button } from "@/components/ui/button";
import { TableInputField } from "@/components/ui/form";
import { TableCell } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { Plus, PlusCircle, X } from "lucide-react";
import { Control } from "react-hook-form";

export default function LiftSet({
  dayIndex,
  liftIndex,
  setIndex,
  control,
  onRemoveLift,
  onAddSet,
  onRemoveSet,
  isOnlySet,
  isLastSet,
}: {
  dayIndex: number;
  liftIndex: number;
  setIndex: number;
  control: Control<AssignTrainingProgramForm>;
  onRemoveLift: () => void;
  onAddSet: () => void;
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
      {/* Set Number
      <TableCell className="text-center">{setIndex + 1}</TableCell> */}

      {/* Weight Range */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.weightRange`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* Set Rep Range */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.repRange`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* Rest Range (nullable) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.restRange`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* RIR range (nullable) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.rirRange`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* Add/Delete Set (only show for last set) */}
      <TableCell>
        {isLastSet && (
          <>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={onAddSet}
              className="cursor-pointer hover:text-chart-2"
            >
              <Plus className="cursor-pointer hover:text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="cursor-pointer hover:text-destructive"
              onClick={handleRemoveSet}
            >
              <X />
            </Button>
          </>
        )}
      </TableCell>
    </>
  );
}
