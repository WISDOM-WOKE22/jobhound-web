import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import DashboardLayout from "@/core/commons/layouts/dashboardLayout";

function TableRowSkeleton({ index }: { index: number }) {
    return (
        <TableRow 
            className="border-b border-border/30 animate-in fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4">
                <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell className="px-6 py-4">
                <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>
            <TableCell className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
            </TableCell>
        </TableRow>
    );
}

export const Preloader = () => {
    return (
        <DashboardLayout pageTitle="Applications" subHeading="Track and manage all your job applications">
            <div className="animate-in fade-in duration-500">
                <Card className="border-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="pb-4 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                            <Skeleton className="h-9 w-32 rounded-md" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/30">
                                        <TableHead className="h-12 px-6 font-medium text-muted-foreground">
                                            Position
                                        </TableHead>
                                        <TableHead className="h-12 px-6 font-medium text-muted-foreground">
                                            Company
                                        </TableHead>
                                        <TableHead className="h-12 px-6 font-medium text-muted-foreground">
                                            Status
                                        </TableHead>
                                        <TableHead className="h-12 px-6 font-medium text-muted-foreground">
                                            Date Applied
                                        </TableHead>
                                        <TableHead className="h-12 px-6 font-medium text-muted-foreground text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...Array(6)].map((_, index) => (
                                        <TableRowSkeleton key={index} index={index} />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}