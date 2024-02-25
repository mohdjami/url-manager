import { Metadata } from "next";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header";

import { Shell } from "@/components/layouts/shell";
import { UserNameForm } from "@/components/form/username-form";
import { AppearanceForm } from "@/components/form/appearence-form";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage account and app settings.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin");
  }

  return (
    <main className="py-10">
      <DashboardHeader
        heading="Settings"
        text="Manage account and app settings."
      />
      <div className="grid grid-cols-2 gap-6">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <AppearanceForm />
      </div>
    </main>
  );
}
