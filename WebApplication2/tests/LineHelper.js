/// <reference path="../Bike.ts" />
/// <chutzpah_reference path="../Scripts/qunit.js" />
/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
test("GetLines returns 0 line when having 0 coords", function () {
    var coords = [];

    var lines = LineHelper.GetLines(coords);

    ok(0 == lines.length);
});

test("GetLines returns 1 line when having one coord", function () {
    var coords = [new Coordinate(0, 0)];

    var lines = LineHelper.GetLines(coords);

    ok(1 == lines.length);
});

test("GetLines returns 1 line when having two coords", function () {
    var coords = [new Coordinate(0, 0), new Coordinate(0, 1)];

    var lines = LineHelper.GetLines(coords);

    ok(1 == lines.length);
});

test("GetLines returns 1 lines when having three coords", function () {
    var coords = [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(0, 2)];

    var lines = LineHelper.GetLines(coords);

    ok(1 == lines.length);
});

test("GetLines returns 2 lines when having three coords", function () {
    var coords = [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(1, 1)];

    var lines = LineHelper.GetLines(coords);

    ok(2 == lines.length);
});

test("Make sure reference is kept", function () {
    var coords = [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(1, 1), new Coordinate(2, 1), new Coordinate(2, 2), new Coordinate(2, 3)];

    var lines = LineHelper.GetLines(coords);

    ok(3 == lines.length);

    ok(lines[0].Start.X == 0, "start1x");
    ok(lines[0].Start.Y == 0, "start1y");
    ok(lines[0].End.X == 0, "end1x");
    ok(lines[0].End.Y == 1, "end1y");

    ok(lines[1].Start.X == 0);
    ok(lines[1].Start.Y == 1);
    ok(lines[1].End.X == 2);
    ok(lines[1].End.Y == 1);

    ok(lines[2].Start.X == 2);
    ok(lines[2].Start.Y == 1);
    ok(lines[2].End.X == 2);
    ok(lines[2].End.Y == 3);
});
