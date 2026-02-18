import api from "@/core/services/api";
import { useMainStore } from "@/lib/zustand/store";
import { toast } from "sonner";

export const useSettingsServices = () => {
    const { setUser } = useMainStore();

    const getMyProfile = async () => {
        try {
            const response = await api.get("/users/me");
            setUser(response.data.user);
        } catch (error: any) {
            const message = error?.response?.data?.message ?? error?.message ?? "Failed to load profile";
            toast.error(message);
        }
    }
    
    return { getMyProfile };
}