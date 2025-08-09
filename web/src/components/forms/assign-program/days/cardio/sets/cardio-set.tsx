"use client";
import { Button } from "@/components/ui/button";
import { TableInputField } from "@/components/ui/form";
import { TableCell } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { X } from "lucide-react";
import { Control } from "react-hook-form";

export default function CardioSet({
  dayIndex,
  cardioIndex,
  setIndex,
  control,
  onRemoveCardio,
  onRemoveSet,
  isOnlySet,
  isLastSet,
}: {
  dayIndex: number;
  cardioIndex: number;
  setIndex: number;
  control: Control<AssignTrainingProgramForm>;
  onRemoveCardio: () => void;
  onRemoveSet: () => void;
  isOnlySet: boolean;
  isLastSet: boolean;
}) {
  function handleRemoveSet() {
    if (isOnlySet) {
      onRemoveCardio();
    } else {
      onRemoveSet();
    }
  }
  return (
    <>
      {/* Speed */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.cardio.${cardioIndex}.sets.${setIndex}.speedRange`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* Total (s) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.cardio.${cardioIndex}.sets.${setIndex}.inclineRange`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* Set Rep Range */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.cardio.${cardioIndex}.sets.${setIndex}.timeRange`}
          control={control}
          placeholder="min-max"
        />
      </TableCell>

      {/* Remove Set */}
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="cursor-pointer hover:text-destructive"
          onClick={handleRemoveSet}
        >
          <X />
        </Button>
      </TableCell>
    </>
  );
}
