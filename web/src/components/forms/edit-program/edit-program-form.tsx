"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const editProgramFormSchema = AssignedTrainingProgram;

export default function EditProgramForm() {
  return (
    <form>
      <Card>
        <CardContent>
          <div className="flex gap-5">
            <div className="flex flex-col  gap-1">
              <span>Program Name</span>
              <Input />
            </div>
            <div className="flex flex-col gap-1 ">
              <span>Number of weeks</span>
              <Input />
            </div>
          </div>
        </CardContent>
      </Card>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Muscle</TableHead>
            <TableHead>Exercise</TableHead>
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
    </form>
  );
}
