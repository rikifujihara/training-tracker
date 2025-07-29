import { AssignTrainingProgramForm } from "@/types/trainingProgram";
import { useFormContext, UseFormReturn } from "react-hook-form";

export function onSubmit(formValues: AssignTrainingProgramForm) {
  console.log("submitted!");
  console.log(formValues);
}

export function onSubmitError(
  errors: any,
  form: UseFormReturn<AssignTrainingProgramForm>
) {
  console.log("❌ Form validation errors:");
  console.log(errors);

  // More detailed error logging
  console.group("📋 Detailed Error Breakdown:");
  Object.entries(errors).forEach(([fieldName, error]: [string, any]) => {
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
  clientId: "",
  days: [
    { name: "Push Day", lifts: [{ name: "Bench", sets: [{}, {}] }, {}] },
    { name: "Push Day", lifts: [{ name: "Bench", sets: [{}, {}] }, {}] },
    { name: "Push Day", lifts: [{ name: "Bench", sets: [{}, {}] }, {}] },
  ],
};
