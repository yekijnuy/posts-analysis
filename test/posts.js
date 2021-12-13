const { expect } = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
const { response } = require('../server/server.js');
let server = require('../server/server.js');

// Assertion Style
chai.should();

// for HTTP protocol
chai.use(chaiHttp);

describe('Posts API', () => {
    /**
     * Test Health
     */
    describe('GET /health', () => {
        it('It should return back a string for the health check', (done) => {
            chai.request(server)
                .get('/health')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.text.should.be.a('string');
                    done();
                });
        });

        it('It should NOT receive a string due to a wrong API endpoint', (done) => {
            chai.request(server)
                .get('/health/teemo')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                });
        });
    });

    /**
     * Test Get based on true JSON and true DETAIL - Should fail due to timeout and async resolving of child process
     * This points out why separation of duties is key as child processes need to be tested
     */
    describe('GET /postdata/:json/:detailmode', () => {
        it('It should return back JSON and detail mode', async () => {
            const json = true;
            const detailmode = true;
            const response = await chai
                .request(server)
                .get(`/postdata/${json}/${detailmode}`)
                .set('Content-Type', 'application/json');
            response.should.have.status(200);
        });
    });

    /**
     * Test Get based on CSV and DETAIL
     */
});
