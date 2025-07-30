import z from "zod";

/* ASSIGN PROGRAM FORM */
export const StretchSetSchema = z.object({
  stretchIndex: z.number().int(),
  targetReps: z.number().int().nullable(),
  minHoldSeconds: z.number().int().nullable(),
  maxHoldSeconds: z.number().int().nullable(),
});

export const StretchSchema = z.object({
  name: z.string(),
  stretchIndex: z.number().int(),
  sets: z.array(StretchSetSchema),
});

export const CardioSetSchema = z.object({
  setIndex: z.number().int(),
  minSpeed: z.number().nullable(),
  maxSpeed: z.number().nullable(),
  minIncline: z.number().nullable(),
  maxIncline: z.number().nullable(),
  minTime: z.number().int().nullable(),
  maxTime: z.number().int().nullable(),
});

export const CardioSchema = z.object({
  name: z.string(),
  cardioIndex: z.number().int(),
  sets: z.array(CardioSetSchema),
});

export const LiftSetSchema = z.object({
  setIndex: z.number().int(),
  minReps: z.number().int(),
  maxReps: z.number().int(),
  minWeight: z.number().int(),
  maxWeight: z.number().int(),
  minRest: z.number().int().nullable(),
  maxRest: z.number().int().nullable(),
  minRir: z.number().int().nullable(),
  maxRir: z.number().int().nullable(),
});

export const LiftSchema = z.object({
  muscleGroup: z.string(),
  name: z.string(),
  liftIndex: z.number().int(),
  sets: z.array(LiftSetSchema),
});

export const TrainingProgramDay = z.object({
  name: z.string(),
  dayIndex: z.number().int(),
  lifts: z.array(LiftSchema),
  cardio: z.array(CardioSchema),
  stretches: z.array(StretchSchema),
});

export const AssignTrainingProgramFormSchema = z.object({
  clientId: z.string().nullable(),
  weeksDuration: z.number().int(),
  name: z.string(),
  days: z.array(TrainingProgramDay),
});

export type AssignTrainingProgramForm = z.infer<
  typeof AssignTrainingProgramFormSchema
>;

export type LiftSet = z.infer<typeof LiftSetSchema>;
