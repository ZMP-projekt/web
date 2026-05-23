describe('Bezpieczeństwo Routingu i Autoryzacja Tras (RBAC)', () => {

    beforeEach(() => {
        cy.viewport('macbook-13');
    });
    it('1. Gość (niezalogowany) -> próba wejścia na pulpit', () => {
        cy.visit('http://localhost:5173/dashboard');
        cy.url().should('include', '/login');
    });

    it('2. Zwykły Użytkownik -> próba wejścia na panel trenera', () => {
        cy.visit('http://localhost:5173/login');
        cy.env(['testUserEmail', 'testUserPassword']).then((secrets) => {
            cy.get('input[name="email"]').type(secrets.testUserEmail);
            cy.get('input[name="password"]').type(`${secrets.testUserPassword}{enter}`);
        });
        cy.url().should('include', '/dashboard');
        cy.visit('http://localhost:5173/trainer/schedule');
        cy.url().should('include', '/dashboard');
    });

    it('3. Trener -> próba wejścia na panel zwykłego użytkownika', () => {
        cy.visit('http://localhost:5173/login');
        cy.env(['testTrainerEmail', 'testTrainerPassword']).then((secrets) => {
            cy.get('input[name="email"]').type(secrets.testTrainerEmail);
            cy.get('input[name="password"]').type(`${secrets.testTrainerPassword}{enter}`);
        });
        cy.url().should('include', '/trainer/dashboard');
        cy.visit('http://localhost:5173/dashboard');
        cy.url().should('include', '/trainer/dashboard');
    });

    it('4. Obsługa błędnych adresów URL (Strona 404)', () => {
        cy.visit('http://localhost:5173/bardzo-dziwny-adres-ktory-nie-istnieje-12345');
        cy.contains('404').should('be.visible');
        cy.contains('Zgubiliśmy się...').should('be.visible');
        cy.contains('Wróć do strony głównej').should('be.visible');
    });

});