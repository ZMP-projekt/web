import React, { useState, useEffect } from 'react';
import { useAuth } from "../auth/useAuth.ts";
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import { User, Mail, Camera, Edit2, Save, X, Loader2, AlertCircle } from 'lucide-react';
import toast from "react-hot-toast";

interface ProfileData {
    firstName: string;
    lastName: string;
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
        specialization: '',
        bio: '',
        photoUrl: ''
    });

    const apiEndpoint = role === 'ROLE_TRAINER' ? '/api/trainers/me' : '/user/profile';
    const isTrainer = role === 'ROLE_TRAINER';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiPrivate.get(apiEndpoint);
                setProfile(response.data);
                setFormData(response.data);
            } catch (err) {
                console.warn('Profil nie istnieje (lub backend zwrócił 403). Inicjalizowanie pustego profilu.', err);
                const emptyProfile = { firstName: '', lastName: '', specialization: '', bio: '', photoUrl: '' };
                setProfile(emptyProfile);
                setFormData(emptyProfile);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
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
            setError('Wystąpił błąd podczas zapisywania zmian. Upewnij się, że wypełniłeś wszystkie wymagane pola.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-10 h-10 animate-spin text-[#3B82F6]" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-slate-700 border-4 border-slate-800 overflow-hidden flex items-center justify-center relative z-10">
                        {formData.photoUrl ? (
                            <img src={formData.photoUrl} alt="Profil" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-slate-500" />
                        )}
                    </div>
                    {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-[#3B82F6] p-2 rounded-full text-white hover:bg-blue-600 transition-colors z-20 shadow-lg">
                            <Camera className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {profile?.firstName || profile?.lastName ? `${profile.firstName} ${profile.lastName}` : 'Nieznajomy'}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                        <Mail className="w-4 h-4" />
                        <span>{'trainer@example.com'}</span>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-700/50 text-xs font-bold text-slate-300">
              {isTrainer ? 'TRENER' : 'KLIENT'}
            </span>
                    </div>
                </div>

                <div className="z-10">
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
                            <Edit2 className="w-4 h-4" /> Edytuj profil
                        </button>
                    ) : (
                        <button onClick={() => { setIsEditing(false); setFormData(profile || formData); }} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-5 py-2.5 rounded-xl font-medium transition-colors">
                            <X className="w-4 h-4" /> Anuluj
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">Dane szczegółowe</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Imię" name="firstName" value={formData.firstName} isEditing={isEditing} onChange={handleChange} />
                    <InputField label="Nazwisko" name="lastName" value={formData.lastName} isEditing={isEditing} onChange={handleChange} />

                    {isTrainer && (
                        <>
                            <div className="md:col-span-2">
                                <InputField label="Specjalizacja (np. Trening siłowy, Joga)" name="specialization" value={formData.specialization || ''} isEditing={isEditing} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Biogram (O mnie)</label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio || ''}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all resize-none"
                                        placeholder="Napisz kilka słów o swoim doświadczeniu..."
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-slate-900/20 border border-transparent rounded-xl text-white min-h-25">
                                        {formData.bio || <span className="text-slate-500 italic">Brak biogramu.</span>}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {isEditing && (
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-70"
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
        <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
        {isEditing ? (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
                placeholder={`Wprowadź ${label.toLowerCase()}`}
            />
        ) : (
            <div className="w-full px-4 py-3 bg-slate-900/20 border border-transparent rounded-xl text-white font-medium">
                {value || <span className="text-slate-500 italic">Brak danych</span>}
            </div>
        )}
    </div>
);