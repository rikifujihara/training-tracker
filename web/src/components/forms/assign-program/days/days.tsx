import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProgramDay from "./program-day";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AssignTrainingProgramForm } from "@/types/programs/trainingProgram";
import { useState } from "react";
import { SectionType } from "./section-badges";

export default function Days() {
  const { control } = useFormContext<AssignTrainingProgramForm>();
  const { fields } = useFieldArray({
    control,
    name: "days",
  });

  // Store activeSections for each day - initialized with default sections for each day
  const [dayActiveSections, setDayActiveSections] = useState<
    Record<number, SectionType[]>
  >(() => {
    const initialSections: Record<number, SectionType[]> = {};
    fields.forEach((_, index) => {
      // Can add different defaults here if we want
      initialSections[index] = [];
    });
    return initialSections;
  });

  const handleRemoveSection = (dayIndex: number, section: SectionType) => {
    setDayActiveSections((prev) => ({
      ...prev,
      [dayIndex]: prev[dayIndex].filter((sec) => sec !== section),
    }));
  };

  const handleAddSection = (dayIndex: number, section: SectionType) => {
    setDayActiveSections((prev) => ({
      ...prev,
      [dayIndex]: prev[dayIndex].includes(section)
        ? prev[dayIndex]
        : [...prev[dayIndex], section],
    }));
  };

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
          <ProgramDay
            key={field.id}
            dayIndex={index}
            activeSections={dayActiveSections[index] || []}
            onRemoveSection={(section) => handleRemoveSection(index, section)}
            onAddSection={(section) => handleAddSection(index, section)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
