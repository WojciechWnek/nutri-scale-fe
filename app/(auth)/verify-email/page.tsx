"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function EmailVerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const urlEmail = searchParams.get("email") || "";

  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [errorMessage, setErrorMessage] = React.useState(
    token ? "" : "No verification token found in the URL.",
  );

  // States for resending email
  const [resendEmail, setResendEmail] = React.useState(urlEmail);
  const [isResending, setIsResending] = React.useState(false);
  const [resendStatus, setResendStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [resendMessage, setResendMessage] = React.useState("");

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

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      setResendStatus("error");
      setResendMessage("Please enter your email address.");
      return;
    }

    setIsResending(true);
    setResendStatus("idle");

    try {
      const result = await authService.resendVerification(resendEmail);
      if (result.success) {
        setResendStatus("success");
        setResendMessage("Verification email sent! Please check your inbox.");
      } else {
        setResendStatus("error");
        setResendMessage(result.message || "Failed to resend email.");
      }
    } catch {
      setResendStatus("error");
      setResendMessage("An unexpected error occurred.");
    } finally {
      setIsResending(false);
    }
  };

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

  // If user entered WITHOUT a token (just wanted to resend email)
  if (status === "error" && !token) {
    return (
      <AuthLayout
        title="Resend Verification Email"
        subtitle="Enter your email to receive a new verification link"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="pt-2">
            {resendStatus === "success" ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-2">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  {resendMessage}
                </p>
                <Link href="/signin" className="block pt-4">
                  <Button variant="outline" className="w-full">
                    Back to Sign in
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResend} className="space-y-4">
                <div className="space-y-2 text-left">
                  <label htmlFor="resendEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <Input
                    id="resendEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                  />
                </div>

                {resendStatus === "error" && (
                  <p className="text-sm text-red-500 text-left">{resendMessage}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isResending}
                >
                  {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send verification link
                </Button>
                
                <Link href="/signin" className="block pt-2">
                  <Button variant="ghost" className="w-full" type="button">
                    Back to Sign in
                  </Button>
                </Link>
              </form>
            )}
          </div>
        </div>
      </AuthLayout>
    );
  }

  // If user entered WITH an invalid/expired token (verification failed)
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

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
          {resendStatus === "success" ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-2">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                {resendMessage}
              </p>
              <Link href="/signin" className="block pt-4">
                <Button variant="outline" className="w-full">
                  Back to Sign in
                </Button>
              </Link>
            </div>
          ) : (
             <form onSubmit={handleResend} className="space-y-4">
               <div className="space-y-2 text-left">
                 <label htmlFor="resendEmailFallback" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Didn't receive the code or link expired?
                 </label>
                 <Input
                   id="resendEmailFallback"
                   type="email"
                   placeholder="Enter your email to resend"
                   value={resendEmail}
                   onChange={(e) => setResendEmail(e.target.value)}
                   required
                 />
               </div>
 
               {resendStatus === "error" && (
                 <p className="text-sm text-red-500 text-left">{resendMessage}</p>
               )}
 
               <Button
                 type="submit"
                 className="w-full"
                 disabled={isResending}
               >
                 {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Resend verification email
               </Button>
               
               <Link href="/signin" className="block pt-2">
                 <Button variant="ghost" className="w-full" type="button">
                   Back to Sign in
                 </Button>
               </Link>
             </form>
           )}
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