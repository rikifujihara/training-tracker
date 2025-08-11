"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserRoleType } from "@/types/generated";
import { useUpdateUserRole } from "@/hooks";

export default function ChooseRolePage() {
  const updateUserRole = useUpdateUserRole();

  const handleRoleSelect = (role: UserRoleType) => {
    updateUserRole.mutate({ role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Choose Your Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Select whether you&apos;re a trainer or a client to get started
          </p>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Trainer</h3>
              <p className="text-gray-600">
                Create and manage training programs for your clients
              </p>
              <Button
                onClick={() => handleRoleSelect("TRAINER")}
                disabled={updateUserRole.isPending}
                className="w-full"
                size="lg"
                type="button"
              >
                {updateUserRole.isPending ? "Setting up..." : "I'm a Trainer"}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Client</h3>
              <p className="text-gray-600">
                Follow training programs created by your trainer
              </p>
              <Button
                onClick={() => handleRoleSelect("CLIENT")}
                disabled={updateUserRole.isPending}
                className="w-full"
                variant="outline"
                type="button"
                size="lg"
              >
                {updateUserRole.isPending ? "Setting up..." : "I'm a Client"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
