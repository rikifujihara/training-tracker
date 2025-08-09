"use client";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { useFieldArray, useFormContext } from "react-hook-form";
import AssignProgramFormLiftsHeaders from "./assign-program-stretches-headers";
import Stretch from "./stretch";
import { Plus } from "lucide-react";
import ProgramExerciseCard from "../program-exercise-card";
import AssignProgramFormStretchesHeaders from "./assign-program-stretches-headers";

interface DayStretchesProps {
  dayIndex: number;
  onRemoveSection: () => void;
}

export default function DayStretches({ dayIndex, onRemoveSection }: DayStretchesProps) {
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

  // Add a stretch
  function handleAddStretch() {
    addStretch({
      stretchIndex: stretchFields.length,
      name: "",
      sets: [
        {
          setIndex: 0,
          weight: "",
          totalSeconds: "",
          holdSeconds: "",
          restSeconds: "",
        },
      ],
    });
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

  function handleRemoveStretchesSection() {
    onRemoveSection();
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
      emoji="🧘"
      title="Stretches"
      tableHeaders={<AssignProgramFormStretchesHeaders />}
      tableBody={tableBody}
      onDelete={handleRemoveStretchesSection}
      addButton={{
        icon: <Plus />,
        text: "Stretch",
        onClick: handleAddStretch,
      }}
    />
  );
}
