/*global define, describe, it, require*/
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

var Component = require("../src/js/index"),
    $ = require("jquery"),
    model = require("./models/model");
//
// describe("Data Editor", function () {
//     it("should be not null", function () {
//         expect(model).to.be.not.null;
//     });
// });