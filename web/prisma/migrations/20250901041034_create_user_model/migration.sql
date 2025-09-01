-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('TRAINER', 'CLIENT');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "role" "public"."user_role" NOT NULL DEFAULT 'TRAINER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "first_name" TEXT,
    "last_name" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");
