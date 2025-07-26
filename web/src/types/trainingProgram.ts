import { z } from "zod";
import {
  AssignedTrainingProgramSchema,
  DaySchema,
  ExerciseSchema,
  LiftSchema,
  LiftSetSchema,
  LiftPerformanceSchema,
  CardioSchema,
  CardioSetSchema,
  CardioPerformanceSchema,
  StretchSchema,
  StretchPerformanceSchema,
} from "./generated";

// Complete schema that includes the composite types
export const FullAssignedTrainingProgramSchema =
  AssignedTrainingProgramSchema.extend({
    days: z.array(DaySchema),
  });

// Individual schemas you can use for validation
export const CreateAssignedTrainingProgramSchema =
  FullAssignedTrainingProgramSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const UpdateAssignedTrainingProgramSchema =
  FullAssignedTrainingProgramSchema.partial()
    .omit({
      id: true,
      createdAt: true,
    })
    .extend({
      updatedAt: z.date().default(() => new Date()),
    });

// Performance-specific schemas for API validation
export const AddLiftPerformanceSchema = LiftPerformanceSchema.omit({
  date: true,
}).extend({
  date: z.date().default(() => new Date()),
});

export const AddCardioPerformanceSchema = CardioPerformanceSchema.omit({
  date: true,
}).extend({
  date: z.date().default(() => new Date()),
});

export const AddStretchPerformanceSchema = StretchPerformanceSchema.omit({
  date: true,
}).extend({
  date: z.date().default(() => new Date()),
});

// Export types
export type FullAssignedTrainingProgram = z.infer<
  typeof FullAssignedTrainingProgramSchema
>;
export type CreateAssignedTrainingProgram = z.infer<
  typeof CreateAssignedTrainingProgramSchema
>;
export type UpdateAssignedTrainingProgram = z.infer<
  typeof UpdateAssignedTrainingProgramSchema
>;
export type AddLiftPerformance = z.infer<typeof AddLiftPerformanceSchema>;
export type AddCardioPerformance = z.infer<typeof AddCardioPerformanceSchema>;
export type AddStretchPerformance = z.infer<typeof AddStretchPerformanceSchema>;

// Re-export the generated composite types for convenience
export type {
  Day,
  Exercise,
  Lift,
  LiftSet,
  LiftPerformance,
  Cardio,
  CardioSet,
  CardioPerformance,
  Stretch,
  StretchPerformance,
} from "./generated";
