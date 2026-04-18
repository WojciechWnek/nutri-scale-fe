export const endpoints = {
  auth: {
    signin: "/auth/signin",
    signup: "/auth/signup",
    signout: "/auth/signout",
    refresh: "/auth/refresh",
    signoutAll: "/auth/signout-all",
    verifyEmail: "/auth/verify-email",
    resendVerification: "/auth/resend-verification",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  users: {
    me: "/users/me",
    allUser: "/users",
    singleUser: (id: string) => `/users/${id}`,
  },
} as const;
