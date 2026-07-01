import UtilsPage from "../pages/Utils";
import RegisterProductPage from "../pages/registerProducts";

describe('Register Product', () => {
    const utils = new UtilsPage();
    const registerProduct = new RegisterProductPage();
    let user;

    before(() => {
        cy.log('Creating admin user for product registration tests')
        user = utils.setupAdminUser();
    });

    beforeEach(() => {
        cy.visit('/login');
        utils.login(user.email, user.password);
    });

    it('should register a product successfully', () => {
        const product = utils.generateProduct();
        cy.log(`Registering product: ${product.nome} | Price: ${product.preco}`)
        registerProduct.registerProduct(product);
        cy.log('Asserting redirect to product list page')
        cy.url().should('include', '/admin/listarprodutos');
    });

    it('should display error when required fields are empty', () => {
        cy.log('Attempting to register product without filling required fields')
        registerProduct.elements.cadastrarProdutoPageBtn().click();
        registerProduct.elements.cadastrarProdutoBtn().click();
        cy.log('Asserting all required field error messages are visible')
        cy.contains('Nome é obrigatório').should('be.visible');
        cy.contains('Preco é obrigatório').should('be.visible');
        cy.contains('Descricao é obrigatório').should('be.visible');
        cy.contains('Quantidade é obrigatório').should('be.visible');
    });
});