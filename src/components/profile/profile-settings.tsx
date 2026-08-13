"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Camera, KeyRound, ShieldAlert, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useChangePassword,
  useDeactivateProfile,
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from "@/hooks/profile/use-profile";
import {
  passwordChangeSchema,
  profileSchema,
  type PasswordChangeFormValues,
  type ProfileFormValues,
} from "@/lib/schemas/profile-schema";
import { parseError } from "@/lib/utils";
import type { AuthenticatedUser } from "@/types/auth";
import Image from "next/image";

interface ProfileSettingsProps {
  initialProfile: AuthenticatedUser;
}

function initials(profile: AuthenticatedUser) {
  const value = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .map((part) => part?.charAt(0).toUpperCase())
    .join("");
  return value || profile.email.charAt(0).toUpperCase();
}

export function ProfileSettings({ initialProfile }: ProfileSettingsProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deactivatePhrase, setDeactivatePhrase] = useState("");

  const profileQuery = useProfile(initialProfile);
  const profile = profileQuery.data ?? initialProfile;
  const updateMutation = useUpdateProfile();
  const avatarMutation = useUploadAvatar();
  const passwordMutation = useChangePassword();
  const deactivateMutation = useDeactivateProfile();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    values: {
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      phone: profile.phone ?? "",
      dateOfBirth: profile.dateOfBirth ?? "",
      address: profile.address ?? "",
      preferredLanguage: profile.preferredLanguage ?? "en",
    },
    mode: "onTouched",
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeFormValues>({
    resolver: yupResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  async function submitProfile(values: ProfileFormValues) {
    try {
      await updateMutation.mutateAsync(values);
      toast.success("Profile updated");
      router.refresh();
    } catch (error) {
      toast.error(parseError(error));
    }
  }

  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Use a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile photos must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    try {
      await avatarMutation.mutateAsync(file);
      toast.success("Profile photo updated");
      router.refresh();
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      event.target.value = "";
    }
  }

  async function submitPassword(values: PasswordChangeFormValues) {
    try {
      await passwordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      resetPasswordForm();
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(parseError(error));
    }
  }

  async function deactivateAccount() {
    if (deactivatePhrase !== "DEACTIVATE") return;

    try {
      await deactivateMutation.mutateAsync();
      router.replace("/sign-in?reason=account-deactivated");
      router.refresh();
    } catch (error) {
      toast.error(parseError(error));
    }
  }

  return (
    <div className="space-y-7">
      <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-primary/10 font-display text-2xl font-extrabold text-primary ring-1 ring-primary/10">
              {profile.avatarUrl ? (
                <Image
                  width={80}
                  height={80}
                  priority
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="size-full object-cover"
                />
              ) : (
                initials(profile)
              )}
            </div>
            <div>
              <p className="font-display text-xl font-extrabold text-foreground">
                {[profile.firstName, profile.lastName]
                  .filter(Boolean)
                  .join(" ") || "Your profile"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.email}
              </p>
              <p className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold capitalize text-primary">
                {profile.role}
              </p>
            </div>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="outline"
              disabled={avatarMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera aria-hidden="true" className="size-4" />
              {avatarMutation.isPending ? "Uploading..." : "Change photo"}
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              JPG, PNG or WebP. Maximum 2 MB.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <UserRound aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold text-foreground">
              Personal information
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Keep the contact details attached to your account up to date.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleProfileSubmit(submitProfile)}
          noValidate
          className="mt-7 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="profile-first-name"
              label="First name"
              autoComplete="given-name"
              required
              errorMessage={profileErrors.firstName?.message}
              {...registerProfile("firstName")}
            />
            <Input
              id="profile-last-name"
              label="Last name"
              autoComplete="family-name"
              required
              errorMessage={profileErrors.lastName?.message}
              {...registerProfile("lastName")}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="profile-email"
              label="Email address"
              type="email"
              value={profile.email}
              disabled
              info="Email changes are managed separately for account security."
              readOnly
            />
            <Input
              id="profile-phone"
              label="Phone number"
              type="tel"
              autoComplete="tel"
              placeholder="+234 ..."
              errorMessage={profileErrors.phone?.message}
              {...registerProfile("phone")}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="profile-dob"
              label="Date of birth"
              type="date"
              errorMessage={profileErrors.dateOfBirth?.message}
              {...registerProfile("dateOfBirth")}
            />
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="profile-language"
                className="font-display text-sm font-bold text-foreground"
              >
                Preferred language
              </label>
              <select
                id="profile-language"
                className="min-h-12 rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10"
                {...registerProfile("preferredLanguage")}
              >
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <Textarea
            id="profile-address"
            label="Address"
            rows={4}
            autoComplete="street-address"
            errorMessage={profileErrors.address?.message}
            {...registerProfile("address")}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-turquoise/15 text-teal-700">
            <KeyRound aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold text-foreground">
              Password
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Confirm your current password before choosing a new one.
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePasswordSubmit(submitPassword)}
          noValidate
          className="mt-7 space-y-5"
        >
          <Input
            id="current-password"
            label="Current password"
            type="password"
            autoComplete="current-password"
            required
            errorMessage={passwordErrors.currentPassword?.message}
            {...registerPassword("currentPassword")}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="new-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              info="At least 8 characters with uppercase, lowercase and a number."
              errorMessage={passwordErrors.newPassword?.message}
              {...registerPassword("newPassword")}
            />
            <Input
              id="confirm-new-password"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              required
              errorMessage={passwordErrors.confirmPassword?.message}
              {...registerPassword("confirmPassword")}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="outline"
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending ? "Changing..." : "Change password"}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-destructive/20 bg-destructive/3 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldAlert aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold text-foreground">
              Deactivate account
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              This signs you out and marks your profile inactive without
              deleting related school records. An administrator can restore
              access if needed.
            </p>
          </div>
        </div>

        <div className="mt-6 max-w-md">
          <Input
            id="deactivate-confirmation"
            label='Type "DEACTIVATE" to confirm'
            value={deactivatePhrase}
            onChange={(event) => setDeactivatePhrase(event.target.value)}
            autoComplete="off"
          />
          <Button
            type="button"
            variant="destructive"
            className="mt-4"
            disabled={
              deactivatePhrase !== "DEACTIVATE" || deactivateMutation.isPending
            }
            onClick={deactivateAccount}
          >
            {deactivateMutation.isPending
              ? "Deactivating..."
              : "Deactivate my account"}
          </Button>
        </div>
      </section>
    </div>
  );
}
