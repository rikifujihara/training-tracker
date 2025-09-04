import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UploadLeadsWizard } from "@/components/upload-leads/upload-leads-wizard";

export default async function UploadLeadsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 max-w-4xl mx-auto p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Upload Leads</h1>
        <p className="text-muted-foreground">
          Import your leads from email tables in just a few simple steps
        </p>
      </div>
      <UploadLeadsWizard />
    </div>
  );
}