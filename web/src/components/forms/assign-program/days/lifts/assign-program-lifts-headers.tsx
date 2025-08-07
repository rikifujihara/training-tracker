import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function AssignProgramFormLiftsHeaders() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{/* Space for reordering */}</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Muscle</TableHead>
        <TableHead className="text-center">Set</TableHead>
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
