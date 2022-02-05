/// <reference types="cypress" />
const { startOfToday, startOfTomorrow, format} = require('date-fns')
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
describe('Create Bookings as normal user', () => {
    beforeEach(() => {
        cy.login(Cypress.env('user_email'), Cypress.env('user_password'));
        cy.visit('/');
    })

    it('create normal booking single person', () => {
        // first day in calendar
        cy.get('.rbc-day-bg').first().click();
        cy.get('input[name=from]').typeDate(startOfToday());
        cy.get('input[name=to]').typeDate(startOfTomorrow());
        cy.get('input[name=pplCount]').type(1);
        cy.get('input[name=tubCount]').type(1);
        cy.get('[name=comment]').type('This is a test from cypress');

        cy.intercept('POST', '/bookings').as('createBooking');
        cy.get('button[type=submit]').click();

        cy.wait('@createBooking').its('response.statusCode').should('eq', 200);

        cy.get('#create-booking-title h2').should('have.text', 'Kvittering');
        cy.get('[data-cy=receipt-message]')
            .should('contain.text', 'Din booking for 1 gæster')
            .and('contain.text', '1 til den varme pot')
            .and('contain.text', `perioden ${format(startOfToday(), 'd')}`)
            .and('contain.text', `til ${format(startOfTomorrow(), 'd')}`)
    })
})
