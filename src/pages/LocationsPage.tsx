import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api/axios';
import { GymMap } from '../components/GymMap';
import { Search, MapPin, Clock, ChevronRight } from 'lucide-react';
import {Link} from "react-router";
import {useTranslation} from "react-i18next";

interface GymLocation {
    id: number;
    name: string;
    city: string;
    address: string;
    latitude: number;
    longitude: number;
}

export const LocationsPage: React.FC = () => {
    const [locations, setLocations] = useState<GymLocation[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activePin, setActivePin] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation('map');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await api.get('/api/locations');
                const rawLocations: GymLocation[] = response.data;
                const uniqueLocationsMap = new Map(
                    rawLocations.map((loc: GymLocation) => [loc.name, loc])
                );

                const uniqueLocations: GymLocation[] = Array.from(uniqueLocationsMap.values());
                setLocations(uniqueLocations);
            } catch (error) {
                console.error("Error while fetching locations:", error);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchLocations();
    }, []);

    const filteredLocations = useMemo(() => {
        return locations.filter(loc =>
            loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [locations, searchQuery]);
    const groupedLocations = useMemo(() => {
        const groups: Record<string, GymLocation[]> = {};
        filteredLocations.forEach(loc => {
            if (!groups[loc.city]) groups[loc.city] = [];
            groups[loc.city].push(loc);
        });
        return groups;
    }, [filteredLocations]);

    return (
        <div className="flex h-screen bg-slate-900 text-slate-200 overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <aside className="w-full md:w-100 flex flex-col border-r border-white/5 z-20 bg-slate-900 shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-slate-800/20">
                    <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <MapPin className="text-blue-500" /> {t('title')}
                    </h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center py-20 text-slate-500 italic">{t('loading_locations')}</div>
                    ) : Object.keys(groupedLocations).length > 0 ? (
                        Object.entries(groupedLocations).map(([city, cityLocs]) => (
                            <div key={city}>
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-4 px-2">{city}</h2>
                                <div className="space-y-2">
                                    {cityLocs.map((loc) => (
                                        <div
                                            key={loc.id}
                                            onClick={() => setActivePin(loc.id)}
                                            className={`group p-4 rounded-2xl cursor-pointer transition-all border ${
                                                activePin === loc.id
                                                    ? 'bg-blue-500/10 border-blue-500/40'
                                                    : 'bg-slate-800/40 border-transparent hover:border-white/10 hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{loc.name}</h3>
                                                    <p className="text-sm text-slate-400 mt-1">{loc.address}</p>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${activePin === loc.id ? 'rotate-90 text-blue-500' : 'text-slate-600'}`} />
                                            </div>

                                            {activePin === loc.id && (
                                                <div className="mt-4 pt-4 border-t border-white/5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Clock className="w-3 h-3" /> 24/7 ({t('depends_on_location')})
                                                    </div>
                                                    <button className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors">
                                                        {t('select_club_btn')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-slate-600">{t('no_clubs_found')}</div>
                    )}
                </div>
            </aside>

            <main className="hidden md:block flex-1 relative">
                <GymMap
                    locations={locations}
                    activeIndex={activePin}
                    onPinClick={(id => setActivePin(id))}
                />

                <div className="absolute top-6 right-6 z-1000">
                    <Link to={'/'} className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-slate-800 transition-all no-underline shadow-2xl">
                        ← {t('back_to_home')}
                    </Link>
                </div>
            </main>

        </div>
    );
};