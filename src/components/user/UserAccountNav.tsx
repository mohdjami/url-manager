"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";
import { Trash } from "lucide-react";
import React from "react";
import { Logout } from "../dialogs/logout-dialog";

const UserAccountNav = () => {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    const logout = await signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}/sign-in`,
    });

    if (logout) {
      setIsDeleteLoading(false);
      setShowDeleteAlert(false);
    }
  };
  return (
    <>
      {" "}
      <Button
        onClick={() => setShowDeleteAlert(true)}
        disabled={isDeleteLoading}
        variant="destructive"
        className="dark:text-white"
      >
        Sign Out
      </Button>
      <Logout
        open={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onDelete={handleDelete}
        isLoading={isDeleteLoading}
      />
    </>
  );
};

export default UserAccountNav;
