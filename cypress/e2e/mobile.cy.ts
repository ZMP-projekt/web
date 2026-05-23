describe('Nawigacja mobilna (E2E)', () => {

    beforeEach(() => {
        cy.viewport('iphone-x');
        cy.visit('http://localhost:5173');
    });

    it('powinno otworzyć menu hamburgerowe i przejść do formularza logowania', () => {
        cy.get('nav').contains('Zaloguj').should('not.be.visible');
        cy.get('button[aria-label="Menu"]').should('be.visible').click();
        cy.get('[data-cy="mobile-login-btn"]').should('be.visible').click();
        cy.url().should('include', '/login');
        cy.get('input[name="email"]').should('be.visible');
    });
});