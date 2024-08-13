describe('Smoke Suite', () => {
    beforeEach(() => {
        /*URL */

        cy.wait(10000);
    });

    /* Check login DOM elements */
    it('should display login screen and login successfully', () => {
        cy.visit('https://smartoperation.siddhanproducts.com/#/login');
        cy.get('#cy_email').should('be.visible');
        cy.get('#cy_password').should('be.visible');
        cy.get('#cy_login').should('be.visible');
        cy.intercept('POST', '**/api/user/login').as('loginRequest');

        cy.get('input[name="email"]').type('francis@si.com');
        cy.get('input[name="password"]').type('Fran@123');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest').its('response').then((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.have.property('token');
            expect(response.body.profile.user).to.have.property('user_name', 'Francis');
            expect(response.body.profile.role).to.have.property('role_code', 'APM');
        });
    })

    // it('Dashboard Screen', () => {
    //     cy.login();

    //     /*  GET dashboard API */
    //     cy.intercept('GET', 'https://smartoperation.siddhanproducts.com/api/user/getAirportData').as('getDashboardData');
    //     cy.visit('https://smartoperation.siddhanproducts.com/#/dashboard')
    //     cy.wait('@getDashboardData').its('res').then((res) => {
    //         const task = res?.body?.data?.[0]
    //         const innerTasks = task?.taks?.[0]
    //         expect(task).to.have.property('_id').that.is.a('string');
    //         expect(task).to.have.property('arrivalFlight').that.is.a('string');
    //         expect(task).to.have.property('departureFlight').that.is.a('string');
    //         expect(innerTasks).to.have.property('taskname').that.is.a('string');
    //         expect(innerTasks).to.have.property('taskDelayMinutes').that.is.a('number');
    //         expect(response.statusCode).to.eq(200);
    //     });
    // })



    /* Check department DOM elements */
    it('Department Screen: DOM Elements', () => {
        cy.login();
        cy.navigateToDepartmentScreen();
        cy.url().should('include', '/#/layout/masters/department');
        cy.get('.addEvent').scrollIntoView().should('be.visible').click()
        cy.get('[testing_id="cy_departmentcode"]').should('be.visible');
        cy.get('[testing_id="cy_departmentname"]').should('be.visible');
        cy.get('[testing_id="cy_label"]').should('be.visible');
        cy.get('[testing_id="cy_save"]').should('be.visible');
    });

    /* GET request departments API */
    it('Department Screen: API Interaction', () => {
        cy.intercept('GET', '**/department', (req) => {
            req.continue((res) => {

                expect(res.body.success).to.eq(true);
                expect(res.body.message).to.eq('Department Records fetched Successfully');
                expect(res.body.respayload).to.have.property('departments').that.is.an('array').and.not.empty;


                const firstDepartment = res.body.respayload?.departments?.[0];
                expect(firstDepartment).to.have.property('_id').that.is.a('string');
                expect(firstDepartment).to.have.property('department_code').that.is.a('string');
                expect(firstDepartment).to.have.property('department_name').that.is.a('string');
                expect(response.statusCode).to.eq(200);


            });
        }).as('getDepartments');


    });
})