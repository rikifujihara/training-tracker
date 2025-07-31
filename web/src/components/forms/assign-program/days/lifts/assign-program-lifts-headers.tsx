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
        <TableHead>Reorder</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Muscle</TableHead>
        <TableHead className="text-center">Set</TableHead>
        <TableHead>Weight</TableHead>
        <TableHead>Reps</TableHead>
        <TableHead>Rest (s)</TableHead>
        <TableHead>RIR</TableHead>
        <TableHead>Add</TableHead>
        <TableHead>Bin</TableHead>
      </TableRow>
    </TableHeader>
  );
}
