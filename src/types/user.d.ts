export interface UserType {
    _id: string;
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    photo?: string;
    password: string; // stored hashed
    role?: UserRole;
    tokens?: string[]; // optional list of issued tokens (refresh / sessions)
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
    otpCode?: string;
    verifyOtp?: string;
    verificationToken?: string;
    phoneNumber?: string;
    gender?: string;
    isBlocked?: boolean;
    blockedAt?: Date;
    isOnBoarded: boolean;
    isVerified: boolean;
    otpCodeExpiry?: Date;
    isTwoFactorAuthEnabled?: boolean;
    twoFactorAuthCode?: string;
    twoFactorAuthCodeExpiry?: Date;
    authType?: "google" | "email";
    image?: string;
    googleAccessToken?: string;
    googleRefreshToken?: string;
    googleUserId?: string;
    googleIdToken?: string;
    googleTokenExpiry?: Date;
    focusedTags: string[];
    firstEmailProcessing: boolean;
    isFirstApplicationCompleted: boolean;
    firstEmailProcessingStarted: boolean;
}