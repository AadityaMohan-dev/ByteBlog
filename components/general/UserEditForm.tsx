"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Loader2, X, Upload } from "lucide-react";
import Image from "next/image";
import { updateUser } from "@/src/action/user.action"; // Import the server action

interface Props {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
}

function UserEditForm({ user }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatarUrl || null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const result = await updateUser(formData);

      if (result.success) {
        // Success - refresh and show message
        router.refresh();
        alert("Profile updated successfully!");
      } else {
        setErrors({ submit: result.error || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Update failed:", error);
      setErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, avatar: "Image must be less than 5MB" });
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, avatar: "Please select a valid image file" });
        return;
      }

      const { avatar, ...restErrors } = errors;
      setErrors(restErrors);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 min-w-full border rounded-lg shadow-2xl max-w-2xl mx-auto px-16 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Update Personal Details</h1>
        <p className="text-gray-600">Keep your profile information up to date</p>
      </div>

      {errors.submit && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel>
            First Name <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            name="firstName"
            defaultValue={user.firstName}
            placeholder="Enter first name"
            required
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>
            Last Name <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            name="lastName"
            defaultValue={user.lastName}
            placeholder="Enter last name"
            required
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </Field>
      </div>

      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          disabled
          defaultValue={user.email}
          className="bg-gray-50 cursor-not-allowed"
        />
        <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
      </Field>

      <Field>
        <FieldLabel>Profile Picture</FieldLabel>
        <div className="space-y-4">
          {avatarPreview && (
            <div className="relative inline-block">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                aria-label="Remove avatar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <label
              htmlFor="avatar"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Image</span>
            </label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <span className="text-sm text-gray-500">Max size: 5MB</span>
          </div>

          {errors.avatar && (
            <p className="text-red-500 text-sm">{errors.avatar}</p>
          )}
        </div>
      </Field>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default UserEditForm;