import { AssignTrainingProgramForm } from "@/types/programs/trainingProgram";
import { useFormContext } from "react-hook-form";
import DayLifts from "./lifts/day-lifts";
import DayStretches from "./stretches/day-stretches";

interface ProgramDayProps {
  dayIndex: number;
}

// Renders the lifts, stretches and cardio for the day
export default function ProgramDay({ dayIndex }: ProgramDayProps) {
  const { control } = useFormContext<AssignTrainingProgramForm>();

  return (
    <>
      <DayLifts dayIndex={dayIndex} />
      <DayStretches dayIndex={dayIndex} />
    </>
  );
}
