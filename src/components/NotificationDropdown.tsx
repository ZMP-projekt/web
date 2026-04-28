import React from 'react';
import { useNotifications } from "../hooks/useNotifications.ts";
import { Bell, CheckCircle, Trash2, X } from 'lucide-react';
import {useTranslation} from "react-i18next";

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
    const { notifications, markAsRead, deleteNotification, unreadCount } = useNotifications();
    const { t } = useTranslation('notifications');

    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose}></div>
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/90 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg">{t('notifications')}</h3>
                        {unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount} {t('new')}
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto no-scrollbar flex-1 p-2">
                    {notifications.length === 0 ? (
                        <div className="text-center py-10 flex flex-col items-center">
                            <Bell className="w-12 h-12 text-slate-600 mb-3 opacity-50" />
                            <p className="text-slate-400 text-sm">{t('no_notifications')}</p>
                            <p className="text-slate-500 text-xs mt-1">{t('up_to_date')}</p>
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className={`relative group p-3 rounded-xl transition-all ${
                                        notification.read
                                            ? 'bg-transparent hover:bg-slate-700/50'
                                            : 'bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20'
                                    }`}
                                >
                                    <div className="pr-14">
                                        <p className={`text-sm mb-1 ${notification.read ? 'text-slate-300' : 'text-blue-100 font-medium'}`}>
                                            {notification.content}
                                        </p>
                                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>

                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                title={t('mark_as_read')}
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title={t('delete_notification')}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {!notification.read && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full group-hover:opacity-0 transition-opacity shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};