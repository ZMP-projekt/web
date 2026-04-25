import React, { useState, useEffect } from 'react';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import {
    Calendar as CalendarIcon,
    ArrowLeft,
    ArrowRight, Navigation, MapPin, Clock, User, XCircle, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMembership } from '../hooks/useMembership.ts';
import {SkeletonCard} from "../components/SkeletonCard.tsx";
import {ClassCard, type GymClass} from "../components/ClassCard.tsx";
import {useNavigate, useParams} from "react-router";

const generateNext7Days = (offset: number): string[] => {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i + offset);
        days.push(date.toISOString().split('T')[0]);
    }
    return days;
};

const formatMonthRange = (days: string[]): string => {
    const first = new Date(days[0]);
    const last = new Date(days[days.length - 1]);
    const opts: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    if (first.getMonth() === last.getMonth()) {
        return first.toLocaleDateString('pl-PL', opts);
    }
    return `${first.toLocaleDateString('pl-PL', { month: 'long' })} – ${last.toLocaleDateString('pl-PL', opts)}`;
};

const isToday = (dateStr: string): boolean =>
    dateStr === new Date().toISOString().split('T')[0];

const formatTime = (isoString: string): string =>
    new Date(isoString).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

export const Schedule: React.FC = () => {
    const apiPrivate = useAxiosPrivate();
    const { isValid, isMembershipLoading } = useMembership();

    const [daysOffset, setDaysOffset] = useState<number>(0);
    const [availableDays, setAvailableDays] = useState<string[]>(generateNext7Days(0));
    const [selectedDate, setSelectedDate] = useState<string>(availableDays[0]);
    const [classes, setClasses] = useState<GymClass[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
    const { classId } = useParams();
    const navigate = useNavigate();

    const selectedClassDetails = classId ? classes.find(c => c.id === Number(classId)) : null;

    useEffect(() => {
        const newDays = generateNext7Days(daysOffset);
        setAvailableDays(newDays);
        if (!newDays.includes(selectedDate)) {
            setSelectedDate(newDays[0]);
        }
    }, [daysOffset, selectedDate]);

    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            try {
                const response = await apiPrivate.get(`/api/classes/by-date?date=${selectedDate}T00:00:00`);
                setClasses(response.data);
            } catch (error) {
                console.error('Błąd pobierania grafiku:', error);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchClasses();
    }, [selectedDate, apiPrivate]);

    const handleEnrollment = async (classId: number, isEnrolling: boolean): Promise<void> => {
        if (isMembershipLoading) {
            toast.loading('Ładowanie danych o karnecie…');
            return;
        }
        if (!isValid) {
            toast.error('Musisz posiadać aktywny karnet, aby zapisać się na zajęcia!');
            return;
        }
        setActionLoadingId(classId);
        try {
            if (isEnrolling) {
                await apiPrivate.post(`/api/classes/${classId}/book`);
            } else {
                await apiPrivate.delete(`/api/classes/${classId}/cancel`);
            }
            setClasses((prev) =>
                prev.map((c) =>
                    c.id === classId
                        ? {
                            ...c,
                            userEnrolled: isEnrolling,
                            currentParticipants: isEnrolling
                                ? c.currentParticipants + 1
                                : c.currentParticipants - 1,
                        }
                        : c
                )
            );
            toast.success(isEnrolling ? 'Pomyślnie zapisano na zajęcia!' : 'Zrezygnowano z zajęć.');
        } catch {
            toast.error('Wystąpił błąd. Spróbuj ponownie.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const selectedDateObj = new Date(selectedDate);
    const selectedDayFull = selectedDateObj.toLocaleDateString('pl-PL', {
        weekday: 'long', day: 'numeric', month: 'long',
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold text-white">Grafik zajęć</h1>
                    <p className="text-slate-500 mt-1.5 text-sm">
                        Wybierz dzień i zapisz się na trening.
                    </p>
                </div>
            </header>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-4">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-1 mb-3">
                    {formatMonthRange(availableDays)}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setDaysOffset((o) => o - 7)}
                        className="flex items-center justify-center w-12 h-14 rounded-2xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-400 hover:text-white transition-all shrink-0"
                        title="Poprzedni tydzień"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1 grid grid-cols-7 gap-2">
                        {availableDays.map((dateStr) => {
                            const d = new Date(dateStr);
                            const dayName = d.toLocaleDateString('pl-PL', { weekday: 'short' });
                            const dayNum = d.getDate();
                            const today = isToday(dateStr);
                            const selected = selectedDate === dateStr;

                            return (
                                <button
                                    key={dateStr}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all duration-200 ${
                                        selected
                                            ? 'text-white border-blue-500 shadow-lg shadow-blue-500/20'
                                            : today
                                                ? 'bg-slate-700/40 border-slate-500/50 text-slate-300 hover:border-slate-400'
                                                : 'bg-slate-800/30 border-slate-700/30 text-slate-500 hover:bg-slate-700/40 hover:text-slate-300 hover:border-slate-600/50'
                                    }`}
                                    style={selected ? { background: 'linear-gradient(135deg, #3B82F6, #6D28D9)' } : {}}
                                >
                                    <span className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-80">
                                        {today && !selected ? 'Dziś' : dayName}
                                    </span>
                                    <span className="text-xl font-black leading-none">{dayNum}</span>
                                    {today && (
                                        <span
                                            className="w-1 h-1 rounded-full mt-1.5"
                                            style={{ background: selected ? 'rgba(255,255,255,0.6)' : '#3B82F6' }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setDaysOffset((o) => o + 7)}
                        className="flex items-center justify-center w-12 h-14 rounded-2xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-400 hover:text-white transition-all shrink-0"
                        title="Następny tydzień"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-white font-semibold capitalize">
                        {selectedDayFull}
                    </h2>
                    {!isLoading && (
                        <div className="h-px flex-1 bg-slate-700/50" />
                    )}
                </div>

                <div className="space-y-3 relative min-h-64">
                    {isLoading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : classes.length > 0 ? (
                        classes.map((gymClass) => (
                            <ClassCard
                                key={gymClass.id}
                                gymClass={gymClass}
                                isActionLoading={actionLoadingId === gymClass.id}
                                onEnroll={handleEnrollment}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-4">
                                <CalendarIcon className="w-7 h-7 text-slate-600" />
                            </div>
                            <p className="text-white font-semibold mb-1">Brak zajęć w tym dniu</p>
                            <p className="text-slate-500 text-sm">Sprawdź inny dzień lub wróć później.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedClassDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 py-6 overflow-y-auto">
                    <div className="bg-slate-800 border border-slate-700 w-full max-w-xl rounded-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

                        {/* 1. Header z kolorem zależnym od typu */}
                        <div className={`p-8 pb-6 ${selectedClassDetails.personalTraining ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                            <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                        selectedClassDetails.personalTraining
                            ? 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                            : 'border-blue-500/30 text-blue-500 bg-blue-500/5'
                    }`}>
                        {selectedClassDetails.personalTraining ? 'Trening Personalny' : 'Zajęcia Grupowe'}
                    </span>
                                <button
                                    onClick={() => navigate('/schedule')}
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    <XCircle className="w-8 h-8" />
                                </button>
                            </div>
                            <h2 className="text-3xl font-black text-white leading-tight">{selectedClassDetails.name}</h2>
                        </div>

                        <div className="p-8 pt-2 space-y-8">
                            {/* 2. Siatka detali (Szybkie info) */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Trener</p>
                                    <div className="flex items-center gap-2 text-white font-semibold">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                            <User className="w-4 h-4 text-blue-400" />
                                        </div>
                                        {selectedClassDetails.trainerName}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Czas trwania</p>
                                    <div className="flex items-center gap-2 text-white font-semibold">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                        {formatTime(selectedClassDetails.startTime)} - {formatTime(selectedClassDetails.endTime)}
                                    </div>
                                </div>
                            </div>

                            {/* 3. Lokalizacja z linkiem do mapy */}
                            <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4">
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-3">Lokalizacja</p>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-3">
                                        <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-white font-bold">{selectedClassDetails.locationName}</p>
                                            <p className="text-slate-400 text-sm">{selectedClassDetails.address}, {selectedClassDetails.city}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${selectedClassDetails.latitude},${selectedClassDetails.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl border border-slate-600 transition-colors"
                                        title="Otwórz w Mapach Google"
                                    >
                                        <Navigation className="w-5 h-5 text-blue-400" />
                                    </a>
                                </div>
                            </div>

                            {/* 4. Opis zajęć */}
                            <div className="space-y-2">
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">O zajęciach</p>
                                <p className="text-slate-300 leading-relaxed italic">
                                    "{selectedClassDetails.description || 'Brak dodatkowego opisu dla tych zajęć.'}"
                                </p>
                            </div>

                            {/* 5. Obłożenie */}
                            <div className="pt-4 border-t border-slate-700/50">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-slate-400 text-sm font-medium">Uczestnicy</span>
                                    <span className="text-white font-bold">
                            {selectedClassDetails.currentParticipants} / {selectedClassDetails.maxParticipants}
                        </span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${(selectedClassDetails.currentParticipants / selectedClassDetails.maxParticipants) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* 6. Status zapisu (jeśli użytkownik jest już zapisany) */}
                            {selectedClassDetails.userEnrolled && (
                                <div className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    <span className="text-emerald-500 font-bold text-sm uppercase tracking-wide">Jesteś na liście uczestników</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};