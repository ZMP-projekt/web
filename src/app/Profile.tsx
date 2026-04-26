import React, { useState, useEffect } from 'react';
import { useAuth } from "../auth/useAuth.ts";
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import { User, Mail, Edit2, Save, X, Loader2, AlertCircle, Link as LinkIcon } from 'lucide-react';
import toast from "react-hot-toast";

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    specialization?: string;
    bio?: string;
    photoUrl?: string;
}

export const Profile: React.FC = () => {
    const { role } = useAuth();
    const apiPrivate = useAxiosPrivate();

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        specialization: '',
        bio: '',
        photoUrl: ''
    });

    const isTrainer = role === 'ROLE_TRAINER';
    const apiEndpoint = isTrainer ? '/api/trainers/me' : '/api/users/me';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiPrivate.get(apiEndpoint);
                setProfile(response.data);
                setFormData(response.data);
            } catch (err) {
                console.warn('Profil nie istnieje lub błąd pobierania.', err);
                const emptyProfile = { firstName: '', lastName: '', email: '', specialization: '', bio: '', photoUrl: '' };
                setProfile(emptyProfile);
                setFormData(emptyProfile);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProfile();
    }, [apiEndpoint, apiPrivate]);

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        try {
            await apiPrivate.put(apiEndpoint, formData);
            setProfile(formData);
            setIsEditing(false);
            toast.success('Profil został zaktualizowany!');
        } catch (err) {
            console.error('Błąd zapisu profilu:', err);
            setError('Wystąpił błąd podczas zapisywania zmian. Upewnij się, że wpisane dane są poprawne.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-32 h-32 rounded-full bg-slate-700 border-4 border-slate-800 overflow-hidden flex items-center justify-center relative z-10 shrink-0 shadow-xl">
                    {formData.photoUrl ? (
                        <img
                            src={formData.photoUrl}
                            alt="Profil"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <User className="w-12 h-12 text-slate-500" />
                    )}
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {profile?.firstName || profile?.lastName
                            ? `${profile.firstName} ${profile.lastName}`
                            : 'Profil Użytkownika'}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4" />
                            {profile?.email || 'Brak adresu e-mail'}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border
                            'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        `}>
                            {isTrainer ? 'Trener' : 'Klient'}
                        </span>
                    </div>
                </div>

                {isTrainer && (
                    <div className="z-10 shrink-0 mt-4 md:mt-0">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-bold transition-colors">
                                <Edit2 className="w-4 h-4" /> Edytuj profil
                            </button>
                        ) : (
                            <button onClick={() => { setIsEditing(false); setFormData(profile || formData); }} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-5 py-2.5 rounded-xl font-bold transition-colors">
                                <X className="w-4 h-4" /> Anuluj
                            </button>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">
                    {isEditing ? 'Edycja danych' : 'Dane szczegółowe'}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Imię" name="firstName" value={formData.firstName} isEditing={isEditing} onChange={handleChange} />
                    <InputField label="Nazwisko" name="lastName" value={formData.lastName} isEditing={isEditing} onChange={handleChange} />

                    {isTrainer && (
                        <>
                            {isEditing && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                        Link do zdjęcia (URL)
                                    </label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="url"
                                            name="photoUrl"
                                            value={formData.photoUrl || ''}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-600"
                                            placeholder="https://example.com/moje-zdjecie.jpg"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Wklej bezpośredni link do obrazka (np. z LinkedIn lub hostingu zdjęć).</p>
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <InputField label="Specjalizacja" name="specialization" value={formData.specialization || ''} isEditing={isEditing} onChange={handleChange} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Biogram (O mnie)</label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio || ''}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none placeholder:text-slate-600"
                                        placeholder="Napisz kilka słów o swoim doświadczeniu..."
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-slate-900/20 border border-slate-700/50 rounded-xl text-slate-300 min-h-24 leading-relaxed">
                                        {formData.bio || <span className="text-slate-500 italic">Brak biogramu.</span>}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {isEditing && (
                    <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 text-white font-bold rounded-xl transition-all disabled:opacity-70"
                            style={{ background: 'linear-gradient(135deg, #3B82F6, #6D28D9)', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const InputField = ({ label, name, value, isEditing, onChange }: { label: string, name: string, value: string, isEditing: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{label}</label>
        {isEditing ? (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-600"
                placeholder={`Wprowadź ${label.toLowerCase()}`}
            />
        ) : (
            <div className="w-full px-4 py-3 bg-slate-900/20 border border-slate-700/50 rounded-xl text-white font-medium">
                {value || <span className="text-slate-500 italic">Brak danych</span>}
            </div>
        )}
    </div>
);