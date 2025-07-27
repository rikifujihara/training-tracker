"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AssignTrainingProgramForm() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Head1</TableHead>
          <TableHead>Head2</TableHead>
          <TableHead>Head3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Head1</TableCell>
          <TableCell>Head2</TableCell>
          <TableCell>Head3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
