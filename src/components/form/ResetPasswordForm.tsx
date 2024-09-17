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
import { createClient } from "@/supabase/client";
type FormValues = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const supabase = createClient();
  const form = useForm<FormValues>();
  const search = useSearchParams();
  const token = search.get("token");
  const email = search.get("email");
  const [isValid, setIsValid] = useState(null);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof ResetPasswordFormSchema>) => {
    try {
      setLoading(true);
      const { data: UserExists, error } = await supabase
        .from("User")
        .select("*")
        .eq("email", email)
        .single();

      if (!UserExists) {
        toast({
          title: "User Not Found",
          description: "Please check your email and try again",
          variant: "destructive",
        });
        return;
      }

      await supabase.auth.updateUser({ password: data.password });
      await supabase.from("User").update({
        password: data.password,
        updatedAt: new Date(Date.now()),
      });

      router.push("/sign-in");
      toast({
        title: "Password Updated",
        description:
          "Password has been updated successfully, you can now login",
        variant: "default",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

        <Button type="submit" variant="outline" className="w-full mt-6">
          {loading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Submit"
          )}{" "}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPassword;
