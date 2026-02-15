import { useMainStore } from "@/lib/zustand/store";
import api from "@/core/services/api";
import { useState } from "react";
// import { toast } from "sonner";

export const useProcessMail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { setUser } = useMainStore();

    const processMail = async () => {
        try {
            setIsLoading(true);
            const response = await api.post("/processed-mail/process-workflow-background");
            if (response.status === 200) {
                setSuccess(true);
                setUser(response.data.data.user);
                // toast.success("Email processing workflow started successfully");
            }
        }
        catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        processMail,
        isLoading,
        error,
        success,
    }
}