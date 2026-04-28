import {useAuth} from "../auth/useAuth.ts";
import {useAxiosPrivate} from "../hooks/useAxiosPrivate.ts";
import {type ReactNode, useEffect, useState} from "react";
import {NotificationContext, type NotificationData} from "../context/NotificationContext.tsx";
import {Client} from "@stomp/stompjs";
import {BellRing} from "lucide-react";
import toast from "react-hot-toast";
import SockJS from "sockjs-client";
import {useTranslation} from "react-i18next";


export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { token, isAuthenticated } = useAuth();
    const apiPrivate = useAxiosPrivate();

    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const unreadCount = notifications.filter(n => !n.read).length;
    const { t } = useTranslation('notifications');

    useEffect(() => {
        if (!isAuthenticated || !token) return;

        const fetchOldNotifications = async () => {
            try {
                const response = await apiPrivate.get('/api/notifications');
                setNotifications(response.data);
            } catch (error) {
                console.error("Błąd pobierania historii powiadomień:", error);
            }
        };
        void fetchOldNotifications();

        const client = new Client({
            webSocketFactory: () => new SockJS('https://api-j6d6.onrender.com/ws-gym'),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Połączono z WebSocketem!");
                client.subscribe('/user/queue/notifications', (message) => {
                    let newNotification: NotificationData;

                    try {
                        newNotification = JSON.parse(message.body);
                    } catch (error) {
                        console.warn("Otrzymano zwykły tekst zamiast JSON. Tworzę tymczasowy obiekt.", error);
                        newNotification = {
                            id: Date.now(),
                            content: message.body,
                            createdAt: new Date().toISOString(),
                            read: false
                        };
                    }

                    setNotifications(prev => [newNotification, ...prev]);

                    toast(newNotification.content, {
                        icon: <BellRing className="text-blue-500 w-5 h-5" />,
                        duration: 5000,
                    })
                });
            },
            onStompError: (frame) => {
                console.error('Błąd STOMP:', frame.headers['message']);
                console.error('Szczegóły:', frame.body);
            },
        });

        client.activate();

        return () => {
            void client.deactivate();
        };
    }, [token, isAuthenticated, apiPrivate]);

    const markAsRead = async (id: number) => {
        try {
            await apiPrivate.patch(`/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Nie udało się oznaczyć powiadomienia", error);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            await apiPrivate.delete(`/api/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error(error);
            toast.error(t('delete_failed'));
        }

    }

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, deleteNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};