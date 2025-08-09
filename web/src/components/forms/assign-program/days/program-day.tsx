import DayLifts from "./lifts/day-lifts";
import DayStretches from "./stretches/day-stretches";
import DayCardio from "./cardio/day-cardio";
import { useState } from "react";
import { DaySectionDropDown } from "./section-dropdown";
import { X } from "lucide-react";

interface ProgramDayProps {
  dayIndex: number;
}

export default function ProgramDay({ dayIndex }: ProgramDayProps) {
  const [activeSections, setActiveSections] = useState([
    "lifts",
    "stretches",
    "cardio",
  ]);
  const sectionTypes = {
    lifts: {
      label: "Lifts",
      icon: "🏋️",
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    stretches: {
      label: "Stretches",
      icon: "🧘",
      color: "bg-green-50 border-green-200 text-green-700",
    },
    cardio: {
      label: "Cardio",
      icon: "🏃",
      color: "bg-red-50 border-red-200 text-red-700",
    },
  };

  function handleRemoveSection(section: string) {
    setActiveSections((prevSections) =>
      prevSections.filter((sec) => {
        return sec != section;
      })
    );
  }

  function handleAddSection(section: string) {
    setActiveSections((prevSections) => {
      const sections = [...prevSections];
      if (sections.includes(section)) {
        return prevSections;
      }
      sections.push(section);
      return sections;
    });
  }

  return (
    // TODO: Sections
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Sections</h2>
        <DaySectionDropDown
          handleAddSection={handleAddSection}
          handleRemoveSection={handleRemoveSection}
        />
      </div>
      <div className="space-x-2">
        {activeSections.map((sectionType) => (
          <div
            key={sectionType}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${sectionTypes[sectionType].color}`}
          >
            <span>{sectionTypes[sectionType].icon}</span>
            {sectionTypes[sectionType].label}
            <button
              type="button"
              onClick={() => handleRemoveSection(sectionType)}
              className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
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
