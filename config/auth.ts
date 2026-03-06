export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const AUTH_ENDPOINTS = {
  signin: "/auth/signin",
  signup: "/auth/signup",
  signout: "/auth/signout",
  refresh: "/auth/refresh",
  signoutAll: "/auth/signout-all",
  verifyEmail: "/auth/verify-email",
  resendVerification: "/auth/resend-verification",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  me: "/auth/me",
} as const;

export const getEndpoint = (endpoint: string) => `${API_URL}${endpoint}`;
