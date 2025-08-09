import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SECTION_CONFIGS, SectionType } from "./section-badges";

interface NoSectionsAddedCardProps {
  onAddSection: (sectionType: SectionType) => void;
}

export default function NoSectionsAddedCard({ onAddSection }: NoSectionsAddedCardProps) {
  return (
    <Card>
      <CardContent className="text-center py-12 bg-white border-gray-200">
        <div className="text-4xl mb-4">💪</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No sections added yet
        </h3>
        <p className="text-gray-600 mb-4">
          Add sections to start building your program
        </p>
        <div className="flex justify-center gap-3">
          {Object.entries(SECTION_CONFIGS).map(([sectionType, config]) => (
            <Button
              className="gap-2 bg-black rounded-lg hover:bg-gray-800 hover:cursor-pointer"
              key={sectionType}
              onClick={() => onAddSection(sectionType as SectionType)}
            >
              {config.icon} {config.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
