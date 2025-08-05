"use client";
import { TableInputField } from "@/components/ui/form";
import { TableCell, TableRow } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Set from "./sets/set";

export default function Stretch({
  dayIndex,
  stretchIndex,
  onMoveUp,
  onMoveDown,
  onRemoveStretch,
  canMoveUp,
  canMoveDown,
}: {
  stretchIndex: number;
  dayIndex: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemoveStretch: () => void;
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
    name: `days.${dayIndex}.stretches.${stretchIndex}.sets`,
  });

  function isFirstRow(index: number) {
    return index === 0;
  }

  function handleAddSet() {
    const currentSets = getValues(
      `days.${dayIndex}.stretches.${stretchIndex}.sets`
    );
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
          {/* Reorder Stretches */}
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

          {/* Stretch Index */}
          <TableCell className="text-center">
            {isFirstRow(index) && stretchIndex + 1}
          </TableCell>

          {/* Stretch Name */}
          <TableCell>
            {isFirstRow(index) && (
              <TableInputField
                name={`days.${dayIndex}.stretches.${stretchIndex}.name`}
                control={control}
              />
            )}
          </TableCell>

          {/* Lift Muscle Group */}
          <TableCell>
            {isFirstRow(index) && (
              <TableInputField
                name={`days.${dayIndex}.stretches.${stretchIndex}.muscleGroup`}
                control={control}
              />
            )}
          </TableCell>
          <Set
            dayIndex={dayIndex}
            setIndex={index}
            control={control}
            onRemoveLift={onRemoveStretch}
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
