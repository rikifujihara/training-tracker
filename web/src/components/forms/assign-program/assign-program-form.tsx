"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AssignTrainingProgramForm,
  AssignTrainingProgramFormSchema,
} from "@/types/trainingProgram";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function AssignProgramForm() {
  const form = useForm<AssignTrainingProgramForm>({
    resolver: zodResolver(AssignTrainingProgramFormSchema),
    defaultValues: {
      name: "12 Week Strength",
      weeksDuration: 12,
    },
  });

  function onSubmit(values: AssignTrainingProgramForm) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent>
            <div className="flex gap-5">
              <div className="flex flex-col  gap-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Program Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Name your program for future reference.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1 ">
                <FormField
                  control={form.control}
                  name="weeksDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weeks Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="Weeks" {...field} />
                      </FormControl>
                      <FormDescription>
                        The intended duration of the program.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
    </Form>
  );
}
