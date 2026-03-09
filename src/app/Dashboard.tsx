import './index.css'
import React, {useEffect} from 'react';
import { useNavigate } from "react-router";
import {
    Home,
    CalendarDays,
    CreditCard,
    User,
    Bell,
    MapPin,
    Dumbbell,
    Activity,
    ChevronRight,
    Award, Gift,
    LogOut
} from 'lucide-react';
import {useAuth} from "../auth/useAuth.ts";
import {useAxiosPrivate} from "../hooks/useAxiosPrivate.ts";

interface ClassItem {
    id: number;
    name: string;
    time: string;
    duration: string;
    icon: React.ReactNode;
}

interface MembershipData {
    type: string;
    price: number;
    endDate: string;
    active: boolean;
}

const todayClasses: ClassItem[] = [
    { id: 1, name: 'Yoga', time: '18:00', duration: '45 min', icon: <Dumbbell className="text-blue-400" /> },
    { id: 2, name: 'Crossfit', time: '19:30', duration: '60 min', icon: <Activity className="text-purple-400" /> },
    { id: 3, name: 'Pilates', time: '20:45', duration: '45 min', icon: <Dumbbell className="text-blue-400" /> },
];

const MainCard = ({ title, children, icon }: { title: string, children: React.ReactNode, icon?: React.ReactNode }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 font-medium">{title}</h3>
            {icon}
        </div>
        {children}
    </div>
);

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();
    const apiPrivate = useAxiosPrivate()

    const [membership, setMembership] = React.useState<MembershipData | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try{
                const response = await apiPrivate.get("/api/memberships/me");
                setMembership(response.data);
            } catch (err) {
                console.error(err);
                setError("Nie udało się załadować danych karnetu.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [apiPrivate]);

    const calculateDaysRemaining = (endDateString: string) => {
        const end = new Date(endDateString);
        const now = new Date();
        const diffTime = Math.max(end.getTime() - now.getTime(), 0);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

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

    const Sidebar = () => (
        <div className="fixed left-0 top-0 h-full w-64 bg-[#0F172A]/95 border-r border-slate-800 p-6 flex flex-col">
            <div className="text-2xl font-bold text-white mb-10 flex items-center gap-2">
                <Dumbbell className="w-8 h-8 text-[#3B82F6]" />
                GymApp
            </div>

            <nav className="flex-1 space-y-2">
                <NavButton icon={<Home />} label="Pulpit" active />
                <NavButton icon={<CalendarDays />} label="Grafik" />
                <NavButton icon={<CreditCard />} label="Mój Karnet" />
                <NavButton icon={<User />} label="Profil" />
            </nav>

            <div className="pt-6 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full p-3 rounded-xl transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="front-medium">Wyloguj się</span>
                </button>
            </div>
        </div>
    );

    const NavButton = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
        <button className={`flex items-center gap-4 w-full p-3 rounded-xl transition-colors ${active ? 'bg-[#3B82F6] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-900 bg-linear-to-tr from-slate-900 via-slate-900 to-[#8B5CF6]/10 text-slate-200">

            <Sidebar />

            <main className="ml-64 p-8">

                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Witaj, Jan!</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 relative">
                            <Bell className="w-6 h-6 text-slate-300" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 border-2 border-slate-800"></div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">

                        <MainCard title="Status karnetu" icon={<Award className="text-yellow-500" />}>
                            {isLoading ? (
                                <div className="mt-4 flex flex-col items-center justify-center space-y-3">
                                    <div className="w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-slate-400 text-sm">Pobieranie danych...</p>
                                </div>
                            ) : error ? (
                                <div className="mt-4 text-red-400 text-sm">{error}</div>
                            ) : membership ? (
                                <div className="mt-2 text-white">
                                    <h2 className="text-3xl font-bold mb-4">
                                        {membership.active
                                            ? `Aktywny: ${calculateDaysRemaining(membership.endDate)} dni`
                                            : 'Karnet nieaktywny'}
                                    </h2>

                                    <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full relative ${membership.active ? 'bg-emerald-500' : 'bg-red-500'}`}
                                            style={{ width: membership.active ? '100%' : '0%' }}
                                        >
                                            <div className="absolute right-0 top-0 h-full w-full bg-linear-to-r from-transparent to-white/20"></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-sm text-[#3B82F6] font-bold bg-[#3B82F6]/10 px-3 py-1 rounded-full">
                                            Typ: {membership.type}
                                        </p>
                                        <p className="text-sm text-slate-400 text-right">
                                            Ważny do {formatDate(membership.endDate)}
                                        </p>
                                    </div>
                                </div>
                            ) : (

                                <div className="mt-4 flex flex-col items-start">
                                    <p className="text-slate-400 mb-4">Nie masz jeszcze żadnego aktywnego karnetu.</p>
                                    <button className="bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                        Kup karnet
                                    </button>
                                </div>
                            )}
                        </MainCard>

                        <MainCard title="Twoja Siłownia">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-slate-700/50 rounded-xl">
                                    <MapPin className="text-red-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Siłownia Centrum</h3>
                                    <p className="text-slate-400">ul. Marszałkowska 12, Warszawa</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">Dystans</p>
                                    <p className="text-white font-bold">850m</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">Obłożenie</p>
                                    <p className="text-white font-bold">42 os.</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">Status</p>
                                    <p className="text-emerald-400 font-bold">Czynne</p>
                                </div>
                            </div>
                        </MainCard>

                    </div>

                    <div className="space-y-6">
                        <MainCard title="Dzisiejsze zajęcia">
                            <div className="space-y-4 mt-2">
                                {todayClasses.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-2xl hover:bg-slate-700/50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-800 rounded-xl">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{item.name}</h4>
                                                <p className="text-sm text-slate-400">{item.time} • {item.duration}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-500 w-5 h-5" />
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 text-sm text-[#3B82F6] font-medium hover:underline">
                                Zobacz pełny grafik
                            </button>
                        </MainCard>

                        <div className="bg-linear-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 border border-blue-500/30 rounded-3xl p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold mb-1">Zaproś znajomego!</h3>
                                <p className="text-slate-300 text-sm">Odbierzcie oboje po 7 dni gratis.</p>
                            </div>
                            <Gift className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};