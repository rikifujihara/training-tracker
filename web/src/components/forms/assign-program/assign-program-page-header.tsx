"use client";

import { AssignTrainingProgramForm } from "@/types/programs/trainingProgram";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { onSubmit } from "./form-utilities";

export default function AssignProgramHeader() {
  const form = useFormContext<AssignTrainingProgramForm>();

  function onSubmitError(errors: any) {
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

  return (
    <div className="w-full">
      <div className="w-full flex space-between mb-5">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Program Builder</h1>
          <span className="text-gray-500">
            Create and manage workout programs
          </span>
        </div>
        <div className="flex gap-2 ">
          <Button>
            <Save />
            Save Draft
          </Button>
          <Button onClick={form.handleSubmit(onSubmit, onSubmitError)}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
