"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Clock } from "lucide-react";
import { useApplicationsService } from "../../services";
import { SingleApplicationTimelineType } from "@/types";
import { useEffect } from "react";
import { useMainStore } from "@/lib/zustand/store";
interface ViewEmailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    email: SingleApplicationTimelineType | null;
}

export function ViewEmailModal({ open, onOpenChange, email }: ViewEmailModalProps) {
    const { getEmailContent, emailContentLoading, emailContent } = useApplicationsService();
    const { user } = useMainStore();
    
    useEffect(() => {
        if (open && email?.threadId) {
            getEmailContent(email.threadId);
        }
    }, [email?.threadId]);

    if (!email) return null;

    const getEmailInitial = (email: string) => {
        return email.charAt(0).toUpperCase();
    };

    // Email body content
    const emailBody = emailContent?.body || "";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl">
                {/* Header */}
                <DialogHeader className="px-8 pt-8 pb-6 border-b border-border/40">
                    <div className="flex items-start gap-5">
                        <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-2xl font-semibold text-foreground mb-2 leading-tight">
                                {email.subject}
                            </DialogTitle>
                            {emailContentLoading ? (
                                <div className="flex items-center gap-2 mt-2">
                                    <Skeleton className="h-4 w-4 rounded" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                                    <Clock className="h-4 w-4" />
                                    <span>{emailContent?.date || "Loading..."}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                {/* Email Content */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                    {emailContentLoading ? (
                        <>
                            {/* From/To Section Skeleton */}
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                                    <div className="flex-1 min-w-0 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-4 w-12" />
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-4 w-10" />
                                            <Skeleton className="h-4 w-40" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Email Body Skeleton */}
                            <div className="pt-6 border-t border-border/30 space-y-3 animate-in fade-in duration-500">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-full mt-4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-full mt-4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full mt-4" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* From/To Section */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <span className="text-base font-semibold text-green-700 dark:text-green-400">
                                            {getEmailInitial(emailContent?.from || email.from || "")}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-foreground/70">From:</span>
                                            <span className="text-sm text-foreground">{emailContent?.from || email.from}</span>
                                        </div>
                                        {user?.email && (
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-foreground/70">To:</span>
                                                <span className="text-sm text-foreground">{user.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Email Body */}
                            <div className="pt-6 border-t border-border/30">
                                <div className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                    {emailBody || email.snippet || "No content available"}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-border/40 bg-muted/10">
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => onOpenChange(false)}
                            disabled={emailContentLoading}
                            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
