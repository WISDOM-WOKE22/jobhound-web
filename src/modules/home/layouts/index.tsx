"use client";

import DashboardLayout from "@/core/commons/layouts/dashboardLayout";
import { StatsCard } from "@/core/commons/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
    Clock, 
    Building2, 
    ChevronRight, 
    Briefcase, 
    TrendingUp, 
    Loader2,
    Mail,
    RefreshCw,
    Inbox,
    Sparkles,
} from "lucide-react";
import { StatsChart } from "../components/charts/barChart";
import { getStatusBadge } from "@/core/commons/components/badge/badge";
import { useRouter } from "next/navigation";
import { useHomeServices } from "../services";
import moment from "moment";
// import { useState } from "react";

// Empty State Component - defined outside to avoid re-creation during render
function EmptyState({ syncEmail, isSyncing }: { 
    syncEmail: () => void; 
    isSyncing: boolean;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in-95 duration-500">
            {/* Animated Icon */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                <div className="relative p-6 rounded-3xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <Inbox className="h-14 w-14 text-primary" />
                </div>
                {/* Floating mail icons */}
                <div className="absolute -top-2 -right-2 p-2 rounded-full bg-background border border-border shadow-lg animate-bounce">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            {/* Text Content */}
            <h2 className="text-2xl font-semibold text-foreground mb-3">
                No applications found
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
                Connect your email to automatically track job applications, or sync your inbox to find existing applications.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button 
                    size="lg" 
                    className="h-12 px-6 gap-2 cursor-pointer"
                    onClick={syncEmail}
                    disabled={isSyncing}
                >
                    {isSyncing ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Syncing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="h-5 w-5" />
                            Sync Email
                        </>
                    )}
                </Button>
                {/* <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-12 px-6 gap-2"
                    onClick={onCheckEmail}
                >
                    <Mail className="h-5 w-5" />
                    Check for Applications
                </Button> */}
            </div>

            {/* Helper text */}
            <div className="mt-10 p-4 rounded-xl bg-muted/30 border border-border/50 max-w-lg">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                            Pro tip
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            JobTrackr automatically scans your connected email for job application confirmations and updates. Connect your email in Settings to get started.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function HomeLayout() {
    const router = useRouter();
    const { data, isLoading, syncEmail, isSyncing, instantSync, isInstantSyncing } = useHomeServices();

    // Check if data is empty
    const isDataEmpty = !data || 
        (data.totalApplications === 0 && 
         (!data.topFiveApplications || data.topFiveApplications.length === 0) &&
         (!data.appliedCompanies || data.appliedCompanies.length === 0));

    // Skeleton Loaders
    const StatsCardSkeleton = () => (
        <Card className="w-full p-0 gap-0">
            <CardHeader className="p-3 flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent className="p-3">
                <Skeleton className="h-8 w-16" />
            </CardContent>
        </Card>
    );

    const CompanySkeleton = () => (
        <div className="flex flex-col items-center justify-center gap-2">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <Skeleton className="h-3 w-16 rounded" />
        </div>
    );

    const ApplicationCardSkeleton = () => (
        <Card className="border-border/50 shadow-sm">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-4 rounded" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
            </CardContent>
        </Card>
    );

    if (isLoading) {
        return (
            <DashboardLayout pageTitle="Home" subHeading="Welcome to the home page">
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Overview Section Skeleton */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-9 w-[180px] rounded-md" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="animate-in fade-in slide-in-from-left-4 duration-500"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <StatsCardSkeleton />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column Skeleton */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Companies Section Skeleton */}
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader>
                                    <Skeleton className="h-5 w-48 mb-2" />
                                    <Skeleton className="h-4 w-64" />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4">
                                        {[...Array(8)].map((_, index) => (
                                            <div
                                                key={index}
                                                className="animate-in fade-in zoom-in-95"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <CompanySkeleton />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Chart Section Skeleton */}
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader>
                                    <Skeleton className="h-5 w-40" />
                                </CardHeader>
                                <CardContent className="h-[400px] p-6">
                                    <div className="flex items-center justify-center h-full">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column Skeleton */}
                        <div className="space-y-4">
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader className="pb-3">
                                    <Skeleton className="h-5 w-40 mb-2" />
                                    <Skeleton className="h-4 w-48" />
                                </CardHeader>
                            </Card>

                            <div className="space-y-3">
                                {[...Array(5)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="animate-in fade-in slide-in-from-right-4"
                                        style={{ animationDelay: `${400 + index * 100}ms` }}
                                    >
                                        <ApplicationCardSkeleton />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
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
                {/* Overview Section */}
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 animate-in slide-in-from-bottom-4">
                    <CardHeader className="pb-4">
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
                </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                                <StatsCard
                                    title="Total Applications"
                                    stat={data?.totalApplications}
                                    Icon={Briefcase}
                                />
                            </div>
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                                <StatsCard
                                    title="Active Applications"
                                    stat={data?.totalActiveApplications}
                                    Icon={TrendingUp}
                                />
                            </div>
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                                <StatsCard
                                    title="Interviews"
                                    stat={data?.totalInterviews}
                                    Icon={TrendingUp}
                                />
                            </div>
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                                <StatsCard
                                    title="Offers"
                                    stat={data?.totalOffers}
                                    Icon={TrendingUp}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

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