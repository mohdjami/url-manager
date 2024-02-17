"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";
import { Trash } from "lucide-react";
import React from "react";
import { Logout } from "../dialogs/logout-dialog";

const UserAccountNav = () => {
  const [showLogoutAlert, setShowLogoutAlert] = React.useState<boolean>(false);
  const [isLogoutLoading, setIsLogoutLoading] = React.useState<boolean>(false);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    const logout = await signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}/sign-in`,
    });

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
