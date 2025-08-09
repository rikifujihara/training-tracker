import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";

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

interface DaySectionDropDownProps {
  handleAddSection: (section: string) => void;
  handleRemoveSection: (section: string) => void;
}

export function DaySectionDropDown({
  handleAddSection,
  handleRemoveSection,
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
        <DropdownMenuItem
          onClick={() => handleAddSection("lifts")}
          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
        >
          <span className="text-lg">🏋️</span>{" "}
          <span className="font-medium">Lifts</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAddSection("cardio")}
          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
        >
          <span className="text-lg">🏃</span>{" "}
          <span className="font-medium">Cardio</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAddSection("stretches")}
          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
        >
          <span className="text-lg">🧘</span>{" "}
          <span className="font-medium">Stretches</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
