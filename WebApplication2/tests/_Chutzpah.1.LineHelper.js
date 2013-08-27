test("GetLines returns 0 line when having 0 coords", function () {
    var lh = new LineHelper();

    var coords = [];

    var lines = lh.GetLines(coords);

    ok(0 == lines.length);
});

test("GetLines returns 1 line when having one coord", function () {
    var lh = new LineHelper();

    var coords = [new Coordinate(0, 0)];

    var lines = lh.GetLines(coords);

    ok(1 == lines.length);
});

test("GetLines returns 1 line when having two coords", function () {
    var lh = new LineHelper();

    var coords = [new Coordinate(0, 0), new Coordinate(0, 1)];

    var lines = lh.GetLines(coords);

    ok(1 == lines.length);
});

test("GetLines returns 1 lines when having three coords", function () {
    var lh = new LineHelper();

    var coords = [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(0, 2)];

    var lines = lh.GetLines(coords);

    ok(1 == lines.length);
});

test("GetLines returns 2 lines when having three coords", function () {
    var lh = new LineHelper();

    var coords = [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(1, 1)];

    var lines = lh.GetLines(coords);

    ok(2 == lines.length);
});
