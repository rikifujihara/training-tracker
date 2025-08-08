"use client";
import { TableInputField } from "@/components/ui/form";
import { TableCell, TableRow } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Set from "./sets/set";
import { Button } from "@/components/ui/button";

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
                <Button
                  type="button"
                  variant="ghost"
                  onClick={canMoveUp ? onMoveUp : () => {}}
                >
                  <ChevronUp size="16" color="#808080" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={canMoveDown ? onMoveDown : () => {}}
                >
                  <ChevronDown size="16" color="#808080" />
                </Button>
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

          {/* Set Number */}
          <TableCell className="text-center">
            {" "}
            {isFirstRow(index) && setFields.length}
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
