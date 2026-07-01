
describe('API - Usuarios', () => {
    const baseUrl = Cypress.env('apiUrl')
    let token
    let adminEmail = `qatest_${Date.now()}@qatest.com`

    before(() => {
        cy.log('Creating admin user via API and logging in for token')
        cy.request({
            method: 'POST',
            url: `${baseUrl}/usuarios`,
            body: {
                nome: 'QA Admin Setup',
                email: adminEmail,
                password: Cypress.env('setupPassword'),
                administrador: 'true'
            }
        }).then((response) => {
            cy.log(`Setup user created: ${adminEmail}`)
        })

        cy.request({
            method: 'POST',
            url: `${baseUrl}/login`,
            body: {
                email: adminEmail,
                password: Cypress.env('setupPassword')
            }
        }).then((response) => {
            token = response.body.authorization
            cy.log('Token acquired successfully')
        })
    })

    it('should create a user successfully', () => {
        const email = `qatest_${Date.now()}@qatest.com`
        cy.log(`Sending POST /usuarios with email: ${email}`)
        cy.request({
            method: 'POST',
            url: `${baseUrl}/usuarios`,
            body: {
                nome: 'QA Test User',
                email: email,
                password: Cypress.env('setupPassword'),
                administrador: 'true'
            }
        }).then((response) => {
            cy.log(`Response status: ${response.status}`)
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
            expect(response.body).to.have.property('_id')
        })
    })

    it('should list users successfully', () => {
        cy.log('Sending GET /usuarios')
        cy.request({
            method: 'GET',
            url: `${baseUrl}/usuarios`
        }).then((response) => {
            cy.log(`Response status: ${response.status}`)
            cy.log(`Total users found: ${response.body.quantidade}`)
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('quantidade')
            expect(response.body.quantidade).to.be.greaterThan(0)
            expect(response.body.usuarios).to.be.an('array')
        })
    })

    it('should delete all users with @qatest.com domain', () => {
        cy.log('Fetching all @qatest.com users for cleanup')
        cy.request({
            method: 'GET',
            url: `${baseUrl}/usuarios`
        }).then((response) => {
            const qatestUsers = response.body.usuarios.filter(u => u.email.includes('@qatest.com'))
            cy.log(`Found ${qatestUsers.length} @qatest.com users to delete`)

            qatestUsers.forEach((user) => {
                cy.request({
                    method: 'DELETE',
                    url: `${baseUrl}/usuarios/${user._id}`,
                    headers: { Authorization: token }
                }).then((deleteResponse) => {
                    cy.log(`Deleted user: ${user.email}`)
                    expect(deleteResponse.status).to.eq(200)
                    expect(deleteResponse.body).to.have.property('message', 'Registro excluído com sucesso')
                })
            })
        })
    })
})