import * as React from "react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Icons } from "../Icons";

interface Logout {
  open: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  isLoading: boolean;
}

export function Logout({ open, onClose, onDelete, isLoading }: Logout) {
  const router = useRouter();

  const handleDelete = async () => {
    await onDelete();
    onClose();
    window.location.reload();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you wanna logout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-auto justify-between">
          <div className="flex justify-center space-x-4 align-middle">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 focus:ring-red-600"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.signout className="mr-2 h-4 w-4" />
              )}
              <span>Logout</span>
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
