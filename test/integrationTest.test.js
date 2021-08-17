const expect = require('chai').expect;
const request = require('request');
const app = require('../server');

const baseUrl = "http://localhost:8080/vendor"

const testVendorPark = {
    validBody:{
        "location": [-37.79674652014172, 144.96138669574788],
        "parked": true,
        "curAddress": "At union house"
    }
}

const testVendorId = "60769e7636450e661844e2d5"

describe("integration tests", ()=>{
    it('Test: set status of vendor parking', function(done){
        request.post(
            {
                headers:{'Content-Type': 'application/json'},
                url: baseUrl + '/park/' + testVendorId,
                body: testVendorPark.validBody,
                json: true,
            }, 
        function(error, response, body){
            expect(response.statusCode).to.equal(200);
            expect(body.updatedVendor.parked).to.equal(true);
            if(error) done(error);
            else done();
        }
        );
    })
});
