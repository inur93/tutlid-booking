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

  context('in english', () => {
    beforeEach(() => {
      cy.setLanguage('en');
      cy.visit('/#/login');
    })

    it('has title', () => {
      cy.contains('h1', 'Login');
    })

    it('has email label', () => {
      cy.contains('label', 'Email');
    })

    it('has password label', () => {
      cy.contains('label', 'Password');
    })

    it('has forgot your password label', () => {
      cy.contains('a', 'Forgot your password?');
    })

    it('has forgot your password link', () => {
      cy.get('a[href="#/reset-password"]').should('exist');
    })

    it('has login button', () => {
      cy.contains('button', 'Login');
    })

    it('has register link', () => {
      cy.get('a[href="#/register"]').should('exist');
    })

    it('show invalid email message', () => {
      cy.get('[name=email]').type('test{enter}');

    })
  })

  context('in danish', () => {
    beforeEach(() => {
      cy.setLanguage('da');
    })

    context('from protected page login with modal', () => {
      beforeEach(() => {
        cy.visit('/#/admin/bookings');
        cy.get('[data-cy=login-btn]').click();
      })

      it('has title', () => {
        cy.contains('h1', 'Login');
      })

      it('has email label', () => {
        cy.contains('label', 'Email');
      })

      it('has password label', () => {
        cy.contains('label', 'Adgangskode');
      })

      it('has forgot your password label', () => {
        cy.contains('a', 'Har du glemt dit kodeord?');
      })

      it('has forgot your password link', () => {
        cy.get('a[href="#/reset-password"]').should('exist');
      })

      it('has login button', () => {
        cy.contains('button', 'Login');
      })

      it('has register link', () => {
        cy.get('a[href="#/register"]').should('exist');
      })

      // it('login as user with missing permissions', () => {
      //   cy.typeLogin(Cypress.env('user_email'), Cypress.env('user_password'));

      //   cy.get('[data-cy=protected-component-label]').should('have.text', `Du mangler en af følgende roller: "admin", for at tilgå denne side.`)
      //   cy.get('[data-cy=login-btn]').should('not.exist');
      // })

      // it('login as user with required permissions', () => {
      //   cy.typeLogin(Cypress.env('admin_email'), Cypress.env('admin_password'));

      //   cy.intercept('GET', '/bookings?status=reserved', (req) => {
      //     delete req.headers['if-none-match'];
      //   }).as('getReservedBookings');
      //   cy.intercept('GET', /\/admin\/bookings\?from=(\d{4}-\d{2}-\d{2})\&count=(\d+)$/, (req) => {
      //     delete req.headers['if-none-match'];
      //   }).as('getBookingList');

      //   cy.get('[data-cy=protected-component-label]').should('not.exist');
      //   cy.get('[data-cy=login-btn]').should('not.exist');

      //   cy.wait('@getReservedBookings').its('response.statusCode').should('eq', 200);
      //   cy.wait('@getBookingList').its('response.statusCode').should('eq', 200);
      // })

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
})
