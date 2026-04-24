import {useContext} from "react";
import {MembershipContext} from "../context/MembershipContext.tsx";

export const useMembership = () => {
    const context = useContext(MembershipContext);
    if (!context) throw new Error("useMembership musi być użyte w MembershipProvider");
    return context;
};