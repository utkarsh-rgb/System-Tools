describe('Dashboard Page Access', () => {
  it('logs in and accesses dashboard', () => {
    cy.login('utkarshh', '12345678'); // ✅ Reusing the login command
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('exist');
  });
});
