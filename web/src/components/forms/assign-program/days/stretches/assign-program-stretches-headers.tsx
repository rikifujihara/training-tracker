import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
export default function AssignProgramFormLiftsHeaders() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <p className="text-lg text-ring">Stretches</p>
        </TableHead>
        <TableHead>Exercise</TableHead>
        <TableHead>Name</TableHead>
        <TableHead className="text-center">Set</TableHead>
        <TableHead>Weight</TableHead>
        <TableHead>Total (s)</TableHead>
        <TableHead>Holds (s)</TableHead>
        <TableHead>Rest (s)</TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
  );
}
