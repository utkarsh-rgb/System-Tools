
describe('Login Page Tests', () => {
  it('logs in successfully as user', () => {
    cy.login('utkarshh', '12345678');
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('exist');
  });

  it('shows error for invalid credentials', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('wronguser');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid username or password').should('exist');
  });
});