"use client";
import { Table, TableBody } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { useFieldArray, useFormContext } from "react-hook-form";
import AssignProgramFormLiftsHeaders from "./assign-program-stretches-headers";
import { Button } from "@/components/ui/button";
import Stretch from "./stretch";
import { PlusCircle } from "lucide-react";

interface DayLiftsProps {
  dayIndex: number;
}

export default function DayStretches({ dayIndex }: DayLiftsProps) {
  const { control } = useFormContext<AssignTrainingProgramForm>();

  const {
    fields: stretchFields,
    append: addStretch,
    remove: removeStretch,
    move: moveStretch,
  } = useFieldArray({
    control,
    name: `days.${dayIndex}.stretches`,
  });

  // Add a lift
  function handleAddLift() {
    addStretch();
  }

  // Move lift up in the order
  function handleMoveUp(liftIndex: number) {
    if (liftIndex > 0) {
      moveStretch(liftIndex, liftIndex - 1);
    }
  }

  // Move lift down in the order
  function handleMoveDown(liftIndex: number) {
    if (liftIndex < stretchFields.length - 1) {
      moveStretch(liftIndex, liftIndex + 1);
    }
  }

  // Remove a lift completely
  function handleRemoveStretch(liftIndex: number) {
    removeStretch(liftIndex);
  }

  return (
    <>
      <Table className="mt-20">
        <AssignProgramFormLiftsHeaders />
        <TableBody>
          {stretchFields.map((field, index) => (
            <Stretch
              key={field.id}
              dayIndex={dayIndex}
              stretchIndex={index}
              canMoveUp={index > 0}
              canMoveDown={index < stretchFields.length - 1}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onRemoveStretch={() => handleRemoveStretch(index)}
            />
          ))}
        </TableBody>
      </Table>
      <Button className="mt-2" type="button" onClick={handleAddLift}>
        <PlusCircle /> Stretch
      </Button>
    </>
  );
}
