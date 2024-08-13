describe('Smoke Suite', () => {


    it('Dashboard Screen: Verify API responses and Payloads', () => {
        cy.login()
        // Navigate to dashboard
        cy.visit('https://smartoperation.siddhanproducts.com/#/dashboard');
        // Intercepts
        //cy.intercept('GET', '/api/user/getAirportData').as('getAirportData');
        cy.intercept('GET', '/api/team/dayschedule/day/schedules?date=*').as('getSchedules');
        cy.intercept('GET', '/api/alert/notifications?empid=*').as('getNotifications');
        cy.intercept('PATCH', '/api/acl/checkMenuAccess').as('checkMenuAccess');

        // Visit the dashboard
        cy.visit('https://smartoperation.siddhanproducts.com/#/layout/dashboard');

        // Wait for the API calls and assert their responses
        //cy.wait('@getAirportData').its('response.statusCode').should('be.oneOf', [200, 304]);
        cy.wait('@getSchedules').its('response.statusCode').should('eq', 200);
        cy.wait('@getNotifications').its('response.statusCode').should('eq', 200);
        cy.wait('@checkMenuAccess').its('response.statusCode').should('eq', 200);
    })


});
