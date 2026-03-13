import React from 'react';
import { Users, CalendarClock, Activity, Edit, XCircle } from 'lucide-react';

const todaysClasses = [
    { id: 1, name: 'Crossfit - Grupa Zaawansowana', time: '17:00 - 18:30', participants: 12, maxParticipants: 15 },
    { id: 2, name: 'Trening Funkcjonalny', time: '19:00 - 20:00', participants: 20, maxParticipants: 20 },
];

export const TrainerDashboard: React.FC = () => {

    const handleCancelClass = (className: string) => {
        if (window.confirm(`Czy na pewno chcesz odwołać zajęcia: ${className}? Kursanci otrzymają powiadomienie e-mail.`)) {
            alert('Symulacja: Zajęcia odwołane.');
        }
    };

    const handleEditClass = (className: string) => {
        alert(`Symulacja: Otwieranie formularza edycji/przekładania dla: ${className}`);
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Witaj, Trenerze!
                    </h1>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<CalendarClock className="text-blue-400" />} title="Twoje zajęcia dzisiaj" value="2" />
                <StatCard icon={<Users className="text-emerald-400" />} title="Zapisani kursanci" value="32" />
                <StatCard icon={<Activity className="text-purple-400" />} title="Godziny w tym miesiącu" value="48h" />
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Twój harmonogram na dziś</h2>
                    <button className="text-sm text-[#3B82F6] font-medium hover:underline">
                        Zobacz cały tydzień
                    </button>
                </div>

                <div className="space-y-4">
                    {todaysClasses.map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-900/50 border border-slate-700/50 rounded-2xl hover:bg-slate-800/80 transition-colors">

                            {/* Informacje o zajęciach */}
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[#3B82F6] font-bold">{item.time}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${item.participants >= item.maxParticipants ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {item.participants}/{item.maxParticipants} osób
                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleEditClass(item.name)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    <Edit className="w-4 h-4" /> Przełóż
                                </button>
                                <button
                                    onClick={() => handleCancelClass(item.name)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium transition-colors"
                                >
                                    <XCircle className="w-4 h-4" /> Odwołaj
                                </button>
                            </div>

                        </div>
                    ))}

                    {todaysClasses.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            Masz dzisiaj wolne! Brak zaplanowanych zajęć.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
    <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
            {icon}
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
    </div>
);