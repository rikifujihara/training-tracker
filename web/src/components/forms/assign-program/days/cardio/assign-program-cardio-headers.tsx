import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
export default function AssignProgramFormCardioHeaders() {
  return (
    <TableHeader>
      <TableRow className="[&>th]:text-gray-500">
        <TableHead>{/* Empty cell for reorder buttons */}</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Speed</TableHead>
        <TableHead>Incline</TableHead>
        <TableHead>Time (m)</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
  );
}
