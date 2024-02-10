import Dashboard from "@/components/pages/Dashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPanel = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/sign-in");
  return <Dashboard />;
};

export default DashboardPanel;
