import './index.css'
import React from 'react';
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
    Award, Gift
} from 'lucide-react';

// --- Atrapy danych (Docelowo będą pochodzić z API) ---

// Interfejs dla pojedynczych zajęć
interface ClassItem {
    id: number;
    name: string;
    time: string;
    duration: string;
    icon: React.ReactNode;
}

const todaysClasses: ClassItem[] = [
    { id: 1, name: 'Yoga', time: '18:00', duration: '45 min', icon: <Dumbbell className="text-blue-400" /> },
    { id: 2, name: 'Crossfit', time: '19:30', duration: '60 min', icon: <Activity className="text-purple-400" /> },
    { id: 3, name: 'Pilates', time: '20:45', duration: '45 min', icon: <Dumbbell className="text-blue-400" /> },
];


// --- Główne Komponenty ---

// 1. Komponent Nawigacji Bocznej (Sidebar)
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
    </div>
);

// Pomocniczy komponent przycisku nawigacji
const NavButton = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <button className={`flex items-center gap-4 w-full p-3 rounded-xl transition-colors ${active ? 'bg-[#3B82F6] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);


// 2. Komponent Głównej Karty (np. Karnet)
const MainCard = ({ title, children, icon }: { title: string, children: React.ReactNode, icon?: React.ReactNode }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 font-medium">{title}</h3>
            {icon}
        </div>
        {children}
    </div>
);


// --- Główny Widok Dashboardu ---
export const Dashboard: React.FC = () => {
    return (
        // Główne tło - używamy Twojego koloru bazowego z lekkim gradientem dla efektu "glow"
        <div className="min-h-screen bg-slate-900 bg-gradient-to-tr from-slate-900 via-slate-900 to-[#8B5CF6]/10 text-slate-200">

            <Sidebar />

            {/* Główna zawartość (odsunięta o szerokość sidebara: ml-64) */}
            <main className="ml-64 p-8">

                {/* Nagłówek (Header) */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Cześć, Alex!</h1>
                        <p className="text-slate-400">Gotowy na dzisiejszy trening?</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 relative">
                            <Bell className="w-6 h-6 text-slate-300" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        {/* Placeholder na avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-slate-800"></div>
                    </div>
                </header>

                {/* Siatka z kartami (Grid Layout) */}
                {/* Na dużych ekranach (lg) 3 kolumny, na mniejszych 1 kolumna */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* --- Kolumna 1: Główne info --- */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Karta Statusu Karnetu (Wzorowana na mobile) */}
                        <MainCard title="Status karnetu" icon={<Award className="text-yellow-500" />}>
                            <div className="mt-2">
                                <h2 className="text-3xl font-bold text-white mb-4">Aktywny: 12 dni</h2>
                                {/* Pasek postępu */}
                                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                    {/* Użyłem koloru szmaragdowego (emerald) bo pasuje do paska ze screena */}
                                    <div className="h-full w-[40%] bg-emerald-500 rounded-full relative">
                                        <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-r from-transparent to-white/20"></div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 mt-2 text-right">Ważny do 15.03.2026</p>
                            </div>
                        </MainCard>

                        {/* Karta Siłowni (Wzorowana na mobile) */}
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

                            {/* Statystyki siłowni */}
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

                    {/* --- Kolumna 2: Boczna (Zajęcia) --- */}
                    <div className="space-y-6">
                        <MainCard title="Dzisiejsze zajęcia">
                            <div className="space-y-4 mt-2">
                                {todaysClasses.map((item) => (
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

                        {/* Placeholder na dodatkową kartę, np. reklama albo statystyki */}
                        <div className="bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 border border-blue-500/30 rounded-3xl p-6 flex items-center justify-between">
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