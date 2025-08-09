import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProgramDay from "./program-day";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AssignTrainingProgramForm } from "@/types/programs/trainingProgram";

export default function Days() {
  const { control } = useFormContext<AssignTrainingProgramForm>();
  const { fields } = useFieldArray({
    control,
    name: "days",
  });

  return (
    <Tabs className="space-y-2" defaultValue="day-0">
      <TabsList variant="underline" className="w-full">
        {fields.map((field, index) => (
          <TabsTrigger
            variant="underline"
            key={field.id}
            value={`day-${index}`}
          >
            Day {index + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {fields.map((field, index) => (
        <TabsContent key={field.id} value={`day-${index}`}>
          <ProgramDay key={field.id} dayIndex={index} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
