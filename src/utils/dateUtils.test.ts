// src/utils/dateUtils.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    formatDuration,
    calculateDaysRemaining,
    formatTime,
    isToday,
    generateNext7Days
} from './dateUtils';

describe('Narzędzia do obsługi dat (dateUtils)', () => {

    // Przed KAŻDYM testem ustawiamy "sztuczny" czas na 5 maja 2026, godz. 12:00
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-05-05T12:00:00Z'));
    });

    // Po KAŻDYM teście przywracamy normalny zegar komputera
    afterEach(() => {
        vi.useRealTimers();
    });

    describe('formatTime()', () => {
        it('powinno poprawnie sformatować czas z ISO na format HH:MM', () => {
            const result = formatTime('2026-05-05T08:05:00');
            expect(result).toBe('08:05');
        });

        it('powinno poprawnie radzić sobie z godzinami popołudniowymi', () => {
            const result = formatTime('2026-05-05T18:30:00');
            expect(result).toBe('18:30');
        });
    });

    describe('isToday()', () => {
        it('powinno zwrócić true dla dzisiejszej daty', () => {
            // Ponieważ zamroziliśmy czas na 2026-05-05, ta funkcja musi zwrócić true
            expect(isToday('2026-05-05')).toBe(true);
        });

        it('powinno zwrócić false dla innej daty', () => {
            expect(isToday('2026-05-06')).toBe(false);
        });
    });

    describe('generateNext7Days()', () => {
        it('powinno wygenerować dokładnie 7 dni', () => {
            const days = generateNext7Days(0);
            expect(days.length).toBe(7);
        });

        it('z offsetem 0 powinno zacząć się od dzisiaj', () => {
            const days = generateNext7Days(0);
            expect(days[0]).toBe('2026-05-05'); // Pierwszy element to nasza zamrożona data
            expect(days[1]).toBe('2026-05-06'); // Kolejny dzień
        });

        it('z offsetem 7 powinno zacząć się za tydzień', () => {
            const days = generateNext7Days(7);
            expect(days[0]).toBe('2026-05-12'); // 5 maja + 7 dni
        });
    });

    // Zostawiamy nasze poprzednie testy, które teraz będą w 100% niezawodne!
    describe('formatDuration()', () => {
        it('powinno zwrócić same minuty dla zajęć krótszych niż godzina', () => {
            expect(formatDuration('2026-05-05T10:00:00', '2026-05-05T10:45:00')).toBe('45 min');
        });

        it('powinno zwrócić pełne godziny i minuty', () => {
            expect(formatDuration('2026-05-05T10:00:00', '2026-05-05T11:30:00')).toBe('1h 30 min');
        });
    });

    describe('calculateDaysRemaining()', () => {
        it('powinno poprawnie obliczyć dni w przyszłości', () => {
            expect(calculateDaysRemaining('2026-05-10T12:00:00Z')).toBe(5); // 10 maja to 5 dni od 5 maja
        });

        it('powinno zwrócić 0 dla daty z przeszłości', () => {
            expect(calculateDaysRemaining('2026-05-01T12:00:00Z')).toBe(0);
        });
    });
});