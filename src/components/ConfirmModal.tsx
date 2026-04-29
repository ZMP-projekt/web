import { AlertTriangle } from 'lucide-react';
import {useTranslation} from "react-i18next";

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel } : {isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void}) => {
    const { t } = useTranslation('common');
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-sm shadow-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/20 rounded-full text-red-500">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <p className="text-slate-400 text-sm mb-8">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl text-slate-300 font-medium hover:bg-slate-700 transition-colors">
                        {t('cancel')}
                    </button>
                    <button onClick={() => { onConfirm(); onCancel(); }} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/75 text-white font-bold hover:bg-red-600/75 transition-colors">
                        {t('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};