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

describe('login', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test

  })

  context('navigate to login page', () => {
    beforeEach(() => {
      cy.visit('/');
    })

    it('main login button', () => {
      cy.get('[data-cy=login-btn]').click();

      cy.get('[name=email]').should('exist');
      cy.get('[name=password]').should('exist');
    })

    it('nav bar login button', () => {
      cy.get('[data-cy=login-header-btn]').click();

      cy.get('[name=email]').should('exist');
      cy.get('[name=password]').should('exist');
    })
  })

  context('navigate to login modal', () => {
    beforeEach(() => {
      cy.visit('/#/admin/bookings');
      cy.get('h4').should('have.text', 'Du har ikke adgang til denne side');
      cy.get('[data-cy=login-btn]').click();
    })
    it('main login button', () => {
      cy.get('[name=email]').should('exist');
      cy.get('[name=password]').should('exist');
    })

    it('login as regular user', () => {
      cy.typeLogin(Cypress.env('user_email'), Cypress.env('user_password'));

      cy.get('[data-cy=protected-component-label]').should('have.text', `Du mangler en af følgende roller: "admin", for at tilgå denne side.`)
      cy.get('[data-cy=login-btn]').should('not.exist');
    })

    it('login as admin user', () => {
      cy.typeLogin(Cypress.env('admin_email'), Cypress.env('admin_password'));

      cy.intercept('GET', '/bookings?status=reserved', (req) => {
        delete req.headers['if-none-match'];
      }).as('getReservedBookings');
      cy.intercept('GET', /\/admin\/bookings\?from=(\d{4}-\d{2}-\d{2})\&count=(\d+)$/, (req) => {
        delete req.headers['if-none-match'];
      }).as('getBookingList');

      cy.get('[data-cy=protected-component-label]').should('not.exist');
      cy.get('[data-cy=login-btn]').should('not.exist');

      cy.wait('@getReservedBookings').its('response.statusCode').should('eq', 200);
      cy.wait('@getBookingList').its('response.statusCode').should('eq', 200);
    })

    it('login with invalid email', () => {
      cy.typeLogin('random@email.com', Cypress.env('user_password'));

      cy.get('[data-cy=login-btn]').should('exist').and('not.have.class', 'disabled');
      cy.get('.MuiAlert-message').should('have.text', 'Email eller kodeord er forkert');
    })

    it('login with invalid password', () => {
      cy.typeLogin(Cypress.env('user_email'), 'random_password');

      cy.get('[data-cy=login-btn]').should('exist').and('not.have.class', 'disabled');
      cy.get('.MuiAlert-message').should('have.text', 'Email eller kodeord er forkert');
    })

  })

})
