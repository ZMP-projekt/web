import React, { useState, useEffect, useRef } from "react";
import {Link} from "react-router";
import {Navigation} from "lucide-react";

interface NavLink {
    label: string;
    href: string;
}

interface Stat {
    value: string;
    label: string;
}

interface ScheduleItem {
    time: string;
    name: string;
    trainer: string;
    spots: number;
    tag: string;
    color: string;
}

interface PricingPlan {
    title: string;
    price: string;
    features: string[];
    popular: boolean;
}

const NAV_LINKS: NavLink[] = [
    { label: "O nas", href: "#o-nas" },
    { label: "Zajęcia", href: "#harmonogram" },
    { label: "Cennik", href: "#cennik" },
    { label: "Lokalizacje", href: "#mapa" },
];

const STATS: Stat[] = [
    { value: "1 200+", label: "Aktywnych członków" },
    { value: "3", label: "Lokalizacje w mieście" },
    { value: "24", label: "Trenerów personalnych" },
    { value: "40+", label: "Zajęć tygodniowo" },
];

const SCHEDULE: ScheduleItem[] = [
    { time: "06:30", name: "Morning HIIT", trainer: "Karolina Wiśniewska", spots: 4, tag: "Cardio", color: "#3B82F6" },
    { time: "09:00", name: "Yoga Flow", trainer: "Marek Zając", spots: 8, tag: "Mindfulness", color: "#8B5CF6" },
    { time: "12:15", name: "CrossFit RX", trainer: "Tomasz Nowak", spots: 2, tag: "Siła", color: "#10B981" },
    { time: "18:00", name: "Boxing Basics", trainer: "Anna Kowalska", spots: 6, tag: "Boks", color: "#F59E0B" },
    { time: "19:30", name: "Body Pump", trainer: "Piotr Malinowski", spots: 10, tag: "Siła", color: "#3B82F6" },
    { time: "20:30", name: "Night Stretch", trainer: "Karolina Wiśniewska", spots: 12, tag: "Mobilność", color: "#8B5CF6" },
];

const PRICING: PricingPlan[] = [
    {
        title: "Student",
        price: "89",
        features: ["Dostęp do 16:00", "Strefy podstawowe", "Aplikacja mobilna", "Szafka w cenie"],
        popular: false,
    },
    {
        title: "Open",
        price: "149",
        features: ["Dostęp 24/7", "Wszystkie strefy", "Zajęcia grupowe", "1 trening personalny", "Aplikacja mobilna"],
        popular: true,
    },
    {
        title: "VIP",
        price: "249",
        features: ["Dostęp 24/7", "Zajęcia Premium", "Ręcznik i woda", "Nielimitowane konsultacje", "Strefa SPA"],
        popular: false,
    },
];

export const LandingPage: React.FC = () => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const onScroll = (): void => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        setVisibleSections((prev) => ({ ...prev, [e.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );
        Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const registerRef = (id: string) => (el: HTMLElement | null): void => {
        sectionRefs.current[id] = el;
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 overflow-x-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #3B82F6; border-radius: 2px; }

        .fade-up { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
        .stagger-5 { transition-delay: 0.5s; }
        .stagger-6 { transition-delay: 0.6s; }

        .schedule-row { transition: background 0.2s ease, transform 0.2s ease; }
        .schedule-row:hover { background: rgba(59,130,246,0.06) !important; transform: translateX(4px); }

        .price-card { transition: transform 0.25s ease; }
        .price-card:hover { transform: translateY(-6px); }

        .nav-link { position: relative; transition: color 0.2s; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:#3B82F6; transition:width 0.25s ease; }
        .nav-link:hover { color: white; }
        .nav-link:hover::after { width: 100%; }

        .grain { position:fixed; inset:0; pointer-events:none; z-index:100; opacity:0.025;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size:200px 200px; }

        .hero-bg {
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(59,130,246,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 60%),
            #0F172A;
        }
        .diagonal-bottom { clip-path: polygon(0 0%, 100% 0%, 100% 96%, 0% 100%); padding-bottom: 4%; }

        @media (max-width: 768px) {
          .hero-title { font-size: 14vw !important; line-height: 0.95 !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .schedule-grid { grid-template-columns: 1fr !important; }
          .map-grid { grid-template-columns: 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

            <div className="grain" />

            <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 transition-all duration-300 ${
                scrolled ? "h-15 bg-slate-900/90 backdrop-blur-md border-b border-white/5" : "h-18 bg-transparent"
            }`}>
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg display"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
                    >GS</div>
                    <span className="font-bold text-lg text-white">GymSystem</span>
                </div>

                <div className="hidden md:flex gap-10">
                    {NAV_LINKS.map((link) => (
                        <a key={link.href} href={link.href} className="nav-link text-slate-400 text-sm font-medium no-underline">
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium no-underline transition-colors">
                        Zaloguj się
                    </Link>
                    <Link
                        to="/register"
                        className="text-white text-sm font-bold no-underline px-5 py-2 rounded-xl transition-opacity hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                    >
                        Dołącz teraz →
                    </Link>
                </div>
            </nav>

            <section
                className="hero-bg diagonal-bottom relative flex flex-col justify-center overflow-hidden"
                style={{ minHeight: "100vh", padding: "120px 2rem 80px" }}
            >
                <div className="absolute top-[15%] right-[8%] w-px h-[40%]" style={{ background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.3), transparent)" }} />
                <div className="absolute top-[30%] right-[12%] w-px h-[30%]" style={{ background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.2), transparent)" }} />

                <div className="max-w-300 w-full mx-auto">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-8 uppercase tracking-widest"
                        style={{ borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", color: "#60A5FA" }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" style={{ boxShadow: "0 0 8px #3B82F6" }} />
                        Twój nowy standard treningu
                    </div>

                    <h1 className="hero-title display text-white mb-8" style={{ fontSize: "clamp(72px, 12vw, 160px)", lineHeight: 0.9 }}>
                        Przestań<br />
                        <span style={{ WebkitTextStroke: "2px #3B82F6", color: "transparent" }}>planować.</span><br />
                        <span style={{ background: "linear-gradient(90deg, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Zacznij</span>
                    </h1>
                    <h1 className="hero-title display text-white mb-12" style={{ fontSize: "clamp(72px, 12vw, 160px)", lineHeight: 0.9 }}>
                        trenować.
                    </h1>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2.5 text-white font-bold text-base no-underline px-8 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
                            style={{ background: "#3B82F6", boxShadow: "0 8px 32px rgba(59,130,246,0.35)" }}
                        >
                            Rozpocznij za darmo <span className="text-xl">→</span>
                        </Link>
                        <Link
                            to="#cennik"
                            className="inline-flex items-center text-slate-200 font-semibold text-base no-underline px-8 py-4 rounded-2xl border transition-all hover:bg-white/10"
                            style={{ background: "rgba(226,232,240,0.06)", borderColor: "rgba(226,232,240,0.12)" }}
                        >
                            Sprawdź cennik
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 text-[11px] font-semibold uppercase tracking-widest">
                    <span>Przewiń</span>
                    <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, #475569, transparent)" }} />
                </div>
            </section>

            <section className="border-b border-blue-500/20 py-12 px-8" style={{ background: "linear-gradient(135deg, #1E293B, #1E3A5F)" }}>
                <div
                    className="stats-grid max-w-300 mx-auto grid grid-cols-4 rounded-2xl overflow-hidden"
                    style={{ gap: "1px", background: "rgba(226,232,240,0.06)" }}
                >
                    {STATS.map((stat, i) => (
                        <div key={i} className="text-center px-6 py-9" style={{ background: "rgba(15,23,42,0.7)" }}>
                            <div className="display text-[52px] leading-none" style={{ color: i % 2 === 0 ? "#3B82F6" : "#8B5CF6" }}>
                                {stat.value}
                            </div>
                            <div className="text-slate-500 text-xs font-medium mt-1.5 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="o-nas" ref={registerRef("o-nas")} className="py-24 px-8">
                <div className="about-grid max-w-300 mx-auto grid grid-cols-2 gap-20 items-center">

                    <div className={`fade-up ${visibleSections["o-nas"] ? "visible" : ""}`}>
                        <div className="text-xs font-bold tracking-[0.16em] text-blue-500 uppercase mb-4">O nas</div>
                        <h2 className="display text-white mb-6" style={{ fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 0.95 }}>
                            Nie jesteśmy<br />zwykłą siłownią.
                        </h2>
                        <p className="text-slate-400 leading-relaxed text-base mb-6">
                            GymSystem to ekosystem, który łączy trzy nowoczesne obiekty z jedną, spójną platformą cyfrową. Rezerwujesz, płacisz i śledzisz postępy — wszystko w jednym miejscu.
                        </p>
                        <p className="text-slate-500 leading-relaxed text-sm">
                            Koniec z papierowymi umowami, staniem w kolejkach i gubieniem karnetów. Twój dostęp jest zawsze w telefonie.
                        </p>
                        <div className="flex gap-8 mt-10">
                            {(["Siłownia", "Cardio", "Spa & Sauna"] as const).map((t, i) => (
                                <div key={t}>
                                    <div className="text-sm font-bold text-white">{t}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{["Sprzęt premium", "Pełna strefa", "Strefy VIP"][i]}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`fade-up stagger-2 ${visibleSections["o-nas"] ? "visible" : ""}`}>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: "📍", title: "3 Lokalizacje", desc: "W kluczowych punktach miasta, zawsze blisko Ciebie.", color: "#3B82F6" },
                                { icon: "🗓", title: "Elastyczny plan", desc: "Zapisuj się na zajęcia jednym dotknięciem.", color: "#8B5CF6" },
                                { icon: "🏆", title: "Top trenerzy", desc: "Certyfikowani specjaliści, realne efekty.", color: "#10B981" },
                                { icon: "📱", title: "Aplikacja mobilna", desc: "Twój karnet, harmonogram i postępy — w kieszeni.", color: "#F59E0B" },
                            ].map((card, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl p-6 border transition-colors duration-200 cursor-default"
                                    style={{ background: "rgba(30,41,59,0.6)", borderColor: "rgba(226,232,240,0.07)" }}
                                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.borderColor = card.color + "55")}
                                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.borderColor = "rgba(226,232,240,0.07)")}
                                >
                                    <div className="text-3xl mb-3">{card.icon}</div>
                                    <div className="text-sm font-bold text-white mb-1.5">{card.title}</div>
                                    <div className="text-xs text-slate-500 leading-relaxed">{card.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            <section
                id="harmonogram"
                ref={registerRef("harmonogram")}
                className="py-24 px-8 border-t border-b border-white/5"
                style={{ background: "rgba(15,23,42,0.8)" }}
            >
                <div className="max-w-300 mx-auto">
                    <div className={`fade-up ${visibleSections["harmonogram"] ? "visible" : ""} mb-14`}>
                        <div className="text-xs font-bold tracking-[0.16em] uppercase mb-3" style={{ color: "#8B5CF6" }}>
                            Zajęcia grupowe
                        </div>
                        <div className="flex justify-between items-end flex-wrap gap-4">
                            <h2 className="display text-white" style={{ fontSize: "clamp(36px, 4vw, 60px)", lineHeight: 1 }}>
                                Co gra dzisiaj?
                            </h2>
                            <Link to="/public/schedule" className="text-sm text-blue-400 no-underline font-semibold tracking-wide hover:text-blue-300 transition-colors">
                                Pełny harmonogram →
                            </Link>
                        </div>
                    </div>

                    <div className="schedule-grid grid grid-cols-2 gap-3">
                        {SCHEDULE.map((cls, i) => (
                            <div
                                key={i}
                                className={`schedule-row fade-up stagger-${Math.min(i + 1, 6)} ${visibleSections["harmonogram"] ? "visible" : ""} flex items-center gap-5 px-6 py-5 rounded-2xl border border-white/5`}
                                style={{ background: "rgba(30,41,59,0.4)" }}
                            >
                                <div className="text-center min-w-12">
                                    <div className="display text-[22px] leading-none" style={{ color: cls.color }}>
                                        {cls.time.split(":")[0]}
                                    </div>
                                    <div className="text-[11px] text-slate-600 font-semibold">:{cls.time.split(":")[1]}</div>
                                </div>
                                <div className="w-0.5 h-10 rounded-sm" style={{ background: `linear-gradient(to bottom, ${cls.color}88, transparent)` }} />
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-white mb-0.5">{cls.name}</div>
                                    <div className="text-xs text-slate-500">{cls.trainer}</div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                  <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{ background: cls.color + "22", color: cls.color, border: `1px solid ${cls.color}44` }}
                  >
                    {cls.tag}
                  </span>
                                    <span className={`text-[11px] font-semibold ${cls.spots <= 3 ? "text-red-400" : "text-slate-500"}`}>
                    {cls.spots <= 3 ? `⚠ ${cls.spots} miejsc` : `${cls.spots} miejsc`}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="cennik" ref={registerRef("cennik")} className="py-24 px-8">
                <div className="max-w-300 mx-auto">
                    <div className={`fade-up ${visibleSections["cennik"] ? "visible" : ""} text-center mb-16`}>
                        <div className="text-xs font-bold tracking-[0.16em] text-blue-500 uppercase mb-3">Karnety</div>
                        <h2 className="display text-white" style={{ fontSize: "clamp(36px, 4vw, 60px)" }}>Wybierz swój plan</h2>
                        <p className="text-slate-500 mt-3 text-sm">Przejrzyste ceny. Brak ukrytych opłat. Rezygnuj kiedy chcesz.</p>
                    </div>

                    <div className="pricing-grid grid grid-cols-3 gap-6 max-w-225 mx-auto">
                        {PRICING.map((plan, i) => (
                            <div
                                key={i}
                                className={`price-card fade-up stagger-${i + 1} ${visibleSections["cennik"] ? "visible" : ""} relative rounded-3xl p-9`}
                                style={{
                                    background: plan.popular ? "linear-gradient(160deg, #1E3A5F 0%, #1a1a2e 100%)" : "rgba(30,41,59,0.5)",
                                    border: plan.popular ? "1px solid #3B82F6" : "1px solid rgba(226,232,240,0.07)",
                                    boxShadow: plan.popular ? "0 0 60px rgba(59,130,246,0.12)" : "none",
                                }}
                            >
                                {plan.popular && (
                                    <div
                                        className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-black tracking-[0.12em] uppercase px-4 py-1 rounded-full whitespace-nowrap"
                                        style={{ background: "linear-gradient(90deg, #3B82F6, #7C3AED)" }}
                                    >
                                        Najpopularniejszy
                                    </div>
                                )}
                                <div className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: plan.popular ? "#60A5FA" : "#64748B" }}>
                                    {plan.title}
                                </div>
                                <div className="flex items-baseline gap-1 mb-7">
                                    <span className="display text-[56px] text-white leading-none">{plan.price}</span>
                                    <span className="text-sm text-slate-500 font-medium">PLN / msc</span>
                                </div>
                                <div className="h-px mb-6" style={{ background: "rgba(226,232,240,0.06)" }} />
                                <ul className="list-none mb-8 p-0">
                                    {plan.features.map((feature, fi) => (
                                        <li
                                            key={fi}
                                            className="flex items-center gap-2.5 py-2 text-sm text-slate-300"
                                            style={{ borderBottom: fi < plan.features.length - 1 ? "1px solid rgba(226,232,240,0.04)" : "none" }}
                                        >
                                            <span className="text-base" style={{ color: plan.popular ? "#3B82F6" : "#8B5CF6" }}>✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/register"
                                    className="block text-center no-underline py-3.5 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-85"
                                    style={{
                                        background: plan.popular ? "linear-gradient(135deg, #3B82F6, #7C3AED)" : "rgba(226,232,240,0.06)",
                                        border: plan.popular ? "none" : "1px solid rgba(226,232,240,0.12)",
                                        boxShadow: plan.popular ? "0 4px 20px rgba(59,130,246,0.3)" : "none",
                                    }}
                                >
                                    Wybierz plan
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="mapa"
                ref={registerRef("mapa")}
                className="py-24 px-8 border-t border-white/5"
                style={{ background: "rgba(15,23,42,0.6)" }}
            >
                <div className="text-center mt-12">
                    <a
                        href="/locations"
                        className="inline-flex items-center gap-2 bg-blue-500 px-8 py-4 rounded-2xl font-bold text-white hover:bg-blue-600 transition-all"
                    >
                        Znajdź swój klub na mapie (60 lokalizacji) <Navigation className="w-5 h-5" />
                    </a>
                </div>
            </section>

            <section ref={registerRef("cta")} id="cta" className="relative py-24 px-8 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 100%)" }}
                />
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), rgba(139,92,246,0.4), transparent)" }}
                />

                <div className="relative max-w-200 mx-auto text-center">
                    <div className="display text-white mb-6" style={{ fontSize: "clamp(48px, 8vw, 96px)", lineHeight: 0.95 }}>
                        Twoja metamorfoza<br />
                        <span style={{ background: "linear-gradient(90deg, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              zaczyna się dziś.
            </span>
                    </div>
                    <p className="text-slate-400 text-base leading-relaxed max-w-125 mx-auto mb-10">
                        Dołącz do ponad 1200 osób, które już trenują z GymSystem. Pierwszych 30 dni bez opłat.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-3 text-white font-black text-lg no-underline px-10 py-5 rounded-2xl tracking-wide transition-all hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)", boxShadow: "0 8px 40px rgba(59,130,246,0.4)" }}
                    >
                        Zacznij za darmo →
                    </Link>
                    <p className="text-xs text-slate-700 mt-5 tracking-wider">
                        Bez karty kredytowej · Anuluj w każdej chwili · Pełny dostęp przez 30 dni
                    </p>
                </div>
            </section>

            <footer className="border-t border-white/5 py-8 px-8 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm display"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
                    >GS</div>
                    <span className="font-bold text-sm text-slate-200">GymSystem</span>
                </div>
                <p className="text-xs text-slate-700">© 2026 GymSystem — Projekt studencki</p>
                <div className="flex gap-6">
                    {["Regulamin", "Prywatność", "Kontakt"].map((label) => (
                        <a key={label} href="#" className="text-xs text-slate-600 hover:text-slate-400 no-underline transition-colors">
                            {label}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
};