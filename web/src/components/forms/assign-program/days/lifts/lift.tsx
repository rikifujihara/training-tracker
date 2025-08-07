"use client";
import { TableInputField } from "@/components/ui/form";
import { TableCell, TableRow } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

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
  const { control, getValues } = useFormContext<AssignTrainingProgramForm>();

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
    const currentSets = getValues(`days.${dayIndex}.lifts.${liftIndex}.sets`);
    const previousSet =
      currentSets && currentSets.length > 0
        ? currentSets[currentSets.length - 1]
        : null;

    addSet({
      setIndex: setFields.length,
      repRange: previousSet?.repRange || "",
      weightRange: previousSet?.weightRange || "",
      restRange: previousSet?.restRange || "",
      rirRange: previousSet?.rirRange || "",
    });
  }

  return (
    <>
      {setFields.map((field, index) => (
        <TableRow key={field.id}>
          {/* Reorder Lifts */}
          <TableCell>
            {isFirstRow(index) && (
              <div className="flex flex-col justify-start">
                <ChevronUp
                  color="#808080"
                  onClick={canMoveUp ? onMoveUp : () => {}}
                />
                <ChevronDown
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
            isLastSet={index == setFields.length - 1}
            isOnlySet={index == setFields.length - 1 && setFields.length === 1}
          />
        </TableRow>
      ))}
    </>
  );
}
