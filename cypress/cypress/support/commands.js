// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
const { format } = require('date-fns')
Cypress.Commands.add('login', (email, password) => {
    cy.request('POST', '/auth/login', {
        email: email || Cypress.env('user_email'),
        password: password || Cypress.env('user_password')
    })
})

Cypress.Commands.add('setLanguage', (language) => {
    cy.window().its('localStorage').invoke('setItem', 'language', language);
})

Cypress.Commands.add('typeLogin', (email, password) => {
    cy.get('[name=email]').type(email);
    cy.get('[name=password]').type(`${password}{enter}`);
})

Cypress.Commands.add('typeDate', { prevSubject: true }, (subject, date) => {
    return cy.wrap(subject).type(format(date, 'yyyy-MM-dd'));
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
