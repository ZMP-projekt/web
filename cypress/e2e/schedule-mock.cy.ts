describe('Grafik - Symulacja danych z API', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');
        cy.env(['testUserEmail', 'testUserPassword']).then((s) => {
            cy.get('input[name="email"]').type(s.testUserEmail);
            cy.get('input[name="password"]').type(`${s.testUserPassword}{enter}`);
        });
        cy.url().should('include', '/dashboard');
    });

    it('3. Powinno wyświetlić komunikat o braku zajęć (Pusta tablica z API)', () => {
        cy.intercept('GET', '**/api/classes/by-date*', { statusCode: 200, body: [] }).as('pustyGrafik');
        cy.visit('http://localhost:5173/schedule');
        cy.wait('@pustyGrafik');
        cy.contains('Brak zajęć w tym dniu', { matchCase: false }).should('be.visible');
    });

    it('4. Powinno obsłużyć awarię serwera i nie zablokować interfejsu (Error Boundary/Fallback)', () => {
        cy.intercept('GET', '**/api/classes/by-date*', { statusCode: 500 }).as('awariaSerwera');
        cy.visit('http://localhost:5173/schedule');
        cy.wait('@awariaSerwera');
        cy.get('.animate-pulse').should('not.exist');
        cy.get('svg.lucide-arrow-left').should('exist');
    });

    it('5. Powinno otworzyć główny modal ze szczegółami zajęć', () => {
        cy.intercept('GET', '**/api/classes/by-date*', { statusCode: 200, body: [{
                "address": "ul. Złotoryjska 30",
                "city": "Legnica",
                "currentParticipants": 0,
                "description": "test",
                "endTime": "2026-05-29T20:00:00",
                "id": 163,
                "latitude": 51.207,
                "locationName": "Well Fitness - Galeria Gwarna",
                "longitude": 16.155,
                "maxParticipants": 15,
                "name": "test",
                "personalTraining": false,
                "startTime": "2026-05-29T19:00:00",
                "trainerName": "Alan Kamiński",
                "userEnrolled": false
            }] }).as('testSchedule');
        cy.visit('http://localhost:5173/schedule');
        cy.wait('@testSchedule');
        cy.get('.rounded-3xl').contains('test').last().click({ force: true });
        cy.contains('Lokalizacja', { matchCase: false }).should('be.visible');
    });

    it('6. Powinno zamknąć modal po kliknięciu w X', () => {
        cy.intercept('GET', '**/api/classes/by-date*', { statusCode: 200, body: [{
                "address": "ul. Wolności 15",
                "city": "Chojnów",
                "currentParticipants": 0,
                "description": "Fitness dla zaawansowanych",
                "endTime": "2026-05-27T10:45:00",
                "id": 160,
                "latitude": 51.265,
                "locationName": "Strefa Ruchu Chojnów",
                "longitude": 15.93,
                "maxParticipants": 9,
                "name": "test",
                "personalTraining": false,
                "startTime": "2026-05-27T10:00:00",
                "trainerName": "Marcin Norman",
                "userEnrolled": false
            }] }).as('testSchedule');
        cy.visit('http://localhost:5173/schedule');
        cy.wait('@testSchedule');
        cy.get('.rounded-3xl').contains('test').last().click({ force: true });
        cy.get('svg.lucide-circle-x').closest('button').click();
        cy.contains('Lokalizacja', { matchCase: false }).should('not.exist');
    });
});