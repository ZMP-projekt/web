import './index.css';
import React, { useEffect } from 'react';
import { Bell, Dumbbell, Activity, ChevronRight, IdCard, MapPin, Clock, CalendarDays } from 'lucide-react';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate.ts';
import { NotificationDropdown } from '../components/NotificationDropdown.tsx';
import { useNotifications } from '../hooks/useNotifications.ts';
import { useMembership } from '../hooks/useMembership.ts';
import { Link } from 'react-router';
import {SkeletonCard} from "../components/SkeletonCard.tsx";
import {useTranslation} from "react-i18next";

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

interface ClassItem {
    id: number;
    name: string;
    trainerName: string;
    startTime: string;
    endTime: string;
    currentParticipants: number;
    maxParticipants: number;
    description: string;
    locationName: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    userEnrolled: boolean;
    personalTraining: boolean;
}

const formatTime = (isoString: string): string =>
    new Date(isoString).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

const formatDuration = (start: string, end: string): string => {
    const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60} min` : ''}`.trim() : `${mins} min`;
};

const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });

const getClassIcon = (name: string): React.ReactNode => {
    const lower = name.toLowerCase();
    if (lower.includes('yoga') || lower.includes('pilates') || lower.includes('stretch'))
        return <Dumbbell className="w-5 h-5 text-purple-400" />;
    return <Activity className="w-5 h-5 text-blue-400" />;
};

const SectionCard = ({ title, icon, children, className = '' }: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-5">
            <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider">{title}</h3>
            {icon}
        </div>
        {children}
    </div>
);

const ClassRow = ({ cls }: { cls: ClassItem; showEnrolledBadge?: boolean }) => {
    const isFull = cls.currentParticipants >= cls.maxParticipants;

    return (
        <Link
            to={`/schedule/${cls.id}`}
            className="flex items-center gap-4 p-3 rounded-2xl bg-slate-700/20 hover:bg-slate-700/40 border border-transparent hover:border-slate-600/40 transition-all duration-200 group no-underline"
        >
            <div className="text-center min-w-11">
                <div className="text-white font-bold text-sm leading-none">{formatTime(cls.startTime)}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{formatDuration(cls.startTime, cls.endTime)}</div>
            </div>

            <div className="w-px h-8 bg-slate-600/60 shrink-0" />

            <div className="p-2 bg-slate-700/60 rounded-xl shrink-0">
                {getClassIcon(cls.name)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm truncate">{cls.name}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="text-slate-500 text-xs truncate">{cls.locationName}</span>
                </div>
            </div>

            <div className={`text-xs font-semibold shrink-0 ${isFull ? 'text-red-400' : 'text-slate-400'}`}>
                {cls.currentParticipants}/{cls.maxParticipants}
            </div>

            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
        </Link>
    );
};

export const Dashboard: React.FC = () => {
    const apiPrivate = useAxiosPrivate();
    const { membership, isValid, isMembershipLoading } = useMembership();
    const [isLoading, setIsLoading] = React.useState(true);
    const [profileData, setProfileData] = React.useState<UserProfile | null>(null);
    const { unreadCount } = useNotifications();
    const [isNotifOpen, setIsNotifOpen] = React.useState(false);
    const todayDate = new Date();
    const [todayClasses, setTodayClasses] = React.useState<ClassItem[]>([])
    const enrolledClasses = todayClasses.filter((c) => c.userEnrolled);
    const { t } = useTranslation(['dashboard', 'common']);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profile, classes] = await Promise.all(
                    [apiPrivate.get('/api/users/me'),
                    apiPrivate.get(`/api/classes/by-date?date=${todayDate.toISOString().split('T')[0]}T00:00:00`),]);
                setProfileData(profile.data);
                setTodayClasses(classes.data)
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchDashboardData();
    },);

    const calculateProgress = (endDateString: string): number => {
        const end = new Date(endDateString);
        const start = new Date(endDateString);
        start.setMonth(start.getMonth() - 1);
        const now = new Date();
        const total = end.getTime() - start.getTime();
        const passed = now.getTime() - start.getTime();
        const pct = (passed / total) * 100;
        return 100 - Math.min(100, Math.max(0, pct));
    };

    const calculateDaysRemaining = (endDateString: string): number => {
        const diffTime = Math.max(new Date(endDateString).getTime() - new Date().getTime(), 0);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const greeting = (): string => {
        const h = new Date().getHours();
        if (h < 12) return t('common.greeting_morning');
        if (h < 18) return t('common.greeting_afternoon');
        return t('common.greeting_evening');
    };

    return (
        <>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{greeting()},</p>
                    {isLoading ? (
                        <div className="h-9 w-48 bg-slate-700/50 rounded-xl animate-pulse" />
                    ) : (
                        <h1 className="text-3xl font-bold text-white">
                            {profileData?.firstName || t('user.user')}
                        </h1>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className={`relative p-2.5 rounded-xl transition-colors ${
                                isNotifOpen ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                        </button>
                        <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 border-2 border-slate-700 flex items-center justify-center text-white font-bold text-sm">
                        {profileData?.firstName?.[0] ?? '?'}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <SectionCard title={t('user.membership_status')} icon={<IdCard className="w-5 h-5 text-slate-400" />}>
                        {isMembershipLoading ? (
                            <div className="flex items-center gap-3 py-2">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-slate-400 text-sm">{t('common:loading_data')}</span>
                            </div>
                        ) : membership && !isValid ? (
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-red-400 font-bold text-xl mb-1">{t('user.membership_expired')}</p>
                                    <p className="text-slate-500 text-sm">{t('user.renew_to_continue')}</p>
                                </div>
                                <Link
                                    to="/memberships"
                                    className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition-colors no-underline shrink-0"
                                >
                                    {t('user.renew_btn')}
                                </Link>
                            </div>
                        ) : membership ? (
                            <>
                                <div className="flex items-end justify-between mb-5">
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{t('common:days_left')}</p>
                                        <p className="text-5xl font-extrabold text-white leading-none">
                                            {calculateDaysRemaining(membership.endDate)}
                                            <span className="text-slate-500 text-xl font-medium ml-2">{t('common:days_unit')}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block text-xs font-bold uppercase tracking-wide text-blue-400 bg-blue-500/15 border border-blue-500/30 px-3 py-1.5 rounded-full mb-2">
                                            {membership.type}
                                        </span>
                                        <p className="text-slate-500 text-xs">{t('common:valid_until')} {formatDate(membership.endDate)}</p>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${membership.active ? calculateProgress(membership.endDate) : 0}%`,
                                            background: membership.active
                                                ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
                                                : '#EF4444',
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white font-bold text-lg mb-1">{t('user.no_membership')}</p>
                                    <p className="text-slate-500 text-sm">{t('user.buy_and_start')}</p>
                                </div>
                                <Link
                                    to="/memberships"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors no-underline shrink-0"
                                >
                                    {t('user.buy_btn')}
                                </Link>
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard
                        title={t('user.today_classes')}
                        icon={<CalendarDays className="w-5 h-5 text-purple-400" />}
                    >
                        {isLoading ? (
                            <>
                                <SkeletonCard/>
                            </>
                        ) : enrolledClasses.length === 0 ? (
                            <div className="text-center py-8">
                                <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400 text-sm font-medium">{t('user.no_classes')}</p>
                                <p className="text-slate-600 text-xs mt-1 mb-4">{t('user.schedule_browse_and_signup')}</p>
                                <Link
                                    to="/schedule"
                                    className="text-sm text-blue-400 font-semibold hover:text-blue-300 transition-colors no-underline"
                                >
                                    {t('user.open_schedule')}
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {enrolledClasses.map((cls) => (
                                    <ClassRow key={cls.id} cls={cls} />
                                ))}
                                <div className="pt-2">
                                    <Link
                                        to="/schedule"
                                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors no-underline font-medium"
                                    >
                                        {t('user.browse_full_schedule')}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </SectionCard>
                </div>

                <div className="space-y-6">
                    <SectionCard title={t('user.club_today')} icon={<Clock className="w-4 h-4 text-slate-500" />}>
                        <div className="space-y-2">
                            {todayClasses.slice(0, 4).map((cls) => (
                                <ClassRow key={cls.id} cls={cls} showEnrolledBadge />
                            ))}
                        </div>
                        <Link
                            to="/schedule"
                            className="block text-center text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors no-underline mt-4 pt-4 border-t border-slate-700/50"
                        >
                            {t('user.see_all_classes')}
                        </Link>
                    </SectionCard>
                </div>

            </div>
        </>
    );
};