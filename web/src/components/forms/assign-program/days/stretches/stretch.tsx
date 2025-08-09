"use client";
import { TableInputField } from "@/components/ui/form";
import { TableCell, TableRow } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import StretchSet from "./sets/stretch-set";
import { Button } from "@/components/ui/button";

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

  const { fields: setFields, remove: removeSet } = useFieldArray({
    control,
    name: `days.${dayIndex}.stretches.${stretchIndex}.sets`,
  });

  function isFirstRow(index: number) {
    return index === 0;
  }

  return (
    <>
      {setFields.map((field, index) => (
        <TableRow key={field.id}>
          {/* Reorder Stretches */}
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

          {/* Stretch Name */}
          <TableCell>
            {isFirstRow(index) && (
              <TableInputField
                name={`days.${dayIndex}.stretches.${stretchIndex}.name`}
                control={control}
              />
            )}
          </TableCell>

          <StretchSet
            stretchIndex={stretchIndex}
            dayIndex={dayIndex}
            setIndex={index}
            control={control}
            onRemoveLift={onRemoveStretch}
            onRemoveSet={() => removeSet(index)}
            isLastSet={index == setFields.length - 1}
            isOnlySet={index == setFields.length - 1 && setFields.length === 1}
          />
        </TableRow>
      ))}
    </>
  );
}
