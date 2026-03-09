import './index.css'
import React from 'react';
import { Link } from 'react-router';
import { Dumbbell, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 bg-linear-to-tr from-slate-900 via-slate-900 to-[#3B82F6]/10 flex flex-col">

            {/* Prosty pasek nawigacji na górze */}
            <nav className="flex justify-between items-center p-6 lg:px-12 border-b border-slate-800/50 backdrop-blur-md">
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                    <Dumbbell className="w-8 h-8 text-[#3B82F6]" />
                    GymApp
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2 font-medium transition-colors">
                        Zaloguj się
                    </Link>
                    <Link to="/register" className="bg-[#8B5CF6] hover:bg-purple-500 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all">
                        Rejestracja
                    </Link>
                </div>
            </nav>

            {/* Główna sekcja (Hero) */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="inline-block p-2 px-4 bg-slate-800/50 border border-slate-700 rounded-full mb-6">
                    <span className="text-sm font-bold text-[#3B82F6]">Nowość</span>
                    <span className="text-sm text-slate-300 ml-2">Aplikacja mobilna już dostępna!</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 mb-6 max-w-3xl">
                    Twój trening, <br /> twoje zasady.
                </h1>

                <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl">
                    Zarządzaj swoim karnetem, rezerwuj zajęcia i śledź postępy. Wszystko w jednym miejscu, dostępne zawsze wtedy, kiedy tego potrzebujesz.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/register" className="flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all">
                        Rozpocznij za darmo
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/login" className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-lg border border-slate-700 transition-all">
                        Mam już konto
                    </Link>
                </div>
            </main>
        </div>
    );
};