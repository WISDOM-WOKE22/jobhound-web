import { create } from "zustand";
import { MainStoreType } from "@/types";
import { createJSONStorage, persist } from "zustand/middleware";

export const useMainStore = create<MainStoreType>()(
    persist((set) => ({
    user: null,
    notifications: [],
    isAuthenticated: false,
    isLoading: false,
    error: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null, notifications: [], isAuthenticated: false, isLoading: false, error: null }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setNotifications: (notifications) => set({ notifications }),
    setError: (error) => set({ error }),
    setIsLoading: (isLoading) => set({ isLoading }),
}), {
    name: "main-store",
    storage: createJSONStorage(() => localStorage),
}));