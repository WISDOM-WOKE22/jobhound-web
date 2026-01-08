export interface applicationAnalyticsTypes {
    totalApplications?: number;
    signups?: number;
    month: string;
}

export type ApplicationStatus = 
    | "interviewing" 
    | "applied" 
    | "rejected" 
    | "offer" 
    | "pending";

export interface ApplicationType {
    id: string;
    jobTitle: string;
    company: string;
    status: ApplicationStatus;
    scheduledTime?: string;
    date?: string;
}

export interface AnalyticsResponse {
    message: string;
    data: {
        totalApplications: number;
        totalActiveApplications: number;
        totalOffers: number;
        totalRejected: number;
        totalInterviews: number;
        applicationsByMonth: {
            totalApplications: number;
            interview: number;
            accepted: number;
            offer: number;
            month: string;
        }[];
        appliedCompanies: string[];
        topFiveApplications: {
            _id: string;
            id: string;
            userId: string;
            jobTitle: string;
            companyName: string;
            source: string;
            recruiterName?: string;
            recruiterEmail?: string;
            currentStatus:string;
            appliedAt?: string;
            lastStatusUpdateAt: string;
            isManuallyCreated: boolean;
            isManuallyOverridden: boolean;
            createdAt: string;
            updatedAt: string;
            __v?: number;
        }[];
        statusBreakdown: {
            applied: number;
            under_review: number;
            shortlisted: number;
            interview_scheduled: number;
            interview_completed: number;
            assessment: number;
            offer: number;
            rejected: number;
            withdrawn: number;
        };
    }
}