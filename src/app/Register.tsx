import React, { useState } from 'react';
import {Mail, Lock, User, ArrowRight, Dumbbell, User2, Loader2, AlertCircle} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from "../auth/useAuth.ts";
import { api } from "../api/axios.ts";

export const Register: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const role = "ROLE_USER";
    const { login } = useAuth();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', {firstName, lastName, email, password, role});
            const { token } = response.data;
            login(token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Błąd logowania:', err);
            setError('Błąd rejestracji')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-linear-to-tr from-slate-900 via-slate-900 to-[#3B82F6]/10 p-4">

            <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                <div className="absolute -top-12.5 -right-12.5 w-32 h-32 bg-[#3B82F6]/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12.5 -left-12.5 w-32 h-32 bg-[#8B5CF6]/20 rounded-full blur-3xl"></div>

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="p-3 bg-slate-800 rounded-xl mb-4 border border-slate-700">
                        <Dumbbell className="w-8 h-8 text-[#3B82F6]" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Utwórz konto</h2>
                    <p className="text-slate-400 mt-2 text-center text-sm">Dołącz do GymSystem i zacznij swój trening już dziś.</p>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Imię</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                                placeholder="Jan"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Nazwisko</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User2 className="h-5 w-5 text-slate-500"/>
                            </div>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                                placeholder="Kowalski"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Adres E-mail</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                                placeholder="jan@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Hasło</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                                placeholder="Min. 8 znaków"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#3B82F6] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#3B82F6] transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Rejestrowanie...</span>
                            </>
                        ) : (
                            <>
                                <span>Zarejestruj się</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center relative z-10">
                    <p className="text-sm text-slate-400">
                        Masz już konto?{' '}
                        <Link to="/login" className="font-bold text-[#3B82F6] hover:text-blue-400 transition-colors">
                            Zaloguj się
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};