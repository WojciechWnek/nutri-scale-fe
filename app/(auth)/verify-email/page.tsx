"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function EmailVerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [errorMessage, setErrorMessage] = React.useState(
    token ? "" : "No verification token found in the URL.",
  );

  React.useEffect(() => {
    if (!token) return;

    let isMounted = true;

    authService
      .verifyEmail({ token })
      .then((result) => {
        if (!isMounted) return;
        if (result.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(
            result.message ||
              "Verification failed. The link might be invalid or expired.",
          );
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          "An unexpected error occurred. Please try again later.",
        );
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (status === "loading") {
    return (
      <AuthLayout title="Verifying your email" subtitle="Please wait...">
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (status === "success") {
    return (
      <AuthLayout
        title="Email verified!"
        subtitle="Your account has been successfully verified"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Your email has been verified. You can now sign in.
          </p>
          <div className="pt-2">
            <Link href="/signin">
              <Button className="w-full">Go to Sign in</Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verification Failed"
      subtitle="We couldn't verify your email address"
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {errorMessage}
        </div>
        <div className="pt-2">
          <Link href="/signin">
            <Button variant="outline" className="w-full">
              Back to Sign in
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function EmailVerifyPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      }
    >
      <EmailVerifyContent />
    </React.Suspense>
  );
}
