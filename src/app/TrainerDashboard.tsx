import React, { useState, useEffect } from 'react';
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
    Clock, Dumbbell
} from 'lucide-react';
import {ConfirmModal} from "../components/ConfirmModal.tsx";
import toast from "react-hot-toast";

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

const generateNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        days.push(date.toISOString().split('T')[0]);
    }
    return days;
};

const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
};

export const TrainerDashboard: React.FC = () => {
    const apiPrivate = useAxiosPrivate();

    const [availableDays] = useState<string[]>(generateNext7Days());
    const [selectedDate, setSelectedDate] = useState<string>(availableDays[0]);
    const [classes, setClasses] = useState<ApiGymClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
    const [selectedClassForModal, setSelectedClassForModal] = useState<ApiGymClass | null>(null);
    const [participantsList, setParticipantsList] = useState<Participant[]>([]);
    const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);

    const [rescheduleForm, setRescheduleForm] = useState({
        newDate: '',
        newTime: ''
    });
    
    const [createForm, setCreateForm] = useState({
        name: '',
        description: '',
        startTimeStr: '12:00',
        endTimeStr: '13:00',
        maxParticipants: 15,
        personalTraining: false,
    });

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const handleOpenReschedule = (gymClass: ApiGymClass) => {
        setSelectedClassForModal(gymClass);

        const startDate = new Date(gymClass.startTime);
        const dateStr = startDate.toISOString().split('T')[0];
        const timeStr = startDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

        setRescheduleForm({
            newDate: dateStr,
            newTime: timeStr
        })

        setIsRescheduleModalOpen(true);
    }

    const handleRescheduleSubmit = async (e: React.SubmitEvent)=> {
        e.preventDefault();
        if (!selectedClassForModal) return;

        setIsRescheduling(true);
        try {
            const newStartDateTime = `${rescheduleForm.newDate}T${rescheduleForm.newTime}:00`;
            await apiPrivate.patch(`/api/classes/${selectedClassForModal.id}/reschedule?newTime=${newStartDateTime}`)
            toast.success('Zajęcia zostały pomyślnie przełożone!');
            setIsRescheduleModalOpen(false);
            await fetchTrainerClasses();
        } catch (error) {
            console.error("Błąd przekładania zajęć:", error)
            toast.error('Nie udało się  przełożyć zajęć.')
        } finally {
            setIsRescheduling(false);
        }
    }

    const fetchTrainerClasses = async () => {
        setIsLoading(true);
        try {
            const formattedDate = `${selectedDate}T00:00:00`;
            const response = await apiPrivate.get(`/api/classes/trainer?date=${formattedDate}`);
            setClasses(response.data);
        } catch (error) {
            console.error("Błąd pobierania grafiku trenera:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchTrainerClasses = async () => {
            setIsLoading(true);
            try {
                const formattedDate = `${selectedDate}T00:00:00`;
                const response = await apiPrivate.get(`/api/classes/trainer?date=${formattedDate}`);
                setClasses(response.data);
            } catch (error) {
                console.error("Błąd pobierania grafiku trenera:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrainerClasses();
    }, [selectedDate, apiPrivate]);

    const handleOpenParticipants = async (gymClass: ApiGymClass) => {
        setSelectedClassForModal(gymClass);
        setIsParticipantsModalOpen(true);
        setIsParticipantsLoading(true);

        try {
            const response = await apiPrivate.get(`/api/classes/${gymClass.id}/participants`);
            setParticipantsList(response.data);
        } catch (error) {
            console.error("Błąd pobierania uczestników:", error);
        } finally {
            setIsParticipantsLoading(false);
        }
    };

    const handleCancelClass = async (classId: number, className: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Odwołaj zajęcia',
            message: `Czy na pewno chcesz odwołać zajęcia: ${className}?`,
            onConfirm: async () => {
                await apiPrivate.delete(`/api/classes/${classId}`);
                toast.success(`Zajęcia ${className} zostały odwołane!`);
                await fetchTrainerClasses()
            }
        });
    };

    const handleCreateSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const startDateTime = `${selectedDate}T${createForm.startTimeStr}:00.000Z`;
            const endDateTime = `${selectedDate}T${createForm.endTimeStr}:00.000Z`;

            const payload = {
                name: createForm.name,
                description: createForm.description,
                startTime: startDateTime,
                endTime: endDateTime,
                maxParticipants: createForm.personalTraining ? 1 : createForm.maxParticipants,
                personalTraining: createForm.personalTraining
            };
            await apiPrivate.post('/api/classes', payload);

            toast.success('Zajęcia zostały pomyślnie dodane!');
            setIsCreateModalOpen(false);
            setCreateForm({
                name: '', description: '', startTimeStr: '12:00', endTimeStr: '13:00', maxParticipants: 15, personalTraining: false
            });

            await fetchTrainerClasses();

        } catch (error) {
            console.error("Błąd tworzenia zajęć:", error);
            toast.error('Nie udało się utworzyć zajęć. Sprawdź poprawność danych.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setCreateForm(prev => ({
                ...prev,
                [name]: checked,
                maxParticipants: checked ? 1 : prev.maxParticipants
            }));
        } else {
            setCreateForm(prev => ({ ...prev, [name]: value }));
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
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Twój Grafik</h1>
                    <p className="text-slate-400 mt-2">Zarządzaj swoimi zajęciami i przeglądaj listy obecności.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
                >
                    <Plus className="w-5 h-5" /> Dodaj zajęcia
                </button>
            </header>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {availableDays.map((dateStr) => {
                    const { dayName, dayNum } = formatDayButton(dateStr);
                    const isSelected = selectedDate === dateStr;

                    return (
                        <button
                            key={dateStr}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`flex flex-col items-center justify-center min-w-20 py-4 rounded-2xl border transition-all ${
                                isSelected
                                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <span className="text-xs uppercase font-bold tracking-wider mb-1">{dayName}</span>
                            <span className="text-2xl font-black">{dayNum}</span>
                        </button>
                    );
                })}
            </div>

            <div className="space-y-4 relative min-h-75">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
                        <p>Wczytywanie Twojego grafiku...</p>
                    </div>
                ) : classes.length > 0 ? (
                    classes.map((gymClass) => (
                        <div key={gymClass.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/80 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-600 transition-colors">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-xl font-bold text-emerald-400">
                                        {formatTime(gymClass.startTime)} - {formatTime(gymClass.endTime)}
                                    </span>
                                    {gymClass.personalTraining && (
                                        <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30">
                                            Trening Personalny
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-slate-200 mb-1">{gymClass.name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-1 mb-3">{gymClass.description}</p>

                                <button
                                    onClick={() => handleOpenParticipants(gymClass)}
                                    className="flex items-center gap-2 text-sm font-medium bg-slate-900/50 hover:bg-slate-900 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                                >
                                    <Users className="w-4 h-4 text-blue-400" />
                                    <span>Zapisanych: {gymClass.currentParticipants} / {gymClass.maxParticipants}</span>
                                    <span className="text-blue-400 text-xs ml-1">(Zobacz listę)</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <button
                                    onClick={() => handleOpenReschedule(gymClass)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-bold transition-colors">
                                    <Edit className="w-4 h-4" /> Przełóż
                                </button>
                                <button
                                    onClick={() => handleCancelClass(gymClass.id, gymClass.name)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold transition-colors"
                                >
                                    <XCircle className="w-4 h-4" /> Odwołaj
                                </button>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">Masz wolne! Brak zaplanowanych zajęć na ten dzień.</p>
                    </div>
                )}
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => !isCreating && setIsCreateModalOpen(false)}></div>

                    <div className="relative bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">

                        <div className="flex justify-between items-center p-6 border-b border-slate-700">
                            <div>
                                <h3 className="text-xl font-bold text-white">Dodaj nowe zajęcia</h3>
                                <p className="text-sm text-emerald-400 mt-1">Data: {selectedDate}</p>
                            </div>
                            <button onClick={() => !isCreating && setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="createClassForm" onSubmit={handleCreateSubmit} className="space-y-5">

                                <label className="flex items-center gap-3 p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-xl cursor-pointer hover:bg-emerald-500/20 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="personalTraining"
                                        checked={createForm.personalTraining}
                                        onChange={handleFormChange}
                                        className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                                    />
                                    <div>
                                        <span className="block font-bold text-emerald-400">To jest trening personalny</span>
                                        <span className="block text-xs text-slate-400">Zajęcia indywidualne (1 na 1)</span>
                                    </div>
                                </label>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nazwa zajęć</label>
                                        <div className="relative">
                                            <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text" required name="name" value={createForm.name} onChange={handleFormChange}
                                                placeholder="np. Poranna Joga"
                                                className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Miejsca</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="number" required min="1" max="100" name="maxParticipants"
                                                value={createForm.maxParticipants} onChange={handleFormChange}
                                                disabled={createForm.personalTraining}
                                                className="w-full pl-9 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Od</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="time" required name="startTimeStr" value={createForm.startTimeStr} onChange={handleFormChange}
                                                className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm [&::-webkit-calendar-picker-indicator]:invert"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Do</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="time" required name="endTimeStr" value={createForm.endTimeStr} onChange={handleFormChange}
                                                className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm [&::-webkit-calendar-picker-indicator]:invert"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opis</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-4 w-4 h-4 text-slate-500" />
                                        <textarea
                                            required name="description" value={createForm.description} onChange={handleFormChange} rows={3}
                                            placeholder="Krótki opis treningu dla klientów..."
                                            className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none"
                                        />
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-700 bg-slate-800/80">
                            <button
                                type="submit" form="createClassForm" disabled={isCreating}
                                className="w-full flex justify-center items-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all disabled:opacity-70 shadow-lg shadow-emerald-900/20"
                            >
                                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isCreating ? 'Zapisywanie...' : 'Utwórz zajęcia'}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {isParticipantsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => setIsParticipantsModalOpen(false)}></div>
                    <div className="relative bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden z-10">

                        <div className="flex justify-between items-center p-6 border-b border-slate-700">
                            <div>
                                <h3 className="text-xl font-bold text-white">Lista obecności</h3>
                                <p className="text-sm text-slate-400 mt-1">{selectedClassForModal?.name}</p>
                            </div>
                            <button onClick={() => setIsParticipantsModalOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {isParticipantsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                </div>
                            ) : participantsList.length > 0 ? (
                                <ul className="space-y-3">
                                    {participantsList.map((participant, index) => (
                                        <li key={participant.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{participant.firstName} {participant.lastName}</p>
                                                <p className="text-xs text-slate-500">{participant.email}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Nikt jeszcze nie zapisał się na te zajęcia.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {isRescheduleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => !isRescheduling && setIsRescheduleModalOpen(false)}></div>

                    <div className="relative bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden z-10">

                        <div className="flex justify-between items-center p-6 border-b border-slate-700">
                            <div>
                                <h3 className="text-xl font-bold text-white">Przełóż zajęcia</h3>
                                <p className="text-sm text-slate-400 mt-1 line-clamp-1">{selectedClassForModal?.name}</p>
                            </div>
                            <button onClick={() => !isRescheduling && setIsRescheduleModalOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form id="rescheduleForm" onSubmit={handleRescheduleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nowa data</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="date" required
                                            value={rescheduleForm.newDate}
                                            onChange={(e) => setRescheduleForm(prev => ({ ...prev, newDate: e.target.value }))}
                                            className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm [&::-webkit-calendar-picker-indicator]:invert"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nowa godzina rozpoczęcia</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="time" required
                                            value={rescheduleForm.newTime}
                                            onChange={(e) => setRescheduleForm(prev => ({ ...prev, newTime: e.target.value }))}
                                            className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm [&::-webkit-calendar-picker-indicator]:invert"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Czas zakończenia zostanie przeliczony automatycznie.</p>
                                </div>

                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-700 bg-slate-800/80">
                            <button
                                type="submit" form="rescheduleForm" disabled={isRescheduling}
                                className="w-full flex justify-center items-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all disabled:opacity-70 shadow-lg shadow-emerald-900/20"
                            >
                                {isRescheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isRescheduling ? 'Zapisywanie...' : 'Przełóż zajęcia'}
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
                onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            />

        </div>
    );
};