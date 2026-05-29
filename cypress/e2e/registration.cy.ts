describe('Rejestracja - Walidacja i Błędy', () => {
    it('1. Powinno zablokować rejestrację, gdy hasło jest puste', () => {
        cy.visit('http://localhost:5173/register');
        cy.get('input[name="firstName"]').type('Jan');
        cy.get('input[name="lastName"]').type('Kowalski');
        cy.get('input[name="email"]').type('jan@test.pl');

        cy.get('input[name="password"]').should('match', ':invalid');
        cy.get('input[name="password"]')
            .invoke('prop', 'validationMessage')
            .should('not.be.empty');
    });

    it('2. Powinno obsłużyć błąd serwera (403) i wyświetlić ogólny komunikat', () => {
        cy.intercept('POST', '**/auth/register', { statusCode: 403 }).as('bladRejestracji');

        cy.visit('http://localhost:5173/register');
        cy.get('input[name="firstName"]').type('Jan');
        cy.get('input[name="lastName"]').type('Kowalski');
        cy.get('input[name="email"]').type('ktokolwiek@gym.pl');
        cy.get('input[name="password"]').type('qwertyuiop');
        cy.contains('button', 'Utwórz konto').click();

        cy.wait('@bladRejestracji');
        cy.contains('Błąd rejestracji', { matchCase: false }).should('be.visible');
    });
});