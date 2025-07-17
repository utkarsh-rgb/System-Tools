
describe('Unauthorized Access Tests', () => {
  beforeEach(() => {
    cy.login('utkarshh', '12345678'); // user role
  });

  it('blocks user from admin route', () => {
    cy.visit('/dashboard/admin_dashboard');
    cy.url().should('include', '/unauthorized');
    cy.contains('Unauthorized').should('exist');
  });
});
