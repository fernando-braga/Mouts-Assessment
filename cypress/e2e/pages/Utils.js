/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

class utilsPage{
    elements = {

        cadastrarBtn: () => cy.get('[data-testid="cadastrar"]'),
        cadastrarComoAdminBtn: () => cy.get('[data-testid="checkbox"]'),
        campoNome: () => cy.get('[data-testid="nome"]'),
        campoEmail: () => cy.get('[data-testid="email"]'),
        campoSenhaCadastro: () => cy.get('[data-testid="password"]'),
        campoSenhaLogin: () => cy.get('[data-testid="senha"]'),
        logOutBtn: () => cy.get('[data-testid="logout"]'),
        entrarBtn: () => cy.get('[data-testid="entrar"]'),

    }

    generateAdminUser() {
    const user = {
        nome: faker.person.fullName(),
        email: `${faker.internet.username()}@qatest.com`,
        password: faker.internet.password({ length: 8 })
    }
    cy.log(`Generated admin user: ${user.nome} | ${user.email}`)
    return user
    }

    generateProduct() {
        const product = {
            nome: faker.commerce.productName(),
            preco: faker.commerce.price({ min: 10, max: 1000, dec: 0 }),
            descricao: faker.commerce.productDescription(),
            quantidade: faker.number.int({ min: 1, max: 100 }).toString()
        }
        cy.log(`Generated product: ${product.nome} | Price: ${product.preco}`)
        return product
    }

    registerAdminUser(user) {
        cy.visit('/cadastrarusuarios')
        this.elements.campoNome().type(user.nome)
        this.elements.campoEmail().type(user.email)
        this.elements.campoSenhaCadastro().type(user.password)
        this.elements.cadastrarComoAdminBtn().check()
        this.elements.cadastrarBtn().click()
    }

    setupAdminUser() {
        cy.log('Setting up admin user')
        const user = this.generateAdminUser();
        this.registerAdminUser(user);
        cy.url().should('include', 'admin/home');
        this.logOut();
        cy.log('Admin user setup complete')
        return user;
    }

    login(email, password) {
        this.elements.campoEmail().type(email)
        this.elements.campoSenhaLogin().type(password)
        this.elements.entrarBtn().click()
    }

    logOut() {
        this.elements.logOutBtn().click()
    }
}

export default utilsPage