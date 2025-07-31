"use client";
import { TableInputField } from "@/components/ui/form";
import { TableCell, TableRow } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { PlusCircle, X } from "lucide-react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";

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
      {/* Reorder lift Name */}
      <TableCell>{isFirstRow && <p>arrows here</p>}</TableCell>

      {/* Lift Name */}
      <TableCell>
        {isFirstRow && (
          <TableInputField
            name={`days.${dayIndex}.lifts.${liftIndex}.name`}
            control={control}
          />
        )}
      </TableCell>

      {/* Lift Muscle Group */}
      <TableCell>
        {isFirstRow && (
          <TableInputField
            name={`days.${dayIndex}.lifts.${liftIndex}.muscleGroup`}
            control={control}
          />
        )}
      </TableCell>

      {/* Set Number */}
      <TableCell className="text-center">{setIndex + 1}</TableCell>

      {/* Weight Range */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.weightRange`}
          control={control}
        />
      </TableCell>

      {/* Set Rep Range */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.repRange`}
          control={control}
        />
      </TableCell>

      {/* Rest Range (nullable) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.restRange`}
          control={control}
        />
      </TableCell>

      {/* RIR range (nullable) */}
      <TableCell>
        <TableInputField
          name={`days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}.rirRange`}
          control={control}
        />
      </TableCell>

      {/* Add Set */}
      <TableCell>
        <PlusCircle />
      </TableCell>

      {/* Delete Set */}
      <TableCell>
        <X />
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
