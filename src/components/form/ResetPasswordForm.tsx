// ForgotPassword.tsx
"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Icons } from "../Icons";
import { ResetPasswordFormSchema } from "@/lib/validations/forms";
type FormValues = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const form = useForm<FormValues>();
  const search = useSearchParams();
  const token = search.get("token");
  const email = search.get("email");
  const [isValid, setIsValid] = useState(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const verify = async () => {
      if (token !== null && email !== null) {
        const response = await axios.post("/api/tokens/verify-token", {
          token,
          email,
        });
        setIsValid(response.data.isValid);
      }
    };

    verify();
  }, [token, email]);
  if (isValid === null) {
    return (
      <div className=" dark:text-slate-950">
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        Verifying token...
      </div>
    );
  } else if (!isValid) {
    return (
      <div>
        <h2>Something went wrong please try again</h2>
      </div>
    );
  } else {
    const onSubmit = async (data: z.infer<typeof ResetPasswordFormSchema>) => {
      try {
        await axios.post("/api/auth/reset-password", {
          ...data,
          token,
          email,
        });
        router.push("/sign-in");
        toast({
          title: "Password Updasted",
          description:
            "Password has been updated successfully, you can now login",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Something Went Very Wrong",
          variant: "destructive",
        });
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-center text-sm text-gray-600 mt-2">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-center text-sm text-gray-600 mt-2">
                    Re-Enter your password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Re-Enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="w-full mt-6" variant="outline" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    );
  }
};

export default ResetPassword;
