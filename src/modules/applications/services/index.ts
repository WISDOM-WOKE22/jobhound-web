import api from "@/core/services/api";
import { useState } from "react";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr"
import { ApplicationResponseType, IApplicationType, SingleApplicationTimelineType, EmailContentType } from "@/types";
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
    const [ singleApplicationLoading, setSingleApplicationLoading] = useState(false);
    const [ singleApplication, setSingleApplication] = useState<IApplicationType | null>(null);
    const [ singleApplicationTimeline, setSingleApplicationTimeline] = useState<SingleApplicationTimelineType[] | null>(null);
    const [ emailContent, setEmailContent] = useState<EmailContentType | null>(null);
    const [ emailContentLoading, setEmailContentLoading] = useState(false);
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

    const getSingleApplication = async (id: string) => {
        try {
            setSingleApplicationLoading(true);
            const response = await api.get(`/applications/${id}`);
            if (response.status === 200) {
                setSingleApplication(response.data.data.application);
                setSingleApplicationTimeline(response.data.data.timelineEmails);
            }
            setSingleApplicationLoading(false);
        }
        catch (error: any) {
            setSingleApplicationLoading(false)
            toast.error(error.message);
            setServerError(error.response.data.message);
        } finally {
            setSingleApplicationLoading(false);
        }
    }

    const getEmailContent = async (id: string) => {
        try {
            setEmailContentLoading(true);
            const response = await api.get(`/processed-mail/get-email-by-provider-message-id/${id}`);
            console.log(response.data.data);
            if (response.status === 200) {
                setEmailContent(response.data.data);
            }
            setEmailContentLoading(false);
        }
        catch (error: any) {
            setEmailContentLoading(false);
            toast.error(error.message);
            setServerError(error.response.data.message);
        } finally {
            setEmailContentLoading(false);
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
        singleApplication,
        singleApplicationLoading,
        getSingleApplication,
        singleApplicationTimeline,
        getEmailContent,
        emailContentLoading,
        emailContent
    }
}