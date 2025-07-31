"use client";
import { TableInputField } from "@/components/ui/form";
import { TableCell, TableRow } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import {
  ChevronDown,
  ChevronDownCircle,
  ChevronUp,
  ChevronUpCircle,
  PlusCircle,
  X,
} from "lucide-react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";

import Set from "./sets/set";

export default function Lift({
  dayIndex,
  liftIndex,
  onMoveUp,
  onMoveDown,
  onRemoveLift,
  canMoveUp,
  canMoveDown,
}: {
  liftIndex: number;
  dayIndex: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemoveLift: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const { control } = useFormContext<AssignTrainingProgramForm>();

  const {
    fields: setFields,
    remove: removeSet,
    append: addSet,
  } = useFieldArray({
    control,
    name: `days.${dayIndex}.lifts.${liftIndex}.sets`,
  });

  function isFirstRow(index: number) {
    return index === 0;
  }

  function handleAddSet() {
    addSet({
      setIndex: setFields.length, // Auto-increment based on current number of sets
      repRange: "8-12",
      weightRange: "0-0", // User will need to update this
      restRange: "60-90",
      rirRange: "1-3",
    });
  }

  return (
    <>
      {setFields.map((field, index) => (
        <TableRow key={field.id}>
          {/* Reorder Lifts */}
          <TableCell>
            {isFirstRow(index) && (
              <div className="flex justify-center">
                <ChevronUpCircle
                  color="#808080"
                  onClick={canMoveUp ? onMoveUp : () => {}}
                />
                <ChevronDownCircle
                  color="#808080"
                  onClick={canMoveDown ? onMoveDown : () => {}}
                />
              </div>
            )}
          </TableCell>

          {/* Lift Name */}
          <TableCell>
            {isFirstRow(index) && (
              <TableInputField
                name={`days.${dayIndex}.lifts.${liftIndex}.name`}
                control={control}
              />
            )}
          </TableCell>

          {/* Lift Muscle Group */}
          <TableCell>
            {isFirstRow(index) && (
              <TableInputField
                name={`days.${dayIndex}.lifts.${liftIndex}.muscleGroup`}
                control={control}
              />
            )}
          </TableCell>
          <Set
            dayIndex={dayIndex}
            liftIndex={liftIndex}
            setIndex={index}
            control={control}
            onRemoveLift={onRemoveLift}
            onAddSet={handleAddSet}
            onRemoveSet={() => removeSet(index)}
            isOnlySet={index == setFields.length - 1 && setFields.length === 1}
          />
        </TableRow>
      ))}
    </>
  );
}
