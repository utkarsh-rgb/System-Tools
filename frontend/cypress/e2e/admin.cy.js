describe('Admin Access Test', () => {
  beforeEach(() => {
    cy.login('admin_tools', 'admin'); // admin role
  });

  it('accesses admin dashboard', () => {
    cy.visit('/dashboard/admin_dashboard');
    cy.contains('Order Dashboard').should('exist');
  });
});
