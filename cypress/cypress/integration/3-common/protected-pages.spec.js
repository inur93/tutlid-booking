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

describe('protected pages', () => {

    [
        ['create booking page', '/#/bookings/create'],
        ['calendar page', '/#/calendar'],
        ['admin users page', '/#/admin/users'],
        ['finances page', '/#/admin/finances'],
        ['admin bookings page', '/#/admin/bookings']
    ].forEach(([name, url]) => {
        it(name, () => {
            cy.visit(url);
            cy.contains('h1', 'Du har ikke adgang til denne side');
        })
    })
})
