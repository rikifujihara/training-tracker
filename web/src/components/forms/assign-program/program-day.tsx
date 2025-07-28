import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function ProgramDayTable() {
  return (
    <TableBody>
      <TableRow>
        <TableCell>Bench</TableCell>
        <TableCell>Chest</TableCell>
        <TableCell>50kg</TableCell>
        <TableCell>Set</TableCell>
        <TableCell>Reps</TableCell>
        <TableCell>Rest (s)</TableCell>
        <TableCell>RIR</TableCell>
        <TableCell>Delete</TableCell>
      </TableRow>
    </TableBody>
  );
}
