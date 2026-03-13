import './index.css'
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Dumbbell, AlertCircle, Loader2 } from 'lucide-react';
import {Link, useNavigate} from "react-router";
import { useAuth } from "../auth/useAuth.ts";
import { api } from "../api/axios.ts";
import { jwtDecode } from "jwt-decode";

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

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {email, password});
            const { token } = response.data;
            const role = jwtDecode<JwtPayload>(token).role;

            if (role === 'ROLE_ADMIN') {
                setError('Konta administratorów są obsługiwane wyłącznie w aplikacji Desktopowej.');
                setIsLoading(false);
                return;
            }

            login(token, role);

            navigate(
                role === 'ROLE_USER' ? '/dashboard'
                : role === 'ROLE_TRAINER' ? '/trainer/dashboard'
                : 'unauthorised')
        } catch (err) {
            console.error('Błąd logowania:', err);
            setError("Niepoprawny email lub hasło");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-linear-to-tr from-slate-900 via-slate-900 to-[#8B5CF6]/10 p-4">
            <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-10">
                    <div className="p-4 bg-[#3B82F6]/20 rounded-2xl mb-5 border border-[#3B82F6]/30">
                        <Dumbbell className="w-10 h-10 text-[#3B82F6]" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Witaj ponownie!</h2>
                    <p className="text-slate-400 mt-2 text-center">Zaloguj się, aby zarządzać swoim karnetem i treningami.</p>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Adres E-mail</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3.5 border border-slate-700 rounded-2xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                                placeholder="jan.kowalski@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Hasło</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3.5 border border-slate-700 rounded-2xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="flex justify-end mt-3">
                            <button type="button" className="text-sm text-[#3B82F6] hover:text-blue-400 font-medium transition-colors">
                                Zapomniałeś hasła?
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-[#3B82F6] hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#3B82F6] transition-all mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Logowanie...</span>
                            </>
                        ) : (
                            <>
                                <span>Zaloguj się</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-400">
                        Nie masz jeszcze konta?{' '}
                        <Link to="/register" className="font-bold text-[#8B5CF6] hover:text-purple-400 transition-colors">
                            Zarejestruj się
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};