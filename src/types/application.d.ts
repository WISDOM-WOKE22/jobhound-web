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