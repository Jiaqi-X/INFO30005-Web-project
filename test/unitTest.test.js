const expect = require('chai').expect;
const request = require('request');

const testVendorLocation = [
    {name: "vendor1", location: [10,10]},
    {name: "vendor2", location: [20,20]},
    {name: "vendor3", location: [30,30]},
    {name: "vendor4", location: [10,20]},
    {name: "vendor5", location: [20,30]},
]

const testVendorResult = [
    {name: "vendor1", distance: 14.14213562373095},
    {name: "vendor4", distance: 22.3606797749979},
    {name: "vendor2", distance: 28.2842712474619},
    {name: "vendor5", distance: 36.05551275463989},
    {name: "vendor3", distance: 42.42640687119285}
]
    
describe("unit tests for vendor locations", ()=>{
    it("test: successfully return 5 nearest vendors", function(done){
        let cur_coordinate = {"lat":0, "lng": 0}
        var vendors = [];
        for (i = 0; i< testVendorLocation.length; i++){
            var distance = Math.sqrt(Math.hypot(
                cur_coordinate.lat - testVendorLocation[i].location[0],
                cur_coordinate.lng - testVendorLocation[i].location[1])
                )

            if (Number.isFinite(distance)){
                vendors.push({name:testVendorLocation[i].name, distance: distance})
            }
        }
    
        vendors = vendors.sort(({distance:a},{distance: b})=>a-b).slice(0,5)
        expect(vendors).to.eql(testVendorResult)
        done()
    })
})