"use client";

import DashboardLayout from "@/core/commons/layouts/dashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
    Building2, 
    Calendar, 
    FileText, 
    ChevronRight,
    Briefcase,
    Search,
    Plus,
    RefreshCw,
} from "lucide-react";
import { useApplicationsService } from "../services";
import { useRouter } from "next/navigation";
import { getStatusBadge } from "@/core/commons/components/badge/badge";
import { Button } from "@/components/ui/button";
import { Preloader } from "../components/preloader";

// Empty State Component - defined outside component
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="relative p-5 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <FileText className="h-10 w-10 text-primary" />
                </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
                No applications yet
            </h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6 leading-relaxed">
                Start tracking your job applications by connecting your email or adding them manually.
            </p>
            <div className="flex items-center gap-3">
                <Button variant="outline" className="h-10 px-4">
                    <Search className="h-4 w-4 mr-2" />
                    Connect Email
                </Button>
                <Button className="h-10 px-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Email
                </Button>
            </div>
        </div>
    );
}

export function ApplicationsLayout() {
    const router = useRouter();
    const { data, isLoading } = useApplicationsService();

    const getCompanyInitial = (companyName: string) => {
        return companyName.charAt(0).toUpperCase();
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = months[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();
            return `${month} ${day}, ${year}`;
        } catch {
            return dateString;
        }
    };

    // Loading State
    if (isLoading) {
        return <Preloader />;
    }

    // Empty State
    if (!data || data.length === 0) {
        return (
            <DashboardLayout pageTitle="Applications" subHeading="Track and manage all your job applications">
                <Card className="border-border/50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <EmptyState />
                </Card>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout pageTitle="Applications" subHeading="Track and manage all your job applications">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="border-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="pb-4 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-semibold">All Applications</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {data.length} total application{data.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <Button size="sm" className="h-9">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/30">
                                        <TableHead className="h-12 px-6 font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4" />
                                                <span>Position</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="h-12 px-6 font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                <span>Company</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="h-12 px-6 font-medium text-muted-foreground">
                                            Status
                                        </TableHead>
                                        <TableHead className="h-12 px-6 font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>Date Applied</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="h-12 px-6 font-medium text-muted-foreground text-right">
                                            
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((application, index) => {
                                        const companyInitial = getCompanyInitial(application.companyName);
                                        
                                        return (
                                            <TableRow 
                                                key={application.id}
                                                className="group hover:bg-muted/40 transition-all duration-200 cursor-pointer border-b border-border/30 animate-in fade-in slide-in-from-left-2"
                                                style={{ animationDelay: `${index * 30}ms` }}
                                                onClick={() => router.push(`/applications/${application.id}`)}
                                            >
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="shrink-0 w-11 h-11 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300 flex items-center justify-center border border-primary/10 group-hover:border-primary/20 shadow-sm">
                                                            <span className="text-sm font-bold text-primary">
                                                                {companyInitial}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                                                                {application.jobTitle}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                                {application.source || "Direct Application"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <span className="font-medium text-foreground">
                                                        {application.companyName}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    {getStatusBadge(application.currentStatus)}
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <span className="text-muted-foreground">
                                                        {formatDate(application.appliedAt)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <div className="p-2 rounded-lg hover:bg-muted transition-all duration-200 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}