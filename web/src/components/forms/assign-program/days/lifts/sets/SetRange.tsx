import { RangeInput } from "@/components/ui/form";
import { ValidNumericField } from "@/types/helpers";
import {
  AssignTrainingProgramForm,
  LiftSet,
} from "@/types/programs/trainingProgram";
import { Control } from "react-hook-form";

interface SetRangeInputProps {
  dayIndex: number;
  liftIndex: number;
  setIndex: number;
  control: Control<AssignTrainingProgramForm>; // Using your actual Zod-inferred type
  minField: ValidNumericField<LiftSet>; // Only allows valid numeric fields from LiftSet
  maxField: ValidNumericField<LiftSet>; // Only allows valid numeric fields from LiftSet
  placeholder?: string;
  className?: string;
}

export function SetRangeInput({
  dayIndex,
  liftIndex,
  setIndex,
  control,
  minField,
  maxField,
  placeholder,
  className,
}: SetRangeInputProps) {
  // Step 9a: Construct the type-safe field path for the specific set
  const fieldPath =
    `days.${dayIndex}.lifts.${liftIndex}.sets.${setIndex}` as const;

  // Step 9b: Use the generic RangeInput component with the constructed path
  return (
    <RangeInput
      name={fieldPath}
      control={control}
      minField={minField}
      maxField={maxField}
      placeholder={placeholder}
      className={className}
    />
  );
}
