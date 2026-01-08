import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { AnalyticsResponse } from "@/types";
import api from "@/core/services/api";
import { useState } from "react";
import { toast } from "sonner";

export const  useHomeServices = () => {

    const [isSyncing, setIsSyncing] = useState(false);
    const [isInstantSyncing, setIsInstantSyncing] = useState(false);

    const { data, isLoading, error, mutate } = useSWR<AnalyticsResponse>(
        "/analytics/dashboard",
        fetcher
    );

    const syncEmail = async () => {
        try {
            setIsSyncing(true);
            const response = await api.post("/processed-mail/process-workflow");
            if (response.status === 200) {
                toast.success("Email synced successfully");
                setIsSyncing(false);
                mutate();
            }
        } catch (error: any) {
            toast.error(error.message);
            setIsSyncing(false);
        }
    }

    const instantSync = async () => {
        try {
            setIsInstantSyncing(true);
            const response = await api.post("/processed-mail/process-user-emails");
            if (response.status === 200) {
                toast.success("Email synced successfully");
                mutate();
            }
            setIsInstantSyncing(false);
        } catch (error: any) {
            toast.error(error.message);
            setIsInstantSyncing(false);
        }
    }

    return {
        data: data?.data,
        isLoading,
        error,
        mutate,
        syncEmail,
        isSyncing,
        instantSync,
        isInstantSyncing,
    }
}