import { get, post, del, HttpError } from "@/lib/http";
import { endpoints } from "@/config/endpoints";
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
} from "@/types/auth";

function handleAuthError(error: unknown): AuthResponse {
  if (error instanceof HttpError) {
    const errorData = error.data as { message?: string } | undefined;
    return {
      success: false,
      message: errorData?.message || error.message || "An error occurred",
    };
  }
  return { success: false, message: "An unexpected error occurred" };
}

export const authService = {
  async signin(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const data = await post<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>(endpoints.auth.signin, credentials);

      return { success: true, user: data.user, accessToken: data.accessToken };
    } catch (error) {
      return handleAuthError(error);
    }
  },

  async signup(data: RegisterData): Promise<AuthResponse> {
    try {
      const result = await post<{ message: string }>(
        endpoints.auth.signup,
        data,
      );

      return { success: true, message: result.message };
    } catch (error) {
      return handleAuthError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await del(endpoints.auth.signout);
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    try {
      const result = await post<{ message: string }>(
        endpoints.auth.forgotPassword,
        data,
      );

      return { success: true, message: result.message };
    } catch (error) {
      return handleAuthError(error);
    }
  },

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    try {
      const result = await post<{ message: string }>(
        endpoints.auth.resetPassword,
        data,
      );

      return { success: true, message: result.message };
    } catch (error) {
      return handleAuthError(error);
    }
  },

  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    try {
      const result = await post<{ message: string }>(
        endpoints.auth.verifyEmail,
        undefined,
        { params: { token: data.token } }
      );

      return { success: true, message: result.message };
    } catch (error) {
      return handleAuthError(error);
    }
  },

  async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const result = await post<{ message: string }>(
        endpoints.auth.resendVerification,
        { email },
      );

      return { success: true, message: result.message };
    } catch (error) {
      return handleAuthError(error);
    }
  },

  async me(): Promise<User | null> {
    try {
      const data = await get<{ user: User }>(endpoints.auth.me);
      return data.user;
    } catch {
      return null;
    }
  },
};
