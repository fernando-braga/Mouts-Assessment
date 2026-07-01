import UtilsPage from "../pages/Utils";
import RegisterProductPage from "../pages/registerProducts";
import listProductPage from "../pages/listProducts";

describe('List Products', () => {
    const utils = new UtilsPage();
    const registerProduct = new RegisterProductPage();
    const listProduct = new listProductPage();
    let user;
    let product;

    before(() => {
        cy.log('Creating admin user and registering product for list tests')
        user = utils.setupAdminUser();
        product = utils.generateProduct();
        cy.visit('/login');
        utils.login(user.email, user.password);
        registerProduct.registerProduct(product);
        cy.log(`Product "${product.nome}" registered and ready for list tests`)
    });

    beforeEach(() => {
        cy.visit('/login');
        utils.login(user.email, user.password);
    });

    it('should list a created product successfully', () => {
        cy.log(`Navigating to product list`)
        listProduct.goToProductList();
        cy.log(`Asserting product "${product.nome}" is visible in the table`)
        cy.contains('tbody tr', product.nome).should('be.visible');
    });

    it('edit a product - known bug', () => {
        // BUG: Edit button does not perform any action when clicked.
        // Expected: should navigate to edit product page or open an edit modal.
        // Actual: nothing happens on click.
        // This test will fail until the bug is fixed.
        cy.log(`Navigating to product list`)
        listProduct.goToProductList();
        cy.log(`Clicking edit button for product: ${product.nome}`)
        listProduct.editProduct(product.nome);
        cy.log('Asserting redirect to edit page — expected to fail due to known bug')
        cy.url().should('include', '/editarproduto');
    });

    it('should delete a product successfully', () => {
        const nome = product.nome;
        cy.log(`Navigating to product list`)
        listProduct.goToProductList();
        cy.log(`Deleting product: ${nome}`)
        listProduct.deleteProduct(nome);
        cy.log(`Asserting product "${nome}" no longer exists in the table`)
        cy.get('table', { timeout: 10000 }).should('not.contain', nome);
    });
});