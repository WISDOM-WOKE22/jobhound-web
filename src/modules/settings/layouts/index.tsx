"use client";

import { useState } from "react";
import DashboardLayout from "@/core/commons/layouts/dashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMainStore } from "@/lib/zustand/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
    User, 
    Mail, 
    Check, 
    Loader2,
    Link2,
    Link2Off,
} from "lucide-react";

// Provider icons as simple components
const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

const MicrosoftIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path fill="#F25022" d="M1 1h10v10H1z" />
        <path fill="#00A4EF" d="M1 13h10v10H1z" />
        <path fill="#7FBA00" d="M13 1h10v10H13z" />
        <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
);

const YahooIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
            fill="#6001D2"
            d="M12.996 20.768c0 .88-.715 1.593-1.597 1.593-.88 0-1.593-.714-1.593-1.593 0-.883.714-1.597 1.593-1.597.882 0 1.597.714 1.597 1.597zM1.608 1.64h4.723l3.71 8.892 3.736-8.893h4.722L11.2 16.893h-2.8L1.608 1.64zm13.604 0h4.585L24 16.893h-4.585L15.212 1.64z"
        />
    </svg>
);

interface LinkedAccount {
    id: string;
    provider: "google" | "microsoft" | "yahoo";
    email: string;
    connected: boolean;
    connectedAt?: string;
}

export function SettingsLayout() {
    const user = useMainStore((state) => state.user);
    // User profile state - initialize from user store
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Linked accounts state
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([
        {
            id: "1",
            provider: "google",
            email: "john.doe@gmail.com",
            connected: true,
            connectedAt: "Dec 15, 2025",
        },
        {
            id: "2",
            provider: "microsoft",
            email: "",
            connected: false,
        },
        {
            id: "3",
            provider: "yahoo",
            email: "",
            connected: false,
        },
    ]);
    const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

    // Handle profile save
    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveSuccess(false);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSaving(false);
        setSaveSuccess(true);

        // Reset success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    // Handle account connection/disconnection
    const handleToggleConnection = async (accountId: string) => {
        const account = linkedAccounts.find((a) => a.id === accountId);
        if (!account) return;

        setConnectingProvider(accountId);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLinkedAccounts((prev) =>
            prev.map((a) =>
                a.id === accountId
                    ? {
                          ...a,
                          connected: !a.connected,
                          email: a.connected ? "" : `user@${a.provider}.com`,
                          connectedAt: a.connected ? undefined : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                      }
                    : a
            )
        );

        setConnectingProvider(null);
    };

    const getProviderIcon = (provider: string) => {
        switch (provider) {
            case "google":
                return <GoogleIcon />;
            case "microsoft":
                return <MicrosoftIcon />;
            case "yahoo":
                return <YahooIcon />;
            default:
                return <Mail className="h-5 w-5" />;
        }
    };

    const getProviderName = (provider: string) => {
        switch (provider) {
            case "google":
                return "Google";
            case "microsoft":
                return "Microsoft";
            case "yahoo":
                return "Yahoo Mail";
            default:
                return provider;
        }
    };

    return (
        <DashboardLayout pageTitle="Settings" subHeading="Manage your account preferences">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Profile Section */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-semibold">Profile</CardTitle>
                                <CardDescription className="mt-1">
                                    Update your personal information
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-2 border-border/50">
                                <AvatarImage src={user?.photo || ""} alt={`${user?.firstName} ${user?.lastName}`} />
                                <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                                    {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-foreground">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Your avatar is generated from your initials
                                </p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="firstName"
                                    className="text-sm font-medium text-foreground"
                                >
                                    First Name
                                </label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Enter your first name"
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="lastName"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Last Name
                                </label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Enter your last name"
                                    className="h-11"
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="h-10 px-6"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                            {saveSuccess && (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-left-2">
                                    <Check className="h-4 w-4" />
                                    <span>Changes saved successfully</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Connected Accounts Section */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Link2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-semibold">
                                    Connected Accounts
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Link your email accounts to sync job applications
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {linkedAccounts.map((account, index) => (
                            <div
                                key={account.id}
                                className="animate-in fade-in slide-in-from-left-4"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                                        account.connected
                                            ? "bg-green-500/5 border-green-500/20 dark:bg-green-500/10"
                                            : "bg-muted/30 border-border/50 hover:border-border"
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-2.5 rounded-lg ${
                                                account.connected
                                                    ? "bg-white dark:bg-background shadow-sm"
                                                    : "bg-muted/50"
                                            }`}
                                        >
                                            {getProviderIcon(account.provider)}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-foreground">
                                                {getProviderName(account.provider)}
                                            </p>
                                            {account.connected ? (
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        {account.email}
                                                    </p>
                                                    <span className="text-xs text-muted-foreground/70">
                                                        · Connected {account.connectedAt}
                                                    </span>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    Not connected
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant={account.connected ? "outline" : "default"}
                                        size="sm"
                                        onClick={() => handleToggleConnection(account.id)}
                                        disabled={connectingProvider === account.id}
                                        className={`h-9 px-4 ${
                                            account.connected
                                                ? "border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {connectingProvider === account.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : account.connected ? (
                                            <>
                                                <Link2Off className="h-4 w-4 mr-2" />
                                                Disconnect
                                            </>
                                        ) : (
                                            <>
                                                <Link2 className="h-4 w-4 mr-2" />
                                                Connect
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {/* Info note */}
                        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <span className="font-medium text-foreground">Note:</span> Connecting
                                your email accounts allows JobTrackr to automatically track job
                                application emails and update your application statuses.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}