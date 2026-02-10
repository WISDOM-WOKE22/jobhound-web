import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Mail } from "lucide-react";
import { Inbox } from "lucide-react";

export const EmptyState = ({ syncEmail, isSyncing }: { 
    syncEmail: () => void; 
    isSyncing: boolean;
}) => {
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