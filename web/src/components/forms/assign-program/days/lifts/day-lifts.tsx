"use client";
import { Table, TableBody } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { useFieldArray, useFormContext } from "react-hook-form";
import AssignProgramFormLiftsHeaders from "./assign-program-lifts-headers";
import Lift from "./lift";
import { Button } from "@/components/ui/button";

interface DayLiftsProps {
  dayIndex: number;
}

export default function DayLifts({ dayIndex }: DayLiftsProps) {
  const { control } = useFormContext<AssignTrainingProgramForm>();

  const {
    fields: liftFields,
    append: addLift,
    remove: removeLift,
    move: moveLift,
  } = useFieldArray({
    control,
    name: `days.${dayIndex}.lifts`,
  });

  // Add a lift
  function handleAddLift() {
    addLift({
      muscleGroup: "",
      name: "",
      liftIndex: liftFields.length, // Auto-increment based on current number of lifts
      sets: [
        {
          setIndex: 0,
          repRange: "8-12",
          weightRange: "0-0",
          restRange: "60-90",
          rirRange: "1-3",
        },
      ],
    });
  }

  // Move lift up in the order
  function handleMoveUp(liftIndex: number) {
    if (liftIndex > 0) {
      moveLift(liftIndex, liftIndex - 1);
    }
  }

  // Move lift down in the order
  function handleMoveDown(liftIndex: number) {
    if (liftIndex < liftFields.length - 1) {
      moveLift(liftIndex, liftIndex + 1);
    }
  }

  // Remove a lift completely
  function handleRemoveLift(liftIndex: number) {
    removeLift(liftIndex);
  }

  return (
    <>
      <p className="text-lg text-ring ml-2">Lifts</p>
      <Table className="">
        <AssignProgramFormLiftsHeaders />
        <TableBody>
          {liftFields.map((field, index) => (
            <Lift
              key={field.id}
              dayIndex={dayIndex}
              liftIndex={index}
              canMoveUp={index > 0}
              canMoveDown={index < liftFields.length - 1}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onRemoveLift={() => handleRemoveLift(index)}
            />
          ))}
        </TableBody>
      </Table>
      <Button type="button" onClick={handleAddLift}>
        Add Lift
      </Button>
    </>
  );
}
