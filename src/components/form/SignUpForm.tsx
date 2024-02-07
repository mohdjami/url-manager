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
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import GoogleSignInButton from "../GoogleSignInButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import GithubSignInButton from "../GithubSignInButton";

const FormSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
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

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  //when the user signs up an email should be sent to the user mail and he should verify it by clicking on it right
  //until the email is verified the user should not be signed up or created
  //so the workflow should be like user clicks on sign up button
  //
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const response = await axios.post("/api/createUser", values);
      console.log("response= ", response, "status", response.status);

      if (response.status === 201) {
        try {
          const response = await axios.post("/api/send-mail", values);
          console.log("email verification response:", response);
          router.push("/sign-in");
          toast({
            title: "Verify Email to Sign-in",
            description:
              "A verification email has been sent to your email address. Please verify your email to complete the sign-up process.",
            variant: "destructive",
          });
        } catch (error) {
          console.log("error in sending email verification", error);
        }
      }
    } catch (error) {
      console.log("error in creating user", error);
      toast({
        title: "Error",
        description: "Oops Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2 md:space-y-2"
      >
        <div className="space-y-2 md:space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full mt-4 mb-1 md:mt-8 lg:mt-10 block lg:hidden dark:text-gray-600">
                  Username
                </FormLabel>
                <FormLabel className="md:block hidden dark:text-gray-600  md:mb-1">
                  Username
                </FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-600">Email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" dark:text-gray-600">Password</FormLabel>
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
                <FormLabel className="dark:text-gray-600">
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
        <div style={{ marginBottom: "10px" }}>
          <Button
            className="flex items-center space-x-2 w-full md:block hidden  "
            type="submit"
            variant="outline"
          >
            Sign up
          </Button>
          <Button
            className="w-full mt-4 md:mt-8 lg:mt-10 block lg:hidden"
            type="submit"
            variant="outline"
          >
            Sign up
          </Button>
        </div>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400 dark:text-gray-600 ">
        or
      </div>
      <div style={{ marginBottom: "10px" }}>
        <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
      </div>
      <GithubSignInButton>Sign in with Github</GithubSignInButton>{" "}
      <p className="text-center text-sm text-gray-600 mt-2">
        If you already have an account, please&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </Form>
  );
};

export default SignUpForm;
