import { get } from "@/lib/http";
import { endpoints } from "@/config/endpoints";
import { User } from "@/types/auth";

export const userService = {
  async me(): Promise<User | null> {
    try {
      const data = await get<any>(endpoints.users.me);
      return data.user || data;
    } catch {
      return null;
    }
  },
};
