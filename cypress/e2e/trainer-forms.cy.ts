describe('Panel Trenera - Tworzenie zajęć', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');
        cy.env(['testTrainerEmail', 'testTrainerPassword']).then((s) => {
            cy.get('input[name="email"]').type(s.testTrainerEmail);
            cy.get('input[name="password"]').type(`${s.testTrainerPassword}{enter}`);
        });
        cy.contains('Grafik').click();
        cy.url().should('include', '/trainer/schedule');
    });

    it('7. Powinno uniemożliwić wysłanie formularza z pustą nazwą zajęć', () => {
        cy.contains('button', 'Dodaj').click();
        cy.get('textarea[name="description"]').type('Super fajne zajęcia interwałowe');
        cy.contains('button', 'Utwórz zajęcia').click();
        cy.contains('Utwórz zajęcia', { matchCase: false }).should('be.visible');
    });

    it('8. Powinno zamknąć modal po kliknięciu "Anuluj" bez zapisywania danych', () => {
        cy.contains('button', 'Dodaj').click();
        cy.contains('Utwórz zajęcia', { matchCase: false }).should('be.visible');
        cy.get('textarea[name="description"]').type('Rozmyśliłem się');
        cy.get('svg.lucide-x').last().click();
        cy.contains('Utwórz zajęcia', { matchCase: false }).should('not.exist');
    });
});