import React, {useState, useEffect, useCallback} from 'react';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import {
    Calendar as CalendarIcon,
    Users,
    Edit,
    XCircle,
    Plus,
    Loader2,
    User,
    X,
    Save,
    FileText,
    Clock,
    Dumbbell,
    ArrowLeft,
    ArrowRight,
    Activity,
    MapPin,
    ChevronDown,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal.tsx';
import toast from 'react-hot-toast';
import { api } from '../api/axios.ts';

interface ApiGymClass {
    id: number;
    name: string;
    trainerName: string;
    startTime: string;
    endTime: string;
    currentParticipants: number;
    maxParticipants: number;
    description: string;
    personalTraining: boolean;
}

interface Participant {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface Location {
    id: number;
    name: string;
    city: string;
    address: string;
}

const generateNext7Days = (offset: number): string[] => {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i + offset);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
};

const formatTime = (iso: string): string =>
    new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

const formatDuration = (start: string, end: string): string => {
    const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    return mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60 > 0 ? ` ${mins % 60} min` : ''}` : `${mins} min`;
};

const formatMonthRange = (days: string[]): string => {
    const first = new Date(days[0]);
    const last = new Date(days[days.length - 1]);
    if (first.getMonth() === last.getMonth())
        return first.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
    return `${first.toLocaleDateString('pl-PL', { month: 'long' })} – ${last.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}`;
};

const isToday = (dateStr: string): boolean =>
    dateStr === new Date().toISOString().split('T')[0];

const inputCls = 'w-full pl-9 pr-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-600';
const labelCls = 'block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2';

const SkeletonCard: React.FC = () => (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 animate-pulse">
        <div className="flex gap-5 items-start">
            <div className="w-14 h-14 rounded-2xl bg-slate-700/60 shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-700/60 rounded-lg w-1/3" />
                <div className="h-6 bg-slate-700/60 rounded-lg w-1/2" />
                <div className="flex gap-4">
                    <div className="h-3 bg-slate-700/40 rounded w-24" />
                    <div className="h-3 bg-slate-700/40 rounded w-32" />
                </div>
            </div>
            <div className="flex gap-2 shrink-0">
                <div className="w-24 h-10 bg-slate-700/60 rounded-xl" />
                <div className="w-24 h-10 bg-slate-700/60 rounded-xl" />
            </div>
        </div>
    </div>
);

export const TrainerSchedule: React.FC = () => {
    const apiPrivate = useAxiosPrivate();

    const [daysOffset, setDaysOffset] = useState<number>(0);
    const [availableDays, setAvailableDays] = useState<string[]>(generateNext7Days(0));
    const [selectedDate, setSelectedDate] = useState<string>(availableDays[0]);
    const [classes, setClasses] = useState<ApiGymClass[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
    const [selectedClassForModal, setSelectedClassForModal] = useState<ApiGymClass | null>(null);
    const [participantsList, setParticipantsList] = useState<Participant[]>([]);
    const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);

    const [rescheduleForm, setRescheduleForm] = useState({ newDate: '', newTime: '' });
    const [createForm, setCreateForm] = useState({
        name: '', description: '', startTimeStr: '12:00', endTimeStr: '13:00',
        maxParticipants: 15, personalTraining: false, locationId: '',
    });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '', message: '', onConfirm: async () => {},
    });

    const fetchTrainerClasses = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiPrivate.get(`/api/classes/trainer?date=${selectedDate}T00:00:00`);
            setClasses(response.data);
        } catch (error) {
            console.error('Błąd pobierania grafiku trenera:', error);
        } finally {
            setIsLoading(false);
        }
    },[selectedDate, apiPrivate]);

    useEffect(() => {
        const newDays = generateNext7Days(daysOffset);
        setAvailableDays(newDays);
        if (!newDays.includes(selectedDate)) setSelectedDate(newDays[0]);
    }, [daysOffset, selectedDate]);

    useEffect(() => { void fetchTrainerClasses(); }, [selectedDate, apiPrivate, fetchTrainerClasses]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await api.get('/api/locations');
                setLocations(response.data);
            } catch (error) {
                console.error('Błąd pobierania lokalizacji:', error);
            }
        };
        void fetchLocations();
    }, []);

    const handleOpenParticipants = async (gymClass: ApiGymClass) => {
        setSelectedClassForModal(gymClass);
        setIsParticipantsModalOpen(true);
        setIsParticipantsLoading(true);
        try {
            const response = await apiPrivate.get(`/api/classes/${gymClass.id}/participants`);
            setParticipantsList(response.data);
        } catch (error) {
            console.error('Błąd pobierania uczestników:', error);
        } finally {
            setIsParticipantsLoading(false);
        }
    };

    const handleOpenReschedule = (gymClass: ApiGymClass) => {
        setSelectedClassForModal(gymClass);
        const start = new Date(gymClass.startTime);
        setRescheduleForm({
            newDate: start.toISOString().split('T')[0],
            newTime: start.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        });
        setIsRescheduleModalOpen(true);
    };

    const handleRescheduleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!selectedClassForModal) return;
        setIsRescheduling(true);
        try {
            await apiPrivate.patch(
                `/api/classes/${selectedClassForModal.id}/reschedule?newTime=${rescheduleForm.newDate}T${rescheduleForm.newTime}:00`
            );
            toast.success('Zajęcia zostały pomyślnie przełożone!');
            setIsRescheduleModalOpen(false);
            await fetchTrainerClasses();
        } catch {
            toast.error('Nie udało się przełożyć zajęć.');
        } finally {
            setIsRescheduling(false);
        }
    };

    const handleCancelClass = (classId: number, className: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Odwołaj zajęcia',
            message: `Czy na pewno chcesz odwołać zajęcia: ${className}?`,
            onConfirm: async () => {
                await apiPrivate.delete(`/api/classes/${classId}`);
                toast.success(`Zajęcia "${className}" zostały odwołane.`);
                await fetchTrainerClasses();
            },
        });
    };

    const handleCreateSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await apiPrivate.post('/api/classes', {
                name: createForm.name,
                description: createForm.description,
                startTime: `${selectedDate}T${createForm.startTimeStr}:00.000Z`,
                endTime: `${selectedDate}T${createForm.endTimeStr}:00.000Z`,
                maxParticipants: createForm.personalTraining ? 1 : createForm.maxParticipants,
                personalTraining: createForm.personalTraining,
                locationId: Number(createForm.locationId),
            });
            toast.success('Zajęcia zostały pomyślnie dodane!');
            setIsCreateModalOpen(false);
            setCreateForm({ name: '', description: '', startTimeStr: '12:00', endTimeStr: '13:00', maxParticipants: 15, personalTraining: false, locationId: '' });
            await fetchTrainerClasses();
        } catch {
            toast.error('Nie udało się utworzyć zajęć. Sprawdź poprawność danych.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setCreateForm((prev) => ({ ...prev, [name]: checked, maxParticipants: checked ? 1 : prev.maxParticipants }));
        } else {
            setCreateForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const selectedDateLabel = new Date(selectedDate).toLocaleDateString('pl-PL', {
        weekday: 'long', day: 'numeric', month: 'long',
    });

    return (
        <div className="space-y-8">

            <header className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mój grafik</h1>
                    <p className="text-slate-500 mt-1.5 text-sm">Zarządzaj zajęciami i przeglądaj listy obecności.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all hover:opacity-90 shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #6D28D9)', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
                >
                    <Plus className="w-4 h-4" /> Dodaj zajęcia
                </button>
            </header>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-4">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-1 mb-3">
                    {formatMonthRange(availableDays)}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setDaysOffset((o) => o - 7)}
                        className="flex items-center justify-center w-12 h-14 rounded-2xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-400 hover:text-white transition-all shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="flex-1 grid grid-cols-7 gap-2">
                        {availableDays.map((dateStr) => {
                            const d = new Date(dateStr);
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
                                        {today && !selected ? 'Dziś' : d.toLocaleDateString('pl-PL', { weekday: 'short' })}
                                    </span>
                                    <span className="text-xl font-black leading-none">{d.getDate()}</span>
                                    {today && (
                                        <span className="w-1 h-1 rounded-full mt-1.5"
                                              style={{ background: selected ? 'rgba(255,255,255,0.6)' : '#3B82F6' }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setDaysOffset((o) => o + 7)}
                        className="flex items-center justify-center w-12 h-14 rounded-2xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-400 hover:text-white transition-all shrink-0"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-white font-semibold capitalize">{selectedDateLabel}</h2>
                    {!isLoading && <div className="h-px flex-1 bg-slate-700/50" />}
                    {!isLoading && classes.length > 0 && (
                        <span className="text-xs text-slate-500 font-medium shrink-0">{classes.length} zajęć</span>
                    )}
                </div>

                <div className="space-y-3 min-h-64">
                    {isLoading ? (
                        <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
                    ) : classes.length > 0 ? (
                        classes.map((gymClass) => {
                            const isFull = gymClass.currentParticipants >= gymClass.maxParticipants;
                            const occupancyPct = gymClass.maxParticipants > 0
                                ? Math.min((gymClass.currentParticipants / gymClass.maxParticipants) * 100, 100)
                                : 0;

                            return (
                                <div
                                    key={gymClass.id}
                                    className="relative group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 hover:border-slate-600/70 transition-all duration-200"
                                >


                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                                        <div className={`p-3.5 rounded-2xl border shrink-0
                                            'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                        `}>
                                            {gymClass.personalTraining ? <User className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <span className="text-white font-bold flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-slate-500" />
                                                    {formatTime(gymClass.startTime)} – {formatTime(gymClass.endTime)}
                                                    <span className="text-slate-500 font-normal text-sm">
                                                        ({formatDuration(gymClass.startTime, gymClass.endTime)})
                                                    </span>
                                                </span>
                                                {gymClass.personalTraining && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-blue-500 border border-blue-500/20 bg-blue-500/10">
                                                        Personalny
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-1 leading-tight">{gymClass.name}</h3>

                                            {gymClass.description && (
                                                <p className="text-slate-500 text-sm line-clamp-1 mb-2">{gymClass.description}</p>
                                            )}

                                            <button
                                                onClick={() => handleOpenParticipants(gymClass)}
                                                className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-slate-700/30 hover:bg-slate-700/60 border border-slate-600/50 px-3 py-1.5 rounded-xl transition-all"
                                            >
                                                <Users className="w-4 h-4 text-blue-400" />
                                                {gymClass.currentParticipants}/{gymClass.maxParticipants} uczestników
                                                {isFull && <span className="text-red-400 text-xs font-bold">(Komplet)</span>}
                                                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                                            </button>

                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="w-32 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${occupancyPct}%` }}
                                                    />
                                                </div>
                                                <span className="text-[11px] text-slate-500 font-medium">
                                                    {isFull ? 'Brak wolnych miejsc' : `${gymClass.maxParticipants - gymClass.currentParticipants} wolnych`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                                            <button onClick={() => handleOpenReschedule(gymClass)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700/40 hover:bg-slate-700 text-white text-sm font-bold rounded-xl border border-slate-600/50 transition-all">
                                                <Edit className="w-4 h-4" /> Przełóż
                                            </button>
                                            <button onClick={() => handleCancelClass(gymClass.id, gymClass.name)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold rounded-xl border border-red-500/20 hover:border-red-500/30 transition-all">
                                                <XCircle className="w-4 h-4" /> Odwołaj
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-4">
                                <CalendarIcon className="w-7 h-7 text-slate-600" />
                            </div>
                            <p className="text-white font-semibold mb-1">Masz wolne!</p>
                            <p className="text-slate-500 text-sm mb-4">Brak zajęć na ten dzień. Możesz je tutaj dodać.</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-2 text-sm font-bold text-white px-4 py-2 rounded-xl"
                                style={{ background: 'linear-gradient(135deg, #3B82F6, #6D28D9)' }}
                            >
                                <Plus className="w-4 h-4" /> Dodaj zajęcia
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => !isCreating && setIsCreateModalOpen(false)} />
                    <div className="relative bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-slate-700/80">
                            <div>
                                <h3 className="text-xl font-bold text-white">Dodaj nowe zajęcia</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    {new Date(selectedDate).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                            </div>
                            <button onClick={() => !isCreating && setIsCreateModalOpen(false)}
                                    className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="createClassForm" onSubmit={handleCreateSubmit} className="space-y-5">
                                <label className="flex items-center gap-3 p-4 border border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50 rounded-2xl cursor-pointer transition-colors">
                                    <input
                                        type="checkbox" name="personalTraining"
                                        checked={createForm.personalTraining} onChange={handleFormChange}
                                        className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                                    />
                                    <div>
                                        <span className="block font-bold text-slate-200 text-sm">Trening personalny</span>
                                        <span className="block text-xs text-slate-500">Zajęcia indywidualne (1 na 1) — limit miejsc: 1</span>
                                    </div>
                                </label>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className={labelCls}>Nazwa zajęć</label>
                                        <div className="relative">
                                            <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input type="text" required name="name" value={createForm.name}
                                                   onChange={handleFormChange} placeholder="np. Poranna Joga"
                                                   className={inputCls} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Miejsca</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input type="number" required min="1" max="100" name="maxParticipants"
                                                   value={createForm.maxParticipants} onChange={handleFormChange}
                                                   disabled={createForm.personalTraining}
                                                   className={inputCls + ' disabled:opacity-40 disabled:cursor-not-allowed'} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Godzina od</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input type="time" required name="startTimeStr" value={createForm.startTimeStr}
                                                   onChange={handleFormChange}
                                                   className={inputCls + ' [&::-webkit-calendar-picker-indicator]:invert'} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Godzina do</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input type="time" required name="endTimeStr" value={createForm.endTimeStr}
                                                   onChange={handleFormChange}
                                                   className={inputCls + ' [&::-webkit-calendar-picker-indicator]:invert'} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Lokalizacja</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                        <select required name="locationId" value={createForm.locationId}
                                                onChange={handleFormChange}
                                                className={inputCls + ' appearance-none pr-8'}>
                                            <option value="" disabled>Wybierz klub z listy…</option>
                                            {locations.map((loc) => (
                                                <option key={loc.id} value={loc.id}>
                                                    {loc.city} – {loc.name} ({loc.address})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Opis</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                                        <textarea required name="description" value={createForm.description}
                                                  onChange={handleFormChange} rows={3}
                                                  placeholder="Krótki opis treningu dla klientów…"
                                                  className={inputCls + ' pl-9 resize-none'} />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-700/80 bg-slate-800/60">
                            <button
                                type="submit" form="createClassForm" disabled={isCreating}
                                className="w-full flex justify-center items-center gap-2 py-3 text-white font-bold rounded-xl transition-all disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg, #3B82F6, #6D28D9)', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
                            >
                                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isCreating ? 'Zapisywanie…' : 'Utwórz zajęcia'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isParticipantsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => setIsParticipantsModalOpen(false)} />
                    <div className="relative bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden z-10">

                        <div className="flex justify-between items-center p-6 border-b border-slate-700/80">
                            <div>
                                <h3 className="text-xl font-bold text-white">Lista obecności</h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    {selectedClassForModal?.name} · {selectedClassForModal && formatTime(selectedClassForModal.startTime)}
                                </p>
                            </div>
                            <button onClick={() => setIsParticipantsModalOpen(false)}
                                    className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[55vh] overflow-y-auto">
                            {isParticipantsLoading ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                    <p className="text-slate-500 text-sm">Ładowanie…</p>
                                </div>
                            ) : participantsList.length > 0 ? (
                                <ul className="space-y-2">
                                    {participantsList.map((p, index) => (
                                        <li key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-300 shrink-0"
                                                 style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))' }}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold text-sm">{p.firstName} {p.lastName}</p>
                                                <p className="text-xs text-slate-500">{p.email}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-10">
                                    <User className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                                    <p className="text-slate-400 text-sm font-medium">Nikt nie jest jeszcze zapisany</p>
                                    <p className="text-slate-600 text-xs mt-1">Na te zajęcia nie ma jeszcze uczestników.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isRescheduleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => !isRescheduling && setIsRescheduleModalOpen(false)} />
                    <div className="relative bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden z-10">

                        <div className="flex justify-between items-center p-6 border-b border-slate-700/80">
                            <div>
                                <h3 className="text-xl font-bold text-white">Przełóż zajęcia</h3>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{selectedClassForModal?.name}</p>
                            </div>
                            <button onClick={() => !isRescheduling && setIsRescheduleModalOpen(false)}
                                    className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form id="rescheduleForm" onSubmit={handleRescheduleSubmit} className="space-y-4">
                                <div>
                                    <label className={labelCls}>Nowa data</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input type="date" required value={rescheduleForm.newDate}
                                               onChange={(e) => setRescheduleForm((p) => ({ ...p, newDate: e.target.value }))}
                                               className={inputCls + ' [&::-webkit-calendar-picker-indicator]:invert'} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Nowa godzina rozpoczęcia</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input type="time" required value={rescheduleForm.newTime}
                                               onChange={(e) => setRescheduleForm((p) => ({ ...p, newTime: e.target.value }))}
                                               className={inputCls + ' [&::-webkit-calendar-picker-indicator]:invert'} />
                                    </div>
                                    <p className="text-xs text-slate-600 mt-2">Czas zakończenia zostanie przeliczony automatycznie.</p>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-700/80 bg-slate-800/60">
                            <button
                                type="submit" form="rescheduleForm" disabled={isRescheduling}
                                className="w-full flex justify-center items-center gap-2 py-3 text-white font-bold rounded-xl transition-all disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg, #3B82F6, #6D28D9)', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
                            >
                                {isRescheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isRescheduling ? 'Zapisywanie…' : 'Przełóż zajęcia'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog((p) => ({ ...p, isOpen: false }))}
            />
        </div>
    );
};