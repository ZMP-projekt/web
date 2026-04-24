import { createContext } from "react";

export interface Membership {
    id: number;
    type: string;
    price: number;
    active: boolean;
    endDate: string;
}

export interface MembershipContextType {
    membership: Membership | null;
    isValid: boolean;
    isMembershipLoading: boolean;
    refreshMembership: () => Promise<void>;
}

export const MembershipContext = createContext<MembershipContextType | undefined>(undefined);