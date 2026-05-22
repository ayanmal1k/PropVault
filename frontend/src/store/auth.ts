import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email?: string | null;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        if (refreshToken && typeof window !== "undefined") {
          localStorage.setItem("refreshToken", refreshToken);
        }
        set({ user, accessToken });
      },
      setTokens: (accessToken, refreshToken) => {
        if (refreshToken && typeof window !== "undefined") {
          localStorage.setItem("refreshToken", refreshToken);
        }
        set({ accessToken });
      },
      logout: () => {
        if (typeof window !== "undefined") localStorage.removeItem("refreshToken");
        set({ user: null, accessToken: null });
      },
    }),
    { name: "propvault-auth" }
  )
);
