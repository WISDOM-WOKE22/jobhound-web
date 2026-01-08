import api from "@/core/services/api";
import { useState } from "react";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr"
import { ApplicationResponseType, IApplicationType } from "@/types";

export const useApplicationsService = () => {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [application, setApplication] = useState<IApplicationType | null>(null);

    const { data, isLoading, error, mutate } = useSWR<ApplicationResponseType>(
        "/applications",
        fetcher
    );

    const getApplications = async () => {
        try {
            const response = await api.get("/applications");
            if (response.status === 200) {
                setSuccess(true);
                setApplication(response.data.data);
            }
        } catch (error: any) {
            setLoading(false);
            toast.error(error.message);
            setServerError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return {
        getApplications,
        isLoading,
        error,
        loading,
        setLoading,
        success,
        data: data?.data,
        mutate,
        serverError,
        application,
    }
}