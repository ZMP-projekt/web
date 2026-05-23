describe('Przepływ logowania i pobierania danych (E2E)', () => {

    beforeEach(() => {
        cy.viewport('macbook-13');
    });
    it('powinno zablokować wysłanie pustego formularza (walidacja frontendowa)', () => {
        cy.visit('http://localhost:5173/login');
        cy.contains('button', 'Zaloguj').click();
        cy.url().should('include', '/login');
    });

    it('powinno odrzucić niepoprawny format adresu email', () => {
        cy.visit('http://localhost:5173/login');
        cy.get('input[name="email"]').type('to-nie-jest-email');
        cy.get('input[name="password"]').type('jakieshaslo');
        cy.contains('button', 'Zaloguj').click();
        cy.url().should('include', '/login');
    });

    it('powinno wyświetlić błąd z serwera przy błędnych danych logowania', () => {
        cy.intercept('POST', '*login*').as('probaLogowania');
        cy.visit('http://localhost:5173/login');
        cy.get('input[name="email"]').type('nieistnieje@gym.pl');
        cy.get('input[name="password"]').type('zlehaslo123');
        cy.contains('button', 'Zaloguj').click();
        cy.wait('@probaLogowania').its('response.statusCode').should('be.oneOf', [401, 403, 404]);
        cy.contains('Niepoprawny').should('be.visible');
        cy.url().should('include', '/login');
    });
    it('powinno zalogować użytkownika i poprawnie załadować dane z API', () => {
        cy.intercept('GET', '**/api/**').as('pobieranieDanych');
        cy.visit('http://localhost:5173/login');
        cy.env(['testUserEmail', 'testUserPassword']).then((secrets) => {
            cy.get('input[name="email"]')
                .should('be.visible')
                .type(secrets.testUserEmail);
            cy.get('input[name="password"]')
                .type(`${secrets.testUserPassword}{enter}`);
        });
        cy.url().should('include', '/dashboard');
        cy.wait('@pobieranieDanych').its('response.statusCode').should('be.oneOf', [200, 304]);
        cy.contains('Wyloguj').should('be.visible');
    });
});