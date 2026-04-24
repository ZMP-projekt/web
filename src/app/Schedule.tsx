import React, { useState, useEffect } from 'react';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import {
    Calendar as CalendarIcon,
    User,
    Users,
    CheckCircle,
    XCircle,
    Loader2,
    Activity,
    ArrowLeft,
    ArrowRight,
    MapPinIcon
} from 'lucide-react';
import toast from "react-hot-toast";
import { useMembership } from "../hooks/useMembership.ts";

interface GymClass {
    id: number;
    name: string;
    trainerName: string;
    startTime: string;
    endTime: string;
    currentParticipants: number;
    maxParticipants: number;
    description: string;
    userEnrolled: boolean;
    personalTraining: boolean;
    city: string;
    address: string;
    locationName: string;
}

const generateNext7Days = (o: number) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i + o);
        days.push(date.toISOString().split('T')[0]);
    }
    return days;
};
const getClassStyle = (isPersonal: boolean) => {
    if (isPersonal) {
        return { icon: <User className="w5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-500/30', tag: 'Personalny' }
    }
    else {
        return { icon: <Activity className="w5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-500/30', tag: 'Fitness' };
    }
};

const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'});
}

export const Schedule: React.FC = () => {
    const apiPrivate = useAxiosPrivate();
    const { isValid, isMembershipLoading } = useMembership();

    const [daysOffset, setDaysOffset] = React.useState<number>(0);
    const [availableDays, setAvailableDays] = useState<string[]>(generateNext7Days(daysOffset));
    const [selectedDate, setSelectedDate] = useState<string>(availableDays[0]);
    const [classes, setClasses] = useState<GymClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            try {
                const formattedDate = `${selectedDate}T00:00:00`;
                const response = await apiPrivate.get('/api/classes/by-date?date=' + formattedDate);
                setClasses(response.data);
            } catch (error) {
                console.error("Błąd pobierania grafiku:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchClasses();
    }, [selectedDate, apiPrivate]);

    useEffect(() => {
        setAvailableDays(generateNext7Days(daysOffset))
    }, [daysOffset]);

    const handleEnrollment = async (classId: number, isEnrolling: boolean) => {
        setActionLoadingId(classId);

        if (isMembershipLoading) {
            setActionLoadingId(null);
            toast.loading("Ładowanie danych o karnecie");
            return;
        }

        if (!isValid){
            setActionLoadingId(null);
            toast.error("Musisz posiadać aktywny karnet, aby zapisać się na zajęcia!");
            return;
        }
        try {
            if (isEnrolling) {
                await apiPrivate.post(`/api/classes/${classId}/book`);
            }
            else {
                await apiPrivate.delete(`/api/classes/${classId}/cancel`);
            }
            setClasses(prev => prev.map(c => {
                if (c.id === classId) {
                    return { ...c, userEnrolled: isEnrolling, currentParticipants: isEnrolling ? c.currentParticipants + 1 : c.currentParticipants - 1 };
                }
                return c;
            }));

            toast.success(isEnrolling ? 'Pomyślnie zapisano na zajęcia!' : 'Zrezygnowano z zajęć.');
        } catch (error) {
            toast.error('Wystąpił błąd. Spróbuj ponownie.');
            console.log(error);
        } finally {
            setActionLoadingId(null);
        }
    };

    const formatDayButton = (dateStr: string) => {
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString('pl-PL', { weekday: 'short' });
        const dayNum = date.getDate();
        return { dayName, dayNum };
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Grafik zajęć</h1>
                <p className="text-slate-400 mt-2">Wybierz dzień i zapisz się na trening grupowy.</p>
            </header>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                <button
                    onClick={() => setDaysOffset(daysOffset - 7)}
                    className={`flex items-center justify-center min-w-20 py-4 rounded-2xl border transition-all bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg shadow-blue-500/20}`}
                >
                    <ArrowLeft className="w-10 h-10 text-white" />
                </button>
                {availableDays.map((dateStr) => {
                    const {dayName, dayNum} = formatDayButton(dateStr);
                    const isSelected = selectedDate === dateStr;

                    return (
                        <button
                            key={dateStr}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`flex flex-col items-center justify-center min-w-20 py-4 rounded-2xl border transition-all ${
                                isSelected
                                    ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <span className="text-xs uppercase font-bold tracking-wider mb-1">{dayName}</span>
                            <span className="text-2xl font-black">{dayNum}</span>
                        </button>
                    );
                })}
                <button
                    onClick={() => setDaysOffset(daysOffset + 7)}
                    className={`flex items-center justify-center min-w-20 py-4 rounded-2xl border transition-all bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg shadow-blue-500/20}`}
                >
                    <ArrowRight className="w-10 h-10 text-white" />
                </button>
            </div>

            <div className="space-y-4 relative min-h-75">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin text-[#3B82F6] mb-4" />
                        <p>Wczytywanie grafiku...</p>
                    </div>
                ) : classes.length > 0 ? (
                    classes.map((gymClass) => {
                        const style = getClassStyle(gymClass.personalTraining);
                        const isFull = gymClass.currentParticipants >= gymClass.maxParticipants;
                        const isActionLoading = actionLoadingId === gymClass.id;

                        return (
                            <div key={gymClass.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/80 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-600 transition-colors">
                                <div className="flex gap-5 items-start">
                                    <div className={`p-4 rounded-2xl border ${style.bg} ${style.border} ${style.color} shrink-0`}>
                                        {style.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xl font-bold text-white">{formatTime(gymClass.startTime)} - {formatTime(gymClass.endTime)}</span>
                                            {gymClass.userEnrolled && (
                                                <span className="flex items-center gap-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                                                    <CheckCircle className="w-3 h-3" /> Zapisany
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-200 mb-2">{gymClass.name}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-400 font-medium">
                                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {gymClass.trainerName}</span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPinIcon className="w-4 h-4"/> {gymClass.city}, {gymClass.locationName}
                                            </span>
                                            <span className={`flex items-center gap-1.5 ${isFull ? 'text-red-400' : ''}`}>
                                                <Users className="w-4 h-4" /> {gymClass.currentParticipants}/{gymClass.maxParticipants} miejsc
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto mt-4 md:mt-0">
                                    {gymClass.userEnrolled ? (
                                        <button
                                            onClick={() => handleEnrollment(gymClass.id, false)}
                                            disabled={isActionLoading}
                                            className="w-full md:w-auto px-6 py-3 rounded-xl font-bold bg-slate-700 text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30 flex items-center justify-center gap-2"
                                        >
                                            {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                                            Wypisz się
                                        </button>
                                    ) : isFull ? (
                                        <button disabled className="w-full md:w-auto px-6 py-3 rounded-xl font-bold bg-slate-900/50 text-slate-500 border border-slate-700/50 cursor-not-allowed">
                                            Brak miejsc
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEnrollment(gymClass.id, true)}
                                            disabled={isActionLoading}
                                            className="w-full md:w-auto px-6 py-3 rounded-xl font-bold bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Zapisz się'}
                                        </button>
                                    )}
                                </div>

                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">Brak zaplanowanych zajęć w tym dniu.</p>
                    </div>
                )}
            </div>
        </div>
    );
};