"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import MainLayout from "@/components/layouts/MainLayout";
import CompleteProfileForm from "@/components/forms/CompleteProfileForm";
import TrainerDashboard from "@/components/ui/TrainerDashboard";
import { useCompleteProfile } from "@/lib/hooks/useUserQueries";
import { useTrainerDashboard } from "@/lib/hooks/useTrainerQueries";
import { useState } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  const completeProfileMutation = useCompleteProfile();
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useTrainerDashboard();

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <MainLayout>
        <div>Loading...</div>
      </MainLayout>
    );
  }

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
    <MainLayout>
      {needsProfileCompletion ? (
        <CompleteProfileForm
          onSubmit={handleCompleteProfile}
          isSubmitting={completeProfileMutation.isPending}
        />
      ) : session?.user.role === UserRole.TRAINER ? (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Trainer Dashboard
            </h1>
            <button
              onClick={() => setShowCompleteProfile(true)}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Trainer Admin
          </h2>
          <p className="text-gray-600 mb-6">
            {session?.user.role === UserRole.CLIENT
              ? "Your client dashboard is coming soon!"
              : "Please complete your profile to get started."}
          </p>
          <button
            onClick={() => setShowCompleteProfile(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Show any error messages */}
      {completeProfileMutation.error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {completeProfileMutation.error.message}
        </div>
      )}
    </MainLayout>
  );
}
