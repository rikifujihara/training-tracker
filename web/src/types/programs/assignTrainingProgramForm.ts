import z from "zod";

// Helper function to create range validation
const createRangeSchema = (fieldName: string) =>
  z
    .string()
    .regex(/^\d+\s*[-–—]\s*\d+$/, `${fieldName} must be in format like '8-12'`)
    .refine((val) => {
      const parts = val.split(/\s*[-–—]\s*/);
      if (parts.length !== 2) return false;
      const min = parseInt(parts[0]);
      const max = parseInt(parts[1]);
      return !isNaN(min) && !isNaN(max) && min <= max;
    }, `${fieldName}: minimum must be less than or equal to maximum`);

// Optional range (can be empty string)
const createOptionalRangeSchema = (fieldName: string) =>
  z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true; // Allow empty
      return /^\d+\s*[-–—]\s*\d+$/.test(val);
    }, `${fieldName} must be in format like '60-90' or left empty`)
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      const parts = val.split(/\s*[-–—]\s*/);
      if (parts.length !== 2) return true; // Let regex handle this
      const min = parseInt(parts[0]);
      const max = parseInt(parts[1]);
      return !isNaN(min) && !isNaN(max) && min <= max;
    }, `${fieldName}: minimum must be less than or equal to maximum`);

/* ASSIGN PROGRAM FORM */
export const StretchSetSchema = z.object({
  stretchIndex: z.number().int(),
  weight: z.string().optional(),
  totalSeconds: z.string().optional(),
  restSeconds: z.number().int().optional(),
});

export const StretchSchema = z.object({
  name: z.string(),
  stretchIndex: z.number().int(),
  sets: z.array(StretchSetSchema),
});

export const CardioSetSchema = z.object({
  setIndex: z.number().int(),
  speedRange: createOptionalRangeSchema("Speed"), // "5.0-7.5" mph
  inclineRange: createOptionalRangeSchema("Incline"), // "2-5" degrees
  timeRange: createOptionalRangeSchema("Time"), // "20-30" minutes
});

export const CardioSchema = z.object({
  name: z.string(),
  cardioIndex: z.number().int(),
  sets: z.array(CardioSetSchema),
});

export const LiftSetSchema = z.object({
  setIndex: z.number().int(),
  repRange: createRangeSchema("Reps"), // "8-12"
  weightRange: createOptionalRangeSchema("Weight"), // "135-155"
  restRange: createOptionalRangeSchema("Rest"), // "60-90" seconds
  rirRange: createOptionalRangeSchema("RIR"), // "1-3"
});

export const LiftSchema = z.object({
  muscleGroup: z.string().min(1, "Muscle group must be defined"),
  name: z.string().min(1, "Exercise name must be defined"),
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

// Helper function to parse range strings when you need the actual numbers
export const parseRange = (
  rangeString: string
): { min: number; max: number } => {
  const [min, max] = rangeString
    .split(/\s*[-–—]\s/)
    .map((s) => parseInt(s.trim()));
  return { min, max };
};

// Helper function to format numbers as range string
export const formatRange = (min: number, max: number): string => {
  return `${min}-${max}`;
};

// Changes to this is very important because it includes
// default values which will determine the shape of the form which the user cannot change
export const defaultAssignFormValues: AssignTrainingProgramForm = {
  name: "12 Week Strength",
  weeksDuration: 12,
  clientId: null,
  days: [
    {
      name: "Day 1",
      dayIndex: 0,
      lifts: [
        {
          muscleGroup: "Chest",
          name: "Bench Press",
          liftIndex: 0,
          sets: [
            {
              setIndex: 0,
              repRange: "8-12",
              weightRange: "135-155",
              restRange: "60-90",
              rirRange: "1-3",
            },
          ],
        },
      ],
      cardio: [],
      stretches: [
        {
          name: "Pigeon Stretch",
          stretchIndex: 0,
          sets: [{ stretchIndex: 0 }],
        },
      ],
    },
    {
      name: "Day 2",
      dayIndex: 1,
      lifts: [],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 3",
      dayIndex: 2,
      lifts: [],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 4",
      dayIndex: 3,
      lifts: [],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 5",
      dayIndex: 4,
      lifts: [],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 6",
      dayIndex: 5,
      lifts: [],
      cardio: [],
      stretches: [],
    },
    {
      name: "Day 7",
      dayIndex: 6,
      lifts: [],
      cardio: [],
      stretches: [],
    },
  ],
};
