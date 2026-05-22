import {useEffect} from "react";
import {apiPrivate} from "../api/axios.ts";
import {useAuth} from "./useAuth.ts";

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
            (error) => {
                if (error.response && error.response.status === 401) {
                    console.warn("Session expired or token is invalid.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.location.href = '/login';
                }

                return Promise.reject(error);
            }
        );
        return () => {
            apiPrivate.interceptors.request.eject(requestIntercept);
        };
    }, [token]);
    return apiPrivate;
}