import { Home, CalendarDays, CreditCard, User, Dumbbell, LogOut } from 'lucide-react';
import {Link, useNavigate, useLocation} from "react-router";
import React from "react";
import {useAuth} from "../auth/useAuth.ts";
import {useAxiosPrivate} from "../hooks/useAxiosPrivate.ts";

export const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();
    const apiPrivate = useAxiosPrivate();
    const location = useLocation();

    const handleLogout = async () => {
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
                className={`flex items-center gap-4 w-full p-3 rounded-xl transition-colors ${
                    isActive
                        ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
                {icon}
                <span className="font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-[#0F172A]/95 border-r border-slate-800 p-6 flex flex-col">
            <div className="text-2xl font-bold text-white mb-10 flex items-center gap-2">
                <Dumbbell className="w-8 h-8 text-[#3B82F6]"/>
                GymSystem
            </div>

            <nav className="flex-1 space-y-2">
                <NavButton to="/dashboard" icon={<Home />} label="Pulpit" />
                <NavButton to="/schedule" icon={<CalendarDays />} label="Grafik" />
                <NavButton to="/memberships" icon={<CreditCard />} label="Mój Karnet" />
                <NavButton to="/profile" icon={<User />} label="Profil" />
            </nav>

            <div className="pt-6 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full p-3 rounded-xl transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                    <LogOut className="w-5 h-5"/>
                    <span className="front-medium">Wyloguj się</span>
                </button>
            </div>
        </div>
    )
}