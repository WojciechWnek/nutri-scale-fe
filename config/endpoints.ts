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
  recipes: {
    all: "/recipes",
    single: (id: string) => `/recipes/${id}`,
    delete: (id: string) => `/recipes/${id}`,
  },
  upload: {
    pdf: "/upload/pdf",
    status: (jobId: string) => `/upload/status/${jobId}`,
  },
} as const;
