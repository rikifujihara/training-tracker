"use client";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { useFieldArray, useFormContext } from "react-hook-form";
import AssignProgramFormLiftsHeaders from "./assign-program-lifts-headers";
import Lift from "./lift";
import { Plus } from "lucide-react";
import ProgramExerciseCard from "../ProgramExerciseCard";

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
  // Handle deleting the entire lifts section
  function handleDeleteLiftsSection() {
    // Implement your logic here - maybe remove all lifts or hide the section
    console.log("Delete lifts section");
  }

  const tableBody = (
    <>
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
    </>
  );

  return (
    <ProgramExerciseCard
      emoji="🏋️"
      title="Lifts"
      tableHeaders={<AssignProgramFormLiftsHeaders />}
      tableBody={tableBody}
      onDelete={handleDeleteLiftsSection}
      addButton={{
        icon: <Plus />,
        text: "Lift",
        onClick: handleAddLift,
      }}
    />
  );
}
