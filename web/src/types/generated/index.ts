import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const UserScalarFieldEnumSchema = z.enum(['id','email','name','image','emailVerified','role','createdAt','updatedAt','firstName','lastName','phone','businessName','bio','trainerId','isActive']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['id','identifier','token','expires']);

export const AssignedTrainingProgramScalarFieldEnumSchema = z.enum(['id','clientId','trainerId','weeksDuration','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const UserRoleSchema = z.enum(['TRAINER','CLIENT']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRoleSchema,
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  emailVerified: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  businessName: z.string().nullable(),
  bio: z.string().nullable(),
  trainerId: z.string().nullable(),
  isActive: z.boolean(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// ASSIGNED TRAINING PROGRAM SCHEMA
/////////////////////////////////////////

export const AssignedTrainingProgramSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  trainerId: z.string(),
  weeksDuration: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type AssignedTrainingProgram = z.infer<typeof AssignedTrainingProgramSchema>

/////////////////////////////////////////
// COMPOSITE TYPES
/////////////////////////////////////////
// DAY
//------------------------------------------------------


/////////////////////////////////////////
// DAY SCHEMA
/////////////////////////////////////////

export const DaySchema = z.object({
  name: z.string(),
  dayIndex: z.number().int(),
})

export type Day = z.infer<typeof DaySchema>
// EXERCISE
//------------------------------------------------------


/////////////////////////////////////////
// EXERCISE SCHEMA
/////////////////////////////////////////

export const ExerciseSchema = z.object({
})

export type Exercise = z.infer<typeof ExerciseSchema>
// LIFT
//------------------------------------------------------


/////////////////////////////////////////
// LIFT SCHEMA
/////////////////////////////////////////

export const LiftSchema = z.object({
  muscleGroup: z.string(),
  name: z.string(),
  liftIndex: z.number().int(),
})

export type Lift = z.infer<typeof LiftSchema>
// LIFT SET
//------------------------------------------------------


/////////////////////////////////////////
// LIFT SET SCHEMA
/////////////////////////////////////////

export const LiftSetSchema = z.object({
  setIndex: z.number().int(),
  minReps: z.number().int(),
  maxReps: z.number().int(),
  minRest: z.number().int(),
  maxRest: z.number().int(),
  minRir: z.number().int(),
  maxRir: z.number().int(),
})

export type LiftSet = z.infer<typeof LiftSetSchema>
// LIFT PERFORMANCE
//------------------------------------------------------


/////////////////////////////////////////
// LIFT PERFORMANCE SCHEMA
/////////////////////////////////////////

export const LiftPerformanceSchema = z.object({
  weekIndex: z.number().int(),
  date: z.coerce.date(),
  weight: z.number(),
  reps: z.number().int(),
  rir: z.number().int(),
  notes: z.string().nullable(),
})

export type LiftPerformance = z.infer<typeof LiftPerformanceSchema>
// CARDIO
//------------------------------------------------------


/////////////////////////////////////////
// CARDIO SCHEMA
/////////////////////////////////////////

export const CardioSchema = z.object({
  name: z.string(),
  cardioIndex: z.number().int(),
})

export type Cardio = z.infer<typeof CardioSchema>
// CARDIO SET
//------------------------------------------------------


/////////////////////////////////////////
// CARDIO SET SCHEMA
/////////////////////////////////////////

export const CardioSetSchema = z.object({
  setIndex: z.number().int(),
  minSpeed: z.number(),
  maxSpeed: z.number(),
  minIncline: z.number(),
  maxIncline: z.number(),
  minTime: z.number().int(),
  maxTime: z.number().int(),
})

export type CardioSet = z.infer<typeof CardioSetSchema>
// CARDIO PERFORMANCE
//------------------------------------------------------


/////////////////////////////////////////
// CARDIO PERFORMANCE SCHEMA
/////////////////////////////////////////

export const CardioPerformanceSchema = z.object({
  weekIndex: z.number().int(),
  date: z.coerce.date(),
  speed: z.number(),
  incline: z.number(),
  time: z.number().int(),
  notes: z.string().nullable(),
})

export type CardioPerformance = z.infer<typeof CardioPerformanceSchema>
// STRETCH
//------------------------------------------------------


/////////////////////////////////////////
// STRETCH SCHEMA
/////////////////////////////////////////

export const StretchSchema = z.object({
  name: z.string(),
  stretchIndex: z.number().int(),
  targetReps: z.number().int(),
  minHoldSeconds: z.number().int(),
  maxHoldSeconds: z.number().int().nullable(),
})

export type Stretch = z.infer<typeof StretchSchema>
// STRETCH PERFORMANCE
//------------------------------------------------------


/////////////////////////////////////////
// STRETCH PERFORMANCE SCHEMA
/////////////////////////////////////////

export const StretchPerformanceSchema = z.object({
  weekIndex: z.number().int(),
  date: z.coerce.date(),
  reps: z.number().int(),
  holdSeconds: z.number().int(),
  notes: z.string().nullable(),
})

export type StretchPerformance = z.infer<typeof StretchPerformanceSchema>
