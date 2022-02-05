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
describe('Navigation bar', () => {


    context('as anonymous user', () => {
        beforeEach(() => {
            cy.visit('/');
        })

        it('has home link', () => {
            cy.get('a[href="#/"]').should('exist');
        })

        it('has gallery link', () => {
            cy.get('a[href="#/gallery"]').should('exist');
        })

        it('has login link', () => {
            cy.get('a[href="#/login"]').should('exist');
        })

        it('has NO admin button', () => {
            cy.contains('button', 'Administration').should('not.exist');
        })

        it('has NO account button', () => {
            cy.contains('button', 'Profil').should('not.exist');
        })

        it('has language selector', () => {
            cy.contains('#language-selector', 'Dansk');
        })
    })

    context('as basic user', () => {
        beforeEach(() => {
            cy.login();
            cy.visit('/');
        })
        it('has home link', () => {
            cy.get('a[href="#/"]').should('exist');
        })

        it('has gallery link', () => {
            cy.get('a[href="#/gallery"]').should('exist');
        })

        it('has NO login link', () => {
            cy.get('a[href="#/login"]').should('not.exist');
        })

        it('has account button', () => {
            cy.contains('button', 'Profil');
        })

        it('has NO admin button', () => {
            cy.contains('button', 'Administration').should('not.exist');
        })

        it('has language selector', () => {
            cy.contains('#language-selector', 'Dansk');
        })
    })

    context('as admin user', () => {
        beforeEach(() => {
            cy.login(Cypress.env('admin_email'), Cypress.env('admin_password'));
            cy.visit('/');
        })
        it('has home link', () => {
            cy.get('a[href="#/"]').should('exist');
        })

        it('has gallery link', () => {
            cy.get('a[href="#/gallery"]').should('exist');
        })

        it('has NO login link', () => {
            cy.get('a[href="#/login"]').should('not.exist');
        })

        it('has admin button', () => {
            cy.contains('button', 'Administration');
        })

        it('has account button', () => {
            cy.contains('button', 'Profil');
        })

        it('has language selector', () => {
            cy.contains('#language-selector', 'Dansk');
        })
    })
})
