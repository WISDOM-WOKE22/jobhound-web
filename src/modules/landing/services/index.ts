import api from "@/core/services/api";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMainStore } from "@/lib/zustand/store";
import { secureFlag, isProduction } from "@/lib/utils";

export const useAuthServices = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const router = useRouter();
    const { setUser, setIsAuthenticated } = useMainStore();


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
                router.push("/home");
            }
        } catch (error: any) {
            setIsLoading(false);
            toast.error(error.message);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        isLoading,
        error,
        success,
        googleLogin,
    };
};