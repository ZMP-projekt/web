import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Dumbbell, CalendarClock, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../auth/useAuth.ts';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import { NotificationDropdown } from './NotificationDropdown.tsx';
import { useNotifications } from '../hooks/useNotifications.ts';
import {useTranslation} from "react-i18next";
import {LanguageButton} from "./LanguageButton.tsx";

export const TrainerLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const apiPrivate = useAxiosPrivate();
    const { unreadCount } = useNotifications();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const { t } = useTranslation('navbar');

    const handleLogout = async (): Promise<void> => {
        try {
            await apiPrivate.post('/auth/logout');
        } catch (error) {
            console.error('Błąd wylogowania:', error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 no-underline ${
                    isActive
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
            >
                <span className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>{icon}</span>
                {label}
            </Link>
        );
    };

    return (
        <div
            className="min-h-screen text-slate-200 flex flex-col"
            style={{
                background: 'radial-gradient(ellipse 80% 60% at 80% 0%, rgba(59,130,246,0.07) 0%, transparent 60%), #0F172A',
            }}
        >
            {/* ── Topbar ── */}
            <header className="sticky top-0 z-50 flex items-center justify-between px-8 h-16 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
                    >
                        <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white text-base tracking-tight">GymSystem</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                        {t('trainer_badge')}
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex items-center gap-1">
                    <NavLink to="/trainer/dashboard" icon={<Dumbbell className="w-4 h-4" />} label={t('dashboard')} />
                    <NavLink to="/trainer/schedule"  icon={<CalendarClock className="w-4 h-4" />} label={t('schedule')} />
                    <NavLink to="/trainer/profile"   icon={<User className="w-4 h-4" />} label={t('profile')} />
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    <LanguageButton />
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className={`relative p-2.5 rounded-xl transition-colors ${
                                isNotifOpen ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                        </button>
                        <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-slate-700/80 mx-1" />

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut className="w-4 h-4" />
                        {t('logout')}
                    </button>
                </div>
            </header>

            {/* ── Page content ── */}
            <main className="flex-1 p-8 min-h-auto">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};