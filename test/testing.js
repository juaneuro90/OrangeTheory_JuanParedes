let chai = require('chai');
let Handler = require('../functions/handler');
let expect = chai.expect;



    describe('/GET User', () => {
        it('It should respond with a specific users', async () => {
            // console.log(done);
            let event = {
                    queryStringParameters: {
                        uuid: '7f8d5942-77f5-4144-8e11-301be576f576'
                    }
                },
                context = {};

            await Handler.read(event, context, (err, response) => {
                expect(response.statusCode).to.eq(200);
                expect(response.body).to.eq('{"success":true,"data":{"location":{"country":"Spain","city":"Orense","street":{"name":"Calle de Arturo Soria","number":8640},"timezone":{"offset":"+2:00","description":"Kaliningrad, South Africa"},"postcode":21370,"coordinates":{"latitude":"-21.7248","longitude":"-153.3029"},"state":"Cantabria"},"nat":"ES","email":"guillermo.velasco@example.com","picture":{"large":"https://randomuser.me/api/portraits/men/70.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/70.jpg","medium":"https://randomuser.me/api/portraits/med/men/70.jpg"},"registered":{"date":"2004-03-15T11:51:26.130Z","age":16},"name":{"title":"Mr","last":"Velasco","first":"Guillermo"},"gender":"male","login":{"sha1":"2d54361d7e379d0415af09fe5b67c4826b350076","password":"test123","salt":"DE0tfqqb","sha256":"10506a37018a66bb0e28d3db20746455f42738df1518fe43273e2f8a9a178a85","uuid":"7f8d5942-77f5-4144-8e11-301be576f576","username":"beautifulbutterfly284","md5":"7a9e067fdb1cb4b7da3f59c01c4ea429"},"dob":{"date":"1945-10-30T21:21:10.165Z","age":79},"uuid":"7f8d5942-77f5-4144-8e11-301be576f576","id":{"name":"DNI","value":"80148879-X"},"phone":"993-449-344","cell":"612-558-158"}}' );
            })
        });

        it('It should respond with ALL users', async () => {
            let event = {},
                context = {};

            await Handler.read(event, context, (err, response) => {
                response.body = JSON.parse(response.body);
                expect(response.statusCode).to.eq(200);
                expect(response.body.success).to.eq(true);
            })

        });
    });

    describe('/PUT User', () => {
        it('Updates the User with the desired fields', async () => {
            let event = {},
            context = {};
            await Handler.update(event, context, (err, response) => {

                response.body = JSON.parse(response.body);
                expect(response.statusCode).to.eq(400);
                expect(response.body.success).to.eq(false);
                expect(response.body.description).to.eq('No values passed');
            })
        });
    });

    describe('/POST User', () => {
        it('It should create a new user', async () => {
            let event = {},
                context = {};
            await Handler.create(event, context, (err, response) => {

                response.body = JSON.parse(response.body);
                expect(response.statusCode).to.eq(200);
                expect(response.body.success).to.eq(true);
            })
        });
    });