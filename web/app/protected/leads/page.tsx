import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeadsDashboard } from "@/components/leads/leads-dashboard";

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 max-w-6xl mx-auto p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Leads Dashboard</h1>
        <p className="text-muted-foreground">
          View and manage your imported leads
        </p>
      </div>
      <LeadsDashboard />
    </div>
  );
}