/// <reference path="../Bike.ts" />
/// <chutzpah_reference path="../Scripts/qunit.js" />
/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />


test("GetLines returns 0 line when having 0 coords", () => {
    var bike = new Bike(new Coordinate(0, 0), Direction.Down);

    console.log("Bike", bike);
    console.log("Bike pos", bike.Positions);

    bike.ContinueMoving();
    bike.ContinueMoving();
    bike.ContinueMoving();


    ok(bike.Positions.length == 5);
});
