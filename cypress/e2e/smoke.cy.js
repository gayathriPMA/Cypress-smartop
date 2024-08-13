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
    describe('Dashboard Screen Smoke Test', () => {
        beforeEach(() => {
            /* Intercepting API calls with aliases */
            cy.intercept('GET', 'https://smartoperation.siddhanproducts.com/api/master/employee/getWidgetConfigData').as('getWidgetConfigData');
            cy.intercept('GET', 'https://smartoperation.siddhanproducts.com/api/master/airport-config/getAllTerminal').as('getAllTerminal');
            cy.intercept('GET', 'https://smartoperation.siddhanproducts.com/api/operation/notificationCenter/getAllMessage').as('getAllMessage');

            cy.login()
            cy.url().should('include', '/dashboard')
        });

        it('should check DOM elements, verify API calls, and validate payloads', () => {
            /* Checking for key DOM elements to ensure the dashboard loaded correctly */
            cy.get('.flightOperated').should('be.visible');
            cy.get('.attendance-widget > .p-2').should('be.visible');

            /* Waiting for all API calls and verifying status codes */
            cy.wait('@getWidgetConfigData').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
                const responseBody = interception.response.body;

                /* Validate the structure and content of the getWidgetConfigData response */
                expect(responseBody).to.have.property('success', true);
                expect(responseBody).to.have.property('groupedWidgets').that.is.an('array').with.length.of.at.least(1);

                responseBody.groupedWidgets.forEach(widgetGroup => {
                    Object.values(widgetGroup).forEach(widget => {
                        expect(widget).to.have.all.keys(['_id', 'name', 'view', 'col', 'order', 'img', 'description', 'disable']);
                        expect(widget.view).to.be.a('boolean');
                        expect(widget.col).to.be.a('number');
                        expect(widget.order).to.be.a('number');
                        expect(widget.img).to.be.a('string').and.to.match(/^https:\/\/soassests\.s3\.ap-south-1\.amazonaws\.com\/.*\.png$/);
                    });
                });
            });

            cy.wait('@getAllTerminal').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
                const responseBody = interception.response.body;

                /* Validate the structure and content of the getAllTerminal response */
                expect(responseBody).to.have.property('success', true);
                expect(responseBody).to.have.property('data').that.is.an('array').with.length.of.at.least(1);

                responseBody.data.forEach(terminal => {
                    expect(terminal).to.have.all.keys(['_id', 'airport', 'name', 'abbreviation', '__v']);
                    expect(terminal._id).to.be.a('string');
                    expect(terminal.airport).to.be.a('string');
                    expect(terminal.name).to.be.a('string');
                    expect(terminal.abbreviation).to.be.a('string');
                    expect(terminal.__v).to.be.a('number');
                });
            });

            cy.wait('@getAllMessage').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
                const responseBody = interception.response.body;

                /* Validate the structure and content of the getAllMessage response */
                expect(responseBody).to.have.property('success', true);

                const notificationCenter = responseBody.respayload.notificationCenter;
                expect(notificationCenter).to.be.an('array').with.length.of.at.least(1);

                notificationCenter.map((notification) => {
                    expect(notification).to.have.all.keys(['_id', 'services', 'behalf', 'date', 'designation', 'employee', 'message', 'mode', 'time', 'attachment']);
                    expect(notification._id).to.be.a('string');
                    expect(notification.services).to.be.an('array');
                    expect(notification.behalf).to.be.an('array');
                    expect(notification.date).to.be.a('string');
                    expect(notification.designation).to.be.an('array');
                    expect(notification.employee).to.be.an('array');
                    expect(notification.message).to.be.a('string');
                    expect(notification.mode).to.be.an('array');
                    expect(notification.time).to.be.a('string');
                    expect(notification.attachment).to.be.an('array');
                });
            });
        });
    });

