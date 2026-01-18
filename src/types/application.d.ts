export interface IApplicationType {
    id: string
    userId: string

    jobTitle: string
    company: string

    source: 'LinkedIn' | 'Indeed' | 'CompanySite' | 'Referral' | 'Other'
    sourceUrl?: string

    recruiterName?: string
    recruiterEmail?: string

    currentStatus:
    | 'applied'
    | 'under_review'
    | 'shortlisted'
    | 'interview_scheduled'
    | 'interview_completed'
    | 'assessment'
    | 'offer'
    | 'rejected'
    | 'withdrawn'

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