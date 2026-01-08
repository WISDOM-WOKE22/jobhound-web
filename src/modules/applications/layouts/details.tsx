"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/core/commons/layouts/dashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewEmailModal } from "@/modules/applications/components/modals/viewEmail";
import {
    ChevronLeft,
    ExternalLink,
    Calendar,
    Clock,
    Mail,
    User,
    Sparkles,
    Globe,
} from "lucide-react";
import { ApplicationStatus } from "@/types";

// Types for timeline events and email updates
interface TimelineEvent {
    id: string;
    status: ApplicationStatus;
    label: string;
    timestamp: string;
    source: "email" | "manual" | "system";
    emailSubject?: string;
    emailFrom?: string;
    isCurrent?: boolean;
}

interface EmailUpdate {
    id: string;
    from: string;
    subject: string;
    timestamp: string;
    avatar?: string;
}

interface ApplicationDetails {
    id: string;
    jobTitle: string;
    company: string;
    status: ApplicationStatus;
    appliedDate: string;
    updatedDate: string;
    companyUrl?: string;
    jobPostingUrl?: string;
    timeline: TimelineEvent[];
    lastEmail: EmailUpdate;
}
    
export function ApplicationDetailsLayout() {
    const params = useParams();
    const router = useRouter();
    const [selectedEmail, setSelectedEmail] = useState<{
        from: string;
        subject: string;
        timestamp: string;
        to?: string;
        body?: string;
    } | null>(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    // Mock data - in production, fetch based on params.id
    const application: ApplicationDetails = {
        id: params?.id as string || "1",
        jobTitle: "Senior Frontend Engineer",
        company: "Stripe",
        status: "interviewing",
        appliedDate: "2025-12-15",
        updatedDate: "2025-12-28",
        companyUrl: "https://stripe.com",
        jobPostingUrl: "https://stripe.com/jobs/senior-frontend-engineer",
        timeline: [
            {
                id: "1",
                status: "interviewing",
                label: "Interview Scheduled",
                timestamp: "Dec 28, 2025 at 1:00 AM",
                source: "email",
                emailSubject: "Interview Invitation - Stripe",
                emailFrom: "recruiting@stripe.com",
                isCurrent: true,
            },
            {
                id: "2",
                status: "applied",
                label: "Under Review",
                timestamp: "Dec 20, 2025 at 1:00 AM",
                source: "email",
                emailSubject: "Application Received - Senior Frontend Engineer",
                emailFrom: "recruiting@stripe.com",
            },
            {
                id: "3",
                status: "applied",
                label: "Applied",
                timestamp: "Dec 15, 2025 at 1:00 AM",
                source: "manual",
            },
        ],
        lastEmail: {
            id: "1",
            from: "recruiting@stripe.com",
            subject: "Interview Invitation - Stripe",
            timestamp: "Dec 28, 2025 at 1:00 AM",
        },
    };

    const handleGenerateMailResponse = () => {
        // TODO: Implement mail response generation
        console.log("Generate mail response for:", application.lastEmail);
    };

    const handleVisitSite = () => {
        if (application.jobPostingUrl) {
            window.open(application.jobPostingUrl, "_blank", "noopener,noreferrer");
        }
    };

    const handleEmailClick = (event: TimelineEvent) => {
        if (event.emailFrom && event.emailSubject) {
            setSelectedEmail({
                from: event.emailFrom,
                subject: event.emailSubject,
                timestamp: event.timestamp,
                to: "your-email@example.com", // In production, get from user data
            });
            setIsEmailModalOpen(true);
        }
    };

    const getStatusBadge = (status: ApplicationStatus) => {
        const statusConfig = {
            interviewing: {
                className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
                label: "Interview Scheduled",
            },
            applied: {
                className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
                label: "Applied",
            },
            rejected: {
                className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
                label: "Rejected",
            },
            offer: {
                className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
                label: "Offer",
            },
            pending: {
                className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
                label: "Pending",
            },
        };
        return statusConfig[status] || statusConfig.pending;
    };

    const getSourceIcon = (source: string) => {
        switch (source) {
            case "email":
                return Mail;
            case "manual":
                return User;
            default:
                return Clock;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = months[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();
            return `${month} ${day.toString().padStart(2, '0')}, ${year}`;
        } catch {
            return dateString;
        }
    };

    const getCompanyInitial = (company: string) => {
        return company.charAt(0).toUpperCase();
    };

    const getEmailInitial = (email: string) => {
        return email.charAt(0).toUpperCase();
    };

    const statusConfig = getStatusBadge(application.status);

    return (
        <DashboardLayout pageTitle={application.jobTitle} subHeading={application.company}>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Back Navigation - Minimal */}
                <button
                    onClick={() => router.push("/applications")}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8 -ml-1"
                >
                    <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    <span>Back to applications</span>
                </button>

                {/* Header Section */}
                <div className="mb-16 space-y-8">
                    <div className="flex items-start gap-5">
                        <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <span className="text-2xl font-semibold text-primary">
                                {getCompanyInitial(application.company)}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-3 leading-tight">
                                {application.jobTitle}
                            </h1>
                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                <span className="font-medium text-base">{application.company}</span>
                                {application.companyUrl && (
                                    <a
                                        href={application.companyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground/70 hover:text-foreground transition-colors duration-200"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                        <Badge
                            variant="outline"
                            className={`${statusConfig.className} border text-sm font-medium px-3.5 py-1.5 shrink-0`}
                        >
                            {statusConfig.label}
                        </Badge>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-8 text-sm text-muted-foreground/80">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Applied {formatDate(application.appliedDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Updated {formatDate(application.updatedDate)}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Primary Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Status Timeline */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-foreground tracking-tight">Status Timeline</h2>
                            <div className="relative">
                                {/* Timeline Line */}
                                <div className="absolute left-5 top-0 bottom-0 w-px bg-border/40" />

                                <div className="space-y-10 relative">
                                    {application.timeline.map((event, index) => {
                                        const SourceIcon = getSourceIcon(event.source);
                                        const isCurrent = event.isCurrent;

                                        return (
                                            <div
                                                key={event.id}
                                                className="relative flex gap-5 animate-in fade-in slide-in-from-left-4"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                {/* Timeline Dot */}
                                                <div className="relative z-10 shrink-0">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                            isCurrent
                                                                ? "bg-primary/20 border-2 border-primary scale-110 shadow-sm shadow-primary/20"
                                                                : "bg-muted/50 border-2 border-border/50"
                                                        }`}
                                                    >
                                                        <SourceIcon
                                                            className={`h-4 w-4 ${
                                                                isCurrent ? "text-primary" : "text-muted-foreground/70"
                                                            }`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Event Content */}
                                                <div className="flex-1 pt-0.5 space-y-3">
            <div>
                                                        <div className="flex items-center gap-2.5 mb-1.5">
                                                            <h3
                                                                className={`font-medium ${
                                                                    isCurrent
                                                                        ? "text-foreground text-base"
                                                                        : "text-foreground/70 text-base"
                                                                }`}
                                                            >
                                                                {event.label}
                                                            </h3>
                                                            {isCurrent && (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground/80">
                                                            {event.timestamp}
                                                        </p>
                                                    </div>

                                                    {event.emailFrom && (
                                                        <div className="pt-1 space-y-2">
                                                            <p className="text-xs text-muted-foreground/70">
                                                                From: {event.emailFrom}
                                                            </p>
                                                            {event.emailSubject && (
                                                                <button
                                                                    onClick={() => handleEmailClick(event)}
                                                                    className="w-full text-left p-4 rounded-xl bg-muted/20 border border-border/40 hover:bg-muted/30 hover:border-border/60 transition-all duration-200 cursor-pointer group"
                                                                >
                                                                    <p className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors duration-200">
                                                                        {event.emailSubject}
                                                                    </p>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {event.source === "manual" && (
                                                        <p className="text-xs text-muted-foreground/60 italic">
                                                            Manually updated
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Last Email Update */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-foreground tracking-tight">Last Email Update</h2>
                            <button
                                onClick={() => {
                                    setSelectedEmail({
                                        from: application.lastEmail.from,
                                        subject: application.lastEmail.subject,
                                        timestamp: application.lastEmail.timestamp,
                                        to: "your-email@example.com",
                                    });
                                    setIsEmailModalOpen(true);
                                }}
                                className="w-full text-left p-5 rounded-xl bg-muted/20 border border-border/40 hover:bg-muted/30 hover:border-border/60 transition-all duration-200 group cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-11 h-11 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                            {getEmailInitial(application.lastEmail.from)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                                            {application.lastEmail.from}
                                        </p>
                                        <p className="text-sm text-muted-foreground/80">
                                            {application.lastEmail.timestamp}
                                        </p>
                                        <p className="text-sm font-medium text-foreground/90 mt-2.5">
                                            {application.lastEmail.subject}
                                        </p>
                                    </div>
                                    <ChevronLeft className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground -rotate-180 transition-all duration-200 shrink-0 mt-1" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="lg:sticky lg:top-8 lg:h-fit w-full max-w-[250px]">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-foreground tracking-tight">Actions</h2>
                            <div className="space-y-3">
                                <Button
                                    onClick={handleGenerateMailResponse}
                                    className="w-full justify-start h-auto py-3.5 px-4 rounded-xl border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-200 group bg-background cursor-pointer"
                                    variant="outline"
                                >
                                    <Sparkles className="h-4 w-4 mr-2.5 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-medium">Generate Mail Response</span>
                                </Button>
                                <Button
                                    onClick={handleVisitSite}
                                    disabled={!application.jobPostingUrl}
                                    className="w-full justify-start h-auto py-3.5 px-4 rounded-xl border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-200 group bg-background cursor-pointer"
                                    variant="outline"
                                >
                                    <Globe className="h-4 w-4 mr-2.5 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-medium">Visit Site</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email View Modal */}
            <ViewEmailModal
                open={isEmailModalOpen}
                onOpenChange={setIsEmailModalOpen}
                email={selectedEmail}
            />
        </DashboardLayout>
    );
}