import Dashboard from "@/components/Dashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const DashboardPanel = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return window.location.replace("/sign-in");
  return <Dashboard />;
};

export default DashboardPanel;
