import Dashboard from "@/components/Dashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const DashboardPanel = async () => {
  return <Dashboard />;
};

export default DashboardPanel;
