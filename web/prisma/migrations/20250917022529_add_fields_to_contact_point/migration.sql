-- AlterTable
ALTER TABLE "public"."contact_points" ADD COLUMN     "message_template_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."contact_points" ADD CONSTRAINT "contact_points_message_template_id_fkey" FOREIGN KEY ("message_template_id") REFERENCES "public"."message_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
