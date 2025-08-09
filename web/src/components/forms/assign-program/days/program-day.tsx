import DayLifts from "./lifts/day-lifts";
import DayStretches from "./stretches/day-stretches";
import DayCardio from "./cardio/day-cardio";
import { useState } from "react";
import { DaySectionDropDown } from "./section-dropdown";
import SectionBadges, { SectionType } from "./section-badges";

interface ProgramDayProps {
  dayIndex: number;
}

export default function ProgramDay({ dayIndex }: ProgramDayProps) {
  const [activeSections, setActiveSections] = useState<SectionType[]>([
    "lifts",
    "stretches",
    "cardio",
  ]);

  function handleRemoveSection(section: SectionType) {
    setActiveSections((prevSections) =>
      prevSections.filter((sec) => sec !== section)
    );
  }

  function handleAddSection(section: SectionType) {
    setActiveSections((prevSections) => {
      if (prevSections.includes(section)) {
        return prevSections;
      }
      return [...prevSections, section];
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Sections</h2>
        <DaySectionDropDown
          handleAddSection={handleAddSection}
          handleRemoveSection={handleRemoveSection}
        />
      </div>
      <SectionBadges
        activeSections={activeSections}
        onRemoveSection={handleRemoveSection}
      />
      <div className="flex flex-col gap-4">
        {activeSections.includes("lifts") && <DayLifts dayIndex={dayIndex} />}
        {activeSections.includes("stretches") && (
          <DayStretches dayIndex={dayIndex} />
        )}
        {activeSections.includes("cardio") && <DayCardio dayIndex={dayIndex} />}
      </div>
    </div>
  );
}
