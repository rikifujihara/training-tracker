import { Card, CardContent } from "@/components/ui/card";

export default function NoSectionsAddedCard() {
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
        <div className="flex justify-center gap-3"></div>
      </CardContent>
    </Card>
  );
}
