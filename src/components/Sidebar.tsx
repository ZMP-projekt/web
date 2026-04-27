import { Home, CalendarDays, CreditCard, User, Dumbbell, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import React from 'react';
import { useAuth } from '../auth/useAuth.ts';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate.ts';
import {useTranslation} from "react-i18next";

export const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const apiPrivate = useAxiosPrivate();
    const location = useLocation();
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'pl' ? 'en' : 'pl';
        i18n.changeLanguage(newLang);
    }

    const handleLogout = async (): Promise<void> => {
        try {
            await apiPrivate.post('/auth/logout');
        } catch (error) {
            console.error(error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    const NavButton = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl transition-all duration-200 no-underline ${
                    isActive
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
            >
                <span className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {icon}
                </span>
                <span className="font-medium text-sm">{label}</span>
                {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
            </Link>
        );
    };

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-slate-900/95 border-r border-slate-800/80 p-5 flex flex-col backdrop-blur-sm">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8 px-1">
                <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
                >
                    <Dumbbell className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">GymSystem</span>
            </div>

            {/* Nav label */}
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">
                Menu
            </p>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                <NavButton to="/dashboard"   icon={<Home className="w-5 h-5" />}         label="Pulpit" />
                <NavButton to="/schedule"    icon={<CalendarDays className="w-5 h-5" />}  label="Grafik" />
                <NavButton to="/memberships" icon={<CreditCard className="w-5 h-5" />}    label="Mój Karnet" />
                <NavButton to="/profile"     icon={<User className="w-5 h-5" />}          label="Profil" />
            </nav>

            <button onClick={toggleLanguage} className="p-2 text-xs font-bold text-slate-400 hover:text-white">
                {i18n.language.toUpperCase()}
            </button>

            {/* Logout */}
            <div className="pt-4 border-t border-slate-800/80">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span className="font-medium text-sm">Wyloguj się</span>
                </button>
            </div>
        </div>
    );
};