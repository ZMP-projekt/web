import React from 'react';
import {
    Clock, User, Activity, CheckCircle, MapPin,
    Users, Loader2, ChevronRight, XCircle
} from 'lucide-react';
import {Link} from "react-router";
import i18n from "../i18n.ts";
import {useTranslation} from "react-i18next";

export interface GymClass {
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
    latitude: number;
    longitude: number;
}

interface ClassCardProps {
    gymClass: GymClass;
    isActionLoading: boolean;
    onEnroll: (id: number, enrolling: boolean) => void;
}

const formatTime = (isoString: string): string =>
    new Date(isoString).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });

const formatDuration = (start: string, end: string): string => {
    const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    return mins >= 60
        ? `${Math.floor(mins / 60)}h${mins % 60 > 0 ? ` ${mins % 60} min` : ''}`
        : `${mins} min`;
};

export const ClassCard: React.FC<ClassCardProps> = ({ gymClass, isActionLoading, onEnroll }) => {
    const isFull = gymClass.currentParticipants >= gymClass.maxParticipants;
    const { t } = useTranslation('class');
    const occupancyPct = gymClass.maxParticipants > 0
        ? Math.min((gymClass.currentParticipants / gymClass.maxParticipants) * 100, 100)
        : 0;

    return (
        <div
            className={`group relative bg-slate-800/40 backdrop-blur-sm border rounded-3xl p-6 transition-all duration-200 ${
                isFull ? 'border-red-500/30 bg-red-500/5' : 'border-slate-700/50 hover:border-slate-600/70'
            }`}>
            <Link to={`/schedule/${gymClass.id}`} className="flex flex-col md:flex-row items-start md:items-center gap-5">
                <div className={`p-3.5 rounded-2xl border shrink-0 ${
                    isFull ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-700/30 border-slate-600/50'
                }`}>
                    {gymClass.personalTraining
                        ? <User className={`w-5 h-5 ${isFull ? 'text-red-400' : 'text-slate-300'}`}/>
                        : <Activity className={`w-5 h-5 ${isFull ? 'text-red-400' : 'text-slate-300'}`}/>
                    }
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="flex items-center gap-1.5 text-white font-bold">
                            <Clock className="w-4 h-4 text-slate-500"/>
                            <span>{formatTime(gymClass.startTime)} – {formatTime(gymClass.endTime)}</span>
                            <span className="text-slate-500 font-normal text-sm">
                            ({formatDuration(gymClass.startTime, gymClass.endTime)})
                        </span>
                        </div>

                        <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-600 text-slate-400 bg-slate-800">
                        {gymClass.personalTraining ? t('personal') : t('group')}
                    </span>

                        {gymClass.userEnrolled && (
                            <span
                                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3"/> {t('signed_up')}
                        </span>
                        )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">{gymClass.name}</h3>

                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500"/>
                        {gymClass.trainerName}
                    </span>
                        <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500"/>
                            {gymClass.locationName}, {gymClass.city}
                    </span>
                        <span
                            className={`flex items-center gap-1.5 font-medium ${isFull ? 'text-red-400' : 'text-slate-300'}`}>
                        <Users className="w-3.5 h-3.5"/>
                            {gymClass.currentParticipants}/{gymClass.maxParticipants} {t('places', {count: gymClass.maxParticipants})}
                    </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{width: `${occupancyPct}%`}}
                            />
                        </div>
                        <span className="text-[11px] text-slate-500 shrink-0 font-medium">
                        {isFull ? t('no_free_places') : t('free_spots', {count: gymClass.maxParticipants - gymClass.currentParticipants})}
                    </span>
                    </div>
                </div>

                <div className="w-full md:w-auto shrink-0 mt-2 md:mt-0">
                    {gymClass.userEnrolled ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onEnroll(gymClass.id, false)
                            }}
                            disabled={isActionLoading}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-700/40 text-slate-300 hover:bg-red-500/10 hover:text-red-400 border border-slate-600/50 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50"
                        >
                            {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin"/> :
                                <XCircle className="w-4 h-4"/>}
                            {t('drop_out_btn')}
                        </button>
                    ) : isFull ? (
                        <button disabled
                                className="w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-sm bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed">
                            {t('no_places')}
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onEnroll(gymClass.id, true)
                            }}
                            disabled={isActionLoading}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 transition-all duration-200 disabled:opacity-50"
                        >
                            {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin"/> :
                                <ChevronRight className="w-4 h-4"/>}
                            {t('sign_up_btn')}
                        </button>
                    )}
                </div>
            </Link>
        </div>
    );
};