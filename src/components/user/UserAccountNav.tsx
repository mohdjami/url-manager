"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import React from "react";
import { Logout } from "../dialogs/logout-dialog";
import { createClient } from "@/supabase/client";

const UserAccountNav = () => {
  const [showLogoutAlert, setShowLogoutAlert] = React.useState<boolean>(false);
  const [isLogoutLoading, setIsLogoutLoading] = React.useState<boolean>(false);
  const supabase = createClient();
  const handleLogout = async () => {
    setIsLogoutLoading(true);
    const logout = await supabase.auth.signOut();

    if (logout) {
      setIsLogoutLoading(false);
      setShowLogoutAlert(false);
    }
  };
  return (
    <>
      {" "}
      <Button
        onClick={() => setShowLogoutAlert(true)}
        disabled={isLogoutLoading}
        variant="destructive"
        className="dark:text-white"
      >
        Sign Out
      </Button>
      <Logout
        open={showLogoutAlert}
        onClose={() => setShowLogoutAlert(false)}
        onLogout={handleLogout}
        isLoading={isLogoutLoading}
      />
    </>
  );
};

export default UserAccountNav;
