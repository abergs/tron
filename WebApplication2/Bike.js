var Bike = (function () {
    function Bike(startPosition, direction) {
        this.Positions.push(startPosition);
        this.Positions.push(startPosition.GetNext(direction));
    }
    return Bike;
})();

var LineHelper = (function () {
    function LineHelper() {
    }
    LineHelper.prototype.GetDirection = function (coords) {
        var current = coords.pop();
        var previous = coords.pop();

        if (!previous || !current) {
            return Direction.Unkown;
        }

        if (current.X < previous.X)
            return Direction.Left;

        if (current.X > previous.X)
            return Direction.Right;

        if (current.Y < previous.Y)
            return Direction.Up;

        if (current.Y > previous.Y)
            return Direction.Down;

        return Direction.Unkown;
    };

    LineHelper.prototype.GetLines = function (coordinates) {
        var lines = [];
        var lastLine = null;

        coordinates.forEach(function (coordinate) {
            if (!lastLine) {
                lastLine = new Line(coordinate, coordinate);
                lines.push(lastLine);
            } else {
                if (lastLine.Start.X == coordinate.X || lastLine.Start.Y == coordinate.Y) {
                    lastLine.End = coordinate;
                } else {
                    // New line
                    lastLine = new Line(lastLine.End, coordinate);
                    lines.push(lastLine);
                }
            }
        });

        return lines;
    };
    return LineHelper;
})();

var Line = (function () {
    function Line(start, end) {
        this.Start = start;
        this.End = end;
    }
    return Line;
})();

var Coordinate = (function () {
    function Coordinate(x, y) {
        this.X = x;
        this.Y = y;
    }
    Coordinate.prototype.GetNext = function (direction) {
        if (direction == Direction.Up) {
            return new Coordinate(this.X, this.Y--);
        }

        if (direction == Direction.Down) {
            return new Coordinate(this.X, this.Y++);
        }

        if (direction == Direction.Right) {
            return new Coordinate(this.X++, this.Y);
        }

        if (direction == Direction.Left) {
            return new Coordinate(this.X--, this.Y);
        }

        return this;
    };
    return Coordinate;
})();

var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Unkown"] = 4] = "Unkown";
})(Direction || (Direction = {}));
