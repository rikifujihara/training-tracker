import DayLifts from "./lifts/day-lifts";
import DayStretches from "./stretches/day-stretches";
import DayCardio from "./cardio/day-cardio";
import { useState } from "react";

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
interface ProgramDayProps {
  dayIndex: number;
}
export default function ProgramDay({ dayIndex }: ProgramDayProps) {
  const [activeSections, setActiveSections] = useState(["lifts"]);
  const addSection = (sectionType) => {
    if (!activeSections.includes(sectionType)) {
      setActiveSections([...activeSections, sectionType]);
    }
  };

  const removeSection = (sectionType) => {
    setActiveSections(
      activeSections.filter((section) => section !== sectionType)
    );
  };
  return (
    // TODO: Sections
    <>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Sections</h2>
      </div>
      <div className="flex flex-col gap-4">
        <DayLifts dayIndex={dayIndex} />
        <DayStretches dayIndex={dayIndex} />
        <DayCardio dayIndex={dayIndex} />
      </div>
    </>
  );
}
