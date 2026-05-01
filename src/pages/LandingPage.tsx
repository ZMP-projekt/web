import React, { useState, useEffect, useRef } from "react";
import {Link} from "react-router";
import {
    BicepsFlexedIcon,
    CalendarDays, Dumbbell,
    Flame,
    Leaf,
    MapPin,
    MoveRight,
    Navigation,
    Smartphone,
    Trophy
} from "lucide-react";
import {LanguageButton} from "../components/LanguageButton.tsx";
import {useTranslation} from "react-i18next";

interface NavLink {
    label: string;
    href: string;
}

interface Stat {
    value: string;
    label: string;
}

interface PricingPlan {
    title: string;
    price: string;
    features: string[];
    popular: boolean;
}



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
    const { t } = useTranslation(['landing_page', 'common']);

    const NAV_LINKS: NavLink[] = [
        { label: t('about'), href: "#about" },
        { label: t('classes'), href: "#classes" },
        { label: t('pricing'), href: "#pricing" },
        { label: t('locations'), href: "/locations" },
    ];

    const STATS: Stat[] = [
        { value: "1 200+", label: t('active_members') },
        { value: "30", label: t('locations_count') },
        { value: "Top", label: t('certified_coaches') },
        { value: "40+", label: t('classes_per_week') },
    ];

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
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg display"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
                    ><Dumbbell className="w-6 h-6" /></div>
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
                    <LanguageButton />
                    <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium no-underline transition-colors">
                        {t('common:log_in')}
                    </Link>
                    <Link
                        to="/register"
                        className="text-white text-sm flex items-center gap-2 font-bold no-underline px-5 py-2 rounded-xl transition-opacity hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                    >
                        {t('join_now')} <MoveRight className="w-3 h-3" />
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

                    <h1 className="hero-title display text-white mb-8" style={{ fontSize: "clamp(72px, 12vw, 160px)", lineHeight: 0.9 }}>
                        {t('hero.word1')}<br />
                        <span style={{ WebkitTextStroke: "2px #3B82F6", color: "transparent" }}>{t('hero.word2')}</span><br />
                        <span style={{ background: "linear-gradient(90deg, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t('hero.word3')}</span>
                    </h1>
                    <h1 className="hero-title display text-white mb-12" style={{ fontSize: "clamp(72px, 12vw, 160px)", lineHeight: 0.9 }}>
                        {t('hero.word4')}
                    </h1>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2.5 text-white font-bold text-base no-underline px-8 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
                            style={{ background: "#3B82F6", boxShadow: "0 8px 32px rgba(59,130,246,0.35)" }}
                        >
                            {t('start_free_btn')} <MoveRight />
                        </Link>
                        <Link
                            to="#pricing"
                            className="inline-flex items-center text-slate-200 font-semibold text-base no-underline px-8 py-4 rounded-2xl border transition-all hover:bg-white/10"
                            style={{ background: "rgba(226,232,240,0.06)", borderColor: "rgba(226,232,240,0.12)" }}
                        >
                            {t('check_pricing_btn')}
                        </Link>
                    </div>
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

            <section id="about" ref={registerRef("about")} className="py-24 px-8">
                <div className="about-grid max-w-300 mx-auto grid grid-cols-2 gap-20 items-center">

                    <div className={`fade-up ${visibleSections["about"] ? "visible" : ""}`}>
                        <div className="text-xs font-bold tracking-[0.16em] text-blue-500 uppercase mb-4">{t('about')}</div>
                        <h2 className="display text-white mb-6" style={{ fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 0.95 }}>
                            {t('title1')}<br />{t('title2')}
                        </h2>
                        <p className="text-slate-400 leading-relaxed text-base mb-6">
                            {t('description_1')}
                        </p>
                        <p className="text-slate-500 leading-relaxed text-sm">
                            {t('description_2')}
                        </p>
                        <div className="flex gap-8 mt-10">
                            {([t('gym'), "Cardio", "Spa & Sauna"] as const).map((s, i) => (
                                <div key={s}>
                                    <div className="text-sm font-bold text-white">{s}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{[t('premium_equipment'), t('full_zone'), t('vip_zone')][i]}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`fade-up stagger-2 ${visibleSections["about"] ? "visible" : ""}`}>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                {
                                    icon: <MapPin className="w-8 h-8" />,
                                    title: t('locations_number'),
                                    desc: t('locations_desc'),
                                    color: "#3B82F6"
                                },
                                {
                                    icon: <CalendarDays className="w-8 h-8" />,
                                    title: t('flexible_plan'),
                                    desc: t('booking_desc'),
                                    color: "#8B5CF6"
                                },
                                {
                                    icon: <Trophy className="w-8 h-8" />,
                                    title: t('top_coaches'),
                                    desc: t('coaches_desc'),
                                    color: "#10B981"
                                },
                                {
                                    icon: <Smartphone className="w-8 h-8" />,
                                    title: t('mobile_app'),
                                    desc: t('app_desc'),
                                    color: "#F59E0B"
                                },
                            ].map((card, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl p-6 border transition-all duration-300 cursor-default group"
                                    style={{ background: "rgba(30,41,59,0.6)", borderColor: "rgba(226,232,240,0.07)" }}
                                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.borderColor = card.color + "55")}
                                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.borderColor = "rgba(226,232,240,0.07)")}
                                >
                                    <div className="w-fit mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" style={{ color: card.color }}>
                                        {card.icon}
                                    </div>
                                    <div className="text-sm font-bold text-white mb-1.5">{card.title}</div>
                                    <div className="text-xs text-slate-500 leading-relaxed">{card.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            <section
                id="classes"
                ref={registerRef("classes")}
                className="py-24 px-8 border-t border-b border-white/5"
                style={{ background: "rgba(15,23,42,0.8)" }}
            >
                <div className="max-w-300 mx-auto">
                    <div className={`fade-up ${visibleSections["classes"] ? "visible" : ""} text-center mb-16`}>
                        <div className="text-xs font-bold tracking-[0.16em] uppercase mb-3" style={{ color: "#8B5CF6" }}>
                            {t('path_to_goal')}
                        </div>
                        <h2 className="display text-white" style={{ fontSize: "clamp(36px, 4vw, 60px)", lineHeight: 1 }}>
                            {t('find_rhythm')}
                        </h2>
                        <p className="text-slate-400 mt-4 text-base max-w-125 mx-auto">
                            {t('description')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 items-center gap-6 mb-12">
                        {[
                            {
                                icon: <BicepsFlexedIcon className="w-10 h-10" />, title: t('strength'),
                                desc: t('strength_desc'),
                                color: "#3B82F6"
                            },
                            {
                                icon: <Flame className="w-10 h-10 text-amber-500" />, title: t('cardio'),
                                desc: t('cardio_desc'),
                                color: "#F59E0B"
                            },
                            {
                                icon: <Leaf className="w-10 h-10 text-emerald-600" />, title: t('mind_body'),
                                desc: t('mind_body_desc'),
                                color: "#8B5CF6"
                            }
                        ].map((type, i) => (
                            <div
                                key={i}
                                className={`fade-up stagger-${i + 2} ${visibleSections["classes"] ? "visible" : ""} flex flex-col items-center text-center relative p-8 rounded-3xl border transition-transform hover:-translate-y-2`}
                                style={{ background: "rgba(30,41,59,0.5)", borderColor: "rgba(226,232,240,0.07)" }}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: type.color }} />
                                <div className="text-4xl mb-6">{type.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{type.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{type.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className={`fade-up stagger-5 ${visibleSections["classes"] ? "visible" : ""} text-center`}>
                        <Link
                            to="/public/schedule"
                            className="inline-flex items-center gap-2 text-white font-bold no-underline px-8 py-4 rounded-2xl border transition-all hover:bg-slate-800"
                            style={{ background: "rgba(30,41,59,0.8)", borderColor: "rgba(226,232,240,0.12)" }}
                        >
                            {t('check_schedule_btn')} <MoveRight className="text-[#3B82F6]" />
                        </Link>
                    </div>
                </div>
            </section>

            <section id="pricing" ref={registerRef("pricing")} className="py-24 px-8">
                <div className="max-w-300 mx-auto">
                    <div className={`fade-up ${visibleSections["pricing"] ? "visible" : ""} text-center mb-16`}>
                        <div className="text-xs font-bold tracking-[0.16em] text-blue-500 uppercase mb-3">{t('title_memberships')}</div>
                        <h2 className="display text-white" style={{ fontSize: "clamp(36px, 4vw, 60px)" }}>{t('choose_plan')}</h2>
                        <p className="text-slate-500 mt-3 text-sm">{t('transparent_desc')}</p>
                    </div>

                    <div className="pricing-grid grid grid-cols-3 gap-6 max-w-225 mx-auto">
                        {PRICING.map((plan, i) => (
                            <div
                                key={i}
                                className={`price-card fade-up stagger-${i + 1} ${visibleSections["pricing"] ? "visible" : ""} relative rounded-3xl p-9`}
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
                                        {t('most_popular')}
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
                                    {t('select_plan_btn')}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="locations"
                ref={registerRef("locations")}
                className="py-24 px-8 border-t border-white/5"
                style={{ background: "rgba(15,23,42,0.6)" }}
            >
                <div className="text-center mt-12">
                    <a
                        href="/locations"
                        className="inline-flex items-center gap-2 bg-blue-500 px-8 py-4 rounded-2xl font-bold text-white hover:bg-blue-600 transition-all"
                    >
                        {t('find_club')} <Navigation className="w-5 h-5" />
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
                        {t('transformation_part1')}<br />
                        <span style={{ background: "linear-gradient(90deg, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {t('transformation_part2')}
                        </span>
                    </div>
                    <p className="text-slate-400 text-base leading-relaxed max-w-125 mx-auto mb-10">
                        {t('join_desc')}
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-3 text-white font-black text-lg no-underline px-10 py-5 rounded-2xl tracking-wide transition-all hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)", boxShadow: "0 8px 40px rgba(59,130,246,0.4)" }}
                    >
                        {t('start_free_cta')} <MoveRight />
                    </Link>
                    <p className="text-xs text-slate-700 mt-5 tracking-wider">
                        {t('guarantees')}
                    </p>
                </div>
            </section>

            <footer className="border-t border-white/5 py-8 px-8 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm display"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
                    ><Dumbbell className="w-4 h-4"/></div>
                    <span className="font-bold text-sm text-slate-200">GymSystem</span>
                </div>
                <p className="text-xs text-slate-700">© 2026 GymSystem</p>
            </footer>
        </div>
    );
};