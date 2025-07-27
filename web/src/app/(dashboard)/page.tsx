"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import CompleteProfileForm from "@/components/forms/CompleteProfileForm";
import TrainerDashboard from "@/components/ui/trainer-dashboard";
import { useCompleteProfile } from "@/lib/hooks/useUserQueries";
import { useTrainerDashboard } from "@/lib/hooks/useTrainerQueries";
import { useState } from "react";

export default function HomePage() {
  const { data: session } = useSession();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  const completeProfileMutation = useCompleteProfile();
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useTrainerDashboard();

  // Handle profile completion
  const handleCompleteProfile = async (data: any) => {
    try {
      await completeProfileMutation.mutateAsync(data);
      setShowCompleteProfile(false);
      // Session will be updated automatically
    } catch (error) {
      console.error("Failed to complete profile:", error);
    }
  };

  // Check if user needs to complete profile
  const needsProfileCompletion =
    session?.user && (!session.user.name || showCompleteProfile);

  return (
    <div className="section-spacing">
      {needsProfileCompletion ? (
        <CompleteProfileForm
          onSubmit={handleCompleteProfile}
          isSubmitting={completeProfileMutation.isPending}
        />
      ) : session?.user.role === UserRole.TRAINER ? (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Trainer Dashboard
            </h1>
            <button
              onClick={() => setShowCompleteProfile(true)}
              className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
            >
              Edit Profile
            </button>
          </div>

          {dashboardData ? (
            <TrainerDashboard
              data={dashboardData}
              isLoading={isDashboardLoading}
            />
          ) : (
            <TrainerDashboard
              data={{
                trainer: { id: "", name: "", businessName: "", bio: "" },
                clients: [],
                stats: { totalClients: 0, totalClientsInSystem: 0 },
              }}
              isLoading={true}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">
            Welcome to FitTrack
          </h2>
          <p className="text-muted-foreground mb-6">
            {session?.user.role === UserRole.CLIENT
              ? "Your client dashboard is coming soon!"
              : "Please complete your profile to get started."}
          </p>
          <button
            onClick={() => setShowCompleteProfile(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Show any error messages */}
      {completeProfileMutation.error && (
        <div className="fixed bottom-4 right-4 bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          {completeProfileMutation.error.message}
        </div>
      )}
    </div>
  );
}
