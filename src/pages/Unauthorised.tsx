import { Link } from 'react-router';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from "../hooks/useAuth.ts";
import { useTranslation } from "react-i18next";

export const Unauthorised = () => {
    const { role } = useAuth();
    const { t } = useTranslation('common');

    const homeLink = role === 'ROLE_TRAINER' ? '/trainer/dashboard' : role === 'ROLE_USER' ? '/dashboard' : '/'

    return (
        <div className="min-h-screen flex flex-col items-center justify-top pt-30 text-center px-4 bg-slate-900">
            <div
                className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <ShieldAlert className="w-12 h-12 text-red-500" />
            </div>

            <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
                4<span className="text-red-500">0</span>3
            </h1>

            <h2 className="text-2xl font-bold text-slate-300 mb-2">
                {t('no_access')}
            </h2>

            <p className="text-slate-500 max-w-md mb-20">
                {t('no_access_desc')}
            </p>

            <Link
                to={homeLink}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold rounded-xl transition-all"
            >
                <ArrowLeft className="w-5 h-5" />
                {t('go_back_btn')}
            </Link>
        </div>
    );
};