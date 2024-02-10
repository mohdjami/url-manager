"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";
import { DeleteDialog } from "../dialogs/delete-dialog";
import { Trash } from "lucide-react";

interface DeleteButtonProps {
  id: string;
}

async function deleteActivity(id: string) {
  const response = await fetch("api/urls/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });

  if (!response?.ok) {
    toast({
      title: "Something went wrong.",
      description: "Your url was not deleted. Please try again.",
      variant: "destructive",
    });
  } else {
    toast({
      description: "Your url has been deleted successfully.",
    });
  }

  return true;
}
export function DeleteButton({ id }: DeleteButtonProps) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    const deleted = await deleteActivity(id);

    if (deleted) {
      setIsDeleteLoading(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => setShowDeleteAlert(true)}
        disabled={isDeleteLoading}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
      <DeleteDialog
        open={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onDelete={handleDelete}
        isLoading={isDeleteLoading}
      />
    </>
  );
}
