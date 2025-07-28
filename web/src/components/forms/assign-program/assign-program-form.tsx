"use client";

import { Form } from "@/components/ui/form";
import { Table } from "@/components/ui/table";
import {
  AssignTrainingProgramForm,
  AssignTrainingProgramFormSchema,
} from "@/types/trainingProgram";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProgramDayTable from "./program-day";
import AssignProgramFormLiftsHeaders from "./assign-program-lifts-headers";
import ProgramDetails from "./program-details";
import AssignProgramHeader from "./assign-program-page-header";

export default function AssignProgramForm() {
  const form = useForm<AssignTrainingProgramForm>({
    resolver: zodResolver(AssignTrainingProgramFormSchema),
    defaultValues: {
      name: "12 Week Strength",
      weeksDuration: 12,
      clientId: "",
    },
  });

  function onSubmit(values: AssignTrainingProgramForm) {
    console.log(values);
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <AssignProgramHeader />
        <form className="space-y-8">
          <ProgramDetails />
          <Table className="">
            <AssignProgramFormLiftsHeaders />
            <ProgramDayTable />
          </Table>
        </form>
      </Form>
    </div>
  );
}
