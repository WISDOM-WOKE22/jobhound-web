import api from "@/core/services/api";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMainStore } from "@/lib/zustand/store";
import { secureFlag, isProduction } from "@/lib/utils";
import { userTagsSchema, UserTagsType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const useAuthServices = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const router = useRouter();
    const [ isOnboarding, setIsOnboarding ] = useState(false);
    const { setUser, setIsAuthenticated, user } = useMainStore();


    const login = async () => {
        try {
            setIsLoading(true);
            const response = await api.post("/auth/google/callback");
            if (response.status === 200) {
                setSuccess(true);
                window.location.href = response.data.data;
            }
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            toast.error(error.message);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = async () => {
        try {
            setIsLoading(true);
            const response = await api.post("/auth/google-oauth", {
                code: code,
            });
            if (response.status === 200) {
                setSuccess(true);
                setUser(response.data.data.user);
                const { user, token } = response.data.data;
                document.cookie = `token=${token}; path=/${secureFlag}; SameSite=Strict`;
                document.cookie = `role=${user.role.toUpperCase()}; path=/${secureFlag}; SameSite=Strict`;
                document.cookie = `isAuthenticated=true; path=/${secureFlag}; SameSite=Strict`;
                setIsAuthenticated(true);
                if(response.data.data.user.isOnBoarded) {
                window.location.href = "/home";
                router.push("/home");
                } else {
                    router.push("/onboarding");
                    window.location.href = "/onboarding";
                }
            }
        } catch (error: any) {
            setIsLoading(false);
            toast.error(error.message);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const userTagsForm = useForm<UserTagsType>({
        resolver: zodResolver(userTagsSchema),
      })

    const getOnboardingStatus = async () => {
        if (!user?._id) return;
        try {
            setIsOnboarding(true);
            const response = await api.get(`/users/${user._id}`);
            if (response.status === 200 && response.data?.data) {
                setUser(response.data.data);
            }
        } catch (error: any) {
            toast.error(error?.message ?? "Failed to load profile");
            setError(error?.response?.data?.message ?? null);
        } finally {
            setIsOnboarding(false);
        }
    };

    const updateUserOnboarding = async (focusedTags: string[]) => {
        if (!user?._id) {
            toast.error("You must be signed in to save preferences.");
            return null;
        }
        try {
            const response = await api.patch(`/users/${user._id}`, {
                focusedTags,
                isOnBoarded: true,
            });
            if (response.status === 200 && response.data?.data) {
                setUser(response.data.data);
                return response.data.data;
            }
            return null;
        } catch (error: any) {
            const message = error?.response?.data?.message ?? error?.message ?? "Failed to save preferences";
            toast.error(message);
            throw error;
        }
    };

    return {
        login,
        isLoading,
        error,
        success,
        googleLogin,
        getOnboardingStatus,
        isOnboarding,
        userTagsForm,
        updateUserOnboarding
    };
};