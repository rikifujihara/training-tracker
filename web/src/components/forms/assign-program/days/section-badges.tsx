
export type SectionType = "lifts" | "stretches" | "cardio";

export interface SectionConfig {
  label: string;
  icon: string;
  color: string;
}

export const SECTION_CONFIGS: Record<SectionType, SectionConfig> = {
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

interface SectionBadgesProps {
  activeSections: SectionType[];
  onRemoveSection: (section: SectionType) => void;
}

export default function SectionBadges({ activeSections }: SectionBadgesProps) {
  return (
    <div className="space-x-2">
      {activeSections.map((sectionType) => (
        <div
          key={sectionType}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${SECTION_CONFIGS[sectionType].color}`}
        >
          <span>{SECTION_CONFIGS[sectionType].icon}</span>
          {SECTION_CONFIGS[sectionType].label}
        </div>
      ))}
    </div>
  );
}
