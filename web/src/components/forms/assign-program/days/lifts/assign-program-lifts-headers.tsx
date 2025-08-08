import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
export default function AssignProgramFormLiftsHeaders() {
  return (
    <TableHeader>
      <TableRow className="[&>th]:text-gray-500">
        <TableHead>{/* Space for reordering */}</TableHead>
        <TableHead className="text-gray-500">Name</TableHead>
        <TableHead>Muscle</TableHead>
        <TableHead className="text-center">Sets</TableHead>
        <TableHead>Weight</TableHead>
        <TableHead>Reps</TableHead>
        <TableHead>Rest (s)</TableHead>
        <TableHead>RIR</TableHead>
        <TableHead>{/* Space for add set button */}</TableHead>
        <TableHead>{/* Space for delete set button */}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
