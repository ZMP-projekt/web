import './index.css'
import React, { useState } from 'react';
import {Mail, Lock, ArrowRight, Dumbbell, AlertCircle, Loader2, ArrowLeft} from 'lucide-react';
import {Link, useNavigate} from "react-router";
import { useAuth } from "../auth/useAuth.ts";
import { api } from "../api/axios.ts";
import { jwtDecode } from "jwt-decode";
import {useTranslation} from "react-i18next";
import {LanguageButton} from "../components/LanguageButton.tsx";

interface JwtPayload {
    sub: string;
    role: string;
    iat: number;
    exp: number;
}

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useTranslation(['auth', 'common']);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {email, password});
            const { token } = response.data;
            const role = jwtDecode<JwtPayload>(token).role;

            if (role === 'ROLE_ADMIN') {
                setError(t('login.admin_restriction'));
                setIsLoading(false);
                return;
            }

            login(token, role);

            navigate(
                role === 'ROLE_USER' ? '/dashboard'
                : role === 'ROLE_TRAINER' ? '/trainer/dashboard'
                : 'unauthorised')
        } catch (err) {
            console.error('Error while signing in:', err);
            setError(t('login.invalid_credentials'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden relative items-center justify-center bg-slate-900 text-slate-200 p-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, #1E3A5F 0%, transparent 80%)" }} />
            <div className="max-w-md w-full bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10">
                <Link
                    to="/"
                    title="Wróć do strony głównej"
                    className="absolute top-6 left-6 z-20 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="absolute top-6 right-6 z-20"><LanguageButton /></div>
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#3B82F6]/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#8B5CF6]/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
                        <Dumbbell className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl text-center text-white tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{t('login.title')}</h2>
                    <p className="text-slate-400 mt-2 text-center text-sm">{t('login.subtitle')}</p>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-1 ml-1">{t('common:email')}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-500" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3.5 border border-slate-700/50 rounded-xl bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all text-sm"
                                placeholder={t('placeholders.email')}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-1 ml-1">{t('common:password')}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-slate-500" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3.5 border border-slate-700/50 rounded-xl bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-lg text-sm font-bold text-white transition-all mt-8 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)", boxShadow: "0 8px 32px rgba(59,130,246,0.25)" }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>{t('login.logging_in')}</span>
                            </>
                        ) : (
                            <>
                                <span>{t('login.submit_btn')}</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center relative z-10 border-t border-slate-700/50 pt-6">
                    <p className="text-sm text-slate-400">
                        {t('login.no_account_question')}{' '}
                        <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                            {t('login.register_link')}
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};