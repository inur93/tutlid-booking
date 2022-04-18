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

    const viewports = [
        //width, height, afterOpenPage
        [550, 750, () => { cy.get('button[aria-label="open drawer"]').click() }],
        [1920, 1080, () => { }]
    ]
    const users = [
        //name, beforeEach
        ['as anonymous user', () => { }],
        ['as basic user', () => { cy.login(); }],
        ['as admin user', () => { cy.login(Cypress.env('admin_email'), Cypress.env('admin_password')); }]
    ];

    const links = [
        //name, selector, user1, user2, user3
        ['has home link', 'a[href="#/"]', true, true, true],
        ['has gallery link', 'a[href="#/gallery"]', true, true, true],
        ['has login link', 'a[href="#/login"]', true, false, false],
        ['has admin button', 'a[href="#/admin"]', false, false, true]
    ]

    const buttons = [
        //name, selector, text, skipViewports, user1, user2, user3
        ['has account button', 'button', 'Profil', [0], false, true, true],
        ['has language selector', '#language-selector', 'Dansk', [], true, true, true]
    ]

    viewports.forEach(([width, height, afterOpenPage], viewport) => {
        context(`viewport (${width},${height})`, () => {
            beforeEach(() => {
                cy.viewport(width, height);

            })

            users.forEach(([contextName, before], i) => {

                context(contextName, () => {
                    beforeEach(() => {
                        before();
                        cy.visit('/');
                        afterOpenPage();
                    })

                    links.forEach(([name, selector, ...exist]) => {
                        it(`${name}: ${exist[i]}`, () => {
                            cy.get(selector).should(exist[i] ? 'exist' : 'not.exist')
                        })
                    })

                    buttons.forEach(([name, selector, text, skipViewports, ...exist]) => {
                        if (!skipViewports.includes(viewport)) {
                            it(`${name}: ${exist[i]}`, () => {
                                cy.contains(selector, text).should(exist[i] ? 'exist' : 'not.exist')
                            })
                        }
                    })
                })
            })

        })
    })
})
