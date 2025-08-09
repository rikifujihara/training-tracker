"use client";
import { AssignTrainingProgramForm } from "@/types/programs/assignTrainingProgramForm";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus } from "lucide-react";
import ProgramExerciseCard from "../program-exercise-card";
import Cardio from "./cardio";
import AssignProgramFormCardioHeaders from "./assign-program-cardio-headers";

interface DayCardioProps {
  dayIndex: number;
  onRemoveSection: () => void;
}

export default function DayCardio({ dayIndex, onRemoveSection }: DayCardioProps) {
  const { control } = useFormContext<AssignTrainingProgramForm>();

  const {
    fields: cardioFields,
    append: addCardio,
    remove: removeCardio,
    move: moveCardio,
  } = useFieldArray({
    control,
    name: `days.${dayIndex}.cardio`,
  });

  // Add a Cardio
  function handleAddCardio() {
    addCardio({
      name: "",
      cardioIndex: cardioFields.length,
      sets: [{ setIndex: 0, speedRange: "", inclineRange: "", timeRange: "" }],
    });
  }

  // Move lift up in the order
  function handleMoveUp(liftIndex: number) {
    if (liftIndex > 0) {
      moveCardio(liftIndex, liftIndex - 1);
    }
  }

  // Move lift down in the order
  function handleMoveDown(liftIndex: number) {
    if (liftIndex < cardioFields.length - 1) {
      moveCardio(liftIndex, liftIndex + 1);
    }
  }

  // Remove a lift completely
  function handleRemoveCardio(liftIndex: number) {
    removeCardio(liftIndex);
  }

  const tableBody = cardioFields.map((field, index) => (
    <Cardio
      key={field.id}
      dayIndex={dayIndex}
      cardioIndex={index}
      canMoveUp={index > 0}
      canMoveDown={index < cardioFields.length - 1}
      onMoveUp={() => handleMoveUp(index)}
      onMoveDown={() => handleMoveDown(index)}
      onRemoveCardio={() => handleRemoveCardio(index)}
    />
  ));

  function handleRemoveCardioSection() {
    onRemoveSection();
  }

  return (
    <ProgramExerciseCard
      emoji="🏃‍➡️"
      title="Cardio"
      tableHeaders={<AssignProgramFormCardioHeaders />}
      tableBody={tableBody}
      onDelete={handleRemoveCardioSection}
      addButton={{
        icon: <Plus />,
        text: "Cardio",
        onClick: handleAddCardio,
      }}
    />
  );
}
