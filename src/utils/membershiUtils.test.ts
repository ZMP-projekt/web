import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateProgress } from './membershipUtils';

describe('Logika Karnetów (membershipUtils)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('powinno zwrócić 50% postępu, gdy minęła połowa miesiąca', () => {
        // Ustawiamy środek miesiąca (15 maja)
        vi.setSystemTime(new Date('2026-05-15T12:00:00Z'));

        // Karnet wygasa 30 maja (czyli zaczął się 30 kwietnia)
        // 15 maja to dokładnie połowa tego czasu
        const result = calculateProgress('2026-05-30T12:00:00Z');

        // Spodziewamy się, że zostało około 50% paska (+/- małe różnice przez ilość dni w maju)
        expect(result).toBeGreaterThan(45);
        expect(result).toBeLessThan(55);
    });

    it('powinno zwrócić 0% dla wygasłego karnetu', () => {
        vi.setSystemTime(new Date('2026-06-05T12:00:00Z')); // Jest czerwiec
        const result = calculateProgress('2026-05-30T12:00:00Z'); // Karnet wygasł w maju
        expect(result).toBe(0);
    });
});