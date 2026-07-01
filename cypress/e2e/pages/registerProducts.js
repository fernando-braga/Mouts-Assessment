/// <reference types="cypress" />

class registerProductsPage {
    elements = {
        cadastrarProdutoPageBtn: () => cy.get('[data-testid="cadastrarProdutos"]'),
        campoNomeProduto: () => cy.get('[data-testid="nome"]'),
        campoPrecoProduto: () => cy.get('[data-testid="preco"]'),
        campoDescricaoProduto: () => cy.get('[data-testid="descricao"]'),
        campoQuantidadeProduto: () => cy.get('[data-testid="quantity"]'),
        campoImagemProduto: () => cy.get('[data-testid="imagem"]'),
        cadastrarProdutoBtn: () => cy.get('[data-testid="cadastarProdutos"]')

}

registerProduct(product) {
    this.elements.cadastrarProdutoPageBtn().click() 
    this.elements.campoNomeProduto().type(product.nome)
    this.elements.campoPrecoProduto().type(product.preco)
    this.elements.campoDescricaoProduto().type(product.descricao)
    this.elements.campoQuantidadeProduto().type(product.quantidade)
    this.elements.campoImagemProduto().attachFile('images/televisao-retro.jpg')
    this.elements.cadastrarProdutoBtn().click() 
}

}
export default registerProductsPage