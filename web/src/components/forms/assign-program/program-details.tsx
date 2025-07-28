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
import { AssignTrainingProgramForm } from "@/types/trainingProgram";
import { useFormContext } from "react-hook-form";

export default function ProgramDetails() {
  const form = useFormContext<AssignTrainingProgramForm>();
  return (
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
                    <Input type="number" placeholder="Weeks" {...field} />
                  </FormControl>
                  <FormDescription>
                    The intended duration of the program.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-1 ">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Kevin Nguyen"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Who to assign this program to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
