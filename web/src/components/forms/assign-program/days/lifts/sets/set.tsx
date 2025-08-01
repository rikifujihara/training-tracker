"use client";
import { TableInputField } from "@/components/ui/form";
import { TableCell } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { PlusCircle, X } from "lucide-react";
import { Control } from "react-hook-form";

export default function Set({
  dayIndex,
  liftIndex,
  setIndex,
  control,
  onRemoveLift,
  onAddSet,
  onRemoveSet,
  isOnlySet,
}: {
  dayIndex: number;
  liftIndex: number;
  setIndex: number;
  control: Control<AssignTrainingProgramForm>;
  onRemoveLift: () => void;
  onAddSet: () => void;
  onRemoveSet: () => void;
  isOnlySet: boolean;
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
      {/* Set Number */}
      <TableCell className="text-center">{setIndex + 1}</TableCell>

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

      {/* Add Set */}
      <TableCell>
        <PlusCircle
          onClick={onAddSet}
          className="cursor-pointer hover:text-primary"
        />
      </TableCell>

      {/* Delete Set */}
      <TableCell>
        <X
          onClick={handleRemoveSet}
          className="cursor-pointer hover:text-destructive"
        />
      </TableCell>
    </>
  );
}
