"use client";

import { Button } from "@/components/ui/button";
import { TableInputField } from "@/components/ui/form";
import { TableCell, TableRow } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/trainingProgram";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { SetRangeInput } from "./sets/SetRange";

function LiftSet({
  dayIndex,
  liftIndex,
  setIndex,
  control,
}: {
  dayIndex: number;
  liftIndex: number;
  setIndex: number;
  control: Control<AssignTrainingProgramForm>;
}) {
  const isFirstRow = setIndex === 0;

  return (
    <TableRow>
      {/* Lift Name */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.name`}
          control={control}
        />
      </TableCell>

      {/* Lift Muscle Group */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.muscleGroup`}
          control={control}
        />
      </TableCell>

      {/* Set Rep Range */}
      <TableCell>
        <SetRangeInput
          dayIndex={dayIndex}
          setIndex={setIndex}
          control={control}
          minField="minReps"
          maxField="maxReps"
          liftIndex={liftIndex}
        />
      </TableCell>

      {/* Max Reps */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.maxReps`}
          inputType="number"
          control={control}
        />
      </TableCell>

      {/* Min Rest (nullable) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.minRest`}
          inputType="number"
          control={control}
        />
      </TableCell>

      {/* Max Rest (nullable) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.maxRest`}
          inputType="number"
          control={control}
        />
      </TableCell>

      {/* Min RIR (nullable) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.minRir`}
          inputType="number"
          control={control}
        />
      </TableCell>

      {/* Max RIR (nullable) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.maxRir`}
          inputType="number"
          control={control}
        />
      </TableCell>

      {/* Delete button - you can add functionality here */}
      <TableCell>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function Lift({
  dayIndex,
  liftIndex,
}: {
  liftIndex: number;
  dayIndex: number;
}) {
  const { control } = useFormContext<AssignTrainingProgramForm>();

  const { fields } = useFieldArray({
    control,
    name: `days.${dayIndex}.lifts.${liftIndex}.sets`,
  });

  return (
    <>
      {fields.map((field, index) => (
        <LiftSet
          key={field.id}
          dayIndex={dayIndex}
          liftIndex={liftIndex}
          setIndex={index}
          control={control}
        />
      ))}
    </>
  );
}
