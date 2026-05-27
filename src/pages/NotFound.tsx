import { Link } from 'react-router';
import { MapPinOff, ArrowLeft } from 'lucide-react';
import { useAuth } from "../hooks/useAuth.ts";
import { useTranslation } from "react-i18next";

export const NotFound = () => {
    const { role } = useAuth();
    const { t } = useTranslation('common');

    const homeLink = role === 'ROLE_TRAINER' ? '/trainer/dashboard' : role === 'ROLE_USER' ? '/dashboard' : '/'

    return (
        <div className="min-h-screen flex flex-col items-center justify-top pt-30 text-center px-4 bg-slate-900">
            <div
                className="w-24 h-24 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center mb-6">
                <MapPinOff className="w-12 h-12 text-slate-500" />
            </div>

            <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
                4<span className="text-blue-500">0</span>4
            </h1>

            <h2 className="text-2xl font-bold text-slate-300 mb-2">
                {t('lost')}
            </h2>

            <p className="text-slate-500 max-w-md mb-20">
                {t('lost_desc')}
            </p>

            <Link
                to={homeLink}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30"
            >
                <ArrowLeft className="w-5 h-5" />
                {t('go_back_btn')}
            </Link>
        </div>
    );
};