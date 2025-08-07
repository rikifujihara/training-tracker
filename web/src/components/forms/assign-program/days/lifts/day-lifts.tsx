"use client";
import { Table, TableBody } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { useFieldArray, useFormContext } from "react-hook-form";
import AssignProgramFormLiftsHeaders from "./assign-program-lifts-headers";
import Lift from "./lift";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

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
          repRange: "",
          weightRange: "",
          restRange: "",
          rirRange: "",
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
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span>🏋️</span>
            <h3 className="text-lg font-semibold text-gray-900">Lifts</h3>
          </div>
          <button
            onClick={() => {}}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
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
        <div className="p-4 border-t border-gray-100">
          <Button
            className="mt-2 rounded-xs"
            type="button"
            onClick={handleAddLift}
          >
            <Plus /> Lift
          </Button>
        </div>
      </div>
    </>
  );
}
