import { AssignTrainingProgramForm } from "@/types/programs/trainingProgram";
import { UseFormReturn } from "react-hook-form";

export function onSubmit(formValues: AssignTrainingProgramForm) {
  console.log("submitted!");
  console.log(formValues);
}

export function onSubmitError(
  errors: Record<string, { message?: string }>,
  form: UseFormReturn<AssignTrainingProgramForm>
) {
  console.log("❌ Form validation errors:");
  console.log(errors);

  // More detailed error logging
  console.group("📋 Detailed Error Breakdown:");
  Object.entries(errors).forEach(([fieldName, error]) => {
    console.log(`${fieldName}:`, error.message || error);
  });
  console.groupEnd();

  // Check current form state for debugging
  console.log("📊 Current form state:", {
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
    touchedFields: form.formState.touchedFields,
    dirtyFields: form.formState.dirtyFields,
  });
}
export const defaultAssignFormValues = {
  name: "12 Week Strength",
  weeksDuration: 12,
  clientId: null, // Changed from "" to null to match schema
  days: [
    {
      name: "Day 1",
      dayIndex: 0,
      lifts: [
        {
          muscleGroup: "Chest",
          name: "Bench",
          liftIndex: 0,
          sets: [
            {
              setIndex: 0,
              minReps: 8,
              maxReps: 12,
              minWeight: 12,
              maxWeight: 15,
            },
          ],
        },
      ],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 2",
      dayIndex: 1,
      lifts: [
        {
          muscleGroup: "Back",
          name: "Row",
          liftIndex: 0,
          sets: [
            {
              setIndex: 0,
              minReps: 8,
              maxReps: 12,
              minWeight: 10,
              maxWeight: 12,
            },
          ],
        },
      ],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 3",
      dayIndex: 2,
      lifts: [
        {
          muscleGroup: "Legs",
          name: "Squat",
          liftIndex: 0,
          sets: [
            {
              setIndex: 0,
              minReps: 8,
              maxReps: 12,
              minWeight: 15,
              maxWeight: 20,
            },
          ],
        },
      ],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 4",
      dayIndex: 3,
      lifts: [
        {
          muscleGroup: "Shoulders",
          name: "Press",
          liftIndex: 0,
          sets: [
            {
              setIndex: 0,
              minReps: 8,
              maxReps: 12,
              minWeight: 8,
              maxWeight: 10,
            },
          ],
        },
      ],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 5",
      dayIndex: 4,
      lifts: [
        {
          muscleGroup: "Arms",
          name: "Curl",
          liftIndex: 0,
          sets: [
            {
              setIndex: 0,
              minReps: 8,
              maxReps: 12,
              minWeight: 5,
              maxWeight: 8,
            },
          ],
        },
      ],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 6",
      dayIndex: 5,
      lifts: [
        {
          muscleGroup: "Core",
          name: "Plank",
          liftIndex: 0,
          sets: [
            {
              setIndex: 0,
              minReps: 1,
              maxReps: 1,
              minWeight: 0,
              maxWeight: 0,
            },
          ],
        },
      ],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 7",
      dayIndex: 6,
      lifts: [
        {
          muscleGroup: "Full Body",
          name: "Deadlift",
          liftIndex: 0,
          sets: [
            {
              setIndex: 0,
              minReps: 5,
              maxReps: 8,
              minWeight: 20,
              maxWeight: 25,
            },
          ],
        },
      ],
      cardio: [],
      stretches: [],
    },
  ],
};
