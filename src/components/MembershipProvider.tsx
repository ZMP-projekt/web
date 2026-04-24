import {type ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {useAxiosPrivate} from "../hooks/useAxiosPrivate.ts";
import {useAuth} from "../auth/useAuth.ts";
import {MembershipContext, type Membership} from "../context/MembershipContext.tsx";

export const MembershipProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, token } = useAuth();
    const apiPrivate = useAxiosPrivate();

    const [membership, setMembership] = useState<Membership | null>(null);
    const [isMembershipLoading, setIsMembershipLoading] = useState(true);

    const fetchMembership = useCallback(async () => {
        if (!isAuthenticated || !token) {
            setMembership(null);
            setIsMembershipLoading(false);
            return;
        }

        try {
            const response = await apiPrivate.get('/api/memberships/me');
            setMembership(response.data);
        } catch (error) {
            console.error("Użytkownik nie posiada karnetu.", error)
            setMembership(null);
        } finally {
            setIsMembershipLoading(false);
        }
    }, [apiPrivate, isAuthenticated, token] );
    
    useEffect(() => {
        void fetchMembership();
    }, [fetchMembership, isAuthenticated, token]);
    
    const isValid = useMemo(() => {
        if (!membership || !membership.active) return false;

        const now = new Date();
        const end = new Date(membership.endDate);
        return end > now;
    }, [membership]);

    return (
        <MembershipContext.Provider value={{
            membership,
            isValid,
            isMembershipLoading,
            refreshMembership: fetchMembership
        }}>
            {children}
        </MembershipContext.Provider>
    );
};