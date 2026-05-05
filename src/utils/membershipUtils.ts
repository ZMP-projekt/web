export const calculateProgress = (endDateString: string): number => {
    const end = new Date(endDateString);
    const start = new Date(endDateString);
    start.setMonth(start.getMonth() - 1);
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const passed = now.getTime() - start.getTime();
    const pct = (passed / total) * 100;
    return 100 - Math.min(100, Math.max(0, pct));
};