test("GetLines returns 0 line when having 0 coords", function () {
    var bike = new Bike(new Coordinate(0, 0), Direction.Down);

    console.log("Bike", bike);
    console.log("Bike pos", bike.Positions);

    bike.ContinueMoving();
    bike.ContinueMoving();
    bike.ContinueMoving();

    ok(bike.Positions.length == 5);
});
