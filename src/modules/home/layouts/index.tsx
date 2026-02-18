"use client";

import DashboardLayout from "@/core/commons/layouts/dashboardLayout";
import { StatsCard } from "@/core/commons/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Clock, 
    Building2, 
    ChevronRight, 
    Briefcase,
    TrendingUp, 
    Loader2,
    RefreshCw,
    Handshake,
    ListTodo,
} from "lucide-react";
import { StatsChart } from "../components/charts/barChart";
import { getStatusBadge } from "@/core/commons/components/badge/badge";
import { useRouter } from "next/navigation";
import { useHomeServices } from "../services";
import moment from "moment";
import { useMainStore } from "@/lib/zustand/store";
import { EmptyState } from "../components/commons/empty-state";
import { DashboardSkeleton } from "../components/commons/skeleton";
// import { useState } from "react";
import { IsMainSyncing } from "../components/commons/isMainSyncing";
import { useProcessMail } from "@/hooks/process-mail";
import { useEffect } from "react";
import { DashboardStatsCards } from "../components/cards/dashboardCard";
import { useAuthServices } from "@/modules/landing/services";

const USER_REFETCH_INTERVAL_MS = 4000;

export function HomeLayout() {
    const router = useRouter();
    const { data, isLoading, syncEmail, isSyncing, instantSync, isInstantSyncing } = useHomeServices();
    const { user } = useMainStore();
    const { getOnboardingStatus } = useAuthServices();

    const { processMail } = useProcessMail();
    // Check if data is empty
    const isDataEmpty = !data || 
    (data.totalApplications === 0 && 
        (!data.topFiveApplications || data.topFiveApplications.length === 0) &&
        (!data.appliedCompanies || data.appliedCompanies.length === 0));
    
    useEffect(() => {
        if (!user?.isFirstApplicationCompleted) {
            processMail();
        }
    }, []);

    // While syncing, refetch user so we pick up when backend sets firstEmailProcessing to false
    const isSyncingFirstEmail = Boolean(user?.firstEmailProcessing ?? user?.firstEmailProcessingStarted);
    useEffect(() => {
        if (!isSyncingFirstEmail || !user?._id) return;
        const intervalId = window.setInterval(() => {
            getOnboardingStatus();
        }, USER_REFETCH_INTERVAL_MS);
        return () => window.clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only run interval when syncing state or user id changes
    }, [isSyncingFirstEmail, user?._id]);
    if (isSyncingFirstEmail) {
        return (
            <DashboardLayout pageTitle="Home" subHeading="Welcome to JobTrackr">
                <IsMainSyncing />
            </DashboardLayout>
        );
    }

    // Show syncing UI when first-time email processing is in progress

    if (isLoading) {
        return (
            <DashboardSkeleton/>
        );
    }



    // Empty State
    if (isDataEmpty) {
        return (
            <DashboardLayout pageTitle="Home" subHeading="Welcome to JobTrackr">
                <Card className="border-border/50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <EmptyState 
                        syncEmail={syncEmail}
                        isSyncing={isSyncing}
                    />
                </Card>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout pageTitle="Home" subHeading="Welcome to the home page">
            <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-semibold">Overview</CardTitle>
                            <div>
                                <Button variant="outline" size="sm" className="cursor-pointer" onClick={instantSync}
                                disabled={isInstantSyncing}
                                >
                                    {isInstantSyncing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Syncing...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-4 w-4" />
                                            Sync Email
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                <DashboardStatsCards
                    totalApplications={data?.totalApplications}
                    totalActiveApplications={data?.statusBreakdown.applied}
                    totalInterviews={data?.statusBreakdown.interview_scheduled}
                    totalOffers={data?.statusBreakdown.offer}
                />
                {/* Overview Section */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Companies & Chart */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Companies Applied Section */}
                        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-300">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Companies Applied To</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Track your job applications across different companies
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {data?.appliedCompanies.slice(0, 9).map((company, index) => (
                                        <div 
                                            key={index} 
                                            className="flex flex-col items-center justify-center gap-2 group"
                                        >
                                            <div
                                                className="h-16 w-16 rounded-lg bg-linear-to-br from-primary/10 to-primary/5 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-110 cursor-pointer animate-in fade-in zoom-in-95 flex items-center justify-center text-primary font-semibold text-sm shadow-sm hover:shadow-md"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                {company.charAt(0)}
                                            </div>
                                            <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center max-w-[80px] truncate">
                                                {company}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Chart Section */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 delay-500">
                            <StatsChart chartData={data?.applicationsByMonth} />
                        </div>
                    </div>

                    {/* Right Column - Applications */}
                    <div className="space-y-4">
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold">Recent Applications</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Track your job applications
                                </p>
                            </CardHeader>
                        </Card>
                        
                        <div className="space-y-3">
                            {data?.topFiveApplications.map((application, index) => {
                                
                                return (
                                    <Card
                                        key={application.id}
                                        className="group relative overflow-hidden border-border/50 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-right-4"
                                        style={{ animationDelay: `${400 + index * 100}ms` }}
                                        onClick={() => router.push(`/applications/${application._id}`)}
                                    >
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-3 flex-1">
                                                    {/* <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mt-0.5">
                                                        {getStatusBadge(application.currentStatus)}
                                                    </div> */}
                                                    <div className="flex-1 space-y-1">
                                                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                                            {application.jobTitle}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Building2 className="h-3.5 w-3.5" />
                                                            <span>{application.companyName}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-1" />
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                {application.appliedAt ? (
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span className="font-medium">{moment(application.appliedAt).startOf('hour').fromNow()}</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-muted-foreground">
                                                        {moment(application.appliedAt).startOf('hour').fromNow() || "No date set"}
                                                    </div>
                                                )}
                                                {getStatusBadge(application.currentStatus)}
                                            </div>
                                        </CardContent>
                                        
                                        {/* Subtle hover gradient */}
                                        <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/3 group-hover:to-primary/5 transition-all duration-500 pointer-events-none opacity-0 group-hover:opacity-100" />
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );

}