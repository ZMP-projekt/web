describe('Nawigacja i zmiana języka (E2E)', () => {

  beforeEach(() => {
    cy.viewport('macbook-13');
    cy.visit('http://localhost:5173');
  });

  it('powinno poprawnie zmienić język aplikacji po kliknięciu', () => {
    cy.contains('Zaloguj').should('be.visible');
    cy.contains('button', 'PL').click();
    cy.contains('Log in').should('be.visible');
    cy.contains('button', 'EN').click();
    cy.contains('Zaloguj').should('be.visible');
  });

  it('powinno poprawnie przenieść użytkownika do formularza logowania', () => {
    cy.contains('Zaloguj').click();
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').should('be.visible');
  });
});