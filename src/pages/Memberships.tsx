import React, { useState } from 'react';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import {CheckCircle2, Award, Loader2, Moon, Sun, GraduationCap, AlertCircle} from 'lucide-react';
import toast from "react-hot-toast";
import {useMembership} from "../hooks/useMembership.ts";
import {useTranslation} from "react-i18next";

const MEMBERSHIP_PLANS = [
    {
        type: 'STUDENT',
        title: 'Karnet Student',
        price: '89 PLN',
        icon: <GraduationCap className="w-8 h-8 text-blue-400" />,
        features: ['Ważna legitymacja studencka', 'Dostęp do 16:00', 'Podstawowy sprzęt']
    },
    {
        type: 'OPEN',
        title: 'Karnet Open',
        price: '149 PLN',
        icon: <Sun className="w-8 h-8 text-yellow-400" />,
        features: ['Dostęp 24/7', 'Wszystkie strefy', 'Zajęcia grupowe']
    },
    {
        type: 'NIGHT',
        title: 'Karnet Night',
        price: '99 PLN',
        icon: <Moon className="w-8 h-8 text-purple-400" />,
        features: ['Dostęp od 22:00 do 6:00', 'Brak tłumów', 'Dostęp do sauny']
    }
];

export const Memberships: React.FC = () => {
    const apiPrivate = useAxiosPrivate();

    const { membership, isValid, isMembershipLoading, refreshMembership } = useMembership()
    const [purchasingType, setPurchasingType] = useState<string | null>(null);
    const { t } = useTranslation(['memberships', 'common']);

    const handlePurchase = async (type: string) => {
        setPurchasingType(type);
        try {
            await apiPrivate.post(`api/memberships/purchase?type=${type}`);
            toast.success(t(membership?.type === type ? 'toast_extended' : 'toast_purchased', {type: type}));
            await refreshMembership();
        } catch (error) {
            console.error("Błąd zakupu:", error);
            toast.error(t('transaction_error'));
        } finally {
            setPurchasingType(null);
        }
    };

    const calculateDaysRemaining = (endDateString: string) => {
        const diffTime = Math.max(new Date(endDateString).getTime() - new Date().getTime(), 0);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (isMembershipLoading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-15 max-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-white">{t('manage_title')}</h1>
                <p className="text-slate-400 mt-2">{t('manage_description')}</p>
            </div>

            {membership && isValid ? (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl z-10">
                        {t('status_active')}
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                            <Award className="w-10 h-10 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{t('my_plan')} {membership.type}</h2>
                            <p className="text-slate-400 mt-1">
                                {t('common:days_left')}: <span className="text-white font-bold">{calculateDaysRemaining(membership.endDate)} {t('common:days_unit', {count: calculateDaysRemaining(membership.endDate)})}</span> ({t('common:valid_until')} {formatDate(membership.endDate)})
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`backdrop-blur-sm border rounded-3xl p-6 relative overflow-hidden ${
                    membership ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-800/40 border-slate-700/60'
                }`}>
                    <div className={`absolute top-0 right-0 text-white text-xs font-bold px-4 py-1 rounded-bl-xl z-10 ${
                        membership ? 'bg-red-500' : 'bg-slate-600'
                    }`}>
                        {membership ? t("status_expired") : t('status_none')}
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className={`p-4 rounded-2xl border ${
                            membership ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-700/30 border-slate-600/50'
                        }`}>
                            <AlertCircle className={`w-10 h-10 ${membership ? 'text-red-400' : 'text-slate-400'}`} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {membership ? t('expired_message') : t('no_membership_yet')}
                            </h2>
                            <p className="text-slate-400 mt-1">
                                {membership
                                    ? t('renew_description')
                                    : t('choose_plan_description')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {MEMBERSHIP_PLANS.map((plan) => {
                    const isCurrentPlan = membership?.type === plan.type && membership?.active;
                    const isPurchasingThis = purchasingType === plan.type;

                    return (
                        <div key={plan.type} className={`relative p-8 rounded-3xl border flex flex-col ${isCurrentPlan ? 'bg-slate-800/80 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-slate-800/30 border-slate-700/50'}`}>

                            {isCurrentPlan && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                                    {t('your_plan')}
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6 mt-2">
                                {plan.icon}
                                <div className="text-right">
                                    <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                                    <div className="text-2xl font-extrabold text-[#3B82F6]">{plan.price}</div>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-300 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-[#8B5CF6] shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePurchase(plan.type)}
                                disabled={purchasingType !== null}
                                className={`w-full flex justify-center items-center gap-2 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                ${isCurrentPlan
                                    ? 'bg-transparent border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10'
                                    : 'bg-[#3B82F6] text-white hover:bg-blue-600'
                                }`}
                            >
                                {isPurchasingThis ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> {t('common:processing')}</>
                                ) : isCurrentPlan ? (
                                    t('extend_membership_btn')
                                ) : (
                                    membership?.active ? t('change_plan_btn') : t('buy_membership_btn')
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};