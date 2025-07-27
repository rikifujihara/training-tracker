import AssignTrainingProgramForm from "@/components/forms/assign-program/assign-training-program-form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function AssignProgramPage() {
  return (
    <div className="w-full">
      <div className="w-full flex space-between">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Program Builder</h1>
          <span className="text-gray-500">
            Create and manage workout programs
          </span>
        </div>
        <div className="flex gap-2">
          <Button>
            <Save />
            Save Draft
          </Button>
          <Button>Publish</Button>
        </div>
      </div>
      <AssignTrainingProgramForm />
    </div>
  );
}
