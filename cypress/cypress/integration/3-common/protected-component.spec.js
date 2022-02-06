/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('protected component', () => {
    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test

    })

    context('logged in as basic user', () => {

        beforeEach(() => {
            cy.login();
        })

    })

    context('in danish', () => {
        beforeEach(() => {
            cy.setLanguage('da');
        })

        context('as anonymous user', () => {
            beforeEach(() => {
                cy.visit('/#/admin/bookings');
            })

            it('has title', () => {
                cy.contains('h1', 'Du har ikke adgang til denne side');
            })

            it('has description', () => {
                cy.contains('p', 'Du skal logge ind for at tilgå denne side');
            })

            it('has login button', () => {
                cy.contains('button', 'Login');
            })
        })

        context('as basic user', () => {
            beforeEach(() => {
                cy.login();
                cy.visit('/#/admin/bookings');
            })

            it('Has title', () => {
                cy.contains('h1', 'Du har ikke adgang til denne side')
            })

            it('Has missing role description', () => {
                cy.contains('p', 'Du mangler en af følgende roller: "admin", for at tilgå denne side.')
            })

            it('has no login button', () => {
                cy.get('[data-cy=login-btn]').should('not.exist');
            })
        })

        context('as admin user', () => {
            beforeEach(() => {
                cy.login(Cypress.env('admin_email'), Cypress.env('admin_password'));
                cy.visit('/#/admin/bookings');
            })

            it('Has no access denied title', () => {
                cy.get('h1').should('not.have.text', 'Du har ikke adgang til denne side');
            })

            it('Has no missing role description', () => {
                cy.get('p').should('not.have.text', 'Du mangler en af følgende roller: "admin", for at tilgå denne side.')
            })

            it('has no login button', () => {
                cy.get('[data-cy=login-btn]').should('not.exist');
            })
        })
    })

    context('in english', () => {
        beforeEach(() => {
            cy.setLanguage('en');
        })

        context('as anonymous user', () => {
            beforeEach(() => {
                cy.visit('/#/admin/bookings');
            })

            it('has title', () => {
                cy.contains('h1', 'You dont have permission to access this page');
            })

            it('has description', () => {
                cy.contains('p', 'You need to login to access this page');
            })

            it('has login button', () => {
                cy.contains('button', 'Login');
            })
        })
        
        context('as basic user', () => {
            beforeEach(() => {
                cy.login();
                cy.visit('/#/admin/bookings');
            })

            it('Has title', () => {
                cy.contains('h1', 'You dont have permission to access this page')
            })

            it('Has missing role description', () => {
                cy.contains('p', 'You need one of the following roles: "admin", to access this page.')
            })

            it('has no login button', () => {
                cy.get('[data-cy=login-btn]').should('not.exist');
            })
        })
    })


})
