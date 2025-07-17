// cypress/e2e/userorders.cy.js

describe('User Orders Test', () => {
  beforeEach(() => {
    cy.login('utkarshh', '12345678');
  });

  it('shows user orders page', () => {
    cy.visit('/dashboard/userorders/utkarshh');
    cy.contains('Your Orders').should('exist');
  });
});