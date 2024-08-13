/* valid log in */
Cypress.Commands.add('login', () => {
    cy.visit('https://smartoperation.siddhanproducts.com/#/login');
    cy.get('#cy_email').type('francis@si.com');
    cy.get('#cy_password').type('Fran@123');
    cy.get('#cy_login').click();
    cy.wait(10000);
    cy.get('#cy_okay').should('be.visible').click(); 
});
/* Invalid login */
Cypress.Commands.add('invalidLogin', (email, password) => {
    cy.visit('https://smartoperation.siddhanproducts.com/#/login');
    cy.get('#cy_email').type(email);
    cy.get('#cy_password').type(password);
    cy.get('#cy_login').click();
});

/* logout */
Cypress.Commands.add('logout', () => {
    cy.get('button.mat-icon-button.mat-menu-trigger')
        .should('be.visible')
        .first()
        .click();
    cy.get('.mat-menu-content > .mat-focus-indicator').click();
});

/* navigate to the department screen */
Cypress.Commands.add('navigateToDepartmentScreen', () => {
    cy.get('.menu').click();
    
    cy.get('li:contains("Department")')
            .find('a')
            .should('be.visible').click();
    cy.url().should('eq', 'https://smartoperation.siddhanproducts.com/#/layout/masters/department');
});

/* create a department */
Cypress.Commands.add('createDepartment', (department) => {
    cy.get('.addEvent').click();
    cy.wait(10000); 
    cy.get('#mat-input-3').type(department.name);
    cy.wait(10000);
    cy.get('[testing_id="cy_label"]').type(department.label);
    cy.wait(10000);
    cy.get('[testing_id="cy_save"]').click();
    cy.wait(5000); 
});
