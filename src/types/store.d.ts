import { UserType } from "./user";
import { notificationType } from "./notification";

export interface MainStoreType {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
    notifications: notificationType[];
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setNotifications: (notifications: notificationType[]) => void;
    setError: (error: string | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setUser: (user: UserType | null) => void;
    setNotifications: (notifications: notificationType[]) => void;
    setError: (error: string | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setUser: (user: UserType | null) => void;
    setNotifications: (notifications: notificationType[]) => void;
    setError: (error: string | null) => void;
    setIsLoading: (isLoading: boolean) => void;
}   