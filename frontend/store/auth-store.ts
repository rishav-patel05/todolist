"use client";

import { create } from "zustand";
import { authApi } from "@/lib/api";
import { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  fetchUser: async () => {
    try {
      const user = await authApi.me();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  clear: () => set({ user: null })
}));
