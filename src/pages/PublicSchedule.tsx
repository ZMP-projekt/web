import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Loader2, Dumbbell, Zap, Heart, Activity, ArrowLeft } from 'lucide-react';

interface GymClass {
    id: string;
    name: string;
    trainer: string;
    startTime: string;
    endTime: string;
    date: string;
    type: 'STRENGTH' | 'CARDIO' | 'YOGA' | 'CROSSFIT';
    location: string;
}

const generateNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        days.push(date.toISOString().split('T')[0]);
    }
    return days;
};

const getClassStyle = (type: string) => {
    switch (type) {
        case 'STRENGTH': return { icon: <Dumbbell className="w-5 h-5" />, color: '#3B82F6', tag: 'Siła' };
        case 'CROSSFIT': return { icon: <Zap className="w-5 h-5" />, color: '#F59E0B', tag: 'Crossfit' };
        case 'YOGA': return { icon: <Heart className="w-5 h-5" />, color: '#10B981', tag: 'Mindfulness' };
        default: return { icon: <Activity className="w-5 h-5" />, color: '#8B5CF6', tag: 'Fitness' };
    }
};

export const PublicSchedule: React.FC = () => {
    const [availableDays] = useState<string[]>(generateNext7Days());
    const [selectedDate, setSelectedDate] = useState<string>(availableDays[0]);
    const [classes, setClasses] = useState<GymClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPublicClasses = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 600));

                const mockData: GymClass[] = [
                    { id: '1', name: 'Poranny Rozruch', trainer: 'Karolina Wiśniewska', startTime: '06:30', endTime: '07:30', date: selectedDate, type: 'CARDIO', location: 'Centrum' },
                    { id: '2', name: 'Joga Flow', trainer: 'Marek Zając', startTime: '09:00', endTime: '10:00', date: selectedDate, type: 'YOGA', location: 'Północ' },
                    { id: '3', name: 'CrossFit RX', trainer: 'Tomasz Nowak', startTime: '12:15', endTime: '13:15', date: selectedDate, type: 'CROSSFIT', location: 'Centrum' },
                    { id: '4', name: 'Trening Siłowy', trainer: 'Piotr Wiśniewski', startTime: '17:00', endTime: '18:30', date: selectedDate, type: 'STRENGTH', location: 'Południe' },
                    { id: '5', name: 'Boxing Basics', trainer: 'Anna Kowalska', startTime: '18:00', endTime: '19:00', date: selectedDate, type: 'CARDIO', location: 'Centrum' },
                    { id: '6', name: 'Wieczorna Mobilność', trainer: 'Karolina Wiśniewska', startTime: '20:30', endTime: '21:30', date: selectedDate, type: 'YOGA', location: 'Południe' },
                ];

                setClasses(mockData);
            } catch (error) {
                console.error("Błąd pobierania grafiku:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublicClasses();
    }, [selectedDate]);

    const formatDayButton = (dateStr: string) => {
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString('pl-PL', { weekday: 'short' }).replace('.', '');
        const dayNum = date.getDate();
        return { dayName, dayNum };
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 0%, #1E3A5F 0%, transparent 70%)" }} />

            <nav className="relative z-10 flex items-center justify-between px-8 h-20 border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
                <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors no-underline">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium text-sm">Wróć na stronę główną</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium no-underline transition-colors">
                        Zaloguj się
                    </Link>
                    <Link to="/register" className="text-white text-sm font-bold no-underline px-5 py-2 rounded-xl transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}>
                        Dołącz teraz
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>Pełny Harmonogram</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">Przeglądaj zajęcia we wszystkich naszych lokalizacjach. Aby zarezerwować miejsce, musisz posiadać aktywne konto.</p>
                </header>

                <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide justify-start md:justify-center mb-8">
                    {availableDays.map((dateStr) => {
                        const { dayName, dayNum } = formatDayButton(dateStr);
                        const isSelected = selectedDate === dateStr;

                        return (
                            <button
                                key={dateStr}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`flex flex-col items-center justify-center min-w-20 py-4 rounded-2xl border transition-all ${
                                    isSelected
                                        ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                        : 'bg-slate-800/30 border-white/5 text-slate-500 hover:bg-slate-800/60 hover:text-slate-300'
                                }`}
                            >
                                <span className="text-xs uppercase font-bold tracking-wider mb-1">{dayName}</span>
                                <span className="text-2xl font-black">{dayNum}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-3 relative min-h-100">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                            <p className="text-sm font-medium">Wczytywanie zajęć...</p>
                        </div>
                    ) : classes.length > 0 ? (
                        classes.map((gymClass) => {
                            const style = getClassStyle(gymClass.type);

                            return (
                                <div key={gymClass.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-6 py-5 rounded-2xl border transition-all hover:bg-slate-800/50" style={{ background: "rgba(30,41,59,0.3)", borderColor: "rgba(226,232,240,0.05)" }}>

                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="text-center min-w-15">
                                            <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                                {gymClass.startTime}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium">{gymClass.endTime}</div>
                                        </div>

                                        <div className="w-px h-12 bg-white/10 hidden md:block"></div>

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-200 mb-1 flex items-center gap-2">
                                                {gymClass.name}
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ color: style.color, borderColor: `${style.color}40`, background: `${style.color}15` }}>
                          {style.tag}
                        </span>
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                <span>👤 {gymClass.trainer}</span>
                                                <span>📍 {gymClass.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to="/register" className="block w-full text-center px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA" }}>
                                            Zarejestruj się, aby dołączyć
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            <p>Brak zaplanowanych zajęć w tym dniu.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};