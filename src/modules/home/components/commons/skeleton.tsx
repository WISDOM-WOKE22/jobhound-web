import DashboardLayout from "@/core/commons/layouts/dashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export const DashboardSkeleton = () => {

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