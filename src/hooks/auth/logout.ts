import api from '@/core/services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMainStore } from '@/lib/zustand/store';
import { toast } from 'sonner';
import { secureFlag } from '@/lib/utils';

export function useLogoutService() {
    const router = useRouter();
    const { setUser, setIsAuthenticated, logout: logoutStore } = useMainStore();
    const [isLoading, setIsLoading] = useState(false);


    const logout = async () => {
        try {
            setIsLoading(true);
            
            const response = await api.post('/auth/logout');
            if (response.status === 200) {
                logoutStore();
                setUser(null);
                setIsAuthenticated(false);
                document.cookie = `token=; path=/${secureFlag}; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; SameSite=Strict`;
                document.cookie = `role=; path=/${secureFlag}; SameSite=Strict expires=Thu, 01 Jan 1970 00:00:00 UTC; secure;`;
                document.cookie = `isAuthenticated=false; path=/${secureFlag}; SameSite=Strict expires=Thu, 01 Jan 1970 00:00:00 UTC; secure;`;
                router.push('/');
            }
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            toast.error(error.message);
            toast.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        logout,
        isLoading,
    }
}