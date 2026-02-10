"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { 
    Building2, 
    Calendar, 
    FileText, 
    ChevronRight,
    ChevronLeft,
    Briefcase,
    Search,
    RefreshCw,
    Loader2,
} from "lucide-react";
import { useApplicationsService, ApplicationQueryParams } from "../services";
import { useRouter } from "next/navigation";
import { getStatusBadge } from "@/core/commons/components/badge/badge";
import { Button } from "@/components/ui/button";
import { Preloader } from "../components/preloader";
import moment from "moment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ITEMS_PER_PAGE = 10;

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

// No Results Component - for search with no matches
function NoResults({ searchQuery, onClear }: { searchQuery: string; onClear: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
                No results found
            </h3>
            <p className="text-muted-foreground text-center max-w-sm mb-4">
                No applications match &ldquo;{searchQuery}&rdquo;. Try a different search term.
            </p>
            <Button variant="outline" size="sm" onClick={onClear}>
                Clear search
            </Button>
        </div>
    );
}

const DEBOUNCE_MS = 400;

export function ApplicationsLayout() {
    const router = useRouter();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    
    // Debounce search: update debounced value after user stops typing; reset to page 1 when search changes
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, DEBOUNCE_MS);
        return () => window.clearTimeout(timer);
    }, [searchQuery]);
    
    // Stable query params so SWR key only changes when values change
    const queryParams: ApplicationQueryParams = useMemo(
        () => ({
            limit: ITEMS_PER_PAGE,
            offset: (currentPage - 1) * ITEMS_PER_PAGE,
            ...(debouncedSearch.trim() ? { company: debouncedSearch.trim() } : {}),
        }),
        [currentPage, debouncedSearch]
    );
    
    const { data, isLoading, pagination } = useApplicationsService(queryParams);
    
    // Only show full-page preloader on true initial load (no data yet, no search)
    const isInitialLoad = isLoading && !data?.length && !debouncedSearch;
    
    // Extract pagination info from response
    const { 
        total, 
        totalPages, 
        hasNextPage, 
        hasPreviousPage 
    } = pagination;
    
    // Calculate display items
    const startItem = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);
    
    // Pagination handlers
    const goToPage = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);
    
    const goToPreviousPage = () => {
        if (hasPreviousPage) goToPage(currentPage - 1);
    };
    
    const goToNextPage = () => {
        if (hasNextPage) goToPage(currentPage + 1);
    };
    
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const getCompanyInitial = (companyName: string) => {
        return companyName.charAt(0).toUpperCase();
    };
    
    const clearSearch = useCallback(() => {
        setSearchQuery("");
        setDebouncedSearch("");
        setCurrentPage(1);
    }, []);

    // Full-page preloader only on initial load (no data, no search). Refetches keep the same layout.
    if (isInitialLoad) {
        return <Preloader />;
    }

    // Empty State - only show when no search is active and no data
    if ((!data || data.length === 0) && !debouncedSearch) {
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl font-semibold">All Applications</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {total} total application{total !== 1 ? 's' : ''}
                                    {debouncedSearch && ` matching "${debouncedSearch}"`}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 flex-row">
                                <Select>
                                    <SelectTrigger defaultValue="personalized">
                                        <SelectValue placeholder="Personalized" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="personalized">Personalized</SelectItem>
                                        <SelectItem value="default">Default</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        type="search"
                                        placeholder="Search by company..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") e.preventDefault();
                                        }}
                                        className="pl-9 pr-9 h-9 w-[200px] sm:w-[240px]"
                                        aria-label="Search applications by company"
                                    />
                                    {isLoading && !isInitialLoad && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden>
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* No results for search */}
                        {(!data || data.length === 0) && debouncedSearch ? (
                            <NoResults searchQuery={debouncedSearch} onClear={clearSearch} />
                        ) : (
                            <>
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
                                                        <span>Last Updated</span>
                                                    </div>
                                                </TableHead>
                                                <TableHead className="h-12 px-6 font-medium text-muted-foreground text-right">
                                                    
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data?.map((application, index) => {
                                                const companyInitial = getCompanyInitial(application.companyName);
                                                
                                                return (
                                                    <TableRow 
                                                        key={application._id}
                                                        className="group hover:bg-muted/40 transition-all duration-200 cursor-pointer border-b border-border/30 animate-in fade-in slide-in-from-left-2"
                                                        style={{ animationDelay: `${index * 30}ms` }}
                                                        onClick={() => router.push(`/applications/${application._id}`)}
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
                                                                {moment(application.updatedAt).startOf("hour").fromNow() || "No date set"}
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
                                
                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/50 bg-muted/20">
                                        <p className="text-sm text-muted-foreground">
                                            Showing <span className="font-medium text-foreground">{startItem}</span> to{" "}
                                            <span className="font-medium text-foreground">{endItem}</span> of{" "}
                                            <span className="font-medium text-foreground">{total}</span> applications
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={goToPreviousPage}
                                                disabled={!hasPreviousPage}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            {getPageNumbers().map((page, index) => (
                                                typeof page === "number" ? (
                                                    <Button
                                                        key={index}
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => goToPage(page)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        {page}
                                                    </Button>
                                                ) : (
                                                    <span key={index} className="px-2 text-muted-foreground">
                                                        {page}
                                                    </span>
                                                )
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={goToNextPage}
                                                disabled={!hasNextPage}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}