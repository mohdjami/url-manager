import Dashboard from "@/components/pages/Dashboard";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { createClient } from "@/supabase/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPanel = async () => {
  const { supabase, user } = await getCurrentUser();
  if (!user) return redirect("/sign-in");
  return <Dashboard />;
};

export default DashboardPanel;
