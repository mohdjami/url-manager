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
type FormValues = {
  password: string;
  confirmPassword: string;
};

//first i will store the created token in the database for that email then i will check it here if it matches with the token in the database then only i  will show the form to submit the passwords and change them otherwiise not okkay

const Schema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

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
        const response = await axios.post("/api/verify-token", {
          token,
          email,
        });
        console.log("response=", response, "response.data=", response.data);
        console.log("valid=", response.data.isValid);
        setIsValid(response.data.isValid);
      }
    };

    verify();
  }, [token, email]);
  console.log("token", token, "emai:", email);
  console.log("valid=", isValid);
  if (isValid === null) {
    return <div>Verifying token...</div>;
  } else if (!isValid) {
    return (
      <div>
        <h2>Something went wrong please try again</h2>
      </div>
    );
  } else {
    console.log("is valid later:", isValid);
    const onSubmit = async (data: z.infer<typeof Schema>) => {
      console.log("data on submit reset button", data);
      // console.log(token);
      try {
        const response = await axios.post("/api/reset-password", {
          ...data,
          token,
          email,
        });
        router.push("/sign-in");
        toast({
          title: "Password Upsated",
          description:
            "Password has been updated successfully, you can now login",
          variant: "default",
        });
        console.log(response);
        // Handle success (e.g., show a success message and redirect to login page)
      } catch (error) {
        console.log(error);
        // Handle error (e.g., show an error message)
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
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Re-Enter your password</FormLabel>
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

          <Button className="w-full mt-6" type="submit">
            Submit{" "}
          </Button>
        </form>
      </Form>
    );
  }
};

export default ResetPassword;
