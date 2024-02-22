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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ForgotPasswordFormSchema } from "@/lib/validations/forms";

type FormValues = {
  email: string;
};

const ForgotPassword = () => {
  const form = useForm<FormValues>();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof ForgotPasswordFormSchema>) => {
    try {
      await axios.post("/api/auth/forgot-password", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast({
        title: "Success",
        description: "Password reset link has been sent to your mail",
        variant: "default",
      });
      router.push("/sign-in");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: "Error, try again",
          description: "User with this email does not exist",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error, try again",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center text-sm text-gray-600 mt-2">
                  Enter your registered email
                </FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" variant="outline" className="w-full mt-6">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPassword;
