import { describe, it, expect } from 'vitest';
import { calculateMapCenter } from './mapUtils';

describe('Logika Mapy (mapUtils)', () => {
    it('powinno poprawnie wyliczyć środek z kilku lokalizacji', () => {
        const mockLocations = [
            { latitude: 50.0, longitude: 20.0 },
            { latitude: 52.0, longitude: 22.0 }
        ];
        const result = calculateMapCenter(mockLocations);

        expect(result.lat).toBe(51.0);
        expect(result.lng).toBe(21.0);
    });

    it('powinno zwrócić 0, 0 dla pustej tablicy (zabezpieczenie przed dzieleniem przez 0)', () => {
        const result = calculateMapCenter([]);
        expect(result.lat).toBe(0);
        expect(result.lng).toBe(0);
    });
});