-- CreateTable
CREATE TABLE "public"."leads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "age" TEXT,
    "birthday" TEXT,
    "gender" TEXT,
    "phone_number" TEXT,
    "email" TEXT,
    "goals" TEXT,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'email_upload',

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_user_id_idx" ON "public"."leads"("user_id");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "public"."leads"("email");

-- AddForeignKey
ALTER TABLE "public"."leads" ADD CONSTRAINT "leads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
