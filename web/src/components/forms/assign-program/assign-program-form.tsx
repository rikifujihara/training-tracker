"use client";
import { Form as FormProvider } from "@/components/ui/form";
import {
  AssignTrainingProgramForm,
  AssignTrainingProgramFormSchema,
} from "@/types/trainingProgram";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProgramDetails from "./program-details";
import AssignProgramHeader from "./assign-program-page-header";
import Days from "./days/days";
import { defaultAssignFormValues } from "./form-utilities";

export default function AssignProgramForm() {
  const form = useForm<AssignTrainingProgramForm>({
    resolver: zodResolver(AssignTrainingProgramFormSchema),
    defaultValues: defaultAssignFormValues,
  });

  return (
    <div className="w-full">
      <FormProvider {...form}>
        <form className="space-y-8 mt-5">
          <AssignProgramHeader />
          <ProgramDetails />
          <Days />
        </form>
      </FormProvider>
    </div>
  );
}
