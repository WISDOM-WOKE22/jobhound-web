"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Clock } from "lucide-react";

interface EmailData {
    from: string;
    to?: string;
    subject: string;
    timestamp: string;
    body?: string;
}

interface ViewEmailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    email: EmailData | null;
}

export function ViewEmailModal({ open, onOpenChange, email }: ViewEmailModalProps) {
    if (!email) return null;

    const getEmailInitial = (email: string) => {
        return email.charAt(0).toUpperCase();
    };

    const formatTimestamp = (timestamp: string) => {
        // Return as-is if already formatted, or format if it's a date string
        try {
            const date = new Date(timestamp);
            if (!isNaN(date.getTime())) {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const month = months[date.getMonth()];
                const day = date.getDate();
                const year = date.getFullYear();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const ampm = hours >= 12 ? "PM" : "AM";
                const displayHours = hours % 12 || 12;
                const displayMinutes = minutes.toString().padStart(2, "0");
                return `${month} ${day.toString().padStart(2, "0")}, ${year} at ${displayHours}:${displayMinutes} ${ampm}`;
            }
            return timestamp;
        } catch {
            return timestamp;
        }
    };

    // Mock email body if not provided
    const emailBody = email.body || `Dear Candidate,

Thank you for your interest in the ${email.subject.includes("Interview") ? "position" : "role"} at our company.

${email.subject.includes("Interview") 
    ? "We are pleased to invite you for an interview. Please let us know your availability."
    : "We have received your application and are currently reviewing it. We will get back to you soon."
}

Best regards,
Recruiting Team`;

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
                            <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                                <Clock className="h-4 w-4" />
                                <span>{formatTimestamp(email.timestamp)}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* Email Content */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                    {/* From/To Section */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <span className="text-base font-semibold text-green-700 dark:text-green-400">
                                    {getEmailInitial(email.from)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-foreground/70">From:</span>
                                    <span className="text-sm text-foreground">{email.from}</span>
                                </div>
                                {email.to && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-foreground/70">To:</span>
                                        <span className="text-sm text-foreground">{email.to}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Email Body */}
                    <div className="pt-6 border-t border-border/30">
                        <div className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {emailBody}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-border/40 bg-muted/10">
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
        </div>
            </DialogContent>
        </Dialog>
    );
}
