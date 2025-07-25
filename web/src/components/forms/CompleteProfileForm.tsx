"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { UserRoleSchema } from "@/types/generated";
import { z } from "zod";

// Form schema using generated types
const CompleteProfileFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().optional(),
    role: UserRoleSchema,
    businessName: z.string().optional(),
    bio: z.string().optional(),
  })
  .refine(
    (data) => {
      // Business rule: Trainers must have business name
      if (data.role === UserRole.TRAINER && !data.businessName) {
        return false;
      }
      return true;
    },
    {
      message: "Business name is required for trainers",
      path: ["businessName"],
    }
  );

type CompleteProfileFormData = z.infer<typeof CompleteProfileFormSchema>;

interface CompleteProfileFormProps {
  onSubmit: (data: CompleteProfileFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function CompleteProfileForm({
  onSubmit,
  isSubmitting = false,
}: CompleteProfileFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(CompleteProfileFormSchema),
  });

  const watchedRole = watch("role");

  const handleFormSubmit = async (data: CompleteProfileFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-gray-600">
          Please provide some additional information to set up your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name *
            </label>
            <input
              {...register("firstName")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name *
            </label>
            <input
              {...register("lastName")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <input
            {...register("phone")}
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am a... *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                <input
                  {...register("role")}
                  type="radio"
                  value={UserRole.TRAINER}
                  className="sr-only"
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      Personal Trainer
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500">
                      I train clients and manage programs
                    </span>
                  </span>
                </span>
              </label>
            </div>

            <div>
              <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                <input
                  {...register("role")}
                  type="radio"
                  value={UserRole.CLIENT}
                  className="sr-only"
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      Client
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500">
                      I work with a personal trainer
                    </span>
                  </span>
                </span>
              </label>
            </div>
          </div>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Trainer-specific fields */}
        {watchedRole === UserRole.TRAINER && (
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">
              Trainer Information
            </h3>

            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Business Name *
              </label>
              <input
                {...register("businessName")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your business or gym name"
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bio
              </label>
              <textarea
                {...register("bio")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tell clients about your experience and specialties..."
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Completing Profile..." : "Complete Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
