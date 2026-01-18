import api from "@/core/services/api";
import { useState } from "react";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr"
import { ApplicationResponseType, IApplicationType } from "@/types";
import { toQueryString } from "@/utils";

export interface ApplicationQueryParams {
    limit?: number;
    offset?: number;
    company?: string;
    source?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const useApplicationsService = (queryParams?: ApplicationQueryParams) => {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [application, setApplication] = useState<IApplicationType | null>(null);
    const queryString = toQueryString(queryParams || {});

    const { data, isLoading, error, mutate } = useSWR<ApplicationResponseType>(
        `/applications${queryString ? `?${queryString}` : ''}`,
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
        data: data?.data?.applications,
        pagination: data?.data?.pagination || {
            total: 0,
            limit: queryParams?.limit || 20,
            offset: 0,
            currentPage: 1,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
        },
        mutate,
        serverError,
        application,
    }
}