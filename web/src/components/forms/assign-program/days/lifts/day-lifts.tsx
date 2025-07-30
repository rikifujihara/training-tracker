"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/programs/trainingProgram";
import { useFieldArray, useFormContext } from "react-hook-form";
import AssignProgramFormLiftsHeaders from "./assign-program-lifts-headers";
import Lift from "./lift";

interface DayLiftsProps {
  dayIndex: number;
}

export default function DayLifts({ dayIndex }: DayLiftsProps) {
  const { control } = useFormContext<AssignTrainingProgramForm>();

  const { fields: liftFields } = useFieldArray({
    control,
    name: `days.${dayIndex}.lifts`,
  });

  return (
    <>
      <p className="text-lg text-ring ml-2">Lifts</p>
      <Table className="">
        <AssignProgramFormLiftsHeaders />
        <TableBody>
          {liftFields.map((field, index) => (
            <Lift key={field.id} dayIndex={dayIndex} liftIndex={index} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
