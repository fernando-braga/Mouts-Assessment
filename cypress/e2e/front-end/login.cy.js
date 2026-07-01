import UtilsPage from "../pages/Utils";

describe('Login', () => {
    const utils = new UtilsPage();
    let user;

    before(() => {
        cy.log('Creating admin user for login tests')
        user = utils.setupAdminUser();
    });

    beforeEach(() => {
        cy.visit('/login');
    });

    it('should login successfully with valid credentials', () => {
        cy.log(`Attempting login with: ${user.email}`)
        utils.login(user.email, user.password);
        cy.log(`Asserting redirect to home and welcome message for: ${user.nome}`)
        cy.url().should('include', 'admin/home');
        cy.contains(`Bem Vindo ${user.nome}`).should('be.visible');
    });

    it('should display error with invalid credentials', () => {
        cy.log('Attempting login with invalid credentials')
        utils.login('invalid@email.com', 'wrongpassword');
        cy.log('Asserting error message is visible')
        cy.contains('Email e/ou senha inválidos').should('be.visible');
    });

    it('should logout successfully', () => {
        cy.log(`Logging in as: ${user.email}`)
        utils.login(user.email, user.password);
        cy.log('Logging out')
        utils.logOut();
        cy.log('Asserting redirect to login page')
        cy.url().should('include', '/login');
    });
});