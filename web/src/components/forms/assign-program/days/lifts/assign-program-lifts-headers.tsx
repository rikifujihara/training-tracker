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
        <TableHead>Name</TableHead>
        <TableHead>Muscle</TableHead>
        <TableHead>Weight</TableHead>
        <TableHead>Set</TableHead>
        <TableHead>Reps</TableHead>
        <TableHead>Rest (s)</TableHead>
        <TableHead>RIR</TableHead>
        <TableHead>Delete</TableHead>
      </TableRow>
    </TableHeader>
  );
}
