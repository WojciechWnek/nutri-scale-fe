'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/auth/Button';
import { Input } from '@/components/auth/Input';
import { AuthLayout } from '@/components/auth/AuthLayout';

function EmailVerifyContent() {
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const [verificationToken, setVerificationToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoVerified, setAutoVerified] = useState(false);

  useEffect(() => {
    if (token && !autoVerified) {
      setIsLoading(true);
      verifyEmail({ token })
        .then((result) => {
          if (result.success) {
            setSuccess(true);
            setAutoVerified(true);
          } else {
            setError(result.message || 'Verification failed');
          }
        })
        .catch(() => {
          setError('An error occurred. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token, autoVerified, verifyEmail]);

  const handleVerify = async (tokenToVerify: string) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await verifyEmail({ token: tokenToVerify });
      
      if (result.success) {
        setSuccess(true);
        setAutoVerified(true);
      } else {
        setError(result.message || 'Verification failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleVerify(verificationToken);
  };

  if (success) {
    return (
      <AuthLayout title="Email verified!" subtitle="Your account has been successfully verified">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {token ? 'Your email has been verified. You can now sign in.' : 'Redirecting you to sign in...'}
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
    <AuthLayout title="Verify your email" subtitle={email ? `We sent a verification code to ${email}` : 'Enter the verification code'}>
      <form onSubmit={handleManualVerify} className="space-y-5">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        <Input
          type="text"
          label="Verification code"
          placeholder="Enter verification code"
          value={verificationToken}
          onChange={(e) => setVerificationToken(e.target.value)}
          required
          className="text-center tracking-widest text-xl font-mono"
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Verify email
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Did not receive the code?{' '}
          <button type="button" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Resend code
          </button>
        </p>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function EmailVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerifyContent />
    </Suspense>
  );
}
