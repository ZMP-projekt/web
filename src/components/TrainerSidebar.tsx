import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { CalendarClock, Users, User, Dumbbell, LogOut } from 'lucide-react';
import { useAuth } from "../auth/useAuth.ts";
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';

export const TrainerSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const apiPrivate = useAxiosPrivate();

    const handleLogout = async () => {
        try {
            await apiPrivate.post('/auth/logout');
        } catch (error) {
            console.error("Błąd wylogowania:", error);
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
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' // Trener ma np. zielony akcent dla odróżnienia!
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
                {icon}
                <span className="font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-[#0F172A]/95 border-r border-slate-800 p-6 flex flex-col z-50">
            <div className="text-2xl font-bold text-white mb-10 flex items-center gap-2">
                <Dumbbell className="w-8 h-8 text-emerald-500" />
                GymApp <span className="text-xs text-emerald-500 uppercase tracking-widest mt-1">Trener</span>
            </div>

            <nav className="flex-1 space-y-2">
                <NavButton to="/trainer/dashboard" icon={<CalendarClock />} label="Mój Grafik" />
                <NavButton to="/trainer/clients" icon={<Users />} label="Moi Kursanci" />
                <NavButton to="/trainer/profile" icon={<User />} label="Profil" />
            </nav>

            <div className="pt-6 border-t border-slate-800">
                <button onClick={handleLogout} className="flex items-center gap-4 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Wyloguj się</span>
                </button>
            </div>
        </div>
    );
};