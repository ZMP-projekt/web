describe('Lokalizacje', () => {
    it('9. Powinno załadować listę klubów z prawdziwego API', () => {
        cy.intercept('GET', '**/api/locations').as('pobierzKluby');
        cy.visit('http://localhost:5173/locations');
        cy.wait('@pobierzKluby');
        cy.get('h1').should('be.visible');
    });

    it('10. Powinno wyświetlać przycisk nawigacji na ekranach mobilnych', () => {
        cy.viewport('iphone-x');
        cy.visit('http://localhost:5173/locations');
        cy.contains('Pokaż listę').click();
        cy.get('.rounded-2xl').first().click();
        cy.get('svg').should('exist');
    });
});