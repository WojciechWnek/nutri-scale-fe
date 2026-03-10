"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const emailVerifySchema = z.object({
  token: z.string().min(1, "Verification code is required"),
});

type EmailVerifyFormValues = z.infer<typeof emailVerifySchema>;

function EmailVerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [serverError, setServerError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [autoVerified, setAutoVerified] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<EmailVerifyFormValues>({
    resolver: zodResolver(emailVerifySchema),
    defaultValues: {
      token: "",
    },
  });

  const { isSubmitting } = form.formState;

  React.useEffect(() => {
    if (token && !autoVerified) {
      setIsLoading(true);
      authService
        .verifyEmail({ token })
        .then((result) => {
          if (result.success) {
            setSuccess(true);
            setAutoVerified(true);
          } else {
            setServerError(result.message || "Verification failed");
          }
        })
        .catch(() => {
          setServerError("An error occurred. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token, autoVerified]);

  async function onSubmit(data: EmailVerifyFormValues) {
    setServerError("");

    try {
      const result = await authService.verifyEmail({ token: data.token });

      if (result.success) {
        setSuccess(true);
        setAutoVerified(true);
      } else {
        setServerError(result.message || "Verification failed");
      }
    } catch {
      setServerError("An error occurred. Please try again.");
    }
  }

  if (success) {
    return (
      <AuthLayout
        title="Email verified!"
        subtitle="Your account has been successfully verified"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {token
              ? "Your email has been verified. You can now sign in."
              : "Redirecting you to sign in..."}
          </p>
          <Link href="/signin">
            <Button variant="outline">Sign in now</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (token && isLoading) {
    return (
      <AuthLayout title="Verifying your email" subtitle="Please wait...">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        email
          ? `We sent a verification code to ${email}`
          : "Enter the verification code"
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {serverError}
            </div>
          )}

          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter verification code"
                    className="text-center tracking-widest text-xl font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            Verify email
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Did not receive the code?{" "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Resend code
            </button>
          </p>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/signin"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Back to sign in
            </Link>
          </p>
        </form>
      </Form>
    </AuthLayout>
  );
}

export default function EmailVerifyPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <EmailVerifyContent />
    </React.Suspense>
  );
}
