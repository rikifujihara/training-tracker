"use client";
import { TableInputField } from "@/components/ui/form";
import { TableCell, TableRow } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import CardioSet from "./sets/cardio-set";
import { Button } from "@/components/ui/button";

export default function Cardio({
  dayIndex,
  cardioIndex,
  onMoveUp,
  onMoveDown,
  onRemoveCardio,
  canMoveUp,
  canMoveDown,
}: {
  cardioIndex: number;
  dayIndex: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemoveCardio: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const { control } = useFormContext<AssignTrainingProgramForm>();

  const { fields: setFields, remove: removeSet } = useFieldArray({
    control,
    name: `days.${dayIndex}.cardio.${cardioIndex}.sets`,
  });

  function isFirstRow(index: number) {
    return index === 0;
  }

  return (
    <>
      {setFields.map((field, index) => (
        <TableRow key={field.id}>
          {/* Reorder */}
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

          {/* Name */}
          <TableCell>
            {isFirstRow(index) && (
              <TableInputField
                name={`days.${dayIndex}.cardio.${cardioIndex}.name`}
                control={control}
              />
            )}
          </TableCell>

          <CardioSet
            setIndex={index}
            dayIndex={dayIndex}
            cardioIndex={cardioIndex}
            control={control}
            onRemoveCardio={onRemoveCardio}
            onRemoveSet={() => removeSet(index)}
            isLastSet={index == setFields.length - 1}
            isOnlySet={index == setFields.length - 1 && setFields.length === 1}
          />
        </TableRow>
      ))}
    </>
  );
}
