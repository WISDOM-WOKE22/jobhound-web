export interface IApplicationType {
    id: string
    _id: string
    userId: string

    jobTitle: string
    company: string
    companyName: string
    sourceUrl?: string

    source: "string"
    sourceUrl?: string

    recruiterName?: string
    recruiterEmail?: string

    currentStatus: string

    appliedAt?: Date
    lastStatusUpdateAt: Date

    isManuallyCreated: boolean
    isManuallyOverridden: boolean

    lastEmailId?: string

    createdAt: Date
    updatedAt: Date
}

export interface PaginationType {
    total: number;
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ApplicationResponseType {
    data: {
        applications: ApplicationType[];
        pagination: PaginationType;
    }
    message?: string;
}

export interface SingleApplicationTimelineType {
    _id?: string;
    userId?: string;
    emailAccountId: string;
    providerMessageId?: string;
    threadId?: string;
    from?: string;
    subject?: string;
    snippet?: string;
    receivedAt?: string;
    isJobRelated?: boolean;
    linkedApplicationId?: string;
    status?: string;
    processedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface EmailContentType {
    id: string;
    threadId: string;
    labelIds: string[];
    snippet: string;
    subject: string;
    from: string;
    to: string;
    cc: string;
    bcc: string;
    date: string;
    body: string;
    htmlBody: string;
    hasAttachments: boolean;
    attachments: any[];
}