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
        <TableHead>
          <p className="text-lg text-ring w-program-first-col-width">Lifts</p>
        </TableHead>
        <TableHead></TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Muscle</TableHead>
        <TableHead className="text-center">Set</TableHead>
        <TableHead>Weight</TableHead>
        <TableHead>Reps</TableHead>
        <TableHead>Rest (s)</TableHead>
        <TableHead>RIR</TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
  );
}
