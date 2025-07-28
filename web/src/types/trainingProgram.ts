import z from "zod";

export const StretchSchema = z.object({
  name: z.string(),
  stretchIndex: z.number().int(),
  targetReps: z.number().int().nullable(),
  minHoldSeconds: z.number().int().nullable(),
  maxHoldSeconds: z.number().int().nullable(),
});

export const CardioSchema = z.object({
  name: z.string(),
  cardioIndex: z.number().int(),
});

export const LiftSchema = z.object({
  muscleGroup: z.string(),
  name: z.string(),
  liftIndex: z.number().int(),
});

export const ExercisesSchema = z.object({
  lifts: z.array(LiftSchema),
  cardio: z.array(CardioSchema),
});

export const TrainingProgramDay = z.object({
  name: z.string(),
  dayIndex: z.number().int(),
  exercises: ExercisesSchema,
});

export const AssignTrainingProgramFormSchema = z.object({
  clientId: z.string().nullable(),
  weeksDuration: z.number().int(),
  name: z.string(),
});
