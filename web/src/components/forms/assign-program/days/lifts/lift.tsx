import { TableCell, TableRow } from "@/components/ui/table";
import { AssignTrainingProgramForm } from "@/types/trainingProgram";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function Lift({
  dayIndex,
  liftIndex,
}: {
  liftIndex: number;
  dayIndex: number;
}) {
  const { control } = useFormContext<AssignTrainingProgramForm>();

  const { fields } = useFieldArray({
    control,
    name: `days.${dayIndex}.lifts.${liftIndex}.sets`,
  });

  return (
    <>
      {fields.map((field, index) => (
        <LiftSet
          key={field.id}
          dayIndex={dayIndex}
          liftIndex={liftIndex}
          setIndex={index}
        />
      ))}
    </>
  );
}

function LiftSet({
  dayIndex,
  liftIndex,
  setIndex,
}: {
  dayIndex: number;
  liftIndex: number;
  setIndex: number;
}) {
  return (
    <TableRow>
      <TableCell>Bench Day {dayIndex + 1}</TableCell>
      <TableCell>Chest</TableCell>
      <TableCell>50kg</TableCell>
      <TableCell>Set</TableCell>
      <TableCell>Reps</TableCell>
      <TableCell>Rest (s)</TableCell>
      <TableCell>RIR</TableCell>
      <TableCell>Delete</TableCell>
    </TableRow>
  );
}
