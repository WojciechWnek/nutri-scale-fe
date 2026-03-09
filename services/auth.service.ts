import { get, post, del } from "@/lib/http";
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

export const authService = {
  async signin(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await post<{
      accessToken: string;
      refreshToken: string;
      user: User;
    }>(endpoints.auth.signin, credentials);

    return { success: true, user: data.user, accessToken: data.accessToken };
  },

  async signup(data: RegisterData): Promise<AuthResponse> {
    const result = await post<{ message: string }>(endpoints.auth.signup, data);

    return { success: true, message: result.message };
  },

  async logout(): Promise<void> {
    try {
      await del(endpoints.auth.signout);
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    const result = await post<{ message: string }>(
      endpoints.auth.forgotPassword,
      data,
    );

    return { success: true, message: result.message };
  },

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    const result = await post<{ message: string }>(
      endpoints.auth.resetPassword,
      data,
    );

    return { success: true, message: result.message };
  },

  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    const result = await post<{ message: string }>(
      endpoints.auth.verifyEmail,
      data,
    );

    return { success: true, message: result.message };
  },

  async resendVerification(email: string): Promise<AuthResponse> {
    const result = await post<{ message: string }>(
      endpoints.auth.resendVerification,
      { email },
    );

    return { success: true, message: result.message };
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
