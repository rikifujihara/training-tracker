import DayLifts from "./lifts/day-lifts";
import DayStretches from "./stretches/day-stretches";
import DayCardio from "./cardio/day-cardio";
import { useState } from "react";
import { DaySectionDropDown } from "./section-dropdown";
import SectionBadges, { SectionType } from "./section-badges";
import NoSectionsAddedCard from "./no-sections-added";

interface ProgramDayProps {
  dayIndex: number;
  activeSections: SectionType[];
  onRemoveSection: (section: SectionType) => void;
  onAddSection: (section: SectionType) => void;
}

export default function ProgramDay({ 
  dayIndex, 
  activeSections, 
  onRemoveSection, 
  onAddSection 
}: ProgramDayProps) {
  const handleAddSection = (section: SectionType) => {
    onAddSection(section);
  };

  const handleRemoveSection = (section: SectionType) => {
    onRemoveSection(section);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Sections</h2>
        <DaySectionDropDown handleAddSection={handleAddSection} />
      </div>
      <SectionBadges
        activeSections={activeSections}
        onRemoveSection={handleRemoveSection}
      />
      <div className="flex flex-col gap-4">
        {activeSections.length === 0 && <NoSectionsAddedCard />}
        {activeSections.includes("lifts") && (
          <DayLifts
            dayIndex={dayIndex}
            onRemoveSection={() => handleRemoveSection("lifts")}
          />
        )}
        {activeSections.includes("stretches") && (
          <DayStretches
            dayIndex={dayIndex}
            onRemoveSection={() => handleRemoveSection("stretches")}
          />
        )}
        {activeSections.includes("cardio") && (
          <DayCardio
            dayIndex={dayIndex}
            onRemoveSection={() => handleRemoveSection("cardio")}
          />
        )}
      </div>
    </div>
  );
}
