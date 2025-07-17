// cypress/e2e/cart.cy.js

describe('Cart Page Test', () => {
  beforeEach(() => {
    cy.login('utkarshh', '12345678');
  });

  it('accesses cart page', () => {
    cy.visit('/dashboard/cart');
    cy.contains('Your Cart').should('exist');
  });
});