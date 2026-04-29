import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import {
    CalendarClock,
    Users,
    Clock,
    MapPin,
    ChevronRight,
    Activity,
    User,
    Plus,
} from 'lucide-react';
import i18n from "../i18n.ts";
import {useTranslation} from "react-i18next";

interface TrainerProfile {
    firstName: string;
    lastName: string;
    email: string;
}

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
    locationName?: string;
    city?: string;
}

const formatTime = (iso: string): string =>
    new Date(iso).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });

const formatDuration = (start: string, end: string): string => {
    const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    return mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60 > 0 ? ` ${mins % 60} min` : ''}` : `${mins} min`;
};

const getTodayIso = (): string => new Date().toISOString().split('T')[0];

const StatTile = ({ value, label, color = 'text-white' }: { value: string | number; label: string; color?: string }) => (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl px-5 py-4 text-center">
        <p className={`text-3xl font-extrabold leading-none ${color}`}>{value}</p>
        <p className="text-slate-500 text-xs mt-1.5 uppercase tracking-wider font-medium">{label}</p>
    </div>
);

export const TrainerDashboard: React.FC = () => {
    const apiPrivate = useAxiosPrivate();

    const [profile, setProfile] = useState<TrainerProfile | null>(null);
    const [todayClasses, setTodayClasses] = useState<ApiGymClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation('dashboard');

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                const today = getTodayIso();
                const [profileRes, classesRes] = await Promise.all([
                    apiPrivate.get('/api/users/me'),
                    apiPrivate.get(`/api/classes/trainer?date=${today}T00:00:00`),
                ]);
                setProfile(profileRes.data);
                setTodayClasses(classesRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchAll();
    }, [apiPrivate]);

    const now = Date.now();
    const upcomingClasses = todayClasses
        .filter((c) => new Date(c.endTime).getTime() > now)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const nextClass = upcomingClasses[0] ?? null;
    const totalParticipantsToday = todayClasses.reduce((sum, c) => sum + c.currentParticipants, 0);

    const greeting = (): string => {
        const h = new Date().getHours();
        if (h < 12) return t('common.greeting_morning');
        if (h < 18) return t('common.greeting_afternoon');
        return t('common.greeting_evening');
    };

    const getTimeUntil = (iso: string): string => {
        const diff = new Date(iso).getTime() - Date.now();
        if (diff <= 0) return t('trainer.happening.now');
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        if (h > 0) return t('trainer.starts_in', {
            hours: `${h} h`,
            minutes: m > 0 ? m : ''
        });
        return t('trainer.starts_in', {hours: '', minutes: m > 0 ? m : '' });
    };

    return (
        <div className="space-y-8">
            <header>
                <p className="text-slate-500 text-sm font-medium mb-1">{greeting()},</p>
                {isLoading ? (
                    <div className="h-9 w-56 bg-slate-700/50 rounded-xl animate-pulse" />
                ) : (
                    <h1 className="text-3xl font-bold text-white">
                        {profile?.firstName ?? t('trainer.coach_vocative')}!
                    </h1>
                )}
            </header>

            <div className="grid grid-cols-3 gap-4">
                {isLoading ? (
                    <>
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-20 rounded-2xl bg-slate-800/40 border border-slate-700/50 animate-pulse" />
                        ))}
                    </>
                ) : (
                    <>
                        <StatTile value={todayClasses.length} label={t('trainer.classes_today')} />
                        <StatTile value={upcomingClasses.length} label={t('trainer.upcoming')} color="text-blue-400" />
                        <StatTile value={totalParticipantsToday} label={t('trainer.total_participants')} color="text-purple-400" />
                    </>
                )}
            </div>

            <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t('trainer.next_classes')}</h2>

                    {isLoading ? (
                        <div className="h-52 rounded-3xl bg-slate-800/40 border border-slate-700/50 animate-pulse" />
                    ) : nextClass ? (
                        <div
                            className="relative rounded-3xl p-6 border border-blue-500/20 overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.08))' }}
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                                 style={{ background: 'rgba(59,130,246,0.08)' }} />

                            <div className="relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <span
                                        className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                                        style={{
                                            background: new Date(nextClass.startTime).getTime() <= now
                                                ? 'rgba(16,185,129,0.15)'
                                                : 'rgba(59,130,246,0.15)',
                                            color: new Date(nextClass.startTime).getTime() <= now ? '#10B981' : '#60A5FA',
                                            border: `1px solid ${new Date(nextClass.startTime).getTime() <= now ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`,
                                        }}
                                    >
                                        {getTimeUntil(nextClass.startTime)}
                                    </span>
                                    {nextClass.personalTraining && (
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                                            {t('trainer.personal')}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-1">{nextClass.name}</h3>

                                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-400 mb-5">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                                        {formatTime(nextClass.startTime)} – {formatTime(nextClass.endTime)}
                                        <span className="text-slate-600">({formatDuration(nextClass.startTime, nextClass.endTime)})</span>
                                    </span>
                                    {nextClass.locationName && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-600" />
                                            {nextClass.locationName}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-slate-600" />
                                        {nextClass.currentParticipants}/{nextClass.maxParticipants} {t('trainer.registered')}
                                    </span>
                                </div>

                                <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden mb-5">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${Math.min((nextClass.currentParticipants / nextClass.maxParticipants) * 100, 100)}%`,
                                            background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                                        }}
                                    />
                                </div>

                                <Link
                                    to="/trainer/schedule"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-white no-underline px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
                                    style={{ background: 'linear-gradient(135deg, #3B82F6, #6D28D9)', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
                                >
                                    <Users className="w-4 h-4" /> {t('trainer.view_attendance')}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-3xl p-8 border border-slate-700/50 bg-slate-800/30 flex flex-col items-center justify-center text-center h-52">
                            <CalendarClock className="w-10 h-10 text-slate-600 mb-3" />
                            <p className="text-white font-semibold mb-1">{t('trainer.no_classes_today')}</p>
                            <p className="text-slate-500 text-sm mb-4">{t('trainer.add_new_hint')}</p>
                            <Link
                                to="/trainer/schedule"
                                className="inline-flex items-center gap-2 text-sm font-bold text-white no-underline px-4 py-2 rounded-xl"
                                style={{ background: 'linear-gradient(135deg, #3B82F6, #6D28D9)' }}
                            >
                                <Plus className="w-4 h-4" /> {t('trainer.go_to_schedule')}
                            </Link>
                        </div>
                    )}
                </div>

                <div className="col-span-2">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t('trainer.today_plan')}</h2>

                    {isLoading ? (
                        <div className="space-y-2">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-16 rounded-2xl bg-slate-800/40 border border-slate-700/50 animate-pulse" />
                            ))}
                        </div>
                    ) : todayClasses.length > 0 ? (
                        <div className="space-y-2">
                            {todayClasses
                                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                .map((cls) => {
                                    const isPast = new Date(cls.endTime).getTime() < now;
                                    const isActive = new Date(cls.startTime).getTime() <= now && !isPast;
                                    return (
                                        <Link
                                            key={cls.id}
                                            to="/trainer/schedule"
                                            className={`flex items-center gap-3 p-3 rounded-2xl border no-underline transition-all group ${
                                                isPast
                                                    ? 'border-slate-700/30 bg-slate-800/20 opacity-50'
                                                    : isActive
                                                        ? 'border-blue-500/30 bg-blue-500/8'
                                                        : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/60 hover:bg-slate-800/50'
                                            }`}
                                        >
                                            <div className="p-2 rounded-xl bg-slate-700/50 shrink-0">
                                                {cls.personalTraining
                                                    ? <User className="w-4 h-4 text-amber-400" />
                                                    : <Activity className="w-4 h-4 text-blue-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-bold truncate">{cls.name}</p>
                                                <p className="text-slate-500 text-xs">
                                                    {formatTime(cls.startTime)} · {cls.currentParticipants}/{cls.maxParticipants} os.
                                                </p>
                                            </div>
                                            {isActive && (
                                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider shrink-0">{t('trainer.live')}</span>
                                            )}
                                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                                        </Link>
                                    );
                                })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-700/40 bg-slate-800/20 p-6 text-center">
                            <p className="text-slate-500 text-sm">{t('trainer.no_classes_today')}</p>
                        </div>
                    )}

                    <Link
                        to="/trainer/schedule"
                        className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 no-underline transition-colors"
                    >
                        {t('trainer.full_schedule')} <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

            </div>
        </div>
    );
};