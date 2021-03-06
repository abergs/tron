/// <reference path="../Bike.ts" />
/// <chutzpah_reference path="../Scripts/qunit.js" />
/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
test("Direction is unkown when zero coords", function () {
    var coords = [];

    var direction = LineHelper.GetDirection(coords);

    ok(Direction.Unkown == direction);
});

test("Direction is unkown when 1 coord", function () {
    var coords = [new Coordinate(0, 0)];

    var direction = LineHelper.GetDirection(coords);

    ok(Direction.Unkown == direction);
});

test("Direction is down", function () {
    var coords = [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(1, 1), new Coordinate(1, 2)];

    var direction = LineHelper.GetDirection(coords);

    ok(Direction.Down == direction);
});

test("Direction is up", function () {
    var coords = [new Coordinate(10, 10), new Coordinate(11, 10), new Coordinate(11, 9), new Coordinate(11, 8)];

    var direction = LineHelper.GetDirection(coords);

    ok(Direction.Up == direction);
});

test("Direction is Left", function () {
    var coords = [new Coordinate(10, 10), new Coordinate(10, 11), new Coordinate(9, 11), new Coordinate(8, 11)];

    var direction = LineHelper.GetDirection(coords);

    ok(Direction.Left == direction);
});

test("Direction is Right", function () {
    var coords = [new Coordinate(10, 10), new Coordinate(10, 11), new Coordinate(11, 11), new Coordinate(12, 11)];

    var direction = LineHelper.GetDirection(coords);

    ok(Direction.Right == direction);
});
