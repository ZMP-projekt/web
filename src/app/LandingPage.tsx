import React from 'react';
import { Link } from 'react-router';
import { Dumbbell, ArrowRight, CheckCircle2, MapPin, Users, Calendar } from 'lucide-react';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30">

            <nav className="flex justify-between items-center p-6 lg:px-12 border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50 bg-slate-900/80">
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                    <Dumbbell className="w-8 h-8 text-[#3B82F6]" />
                    GymSystem
                </div>
                <div className="hidden md:flex gap-8 font-medium text-slate-300">
                    <a href="#o-nas" className="hover:text-white transition-colors">O nas</a>
                    <a href="#cennik" className="hover:text-white transition-colors">Cennik</a>
                    <a href="#harmonogram" className="hover:text-white transition-colors">Zajęcia</a>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2 font-medium transition-colors">
                        Zaloguj się
                    </Link>
                    <Link to="/register" className="bg-[#8B5CF6] hover:bg-purple-500 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all">
                        Dołącz teraz
                    </Link>
                </div>
            </nav>

            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center px-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-125 bg-[#3B82F6]/20 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-[#3B82F6] font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
                        Twój nowy standard treningu
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                        Przestań planować. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#3B82F6] to-[#8B5CF6]">
              Zacznij trenować.
            </span>
                    </h1>

                    <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                        Zarządzaj swoim karnetem, rezerwuj zajęcia z najlepszymi trenerami i śledź swoje postępy. Wszystko z poziomu nowoczesnej aplikacji.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all">
                            Rozpocznij za darmo
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#cennik" className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-lg border border-slate-700 transition-all">
                            Sprawdź cennik
                        </a>
                    </div>
                </div>
            </section>

            <section id="o-nas" className="py-20 bg-slate-900/50 border-y border-slate-800/50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Dlaczego GymSystem?</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Zbudowaliśmy system, który stawia Twój komfort na pierwszym miejscu. Koniec z papierowymi umowami i staniem w kolejkach do recepcji.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<MapPin className="w-8 h-8 text-blue-400" />}
                            title="3 Nowoczesne Lokalizacje"
                            desc="Trenuj blisko domu. Nasze siłownie znajdują się w kluczowych punktach miasta, zawsze blisko Ciebie."
                        />
                        <FeatureCard
                            icon={<Calendar className="w-8 h-8 text-purple-400" />}
                            title="Elastyczny Harmonogram"
                            desc="Zapisuj się na zajęcia jednym kliknięciem. Joga, Crossfit, czy boks - wszystko w zasięgu ręki."
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-emerald-400" />}
                            title="Najlepsi Trenerzy"
                            desc="Nasz zespół to certyfikowani profesjonaliści, którzy pomogą Ci osiągnąć Twoje cele szybciej i bezpieczniej."
                        />
                    </div>
                </div>
            </section>

            <section id="cennik" className="py-24 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Wybierz swój karnet</h2>
                    <p className="text-slate-400">Przejrzyste ceny, brak ukrytych opłat. Zrezygnuj w dowolnym momencie.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <PricingCard
                        title="Student"
                        price="89 PLN"
                        features={['Dostęp do 16:00', 'Podstawowy sprzęt', 'Aplikacja mobilna']}
                    />

                    <PricingCard
                        title="Open"
                        price="149 PLN"
                        isPopular
                        features={['Dostęp 24/7', 'Wszystkie strefy', 'Zajęcia grupowe', 'Aplikacja mobilna', '1 trening personalny']}
                    />

                    <PricingCard
                        title="VIP"
                        price="249 PLN"
                        features={['Dostęp 24/7', 'Zajęcia grupowe Premium', 'Ręcznik i woda gratis', 'Nielimitowane konsultacje']}
                    />
                </div>
            </section>

            <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
                <p>&copy; 2026 GymSystem. Projekt studencki.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/50 transition-colors">
        <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-800">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

const PricingCard = ({ title, price, features, isPopular = false }: { title: string, price: string, features: string[], isPopular?: boolean }) => (
    <div className={`relative p-8 rounded-3xl border flex flex-col ${isPopular ? 'bg-linear-to-b from-slate-800 to-slate-900 border-[#3B82F6] shadow-xl shadow-blue-900/20' : 'bg-slate-800/30 border-slate-700/50'}`}>
        {isPopular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3B82F6] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Najpopularniejszy
            </div>
        )}
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-extrabold text-white">{price}</span>
            <span className="text-slate-400">/ msc</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#8B5CF6] shrink-0" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        <Link to="/register" className={`w-full py-3 rounded-xl font-bold text-center transition-colors ${isPopular ? 'bg-[#3B82F6] hover:bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>
            Wybierz plan
        </Link>
    </div>
);