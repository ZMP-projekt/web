import { createContext } from 'react';

export interface NotificationData {
    id: number;
    content: string;
    createdAt: string;
    read: boolean;
}

export interface NotificationContextType {
    notifications: NotificationData[];
    unreadCount: number;
    markAsRead: (id: number) => void;
    deleteNotification: (id: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);