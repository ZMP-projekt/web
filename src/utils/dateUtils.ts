import i18n from "../i18n.ts";

export const formatDuration = (start: string, end: string): string => {
    const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60} min` : ''}`.trim() : `${mins} min`;
};

export const calculateDaysRemaining = (endDateString: string): number => {
    const diffTime = Math.max(new Date(endDateString).getTime() - new Date().getTime(), 0);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatTime = (iso: string): string =>
    new Date(iso).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });

export const isToday = (dateStr: string): boolean =>
    dateStr === new Date().toISOString().split('T')[0];

export const generateNext7Days = (offset: number): string[] => {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i + offset);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
};