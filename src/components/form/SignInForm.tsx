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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import GithubSignInButton from "../GithubSignInButton";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const verifyEmail = async (email: string) => {
    return axios.post(
      "/api/isVarified",
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
  };

  const handleError = (error: any) => {
    toast({
      title: "Error",
      description: "Oops Something went wrong",
      variant: "destructive",
    });
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      console.log(result);
      if (result?.error === "CredentialsSignin") {
        toast({
          title: "Either email or password is wrong",
          description:
            "Please sign up if you are not a user or click on forgot password t reset your password",
          variant: "destructive",
        });
      } else {
        const response = await verifyEmail(values.email);

        if (response.status === 200) {
          router.push("/admin");
          router.refresh();
        } else {
          toast({
            title: "Verify your email",
            description:
              "A verification link has been sent to your email id. Please verify to gain access of all the features of the application.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      handleError(error);
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
                  Email
                </FormLabel>
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
        </div>
        <Button
          className="flex items-center w-full mt-6"
          type="submit"
          variant="outline"
        >
          Sign in
        </Button>
      </form>
      <Link
        className="text-red-500 hover:underline text-xs flex justify-end"
        href="/forgot-password"
      >
        Forgot Password
      </Link>

      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400 dark:text-slate-950">
        or
      </div>
      <div style={{ marginBottom: "10px" }}>
        <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
      </div>
      <GithubSignInButton>Sign in with Github</GithubSignInButton>
      <p className="text-center text-sm text-gray-600 mt-2">
        If you don&apos;t have an account, please&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign-up">
          Sign up
        </Link>
      </p>
    </Form>
  );
};

export default SignInForm;
