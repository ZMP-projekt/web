import {Globe} from "lucide-react";
import {useTranslation} from "react-i18next";

export const LanguageButton = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'pl' ? 'en' : 'pl';
        void i18n.changeLanguage(newLang);
    }

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 p-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700"
        >
            <Globe className="w-4 h-4" />
            <span>{i18n.language.toUpperCase()}</span>
        </button>
    )
}