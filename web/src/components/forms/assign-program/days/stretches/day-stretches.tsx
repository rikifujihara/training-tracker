"use client";
import { Table, TableBody } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { useFieldArray, useFormContext } from "react-hook-form";
import AssignProgramFormLiftsHeaders from "./assign-program-stretches-headers";
import { Button } from "@/components/ui/button";
import Stretch from "./stretch";
import { Plus, PlusCircle } from "lucide-react";
import ProgramExerciseCard from "../ProgramExerciseCard";

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

  const tableBody = stretchFields.map((field, index) => (
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
  ));

  return (
    <ProgramExerciseCard
      emoji="🏋️"
      title="Lifts"
      tableHeaders={<AssignProgramFormLiftsHeaders />}
      tableBody={tableBody}
      onDelete={() => {}}
      addButton={{
        icon: <Plus />,
        text: "Lift",
        onClick: handleAddLift,
      }}
    />
  );
}
