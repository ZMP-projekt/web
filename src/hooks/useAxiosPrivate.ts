import {useEffect} from "react";
import {apiPrivate} from "../api/axios.ts";
import {useAuth} from "../auth/useAuth.ts";

export const useAxiosPrivate = () => {
    const {token} = useAuth();

    useEffect(() => {
        const requestIntercept = apiPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization'] && token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        return () => {
            apiPrivate.interceptors.request.eject(requestIntercept);
        };
    }, [token]);
    return apiPrivate;
}