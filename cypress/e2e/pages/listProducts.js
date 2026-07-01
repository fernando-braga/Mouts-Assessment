/// <reference types="cypress" />

class ListProductPage {
    elements = {
        listarProdutosHomeBtn: () => cy.get('[data-testid="listarProdutos"]'),
        editarBtn: (productName) => cy.contains('tbody tr', productName).find('button').contains('Editar'),
        excluirBtn: (productName) => cy.contains('tbody tr', productName).find('button').contains('Excluir'),
    }

    goToProductList() {
        this.elements.listarProdutosHomeBtn().click()
    }

    editProduct(productName) {
        this.elements.editarBtn(productName).click()
    }

    deleteProduct(productName) {
        this.elements.excluirBtn(productName).click()
    }
}

export default ListProductPage