import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { SectionType, SECTION_CONFIGS } from "./section-badges";

interface DaySectionDropDownProps {
  handleAddSection: (section: SectionType) => void;
}

export function DaySectionDropDown({
  handleAddSection,
}: DaySectionDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hover:cursor-pointer rounded-sm w-[160px]"
        >
          <Plus /> Add Section <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[160px]" align="center">
        {Object.entries(SECTION_CONFIGS).map(([sectionType, config]) => (
          <DropdownMenuItem
            key={sectionType}
            onClick={() => handleAddSection(sectionType as SectionType)}
            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
          >
            <span className="text-lg">{config.icon}</span>
            <span className="font-medium">{config.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
