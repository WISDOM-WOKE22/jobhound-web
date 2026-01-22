"use client"

import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/core/commons/layouts/dashboardLayout";

export const ApplicationDetailsPreloader = () => {
    return (
        <DashboardLayout pageTitle="Loading..." subHeading="Application Details">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Back Navigation Skeleton */}
                    <div className="flex items-center gap-2 mb-8 -ml-1">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Header Section Skeleton */}
                    <div className="mb-16 space-y-8">
                        <div className="flex items-start gap-5">
                            <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                            <div className="flex-1 min-w-0 space-y-3">
                                <Skeleton className="h-10 w-3/4 max-w-md" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                            <Skeleton className="h-7 w-28 rounded-full shrink-0" />
                        </div>

                        {/* Dates Skeleton */}
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content Layout Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column - Primary Content */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Status Timeline Skeleton */}
                            <div className="space-y-6">
                                <Skeleton className="h-7 w-40" />
                                <div className="relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-5 top-0 bottom-0 w-px bg-border/40" />
                                    
                                    <div className="space-y-10 relative">
                                        {[...Array(3)].map((_, index) => (
                                            <div
                                                key={index}
                                                className="relative flex gap-5 animate-in fade-in slide-in-from-left-4"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                {/* Timeline Dot */}
                                                <div className="relative z-10 shrink-0">
                                                    <Skeleton className="w-10 h-10 rounded-full" />
                                                </div>

                                                {/* Event Content */}
                                                <div className="flex-1 pt-0.5 space-y-3">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2.5">
                                                            <Skeleton className="h-5 w-36" />
                                                            <Skeleton className="h-1.5 w-1.5 rounded-full" />
                                                        </div>
                                                        <Skeleton className="h-4 w-40" />
                                                    </div>
                                                    
                                                    <div className="pt-1 space-y-2">
                                                        <Skeleton className="h-3 w-48" />
                                                        <Skeleton className="h-16 w-full rounded-xl" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Last Email Update Skeleton */}
                            <div className="space-y-4">
                                <Skeleton className="h-7 w-48" />
                                <div className="p-5 rounded-xl bg-muted/20 border border-border/40">
                                    <div className="flex items-start gap-4">
                                        <Skeleton className="w-11 h-11 rounded-full shrink-0" />
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <Skeleton className="h-4 w-48" />
                                            <Skeleton className="h-3 w-32" />
                                            <Skeleton className="h-4 w-full max-w-md mt-2.5" />
                                        </div>
                                        <Skeleton className="h-4 w-4 rounded shrink-0 mt-1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Actions Skeleton */}
                        <div className="lg:sticky lg:top-8 lg:h-fit w-full max-w-[250px]">
                            <div className="space-y-4">
                                <Skeleton className="h-7 w-20" />
                                <div className="space-y-3">
                                    <Skeleton className="h-12 w-full rounded-xl" />
                                    <Skeleton className="h-12 w-full rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
    )
}